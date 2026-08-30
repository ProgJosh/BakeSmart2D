import Phaser from 'phaser';
import { FONT, GAME_W, HEX, C } from '../core/theme';
import { bgDecor, fadeToScene, makeButton, makeChip, makeSectionLabel } from '../ui/UiFactory';
import { OUTCOMES } from '../data/lessons';
import { GS } from '../core/GameState';

export class LearnHubScene extends Phaser.Scene {
  constructor() {
    super('LearnHub');
  }

  create(): void {
    this.showHub();
  }

  private clearAll(): void {
    this.children.removeAll(true);
  }

  private showHub(): void {
    this.clearAll();
    bgDecor(this);

    const cx = GAME_W / 2;

    makeChip(this, cx, 70, 'YOUR BAKERY COURSE', C.wheat, HEX.ink, 14);
    this.add
      .text(cx, 114, 'Learning Hub', { fontFamily: FONT, fontSize: '38px', fontStyle: 'bold', color: HEX.ink })
      .setOrigin(0.5);

    this.add
      .text(cx, 148, 'Choose a learning outcome and build your bakery skills.', { fontFamily: FONT, fontSize: '18px', color: HEX.inkSoft })
      .setOrigin(0.5);

    makeButton(this, 92, 74, 144, 46, 'MAIN MENU', () => fadeToScene(this, 'Menu'), {
      variant: 'flat',
      fontSize: 15,
      radius: 23
    });

    OUTCOMES.forEach((outcome, idx) => {
      const y = 255 + idx * 142;
      const card = this.add.container(cx, y);
      const w = 940;
      const h = 126;

      const g = this.add.graphics();
      g.fillStyle(C.ink, 0.12).fillRoundedRect(-w / 2 + 5, -h / 2 + 8, w, h, 24);
      g.fillStyle(C.cardWarm, 1).fillRoundedRect(-w / 2, -h / 2, w, h, 24);
      g.lineStyle(2, C.wheatDark, 0.88).strokeRoundedRect(-w / 2, -h / 2, w, h, 24);
      g.fillStyle(outcome.color, 1).fillRoundedRect(-w / 2, -h / 2, 18, h, { tl: 24, bl: 24 });
      g.fillStyle(outcome.color, 0.14).fillCircle(-w / 2 + 79, 0, 48);
      g.fillStyle(outcome.color, 1).fillCircle(-w / 2 + 79, -6, 29);
      card.add(g);

      const outcomeNo = this.add
        .text(-w / 2 + 79, -6, `0${idx + 1}`, { fontFamily: FONT, fontSize: '24px', fontStyle: 'bold', color: HEX.white })
        .setOrigin(0.5);
      const idText = this.add
        .text(-w / 2 + 79, 31, outcome.id, { fontFamily: FONT, fontSize: '14px', fontStyle: 'bold', color: HEX.inkSoft })
        .setOrigin(0.5);
      const titleText = this.add
        .text(-w / 2 + 150, -h / 2 + 22, outcome.title, { fontFamily: FONT, fontSize: '24px', fontStyle: 'bold', color: HEX.ink })
        .setOrigin(0, 0);
      const taglineText = this.add
        .text(-w / 2 + 150, -h / 2 + 58, outcome.tagline, { fontFamily: FONT, fontSize: '16px', color: HEX.inkSoft, wordWrap: { width: 500 } })
        .setOrigin(0, 0);
      card.add([outcomeNo, idText, titleText, taglineText]);

      const viewedCount = outcome.lessons.filter((l) => GS.viewedLessons.has(l.id)).length;
      const progressText = `${viewedCount}/${outcome.lessons.length} lessons`;

      const progressChip = this.add.container(w / 2 - 150, -8);
      const pg = this.add.graphics();
      pg.fillStyle(C.wheat, 0.8).fillRoundedRect(-125, -10, 250, 20, 10);
      const completedWidth = 250 * (viewedCount / outcome.lessons.length);
      if (completedWidth > 0) pg.fillStyle(outcome.color, 0.86).fillRoundedRect(-125, -10, completedWidth, 20, 10);
      pg.lineStyle(1, C.wheatDark, 0.9).strokeRoundedRect(-125, -10, 250, 20, 10);
      const pt = this.add.text(0, 28, progressText, { fontFamily: FONT, fontSize: '14px', fontStyle: 'bold', color: HEX.inkSoft }).setOrigin(0.5);
      progressChip.add([pg, pt]);
      card.add(progressChip);

      if (GS.completedLOs.has(outcome.id)) {
        const doneChip = this.add.container(w / 2 - 400, 35);
        const dg = this.add.graphics();
        dg.fillStyle(C.green, 1).fillRoundedRect(-80, -16, 160, 32, 16);
        const dt = this.add.text(0, 0, 'COMPLETED', { fontFamily: FONT, fontSize: '13px', fontStyle: 'bold', color: HEX.white }).setOrigin(0.5);
        doneChip.add([dg, dt]);
        card.add(doneChip);
      }

      const zone = this.add.zone(0, 0, w, h).setInteractive({ useHandCursor: true });
      zone.on('pointerup', () => this.showWeeks(outcome.id));
      card.add(zone);

      this.add.existing(card);
    });

    this.add
      .text(cx, 690, 'Tap a course card to open its weekly lessons', { fontFamily: FONT, fontSize: '15px', color: HEX.inkSoft })
      .setOrigin(0.5)
      .setAlpha(0.7);
  }

  private showWeeks(loId: 'LO1' | 'LO2' | 'LO3'): void {
    this.clearAll();
    bgDecor(this);

    const outcome = OUTCOMES.find((o) => o.id === loId)!;
    const cx = GAME_W / 2;

    makeButton(this, 70, 82, 56, 56, '⟵', () => this.showHub(), { variant: 'flat', fontSize: 28, radius: 28 });
    makeChip(this, 244, 54, 'CURRICULUM', outcome.color, HEX.white, 13);

    this.add
      .text(140, 82, `${outcome.title} — Weeks 1–${outcome.lessons.length}`, {
        fontFamily: FONT,
        fontSize: '28px',
        fontStyle: 'bold',
        color: HEX.ink
      })
      .setOrigin(0, 0.5);

    makeSectionLabel(this, 140, 140, `${outcome.lessons.length} week${outcome.lessons.length > 1 ? 's' : ''} to explore`, outcome.color);

    outcome.lessons.forEach((lesson, idx) => {
      const y = 210 + idx * 96;
      const card = this.add.container(cx, y);
      const w = 920;
      const h = 86;

      const g = this.add.graphics();
      g.fillStyle(C.ink, 0.1).fillRoundedRect(-w / 2 + 3, -h / 2 + 6, w, h, 18);
      g.fillStyle(C.cardWarm, 1).fillRoundedRect(-w / 2, -h / 2, w, h, 18);
      g.lineStyle(2, C.wheatDark, 0.78).strokeRoundedRect(-w / 2, -h / 2, w, h, 18);
      g.fillStyle(outcome.color, 0.1).fillRoundedRect(-w / 2 + 10, -h / 2 + 10, 70, h - 20, 12);
      card.add(g);

      const weekCircle = this.add.graphics();
      weekCircle.fillStyle(C.wheat, 1).fillCircle(-400, 0, 30);
      weekCircle.lineStyle(2, C.wheatDark, 0.8).strokeCircle(-400, 0, 30);
      const weekNum = this.add.text(-400, 0, String(lesson.week), { fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: HEX.inkSoft }).setOrigin(0.5);
      card.add([weekCircle, weekNum]);

      const titleText = this.add
        .text(-350, -8, lesson.topic, { fontFamily: FONT, fontSize: '21px', fontStyle: 'bold', color: HEX.ink })
        .setOrigin(0, 0);
      card.add(titleText);

      const subCount = this.add
        .text(330, -8, `${lesson.pages.length - 1} topics`, { fontFamily: FONT, fontSize: '14px', color: HEX.inkSoft })
        .setOrigin(1, 0);
      card.add(subCount);

      const arrow = this.add.graphics();
      arrow.fillStyle(C.crustDark, 1);
      arrow.fillTriangle(400, -10, 400, 10, 416, 0);
      card.add(arrow);

      const viewed = GS.viewedLessons.has(lesson.id);
      const dot = this.add.circle(360, -8, viewed ? 7 : 5, viewed ? C.green : C.mutedStar);
      card.add(dot);

      const zone = this.add.zone(0, 0, w, h).setInteractive({ useHandCursor: true });
      zone.on('pointerup', () => fadeToScene(this, 'Lesson', { lessonId: lesson.id }));
      card.add(zone);

      this.add.existing(card);
    });
  }
}
