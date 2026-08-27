import Phaser from 'phaser';
import { FONT, GAME_W, HEX } from '../core/theme';
import { bgDecor, makeOptionTile, makeButton, fadeToScene, makeChip } from '../ui/UiFactory';
import { DIFFICULTY_LIST } from '../data/challenges';
import { GS } from '../core/GameState';
import { OUTCOMES } from '../data/lessons';

interface DifficultyData {
  lo: 'LO1' | 'LO2' | 'LO3';
  lessonId: string;
}

export class DifficultyScene extends Phaser.Scene {
  private lo: 'LO1' | 'LO2' | 'LO3' = 'LO1';
  private lessonId = '';
  private selectedDifficulty: 'easy' | 'medium' | 'hard' = 'medium';

  constructor() {
    super('Difficulty');
  }

  init(data: DifficultyData): void {
    this.lo = data.lo;
    this.lessonId = data.lessonId;
    this.selectedDifficulty = GS.difficulty;
  }

  create(): void {
    this.clearAll();
    bgDecor(this);

    const outcome = OUTCOMES.find(o => o.id === this.lo)!;
    const cx = GAME_W / 2;

    makeButton(this, 70, 82, 56, 56, '\u2039', () => fadeToScene(this, 'Lesson', { lessonId: this.lessonId }), {
      variant: 'flat',
      fontSize: 28,
      radius: 28
    });

    makeChip(this, cx - 350, 82, this.lo, outcome.color, HEX.white, 15);

    this.add
      .text(140, 82, 'Select Difficulty', { fontFamily: FONT, fontSize: '28px', fontStyle: 'bold', color: HEX.ink })
      .setOrigin(0, 0.5);

    this.add
      .text(140, 118, outcome.title, { fontFamily: FONT, fontSize: '18px', color: HEX.inkSoft })
      .setOrigin(0, 0.5);

    const underline = this.add.graphics();
    underline.fillStyle(outcome.color, 1).fillRect(140, 148, 300, 4);

    const diffTiles: Map<string, ReturnType<typeof makeOptionTile>> = new Map();

    DIFFICULTY_LIST.forEach((diff, idx) => {
      const y = 245 + idx * 130;
      const tile = makeOptionTile(
        this,
        cx,
        y,
        820,
        108,
        diff.label,
        () => {
          this.selectedDifficulty = diff.id;
          diffTiles.forEach((t, d) => t.setSelected(d === diff.id));
          continueBtn.setEnabled(true);
        },
        {
          desc: diff.blurb,
          fontSize: 26
        }
      );
      tile.setSelected(diff.id === this.selectedDifficulty);
      diffTiles.set(diff.id, tile);
      this.add.existing(tile);
    });

    const continueBtn = makeButton(
      this,
      cx,
      650,
      320,
      68,
      'CONTINUE',
      () => {
        GS.difficulty = this.selectedDifficulty;
        GS.startActivity(DIFFICULTY_LIST.find(d => d.id === this.selectedDifficulty)?.hints ?? 0);
        const targetScene = this.lo === 'LO1' ? 'Challenge' : this.lo === 'LO2' ? 'Decorate' : 'StoragePack';
        fadeToScene(this, targetScene, { lo: this.lo });
      },
      { variant: 'primary', fontSize: 22, radius: 34 }
    );
    continueBtn.setEnabled(true);

    this.add
      .text(cx, 730, 'Hint tokens and scoring vary by difficulty', { fontFamily: FONT, fontSize: '14px', color: HEX.inkSoft })
      .setOrigin(0.5)
      .setAlpha(0.7);

    this.input.keyboard?.on('keydown-ONE', () => diffTiles.get('easy')?.setSelected(true) || this.selectDiff('easy', diffTiles, continueBtn));
    this.input.keyboard?.on('keydown-TWO', () => diffTiles.get('medium')?.setSelected(true) || this.selectDiff('medium', diffTiles, continueBtn));
    this.input.keyboard?.on('keydown-THREE', () => diffTiles.get('hard')?.setSelected(true) || this.selectDiff('hard', diffTiles, continueBtn));
  }

  private selectDiff(
    id: 'easy' | 'medium' | 'hard',
    tiles: Map<string, ReturnType<typeof makeOptionTile>>,
    btn: ReturnType<typeof makeButton>
  ): void {
    this.selectedDifficulty = id;
    tiles.forEach((t, d) => t.setSelected(d === id));
    btn.setEnabled(true);
  }

  private clearAll(): void {
    this.children.removeAll(true);
  }
}