import Phaser from 'phaser';
import { C, GAME_H, GAME_W } from '../core/theme';

function delay(scene: Phaser.Scene, duration: number): Promise<void> {
  return new Promise((resolve) => scene.time.delayedCall(duration, resolve));
}

export function cameraFadeIn(scene: Phaser.Scene, duration = 260): Promise<void> {
  scene.cameras.main.fadeIn(duration, 45, 25, 10);
  return delay(scene, duration);
}

export function cameraFadeOut(scene: Phaser.Scene, duration = 220): Promise<void> {
  scene.cameras.main.fadeOut(duration, 45, 25, 10);
  return delay(scene, duration);
}

export function cameraPan(scene: Phaser.Scene, x: number, y: number, duration = 450): Promise<void> {
  return new Promise((resolve) => {
    scene.tweens.add({ targets: scene.cameras.main, scrollX: x, scrollY: y, duration, ease: 'Sine.inOut', onComplete: () => resolve() });
  });
}

export function cameraZoom(scene: Phaser.Scene, zoom: number, duration = 320): Promise<void> {
  return new Promise((resolve) => {
    scene.tweens.add({ targets: scene.cameras.main, zoom, duration, ease: 'Sine.inOut', onComplete: () => resolve() });
  });
}

export function slideIn(
  scene: Phaser.Scene,
  target: Phaser.GameObjects.Container,
  fromX: number,
  duration = 320
): Promise<void> {
  const destination = target.x;
  target.x = fromX;
  return new Promise((resolve) => {
    scene.tweens.add({ targets: target, x: destination, duration, ease: 'Back.out', onComplete: () => resolve() });
  });
}

export function uiFade(
  scene: Phaser.Scene,
  target: Phaser.GameObjects.Container,
  alpha: number,
  duration = 220
): Promise<void> {
  return new Promise((resolve) => {
    scene.tweens.add({ targets: target, alpha, duration, ease: 'Sine.out', onComplete: () => resolve() });
  });
}

export async function bookCloseTransition(scene: Phaser.Scene, duration = 360): Promise<void> {
  const overlay = scene.add.container(0, 0).setDepth(5000);
  const left = scene.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W / 2, GAME_H, C.pageWarm).setOrigin(1, 0.5);
  const right = scene.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W / 2, GAME_H, C.pageWarm).setOrigin(0, 0.5);
  left.scaleX = 0;
  right.scaleX = 0;
  overlay.add([left, right]);
  await Promise.all([
    new Promise<void>((resolve) => scene.tweens.add({ targets: left, scaleX: 1, duration, ease: 'Sine.inOut', onComplete: () => resolve() })),
    new Promise<void>((resolve) => scene.tweens.add({ targets: right, scaleX: 1, duration, ease: 'Sine.inOut', onComplete: () => resolve() }))
  ]);
  overlay.destroy(true);
}
