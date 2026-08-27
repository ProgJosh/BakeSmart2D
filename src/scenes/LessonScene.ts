import Phaser from 'phaser';
import { C, FONT, GAME_W, HEX } from '../core/theme';
import { bgDecor, makeButton, fadeToScene, makePanel, makeChip, makeDots } from '../ui/UiFactory';
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

    makeChip(this, 150, 54, `${this.lesson.lo} \u00b7 WEEK ${this.lesson.week}`, C.wheat, HEX.ink, 14);

    this.add
      .text(100, 96, this.lesson.topic, { fontFamily: FONT, fontSize: '27px', fontStyle: 'bold', color: HEX.ink, wordWrap: { width: 1080 } })
      .setOrigin(0, 0.5);

    makePanel(this, cx, 395, 1040, 470);

    let y = 200;
    this.add
      .text(cx, y, page.heading, { fontFamily: FONT, fontSize: '23px', fontStyle: 'bold', color: HEX.primaryDark, wordWrap: { width: 980 } })
      .setOrigin(0.5);
    y += 50;

    page.body.forEach((paragraph) => {
      const txt = this.add
        .text(cx, y, paragraph, { fontFamily: FONT, fontSize: '19px', color: HEX.ink, wordWrap: { width: 940 }, lineSpacing: 8 })
        .setOrigin(0.5, 0);
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
          .text(cx - 450, y, point, { fontFamily: FONT, fontSize: '17px', color: HEX.ink, wordWrap: { width: 900 } })
          .setOrigin(0, 0);
        y += 26;
      });
    }

    makeDots(this, cx, 620, this.lesson.pages.length, this.pageIndex);

    const isLast = this.pageIndex === this.lesson.pages.length - 1;
    const nextLabel = isLast ? 'TAKE THE CHALLENGE' : 'NEXT';
    const nextVariant = isLast ? 'primary' : 'secondary';

    makeButton(this, cx - 160, 680, 180, 58, 'BACK', () => this.prevPage(), { variant: 'secondary', fontSize: 18 });
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