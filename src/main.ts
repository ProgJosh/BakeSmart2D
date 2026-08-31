import Phaser from 'phaser';
import { GAME_W, GAME_H } from './core/theme';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { LearnHubScene } from './scenes/LearnHubScene';
import { LessonScene } from './scenes/LessonScene';
import { DifficultyScene } from './scenes/DifficultyScene';
import { ChallengeScene } from './scenes/ChallengeScene';
import { DecorateScene } from './scenes/DecorateScene';
import { StoragePackScene } from './scenes/StoragePackScene';
import { ResultScene } from './scenes/ResultScene';
import { installPlatformRuntime } from './core/PlatformRuntime';
import { BakeryIntroScene } from './scenes/BakeryIntroScene';
import { BakeStationIntroScene } from './scenes/BakeStationIntroScene';
import { LO1RevealScene } from './scenes/LO1RevealScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#2b1a0d',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_W,
    height: GAME_H
  },
  input: {
    activePointers: 2
  },
  render: {
    antialias: true,
    roundPixels: false
  },
  scene: [
    BootScene,
    MenuScene,
    BakeryIntroScene,
    LearnHubScene,
    LessonScene,
    DifficultyScene,
    BakeStationIntroScene,
    ChallengeScene,
    LO1RevealScene,
    DecorateScene,
    StoragePackScene,
    ResultScene
  ]
};

const game = new Phaser.Game(config);
installPlatformRuntime(game);
