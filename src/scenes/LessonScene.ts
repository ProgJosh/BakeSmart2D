import Phaser from 'phaser';
import { C, FONT, GAME_W, HEX } from '../core/theme';
import { bgDecor, makeButton, fadeToScene, makePanel, makeChip, makeDots, makeSectionLabel } from '../ui/UiFactory';
import { findLesson } from '../data/lessons';
import { GS } from '../core/GameState';

interface LessonData {
  lessonId: string;
}

export class LessonScene extends Phaser.Scene {
  private lesson: ReturnType<typeof findLesson> | null = null;
  private pageIndex = 0;

  constructor() {
    super('Lesson');
  }

  init(data: LessonData): void {
    this.lesson = findLesson(data.lessonId);
    this.pageIndex = 0;
  }

  create(): void {
    this.renderPage();
    this.setupKeyboard();
  }

  private setupKeyboard(): void {
    this.input.keyboard?.on('keydown-LEFT', () => this.prevPage());
    this.input.keyboard?.on('keydown-RIGHT', () => this.nextPage());
  }

  private clearAll(): void {
    this.children.removeAll(true);
  }

  private renderPage(): void {
    if (!this.lesson) return;
    this.clearAll();
    bgDecor(this);

    const page = this.lesson.pages[this.pageIndex];
    const cx = GAME_W / 2;

    makeChip(this, 162, 54, `${this.lesson.lo} \u00b7 WEEK ${this.lesson.week}`, C.wheat, HEX.ink, 14);
    makeChip(this, GAME_W - 156, 54, `PAGE ${this.pageIndex + 1} OF ${this.lesson.pages.length}`, C.cardWarm, HEX.inkSoft, 13);

    this.add
      .text(100, 100, this.lesson.topic, { fontFamily: FONT, fontSize: '27px', fontStyle: 'bold', color: HEX.ink, wordWrap: { width: 980 } })
      .setOrigin(0, 0.5);

    makePanel(this, cx, 404, 1040, 486, C.cardWarm, 28);
    const book = this.add.graphics();
    book.fillStyle(C.wheat, 0.45).fillRoundedRect(cx - 505, 185, 14, 432, 7);
    book.lineStyle(2, C.wheatDark, 0.5).lineBetween(cx - 486, 200, cx - 486, 604);
    for (let lineY = 325; lineY <= 564; lineY += 48) {
      book.lineStyle(1, C.wheatDark, 0.18).lineBetween(cx - 440, lineY, cx + 440, lineY);
    }

    let y = 206;
    makeSectionLabel(this, cx - 440, y, 'Lesson note', C.primary);
    y += 34;
    this.add
      .text(cx - 440, y, page.heading, { fontFamily: FONT, fontSize: '23px', fontStyle: 'bold', color: HEX.primaryDark, wordWrap: { width: 880 } })
      .setOrigin(0, 0);
    y += 50;

    page.body.forEach((paragraph) => {
      const txt = this.add
        .text(cx - 440, y, paragraph, { fontFamily: FONT, fontSize: '18px', color: HEX.ink, wordWrap: { width: 880 }, lineSpacing: 7 })
        .setOrigin(0, 0);
      y += txt.height + 16;
    });

    if (page.points.length > 0) {
      y += 8;
      this.add
        .text(cx - 470, y, 'KEY POINTS', { fontFamily: FONT, fontSize: '13px', fontStyle: 'bold', color: HEX.inkSoft, letterSpacing: 1 })
        .setOrigin(0, 0);
      y += 22;

      page.points.forEach((point) => {
        const bullet = this.add.graphics();
        bullet.fillStyle(C.gold, 1).fillCircle(cx - 470, y + 7, 4);
        this.add
          .text(cx - 420, y, point, { fontFamily: FONT, fontSize: '17px', color: HEX.ink, wordWrap: { width: 850 } })
          .setOrigin(0, 0);
        y += 26;
      });
    }

    makeDots(this, cx, 620, this.lesson.pages.length, this.pageIndex);

    const isLast = this.pageIndex === this.lesson.pages.length - 1;
    const nextLabel = isLast ? 'TAKE THE CHALLENGE' : 'NEXT';
    const nextVariant = isLast ? 'primary' : 'secondary';

    makeButton(
      this,
      cx - 160,
      680,
      180,
      58,
      this.pageIndex === 0 ? 'LEARNING HUB' : 'BACK',
      () => {
        if (this.pageIndex === 0) fadeToScene(this, 'LearnHub');
        else this.prevPage();
      },
      { variant: 'secondary', fontSize: 18 }
    );
    makeButton(this, cx + 180, 680, isLast ? 280 : 180, 58, nextLabel, () => this.nextPage(), { variant: nextVariant, fontSize: 18 });
  }

  private prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.renderPage();
    }
  }

  private nextPage(): void {
    if (this.pageIndex < (this.lesson?.pages.length ?? 1) - 1) {
      this.pageIndex++;
      this.renderPage();
    } else if (this.lesson) {
      GS.markViewed(this.lesson.id);
      fadeToScene(this, 'Difficulty', { lo: this.lesson.lo, lessonId: this.lesson.id });
    }
  }
}
