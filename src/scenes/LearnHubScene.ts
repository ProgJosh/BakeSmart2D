import Phaser from 'phaser';
import { FONT, GAME_W, HEX, C } from '../core/theme';
import { bgDecor, fadeToScene, makeButton } from '../ui/UiFactory';
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

    this.add
      .text(cx, 70, 'Learning Hub', { fontFamily: FONT, fontSize: '38px', fontStyle: 'bold', color: HEX.ink })
      .setOrigin(0.5);

    this.add
      .text(cx, 110, 'Choose a Learning Outcome', { fontFamily: FONT, fontSize: '19px', color: HEX.inkSoft })
      .setOrigin(0.5);

    makeButton(this, 92, 74, 144, 46, 'MAIN MENU', () => fadeToScene(this, 'Menu'), {
      variant: 'flat',
      fontSize: 15,
      radius: 23
    });

    OUTCOMES.forEach((outcome, idx) => {
      const y = 215 + idx * 150;
      const card = this.add.container(cx, y);
      const w = 900;
      const h = 130;

      const g = this.add.graphics();
      g.fillStyle(C.ink, 0.08).fillRoundedRect(-w / 2 + 4, -h / 2 + 7, w, h, 22);
      g.fillStyle(C.card, 1).fillRoundedRect(-w / 2, -h / 2, w, h, 22);
      g.lineStyle(2, C.wheatDark, 0.7).strokeRoundedRect(-w / 2, -h / 2, w, h, 22);
      g.fillStyle(outcome.color, 1).fillRoundedRect(-w / 2, -h / 2, 14, h, { tl: 22, bl: 22 });
      card.add(g);

      const idText = this.add
        .text(-w / 2 + 32, -h / 2 + 20, outcome.id, { fontFamily: FONT, fontSize: '30px', fontStyle: 'bold', color: HEX.primaryDark })
        .setOrigin(0, 0);
      const titleText = this.add
        .text(-w / 2 + 130, -h / 2 + 20, outcome.title, { fontFamily: FONT, fontSize: '24px', fontStyle: 'bold', color: HEX.ink })
        .setOrigin(0, 0);
      const taglineText = this.add
        .text(-w / 2 + 130, -h / 2 + 58, outcome.tagline, { fontFamily: FONT, fontSize: '16px', color: HEX.inkSoft })
        .setOrigin(0, 0);
      card.add([idText, titleText, taglineText]);

      const viewedCount = outcome.lessons.filter((l) => GS.viewedLessons.has(l.id)).length;
      const progressText = `${viewedCount}/${outcome.lessons.length} lessons`;

      const progressChip = this.add.container(w / 2 - 160, 0);
      const pg = this.add.graphics();
      pg.fillStyle(C.wheat, 1).fillRoundedRect(-140, -18, 280, 36, 18);
      pg.lineStyle(1, C.wheatDark, 0.8).strokeRoundedRect(-140, -18, 280, 36, 18);
      const pt = this.add.text(0, 0, progressText, { fontFamily: FONT, fontSize: '14px', fontStyle: 'bold', color: HEX.ink }).setOrigin(0.5);
      progressChip.add([pg, pt]);
      card.add(progressChip);

      if (GS.completedLOs.has(outcome.id)) {
        const doneChip = this.add.container(w / 2 - 320, 0);
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
      .text(cx, 690, 'Select an outcome to view its weekly lessons', { fontFamily: FONT, fontSize: '15px', color: HEX.inkSoft })
      .setOrigin(0.5)
      .setAlpha(0.7);
  }

  private showWeeks(loId: 'LO1' | 'LO2' | 'LO3'): void {
    this.clearAll();
    bgDecor(this);

    const outcome = OUTCOMES.find((o) => o.id === loId)!;
    const cx = GAME_W / 2;

    makeButton(this, 70, 82, 56, 56, '⟵', () => this.showHub(), { variant: 'flat', fontSize: 28, radius: 28 });

    this.add
      .text(140, 82, `${outcome.title} — Weeks 1–${outcome.lessons.length}`, {
        fontFamily: FONT,
        fontSize: '28px',
        fontStyle: 'bold',
        color: HEX.ink
      })
      .setOrigin(0, 0.5);

    const underline = this.add.graphics();
    underline.fillStyle(outcome.color, 1).fillRect(140, 118, 300, 4);

    outcome.lessons.forEach((lesson, idx) => {
      const y = 185 + idx * 100;
      const card = this.add.container(cx, y);
      const w = 920;
      const h = 86;

      const g = this.add.graphics();
      g.fillStyle(C.ink, 0.06).fillRoundedRect(-w / 2 + 3, -h / 2 + 5, w, h, 18);
      g.fillStyle(C.card, 1).fillRoundedRect(-w / 2, -h / 2, w, h, 18);
      g.lineStyle(1, C.wheatDark, 0.6).strokeRoundedRect(-w / 2, -h / 2, w, h, 18);
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
