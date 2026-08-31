import Phaser from 'phaser';

export interface SpriteAnimationDefinition {
  key: string;
  texture: string;
  start: number;
  end: number;
  frameRate?: number;
  repeat?: number;
}

export interface AnimationRegistrationResult {
  registered: string[];
  skipped: string[];
}

export function registerOptionalAnimations(
  scene: Phaser.Scene,
  definitions: readonly SpriteAnimationDefinition[]
): AnimationRegistrationResult {
  const result: AnimationRegistrationResult = { registered: [], skipped: [] };
  definitions.forEach((definition) => {
    if (scene.anims.exists(definition.key)) return;
    if (!scene.textures.exists(definition.texture)) {
      result.skipped.push(definition.key);
      return;
    }

    scene.anims.create({
      key: definition.key,
      frames: scene.anims.generateFrameNumbers(definition.texture, { start: definition.start, end: definition.end }),
      frameRate: definition.frameRate ?? 8,
      repeat: definition.repeat ?? -1
    });
    result.registered.push(definition.key);
  });
  return result;
}

