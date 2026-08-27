import Phaser from 'phaser';
import { FONT, GAME_W, HEX } from '../core/theme';
import { bgDecor, makeButton, fadeToScene, makePanel, makeStars } from '../ui/UiFactory';
import { GS } from '../core/GameState';

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('Result');
  }

  create(): void {
    this.children.removeAll(true);
    bgDecor(this);
    const cx = GAME_W / 2;

    const result = GS.lastResult;
    if (!result) {
      fadeToScene(this, 'Menu');
      return;
    }

    this.add
      .text(cx, 56, `${result.lo} · ${result.difficultyLabel}`, {
        fontFamily: FONT,
        fontSize: '26px',
        fontStyle: 'bold',
        color: HEX.ink
      })
      .setOrigin(0.5);

    makeStars(this, cx, 120, 22, result.stars);

    this.add
      .text(cx, 168, `Accuracy ${result.accuracy}%   ·   Score ${result.total}/${result.maxTotal}`, {
        fontFamily: FONT,
        fontSize: '18px',
        color: HEX.inkSoft
      })
      .setOrigin(0.5);

    makePanel(this, cx, 430, 1040, 500);

    const listTop = 280;
    const rowH = Math.min(56, Math.floor(430 / result.stages.length));
    result.stages.forEach((stage, i) => {
      const y = listTop + i * rowH;
      this.add
        .text(cx - 455, y, `${stage.label}`, { fontFamily: FONT, fontSize: '15px', fontStyle: 'bold', color: HEX.ink, wordWrap: { width: 430 } })
        .setOrigin(0, 0);
      this.add
        .text(cx - 455, y + 20, stage.feedback, { fontFamily: FONT, fontSize: '12px', color: HEX.inkSoft, wordWrap: { width: 620 }, lineSpacing: 2 })
        .setOrigin(0, 0);
      this.add
        .text(cx + 480, y + 6, `${stage.score}/${stage.max}`, { fontFamily: FONT, fontSize: '16px', fontStyle: 'bold', color: HEX.primaryDark })
        .setOrigin(1, 0);
    });

    makeButton(this, cx - 170, 690, 300, 60, 'BACK TO LEARNING HUB', () => fadeToScene(this, 'LearnHub'), {
      variant: 'primary',
      fontSize: 19,
      radius: 30
    });
    makeButton(this, cx + 170, 690, 240, 60, 'MAIN MENU', () => fadeToScene(this, 'Menu'), {
      variant: 'secondary',
      fontSize: 19,
      radius: 30
    });
  }
}
