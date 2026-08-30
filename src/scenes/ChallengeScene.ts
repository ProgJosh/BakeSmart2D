import Phaser from 'phaser';
import { C, FONT, GAME_W, GAME_H, HEX } from '../core/theme';
import { bgDecor, makeButton, fadeToScene, makeChip, makePanel, makeSectionLabel } from '../ui/UiFactory';
import {
  LO1_STAGES,
  DIFFICULTIES,
  type AnyStage,
  type SelectStage,
  type McqStage,
  type MeasureStage,
  type DialStage,
  type OrderStage
} from '../data/challenges';
import { GS, type StageRecord } from '../core/GameState';

export class ChallengeScene extends Phaser.Scene {
  private stages: AnyStage[] = [];
  private index = 0;
  private records: StageRecord[] = [];
  private hintUsedThisStage = false;

  constructor() {
    super('Challenge');
  }

  init(): void {
    this.stages = [...LO1_STAGES];
    this.index = 0;
    this.records = [];
    this.hintUsedThisStage = false;
  }

  create(): void {
    this.renderStage();
  }

  private clearAll(): void {
    this.children.removeAll(true);
  }

  private get penalty(): number {
    return DIFFICULTIES[GS.difficulty].penalty;
  }

  private renderStage(): void {
    this.clearAll();
    bgDecor(this);

    const stage = this.stages[this.index];
    const cx = GAME_W / 2;

    makeButton(this, 70, 82, 56, 56, '⟵', () => fadeToScene(this, 'LearnHub'), {
      variant: 'flat',
      fontSize: 28,
      radius: 28
    });

    makeChip(this, 150, 54, `${stage.code}`, C.wheat, HEX.ink, 14);

    this.add
      .text(150, 96, `Stage ${this.index + 1} of ${this.stages.length}`, {
        fontFamily: FONT,
        fontSize: '20px',
        fontStyle: 'bold',
        color: HEX.ink
      })
      .setOrigin(0, 0.5);

    this.add
      .text(150, 130, stage.label, { fontFamily: FONT, fontSize: '17px', color: HEX.inkSoft })
      .setOrigin(0, 0.5);

    const progressW = 270;
    const progressX = GAME_W - 205;
    const progress = this.add.graphics();
    progress.fillStyle(C.wheat, 0.85).fillRoundedRect(progressX - progressW / 2, 78, progressW, 14, 7);
    progress.fillStyle(C.primary, 1).fillRoundedRect(progressX - progressW / 2, 78, progressW * ((this.index + 1) / this.stages.length), 14, 7);
    progress.lineStyle(1, C.wheatDark, 0.9).strokeRoundedRect(progressX - progressW / 2, 78, progressW, 14, 7);
    this.add
      .text(progressX, 62, `BAKE PATH  ${this.index + 1} / ${this.stages.length}`, { fontFamily: FONT, fontSize: '13px', fontStyle: 'bold', color: HEX.inkSoft })
      .setOrigin(0.5);

    makePanel(this, cx, 410, 1060, 540);
    makeSectionLabel(this, cx - 470, 202, 'Your baking task', C.primary);

    this.add
      .text(cx, 250, stage.prompt, {
        fontFamily: FONT,
        fontSize: '22px',
        color: HEX.ink,
        wordWrap: { width: 980 },
        align: 'center'
      })
      .setOrigin(0.5);

    switch (stage.type) {
      case 'select':
        this.renderChoice(stage as SelectStage, true);
        break;
      case 'mcq':
        this.renderChoice(stage as McqStage, false);
        break;
      case 'measure':
        this.renderMeasure(stage as MeasureStage);
        break;
      case 'dial':
        this.renderDial(stage as DialStage);
        break;
      case 'order':
        this.renderOrder(stage as OrderStage);
        break;
    }

    this.renderHint(stage);

    this.add
      .text(cx, 688, `Hints left: ${GS.hintsLeft}`, {
        fontFamily: FONT,
        fontSize: '15px',
        color: HEX.inkSoft
      })
      .setOrigin(0.5);
  }

  private renderHint(stage: AnyStage): void {
    const cx = GAME_W / 2;
    const hintText = this.add
      .text(cx, 292, '', { fontFamily: FONT, fontSize: '15px', color: HEX.primaryDark, wordWrap: { width: 900 }, align: 'center', fontStyle: 'italic' })
      .setOrigin(0.5);

    const hintBtn = makeButton(this, GAME_W - 120, 112, 200, 40, 'SHOW HINT', () => {
      if (GS.spendHint()) {
        this.hintUsedThisStage = true;
        hintText.setText(stage.hint);
        hintBtn.setVisible(false);
      }
    }, { variant: 'secondary', fontSize: 15, radius: 20 });
  }

  private renderChoice(stage: SelectStage | McqStage, multi: boolean): void {
    const cx = GAME_W / 2;
    const selected = new Set<number>();
    const opts = (stage as SelectStage).options;
    const N = opts.length;

    const top = 318;
    const bottomLimit = 602;
    const gap = 5;
    let rowH = Math.floor((bottomLimit - top - (N - 1) * gap) / N);
    rowH = Math.max(28, Math.min(54, rowH));
    const step = rowH + gap;
    const startY = top + rowH / 2;
    const w = 760;

    opts.forEach((opt, i) => {
      const y = startY + i * step;
      const cont = this.add.container(cx, y);
      const g = this.add.graphics();
      const txt = this.add
        .text(-w / 2 + 24, 0, opt.text, { fontFamily: FONT, fontSize: '17px', color: HEX.ink, wordWrap: { width: w - 70 } })
        .setOrigin(0, 0.5);
      const circle = this.add.graphics();
      const paint = (on: boolean) => {
        g.clear();
        g.fillStyle(C.ink, 0.06).fillRoundedRect(-w / 2 + 3, -rowH / 2 + 4, w, rowH, 12);
        g.fillStyle(on ? 0xfff3dd : C.card, 1).fillRoundedRect(-w / 2, -rowH / 2, w, rowH, 12);
        g.lineStyle(on ? 3 : 2, on ? C.primary : C.wheatDark, 1).strokeRoundedRect(-w / 2, -rowH / 2, w, rowH, 12);
        circle.clear();
        if (multi) {
          circle.lineStyle(3, on ? C.primary : C.wheatDark, 1).strokeRoundedRect(w / 2 - 42, -16, 32, 32, 8);
          if (on) circle.fillStyle(C.primary, 1).fillRoundedRect(w / 2 - 42, -16, 32, 32, 8);
        } else {
          circle.lineStyle(3, on ? C.primary : C.wheatDark, 1).strokeCircle(w / 2 - 26, 0, 14);
          if (on) {
            circle.fillStyle(C.primary, 1).fillCircle(w / 2 - 26, 0, 14);
            circle.lineStyle(3, 0xffffff, 1);
            circle.beginPath();
            circle.moveTo(w / 2 - 31, 0);
            circle.lineTo(w / 2 - 27, 4);
            circle.lineTo(w / 2 - 21, -5);
            circle.strokePath();
          }
        }
      };
      paint(false);
      const zone = this.add.zone(0, 0, w, rowH).setInteractive({ useHandCursor: true });
      zone.on('pointerup', () => {
        if (multi) {
          if (selected.has(i)) selected.delete(i);
          else selected.add(i);
        } else {
          selected.clear();
          selected.add(i);
        }
        paint(selected.has(i));
      });
      cont.add([g, txt, circle, zone]);
      this.add.existing(cont);
    });

    makeButton(this, cx, 648, 240, 54, 'SUBMIT', () => {
      const chosen = [...selected];
      const ok =
        multi
          ? chosen.length === opts.filter((o) => o.correct).length &&
            chosen.every((i) => opts[i].correct)
          : chosen.length === 1 && opts[chosen[0]].correct;
      this.scoreStage(ok ? 100 : 0, stage.fb);
    }, { variant: 'primary', fontSize: 20, radius: 27 });
  }

  private renderMeasure(stage: MeasureStage): void {
    const cx = GAME_W / 2;
    const tol = stage.tol[GS.difficulty];
    const step = Math.max(1, Math.round(tol / 3));
    let value = 0;

    const valueText = this.add
      .text(cx, 380, `${value} ${stage.unit}`, { fontFamily: FONT, fontSize: '40px', fontStyle: 'bold', color: HEX.primaryDark })
      .setOrigin(0.5);

    this.add
      .text(cx, 330, `Target: ${stage.target} ${stage.unit}  (± ${tol})`, {
        fontFamily: FONT,
        fontSize: '17px',
        color: HEX.inkSoft
      })
      .setOrigin(0.5);

    const adjust = (delta: number) => {
      value = Phaser.Math.Clamp(value + delta, 0, stage.target * 2);
      valueText.setText(`${value} ${stage.unit}`);
    };

    makeButton(this, cx - 150, 460, 120, 70, '−', () => adjust(-step), { variant: 'secondary', fontSize: 34, radius: 16 });
    makeButton(this, cx + 150, 460, 120, 70, '+', () => adjust(step), { variant: 'secondary', fontSize: 34, radius: 16 });
    makeButton(this, cx, 540, 220, 52, 'SUBMIT', () => {
      const ok = Math.abs(value - stage.target) <= tol;
      this.scoreStage(ok ? 100 : 0, ok ? stage.fb : `${stage.fb} (You set ${value} ${stage.unit}.)`);
    }, { variant: 'primary', fontSize: 20, radius: 26 });
  }

  private renderDial(stage: DialStage): void {
    const cx = GAME_W / 2;
    const tol = stage.tol[GS.difficulty];
    const step = Math.max(1, Math.round(tol / 3));
    let value = stage.min;

    const valueText = this.add
      .text(cx, 380, `${value} ${stage.unit}`, { fontFamily: FONT, fontSize: '40px', fontStyle: 'bold', color: HEX.primaryDark })
      .setOrigin(0.5);

    this.add
      .text(cx, 330, `Range ${stage.min}–${stage.max} ${stage.unit}  ·  target ${stage.target} (± ${tol})`, {
        fontFamily: FONT,
        fontSize: '17px',
        color: HEX.inkSoft
      })
      .setOrigin(0.5);

    const minText = this.add.text(cx - 200, 470, `${stage.min}`, { fontFamily: FONT, fontSize: '16px', color: HEX.inkSoft }).setOrigin(0.5);
    void minText;
    const maxText = this.add.text(cx + 200, 470, `${stage.max}`, { fontFamily: FONT, fontSize: '16px', color: HEX.inkSoft }).setOrigin(0.5);
    void maxText;

    const adjust = (delta: number) => {
      value = Phaser.Math.Clamp(value + delta, stage.min, stage.max);
      valueText.setText(`${value} ${stage.unit}`);
    };

    makeButton(this, cx - 150, 460, 120, 70, '−', () => adjust(-step), { variant: 'secondary', fontSize: 34, radius: 16 });
    makeButton(this, cx + 150, 460, 120, 70, '+', () => adjust(step), { variant: 'secondary', fontSize: 34, radius: 16 });
    makeButton(this, cx, 540, 220, 52, 'SUBMIT', () => {
      const ok = Math.abs(value - stage.target) <= tol;
      this.scoreStage(ok ? 100 : 0, ok ? stage.fb : `${stage.fb} (You set ${value} ${stage.unit}.)`);
    }, { variant: 'primary', fontSize: 20, radius: 26 });
  }

  private renderOrder(stage: OrderStage): void {
    const cx = GAME_W / 2;
    const order = stage.items.map((_, i) => i);
    const w = 820;
    const rowH = 60;

    const rowsLayer = this.add.container(0, 0);

    const redraw = () => {
      rowsLayer.removeAll(true);

      order.forEach((origIdx, pos) => {
        const y = 300 + pos * (rowH + 10);
        const cont = this.add.container(cx, y);
        const g = this.add.graphics();
        g.fillStyle(C.ink, 0.06).fillRoundedRect(-w / 2 + 3, -rowH / 2 + 4, w, rowH, 12);
        g.fillStyle(C.card, 1).fillRoundedRect(-w / 2, -rowH / 2, w, rowH, 12);
        g.lineStyle(2, C.wheatDark, 1).strokeRoundedRect(-w / 2, -rowH / 2, w, rowH, 12);
        const num = this.add.text(-w / 2 + 20, 0, `${pos + 1}`, { fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: HEX.primary }).setOrigin(0, 0.5);
        const txt = this.add.text(-w / 2 + 60, 0, stage.items[origIdx], { fontFamily: FONT, fontSize: '18px', color: HEX.ink, wordWrap: { width: w - 200 } }).setOrigin(0, 0.5);
        cont.add([g, num, txt]);

        if (pos > 0) {
          const up = makeButton(this, w / 2 - 40, 0, 44, 44, '↑', () => {
            [order[pos - 1], order[pos]] = [order[pos], order[pos - 1]];
            redraw();
          }, { variant: 'flat', fontSize: 22, radius: 22 });
          cont.add(up);
        }
        if (pos < order.length - 1) {
          const down = makeButton(this, w / 2 + 20, 0, 44, 44, '↓', () => {
            [order[pos], order[pos + 1]] = [order[pos + 1], order[pos]];
            redraw();
          }, { variant: 'flat', fontSize: 22, radius: 22 });
          cont.add(down);
        }
        rowsLayer.add(cont);
      });

      const submit = makeButton(this, cx, 660, 220, 52, 'SUBMIT', () => {
        const ok = order.every((v, i) => v === i);
        this.scoreStage(ok ? 100 : 0, stage.fb);
      }, { variant: 'primary', fontSize: 20, radius: 26 });
      rowsLayer.add(submit);
    };

    redraw();
  }

  private scoreStage(score: number, feedback: string): void {
    const stage = this.stages[this.index];
    const finalScore = this.hintUsedThisStage ? Math.max(0, score - this.penalty) : score;
    this.records.push({ label: stage.label, score: finalScore, max: 100, feedback });
    this.showFeedback(feedback, finalScore);
  }

  private showFeedback(feedback: string, score: number): void {
    const cx = GAME_W / 2;
    const overlay = this.add.container(0, 0).setDepth(1000);
    const shade = this.add.graphics();
    shade.fillStyle(0x000000, 0.45).fillRect(0, 0, GAME_W, GAME_H);
    overlay.add(shade);

    const w = 760;
    const h = 320;
    const card = this.add.graphics();
    card.fillStyle(C.card, 1).fillRoundedRect(cx - w / 2, 280, w, h, 24);
    card.lineStyle(3, C.wheatDark, 1).strokeRoundedRect(cx - w / 2, 280, w, h, 24);
    overlay.add(card);

    overlay.add(
      this.add
        .text(cx, 320, 'Feedback', { fontFamily: FONT, fontSize: '24px', fontStyle: 'bold', color: HEX.primaryDark })
        .setOrigin(0.5)
    );

    overlay.add(makeChip(this, cx, 364, `${score}/100 STAGE SCORE`, score === 100 ? C.green : C.wheat, score === 100 ? HEX.white : HEX.ink, 13));

    overlay.add(
      this.add
        .text(cx, 404, feedback, { fontFamily: FONT, fontSize: '19px', color: HEX.ink, wordWrap: { width: w - 80 }, align: 'center', lineSpacing: 6 })
        .setOrigin(0.5, 0)
    );

    const isLast = this.index >= this.stages.length - 1;
    const btn = makeButton(this, cx, 540, 240, 56, isLast ? 'SEE RESULTS' : 'NEXT', () => {
      overlay.destroy();
      if (isLast) {
        const result = GS.finishActivity('LO1', 'LO1 baking challenge complete', this.records);
        fadeToScene(this, 'Result', { result });
      } else {
        this.index++;
        this.hintUsedThisStage = false;
        this.renderStage();
      }
    }, { variant: 'primary', fontSize: 20, radius: 28 });
    overlay.add(btn);
  }
}
