import Phaser from 'phaser';

export type AudioCue =
  | 'backgroundMusic'
  | 'buttonClick'
  | 'pageTurn'
  | 'ingredientDrop'
  | 'mixing'
  | 'oven'
  | 'success'
  | 'incorrect'
  | 'productReveal';

const AUDIO_KEYS: Record<AudioCue, string> = {
  backgroundMusic: 'audio-bgm',
  buttonClick: 'audio-button',
  pageTurn: 'audio-page-turn',
  ingredientDrop: 'audio-ingredient-drop',
  mixing: 'audio-mixing',
  oven: 'audio-oven',
  success: 'audio-success',
  incorrect: 'audio-incorrect',
  productReveal: 'audio-product-reveal'
};

let muted = false;

export class AudioManager {
  constructor(private readonly scene: Phaser.Scene) {
    scene.sound.mute = muted;
  }

  play(cue: AudioCue, config: Phaser.Types.Sound.SoundConfig = {}): boolean {
    this.scene.events.emit('bakesmart:audio-hook', cue);
    const key = AUDIO_KEYS[cue];
    if (muted || !this.scene.cache.audio.exists(key)) return false;
    this.scene.sound.play(key, config);
    return true;
  }

  stop(cue: AudioCue): void {
    this.scene.sound.stopByKey(AUDIO_KEYS[cue]);
  }

  setMuted(value: boolean): void {
    muted = value;
    this.scene.sound.mute = muted;
  }

  toggleMuted(): boolean {
    this.setMuted(!muted);
    return muted;
  }

  isMuted(): boolean {
    return muted;
  }
}

