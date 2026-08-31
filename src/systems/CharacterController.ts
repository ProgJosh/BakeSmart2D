import Phaser from 'phaser';
import { C, FONT, HEX } from '../core/theme';

export type CharacterState = 'idle' | 'walk' | 'talk' | 'happy';
export type FacingDirection = 'left' | 'right';

export interface CharacterOptions {
  x: number;
  y: number;
  name: string;
  texture?: string;
  color?: number;
  animations?: Partial<Record<CharacterState, string>>;
}

export class CharacterController {
  readonly container: Phaser.GameObjects.Container;
  private readonly sprite?: Phaser.GameObjects.Sprite;
  private readonly stateLabel?: Phaser.GameObjects.Text;
  private state: CharacterState = 'idle';

  constructor(private readonly scene: Phaser.Scene, private readonly options: CharacterOptions) {
    this.container = scene.add.container(options.x, options.y);
    if (options.texture && scene.textures.exists(options.texture)) {
      this.sprite = scene.add.sprite(0, 0, options.texture);
      this.container.add(this.sprite);
    } else {
      const g = scene.add.graphics();
      const color = options.color ?? C.primary;
      g.fillStyle(C.ink, 0.12).fillEllipse(4, 75, 104, 24);
      g.fillStyle(color, 1).fillRoundedRect(-46, -18, 92, 102, 30);
      g.fillStyle(0xf4cfa8, 1).fillCircle(0, -55, 43);
      g.fillStyle(C.cocoa, 1).fillEllipse(0, -76, 82, 40);
      g.fillStyle(0xffffff, 1).fillRoundedRect(-36, 8, 72, 34, 12);
      const name = scene.add
        .text(0, 106, options.name, { fontFamily: FONT, fontSize: '16px', fontStyle: 'bold', color: HEX.ink })
        .setOrigin(0.5);
      this.stateLabel = scene.add
        .text(0, 43, 'IDLE', { fontFamily: FONT, fontSize: '11px', fontStyle: 'bold', color: HEX.primaryDark })
        .setOrigin(0.5);
      this.container.add([g, name, this.stateLabel]);
    }
    this.setState('idle');
  }

  setState(state: CharacterState): void {
    this.state = state;
    this.stateLabel?.setText(state.toUpperCase());
    const animation = this.options.animations?.[state];
    if (this.sprite && animation && this.scene.anims.exists(animation)) this.sprite.play(animation, true);
  }

  getState(): CharacterState {
    return this.state;
  }

  setFacing(direction: FacingDirection): void {
    this.sprite?.setFlipX(direction === 'left');
  }

  moveTo(x: number, y: number, duration = 650): Promise<void> {
    this.setFacing(x < this.container.x ? 'left' : 'right');
    this.setState('walk');
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.container,
        x,
        y,
        duration,
        ease: 'Sine.inOut',
        onComplete: () => {
          this.setState('idle');
          resolve();
        }
      });
    });
  }

  syncDialogue(active: boolean): void {
    this.setState(active ? 'talk' : 'idle');
  }

  celebrate(): Promise<void> {
    this.setState('happy');
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.container,
        scaleX: 1.08,
        scaleY: 1.08,
        y: this.container.y - 10,
        duration: 180,
        yoyo: true,
        repeat: 1,
        ease: 'Back.out',
        onComplete: () => {
          this.setState('idle');
          resolve();
        }
      });
    });
  }

  destroy(): void {
    this.container.destroy(true);
  }
}

