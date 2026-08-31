import Phaser from 'phaser';
import { C } from '../core/theme';
import { AudioManager } from './AudioManager';
import { steam, successSparkles } from './ParticleEffects';

export async function revealProduct(
  scene: Phaser.Scene,
  product: Phaser.GameObjects.Container,
  options: { steam?: boolean } = {}
): Promise<void> {
  const glow = scene.add.circle(product.x, product.y, 82, C.gold, 0.2).setDepth(product.depth - 1).setScale(0.4);
  product.setAlpha(0).setScale(0.68);
  new AudioManager(scene).play('productReveal', { volume: 0.8 });
  successSparkles(scene, product.x, product.y - 15, 14);
  if (options.steam) steam(scene, product.x, product.y - 48, 6);

  await new Promise<void>((resolve) => {
    scene.tweens.add({
      targets: product,
      alpha: 1,
      scale: 1,
      duration: 520,
      ease: 'Back.out',
      onComplete: () => resolve()
    });
    scene.tweens.add({ targets: glow, scale: 1.35, alpha: 0, duration: 720, ease: 'Sine.out', onComplete: () => glow.destroy() });
  });
  scene.tweens.add({ targets: product, scaleX: 1.04, scaleY: 0.97, duration: 180, yoyo: true, ease: 'Sine.inOut' });
}

