export interface StoryStep<Action extends string = string> {
  id: string;
  speaker: string;
  dialogue: string;
  portrait?: string;
  action?: Action;
  next?: string | null;
}

export interface StorySequence<Action extends string = string> {
  id: string;
  start?: string;
  steps: readonly StoryStep<Action>[];
}

