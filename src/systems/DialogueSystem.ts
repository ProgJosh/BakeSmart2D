import Phaser from 'phaser';
import { C, FONT, GAME_H, GAME_W, HEX } from '../core/theme';
import { makeButton } from '../ui/UiFactory';

export interface DialogueLine {
  speaker: string;
  text: string;
  portrait?: string;
}

export interface DialogueOptions {
  typewriterMs?: number;
}

export class DialogueBox {
  readonly container: Phaser.GameObjects.Container;
  private readonly speakerText: Phaser.GameObjects.Text;
  private readonly bodyText: Phaser.GameObjects.Text;
  private readonly portraitLayer: Phaser.GameObjects.Container;
  private typewriter?: Phaser.Time.TimerEvent;
  private fullText = '';
  private charIndex = 0;
  private onAdvance?: () => void;
  private nextAllowedAt = 0;
  private destroyed = false;

  constructor(private readonly scene: Phaser.Scene, private readonly options: DialogueOptions = {}) {
    this.container = scene.add.container(0, 0).setDepth(3000).setVisible(false);

    const blocker = scene.add.zone(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H).setInteractive();
    const shade = scene.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x1d1008, 0.12);
    const shadow = scene.add.graphics();
    shadow.fillStyle(C.ink, 0.16).fillRoundedRect(63, 489, 1154, 184, 26);
    const panel = scene.add.graphics();
    panel.fillStyle(C.cardWarm, 1).fillRoundedRect(56, 480, 1154, 184, 26);
    panel.lineStyle(3, C.wheatDark, 1).strokeRoundedRect(56, 480, 1154, 184, 26);

    this.portraitLayer = scene.add.container(135, 566);
    this.speakerText = scene.add
      .text(224, 510, '', { fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: HEX.primaryDark })
      .setOrigin(0, 0.5);
    this.bodyText = scene.add
      .text(224, 542, '', {
        fontFamily: FONT,
        fontSize: '20px',
        color: HEX.ink,
        wordWrap: { width: 700 },
        lineSpacing: 7
      })
      .setOrigin(0, 0);

    const continueButton = makeButton(scene, 1070, 620, 210, 58, 'CONTINUE', () => this.requestAdvance(), {
      variant: 'primary',
      fontSize: 18,
      radius: 29
    });
    const hint = scene.add
      .text(1070, 582, 'Tap to continue', { fontFamily: FONT, fontSize: '14px', color: HEX.inkSoft })
      .setOrigin(0.5);

    this.container.add([shade, blocker, shadow, panel, this.portraitLayer, this.speakerText, this.bodyText, hint, continueButton]);
    blocker.on('pointerup', () => this.requestAdvance());
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
  }

  show(line: DialogueLine, onAdvance: () => void): void {
    if (this.destroyed) return;
    this.stopTypewriter();
    this.fullText = line.text;
    this.charIndex = 0;
    this.onAdvance = onAdvance;
    this.nextAllowedAt = this.scene.time.now + 180;
    this.speakerText.setText(line.speaker.toUpperCase());
    this.bodyText.setText('');
    this.drawPortrait(line.speaker, line.portrait);
    this.container.setVisible(true).setAlpha(1);

    const interval = this.options.typewriterMs ?? 17;
    if (interval <= 0) {
      this.completeText();
      return;
    }

    this.typewriter = this.scene.time.addEvent({
      delay: interval,
      repeat: Math.max(0, this.fullText.length - 1),
      callback: () => {
        this.charIndex++;
        this.bodyText.setText(this.fullText.slice(0, this.charIndex));
      }
    });
  }

  hide(): void {
    this.stopTypewriter();
    this.container.setVisible(false);
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.stopTypewriter();
    this.container.destroy(true);
  }

  private requestAdvance(): void {
    if (!this.container.visible || this.scene.time.now < this.nextAllowedAt) return;
    this.nextAllowedAt = this.scene.time.now + 180;
    if (this.charIndex < this.fullText.length) {
      this.completeText();
      return;
    }

    const advance = this.onAdvance;
    this.onAdvance = undefined;
    advance?.();
  }

  private completeText(): void {
    this.stopTypewriter();
    this.charIndex = this.fullText.length;
    this.bodyText.setText(this.fullText);
  }

  private stopTypewriter(): void {
    this.typewriter?.remove(false);
    this.typewriter = undefined;
  }

  private drawPortrait(speaker: string, portrait?: string): void {
    this.portraitLayer.removeAll(true);
    if (portrait && this.scene.textures.exists(portrait)) {
      const image = this.scene.add.image(0, 0, portrait).setDisplaySize(118, 118);
      this.portraitLayer.add(image);
      return;
    }

    const portraitGraphic = this.scene.add.graphics();
    portraitGraphic.fillStyle(C.wheat, 1).fillCircle(0, 0, 58);
    portraitGraphic.lineStyle(3, C.primary, 1).strokeCircle(0, 0, 58);
    portraitGraphic.fillStyle(C.crust, 1).fillCircle(0, -12, 22);
    portraitGraphic.fillStyle(C.cocoa, 1).fillRoundedRect(-29, 14, 58, 35, 16);
    const initial = this.scene.add
      .text(0, 4, speaker.slice(0, 1).toUpperCase(), { fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: HEX.white })
      .setOrigin(0.5);
    this.portraitLayer.add([portraitGraphic, initial]);
  }
}

