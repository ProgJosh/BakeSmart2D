import Phaser from 'phaser';
import { AudioManager, type AudioCue } from './AudioManager';

export type BakingSequenceStep =
  | { type: 'wait'; duration: number }
  | { type: 'move'; target: string; x?: number; y?: number; angle?: number; scale?: number; alpha?: number; duration?: number; ease?: string }
  | { type: 'animation'; target: string; key: string; fallbackDuration?: number }
  | { type: 'audio'; cue: AudioCue }
  | { type: 'action'; run: () => void | Promise<void> };

export class BakingSequencer {
  private readonly targets = new Map<string, Phaser.GameObjects.GameObject>();
  private cancelled = false;

  constructor(private readonly scene: Phaser.Scene) {
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cancelled = true;
    });
  }

  register(name: string, target: Phaser.GameObjects.GameObject): this {
    this.targets.set(name, target);
    return this;
  }

  async run(steps: readonly BakingSequenceStep[]): Promise<boolean> {
    this.cancelled = false;
    for (const step of steps) {
      if (this.cancelled || !this.scene.sys.isActive()) return false;
      await this.runStep(step);
    }
    return !this.cancelled;
  }

  cancel(): void {
    this.cancelled = true;
  }

  private async runStep(step: BakingSequenceStep): Promise<void> {
    if (step.type === 'wait') {
      await new Promise<void>((resolve) => this.scene.time.delayedCall(step.duration, resolve));
      return;
    }
    if (step.type === 'audio') {
      new AudioManager(this.scene).play(step.cue);
      return;
    }
    if (step.type === 'action') {
      await step.run();
      return;
    }

    const target = this.targets.get(step.target);
    if (!target) return;
    if (step.type === 'animation') {
      if (target instanceof Phaser.GameObjects.Sprite && this.scene.anims.exists(step.key)) {
        target.play(step.key);
        await new Promise<void>((resolve) => target.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => resolve()));
      } else if (step.fallbackDuration) {
        const fallbackDuration = step.fallbackDuration;
        await new Promise<void>((resolve) => this.scene.time.delayedCall(fallbackDuration, resolve));
      }
      return;
    }

    const tweenValues: Record<string, number | undefined> = {
      x: step.x,
      y: step.y,
      angle: step.angle,
      scale: step.scale,
      alpha: step.alpha
    };
    Object.keys(tweenValues).forEach((key) => tweenValues[key] === undefined && delete tweenValues[key]);
    await new Promise<void>((resolve) => {
      this.scene.tweens.add({
        targets: target,
        ...tweenValues,
        duration: step.duration ?? 420,
        ease: step.ease ?? 'Sine.inOut',
        onComplete: () => resolve()
      });
    });
  }
}
