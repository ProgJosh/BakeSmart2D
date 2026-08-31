import Phaser from 'phaser';
import { registerOptionalAnimations } from '../systems/AnimationRegistry';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    // Final sprite sheets are optional. Registration safely skips these keys
    // until original character artwork is supplied and loaded.
    registerOptionalAnimations(this, [
      { key: 'mentor_idle', texture: 'mentor', start: 0, end: 3, frameRate: 6 },
      { key: 'mentor_walk', texture: 'mentor', start: 4, end: 9, frameRate: 9 },
      { key: 'mentor_talk', texture: 'mentor', start: 10, end: 13, frameRate: 7 },
      { key: 'mentor_happy', texture: 'mentor', start: 14, end: 17, frameRate: 8, repeat: 0 }
    ]);
    this.scene.start('Menu');
  }
}
