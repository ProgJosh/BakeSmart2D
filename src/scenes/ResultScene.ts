import Phaser from 'phaser';
import { C, FONT, GAME_W, HEX } from '../core/theme';
import { bgDecor, makeButton, fadeToScene, makePanel, makeStars, makeChip, makeSectionLabel } from '../ui/UiFactory';
import { GS } from '../core/GameState';
import { DIFFICULTIES } from '../data/challenges';
import { UI_LAYOUT } from '../core/layout';

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

    makeChip(this, cx, 48, `${result.lo} · ${result.difficultyLabel.toUpperCase()} MODE`, C.wheat, HEX.ink, 14);

    this.add
      .text(cx, 92, 'Baking session complete!', {
        fontFamily: FONT,
        fontSize: '28px',
        fontStyle: 'bold',
        color: HEX.ink
      })
      .setOrigin(0.5);

    makeStars(this, cx, 132, 22, result.stars);

    this.add
      .text(cx, 172, `Accuracy ${result.accuracy}%   ·   Score ${result.total}/${result.maxTotal}`, {
        fontFamily: FONT,
        fontSize: '18px',
        color: HEX.inkSoft
      })
      .setOrigin(0.5);

    makePanel(this, cx, 430, 1040, 500, C.cardWarm, 28);
    makeSectionLabel(this, cx - 455, 204, 'Stage performance', C.primary);

    // LO1 has eight stages. Start the feedback list near the top of the panel
    // so the final row remains clear of the bottom navigation controls.
    const listTop = 224;
    const rowH = Math.min(52, Math.floor(400 / Math.max(1, result.stages.length)));
    result.stages.forEach((stage, i) => {
      const y = listTop + i * rowH;
      const stageColor = stage.score === stage.max ? C.green : stage.score > 0 ? C.gold : C.primary;
      this.add.circle(cx - 432, y + 8, 6, stageColor);
      this.add
        .text(cx - 414, y, `${stage.label}`, { fontFamily: FONT, fontSize: '15px', fontStyle: 'bold', color: HEX.ink, wordWrap: { width: 400 } })
        .setOrigin(0, 0);
      this.add
        .text(cx - 414, y + 20, stage.feedback, { fontFamily: FONT, fontSize: '13px', color: HEX.inkSoft, wordWrap: { width: 590 }, lineSpacing: 2 })
        .setOrigin(0, 0);
      this.add
        .text(cx + 480, y + 6, `${stage.score}/${stage.max}`, { fontFamily: FONT, fontSize: '16px', fontStyle: 'bold', color: stageColor === C.green ? HEX.green : HEX.primaryDark })
        .setOrigin(1, 0);
      if (i < result.stages.length - 1) {
        this.add.rectangle(cx, y + rowH - 6, 890, 1, C.wheatDark, 0.34).setOrigin(0.5);
      }
    });

    makeButton(this, cx - 310, UI_LAYOUT.safeNavigationY, 190, 60, 'RETRY ACTIVITY', () => {
      GS.startActivity(DIFFICULTIES[GS.difficulty].hints);
      const targetScene = result.lo === 'LO1' ? 'Challenge' : result.lo === 'LO2' ? 'Decorate' : 'StoragePack';
      fadeToScene(this, targetScene, { lo: result.lo });
    }, {
      variant: 'secondary',
      fontSize: 17,
      radius: 30
    });
    makeButton(this, cx, UI_LAYOUT.safeNavigationY, 300, 60, 'CONTINUE LEARNING', () => fadeToScene(this, 'LearnHub'), {
      variant: 'primary',
      fontSize: 18,
      radius: 30
    });
    makeButton(this, cx + 310, UI_LAYOUT.safeNavigationY, 200, 60, 'MAIN MENU', () => fadeToScene(this, 'Menu'), {
      variant: 'secondary',
      fontSize: 18,
      radius: 30
    });
  }
}
