import Phaser from 'phaser';
import { FONT, HEX } from '../core/theme';
import { AudioManager } from './AudioManager';
import { successSparkles } from './ParticleEffects';

export type FeedbackKind = 'correct' | 'incorrect' | 'stage-success' | 'stage-failed';

export function animateFeedbackPanel(
  scene: Phaser.Scene,
  panel: Phaser.GameObjects.Container,
  kind: FeedbackKind,
  x: number,
  y: number
): void {
  const success = kind === 'correct' || kind === 'stage-success';
  panel.setAlpha(0).setY(panel.y + 18);
  scene.tweens.add({ targets: panel, alpha: 1, y: panel.y - 18, duration: 240, ease: 'Back.out' });
  if (success) {
    successSparkles(scene, x, y, 10);
    new AudioManager(scene).play('success', { volume: 0.75 });
  } else {
    new AudioManager(scene).play('incorrect', { volume: 0.65 });
    scene.tweens.add({ targets: panel, x: { from: -7, to: 7 }, duration: 45, yoyo: true, repeat: 3 });
  }
}

export function scoreGain(scene: Phaser.Scene, x: number, y: number, amount: number): void {
  const text = scene.add
    .text(x, y, `+${amount}`, { fontFamily: FONT, fontSize: '25px', fontStyle: 'bold', color: amount > 0 ? HEX.green : HEX.red })
    .setOrigin(0.5)
    .setDepth(3200);
  scene.tweens.add({
    targets: text,
    y: y - 38,
    alpha: 0,
    scale: amount > 0 ? 1.12 : 0.94,
    duration: 760,
    ease: 'Cubic.out',
    onComplete: () => text.destroy()
  });
}

