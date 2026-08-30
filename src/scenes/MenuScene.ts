import Phaser from 'phaser';
import { C, FONT, GAME_W, HEX } from '../core/theme';
import { bgDecor, fadeToScene, makeButton, makeChip, makePanel } from '../ui/UiFactory';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create(): void {
    bgDecor(this);
    const cx = GAME_W / 2;

    makeChip(this, cx, 82, 'BAKERY LEARNING STUDIO', C.wheat, HEX.ink, 14);
    const leftNote = makePanel(this, 210, 320, 238, 164, C.cardWarm, 22);
    leftNote.setAlpha(0.94);
    this.add.text(104, 265, 'TODAY\'S RECIPE', { fontFamily: FONT, fontSize: '13px', fontStyle: 'bold', color: HEX.primaryDark }).setLetterSpacing(2);
    this.add.text(104, 300, 'Learn the craft\nof great baking.', { fontFamily: FONT, fontSize: '21px', fontStyle: 'bold', color: HEX.ink, lineSpacing: 5 });
    this.add.text(104, 372, 'Study · Practise · Improve', { fontFamily: FONT, fontSize: '14px', color: HEX.inkSoft });

    const rightNote = makePanel(this, 1070, 320, 224, 164, C.cardWarm, 22);
    rightNote.setAlpha(0.94);
    this.add.text(972, 265, 'YOUR KITCHEN', { fontFamily: FONT, fontSize: '13px', fontStyle: 'bold', color: HEX.primaryDark }).setLetterSpacing(2);
    ['Lessons', 'Challenges', 'Feedback'].forEach((label, i) => {
      this.add.circle(986, 306 + i * 30, 6, [C.gold, C.primary, C.green][i]);
      this.add.text(1004, 306 + i * 30, label, { fontFamily: FONT, fontSize: '16px', color: HEX.ink }).setOrigin(0, 0.5);
    });

    const art = this.add.container(cx, 218);

    const g = this.add.graphics();
    g.fillStyle(C.wheatDark, 0.5).fillEllipse(0, 104, 380, 36);
    g.fillStyle(0xf3e4c2, 1).fillRoundedRect(-205, 82, 410, 26, 13);
    g.lineStyle(2, C.crustDark, 0.5).strokeRoundedRect(-205, 82, 410, 26, 13);
    art.add(g);

    const loaf = this.add.container(0, 0);
    const lg = this.add.graphics();
    lg.fillStyle(C.crustDark, 1).fillEllipse(0, 6, 330, 178);
    lg.fillStyle(C.crust, 1).fillEllipse(0, -8, 306, 150);
    lg.lineStyle(7, C.crustDark, 0.85);
    for (const sx of [-72, 0, 72]) {
      lg.beginPath();
      lg.moveTo(sx - 18, -52);
      lg.lineTo(sx + 18, 8);
      lg.strokePath();
    }
    lg.lineStyle(4, C.inkSoft, 0.35);
    lg.beginPath();
    lg.arc(-42, -128, 24, Phaser.Math.DegToRad(215), Phaser.Math.DegToRad(335));
    lg.strokePath();
    lg.beginPath();
    lg.arc(14, -140, 28, Phaser.Math.DegToRad(215), Phaser.Math.DegToRad(335));
    lg.strokePath();
    loaf.add(lg);
    art.add(loaf);
    this.tweens.add({
      targets: loaf,
      y: -7,
      duration: 1900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    const t1 = this.add
      .text(0, 0, 'BakeSmart', { fontFamily: FONT, fontSize: '64px', fontStyle: 'bold', color: HEX.ink })
      .setOrigin(0, 0.5);
    const t2 = this.add
      .text(0, 0, '2D', { fontFamily: FONT, fontSize: '64px', fontStyle: 'bold', color: HEX.primary })
      .setOrigin(0, 0.5);
    const totalW = t1.width + 12 + t2.width;
    t1.x = cx - totalW / 2;
    t1.y = 424;
    t2.x = t1.x + t1.width + 12;
    t2.y = 424;

    this.add
      .text(cx, 470, 'An interactive bread & bakery learning game', {
        fontFamily: FONT,
        fontSize: '21px',
        color: HEX.inkSoft
      })
      .setOrigin(0.5);

    makeButton(this, cx, 560, 386, 78, 'START LEARNING', () => fadeToScene(this, 'LearnHub'), {
      variant: 'primary',
      fontSize: 25,
      radius: 38
    });

    this.add
      .text(cx, 638, 'Mouse · touch · keyboard ready', {
        fontFamily: FONT,
        fontSize: '15px',
        color: HEX.inkSoft
      })
      .setOrigin(0.5)
      .setAlpha(0.85);

    this.add
      .text(cx, 690, 'BakeSmart2D · practical bakery learning', {
        fontFamily: FONT,
        fontSize: '15px',
        color: HEX.inkSoft
      })
      .setOrigin(0.5)
      .setAlpha(0.75);

    this.input.keyboard?.once('keydown-ENTER', () => fadeToScene(this, 'LearnHub'));
  }
}
