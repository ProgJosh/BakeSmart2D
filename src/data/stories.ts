import type { StorySequence } from '../story/types';

export type MentorStoryAction = 'mentor-enter' | 'mentor-talk' | 'mentor-idle' | 'mentor-happy';

export const BAKERY_INTRO_STORY: StorySequence<MentorStoryAction> = {
  id: 'bakery-introduction',
  start: 'welcome',
  steps: [
    {
      id: 'welcome',
      speaker: 'Mentor Mara',
      dialogue: 'Welcome to the BakeSmart2D bakery. This is where lesson knowledge becomes careful, practical baking work.',
      action: 'mentor-enter'
    },
    {
      id: 'learning-path',
      speaker: 'Mentor Mara',
      dialogue: 'Your Learning Hub follows Weeks 1–7 across preparing, decorating, and presenting bakery products.',
      action: 'mentor-talk'
    },
    {
      id: 'lo1-objective',
      speaker: 'Mentor Mara',
      dialogue: 'Begin with LO1: prepare bakery products by making sound choices about ingredients, equipment, techniques, and oven control.',
      action: 'mentor-happy',
      next: null
    }
  ]
};

export const LO1_STATION_STORY: StorySequence<MentorStoryAction> = {
  id: 'lo1-workstation-introduction',
  steps: [
    {
      id: 'book-to-bench',
      speaker: 'Mentor Mara',
      dialogue: 'The lesson book is closed and your LO1 workstation is ready. Apply what you learned one decision at a time.',
      action: 'mentor-talk'
    },
    {
      id: 'first-task',
      speaker: 'Mentor Mara',
      dialogue: 'Start by identifying the essential ingredients. Your selected difficulty controls guidance, tolerance, and scoring.',
      action: 'mentor-happy',
      next: null
    }
  ]
};

export const LO1_REVEAL_STORY: StorySequence<MentorStoryAction> = {
  id: 'lo1-product-reveal',
  steps: [
    {
      id: 'product-ready',
      speaker: 'Mentor Mara',
      dialogue: 'Your bakery product is ready. The result card will connect your choices to the feedback from each LO1 stage.',
      action: 'mentor-happy',
      next: null
    }
  ]
};

