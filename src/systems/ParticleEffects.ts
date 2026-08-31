import Phaser from 'phaser';
import { C } from '../core/theme';

type EffectTexture = 'bakesmart-particle-star' | 'bakesmart-particle-dust' | 'bakesmart-particle-steam';

function ensureTexture(scene: Phaser.Scene, key: EffectTexture, color: number): void {
  if (scene.textures.exists(key)) return;
  const graphics = scene.add.graphics().setVisible(false);
  graphics.fillStyle(color, 1).fillCircle(6, 6, 5);
  graphics.generateTexture(key, 12, 12);
  graphics.destroy();
}

function removeLater(scene: Phaser.Scene, emitter: Phaser.GameObjects.Particles.ParticleEmitter, after: number): void {
  scene.time.delayedCall(after, () => {
    if (emitter.active) emitter.destroy();
  });
}

export function successSparkles(scene: Phaser.Scene, x: number, y: number, count = 12): void {
  ensureTexture(scene, 'bakesmart-particle-star', C.gold);
  const emitter = scene.add.particles(x, y, 'bakesmart-particle-star', {
    emitting: false,
    lifespan: 650,
    speed: { min: 45, max: 105 },
    angle: { min: 205, max: 335 },
    scale: { start: 0.85, end: 0 },
    alpha: { start: 1, end: 0 },
    gravityY: 110,
    maxParticles: count
  });
  emitter.explode(count);
  removeLater(scene, emitter, 760);
}

export function flourDust(scene: Phaser.Scene, x: number, y: number, count = 8): void {
  ensureTexture(scene, 'bakesmart-particle-dust', 0xfff8e6);
  const emitter = scene.add.particles(x, y, 'bakesmart-particle-dust', {
    emitting: false,
    lifespan: 520,
    speed: { min: 18, max: 52 },
    angle: { min: 190, max: 350 },
    scale: { start: 0.7, end: 0.15 },
    alpha: { start: 0.8, end: 0 },
    gravityY: 28,
    maxParticles: count
  });
  emitter.explode(count);
  removeLater(scene, emitter, 620);
}

export function steam(scene: Phaser.Scene, x: number, y: number, count = 6): void {
  ensureTexture(scene, 'bakesmart-particle-steam', 0xffffff);
  const emitter = scene.add.particles(x, y, 'bakesmart-particle-steam', {
    emitting: false,
    lifespan: 900,
    speedY: { min: -52, max: -30 },
    speedX: { min: -12, max: 12 },
    scale: { start: 0.8, end: 1.35 },
    alpha: { start: 0.45, end: 0 },
    maxParticles: count
  });
  emitter.explode(count);
  removeLater(scene, emitter, 1000);
}
