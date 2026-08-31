import Phaser from 'phaser';
import { DialogueBox } from '../systems/DialogueSystem';
import { STORY_PROGRESS } from './StoryProgress';
import type { StorySequence, StoryStep } from './types';

export type StoryActionHandler<Action extends string> = (
  action: Action,
  step: StoryStep<Action>
) => void | Promise<void>;

export class StoryController<Action extends string = string> {
  private currentId = '';
  private completing = false;
  private completion?: () => void;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly sequence: StorySequence<Action>,
    private readonly dialogue: DialogueBox,
    private readonly handleAction?: StoryActionHandler<Action>
  ) {}

  play(onComplete: () => void): void {
    const first = this.sequence.start ?? this.sequence.steps[0]?.id;
    if (!first) {
      onComplete();
      return;
    }

    this.completion = onComplete;
    this.currentId = STORY_PROGRESS.begin(this.sequence.id, first);
    void this.presentCurrent();
  }

  private async presentCurrent(): Promise<void> {
    const step = this.sequence.steps.find((candidate) => candidate.id === this.currentId);
    if (!step) {
      this.finish();
      return;
    }

    STORY_PROGRESS.update(this.sequence.id, step.id);
    if (step.action && this.handleAction) await this.handleAction(step.action, step);
    if (!this.scene.sys.isActive()) return;

    this.dialogue.show(
      {
        speaker: step.speaker,
        text: step.dialogue,
        portrait: step.portrait
      },
      () => this.advance(step)
    );
  }

  private advance(step: StoryStep<Action>): void {
    if (this.completing) return;
    const index = this.sequence.steps.findIndex((candidate) => candidate.id === step.id);
    const nextId = step.next === undefined ? this.sequence.steps[index + 1]?.id : step.next;
    if (!nextId) {
      this.finish();
      return;
    }

    this.currentId = nextId;
    void this.presentCurrent();
  }

  private finish(): void {
    if (this.completing) return;
    this.completing = true;
    this.dialogue.hide();
    STORY_PROGRESS.complete(this.sequence.id);
    this.completion?.();
  }
}

