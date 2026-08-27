export type DifficultyId = 'easy' | 'medium' | 'hard';


export interface DifficultyCfg {
  id: DifficultyId;
  label: string;
  blurb: string;
  hints: number;
  penalty: number;
}

export const DIFFICULTY_LIST: DifficultyCfg[] = [
  { id: 'easy', label: 'EASY', blurb: 'More guidance · generous tolerance · forgiving scoring', hints: 3, penalty: 10 },
  { id: 'medium', label: 'MEDIUM', blurb: 'Moderate guidance · standard tolerance · balanced scoring', hints: 1, penalty: 25 },
  { id: 'hard', label: 'HARD', blurb: 'Minimal guidance · strict tolerance · strict scoring', hints: 0, penalty: 50 }
];

export const DIFFICULTIES = Object.fromEntries(DIFFICULTY_LIST.map((d) => [d.id, d])) as Record<
  DifficultyId,
  DifficultyCfg
>;

type Tol = Record<DifficultyId, number>;

interface BaseStage {
  code: string;
  label: string;
  prompt: string;
  hint: string;
  fb: string;
}

export interface SelectStage extends BaseStage {
  type: 'select';
  options: { text: string; correct: boolean }[];
}

export interface McqStage extends BaseStage {
  type: 'mcq';
  options: { text: string; correct: boolean }[];
}

export interface MeasureStage extends BaseStage {
  type: 'measure';
  unit: string;
  target: number;
  tol: Tol;
}

export interface DialStage extends BaseStage {
  type: 'dial';
  unit: string;
  target: number;
  min: number;
  max: number;
  tol: Tol;
}

export interface OrderStage extends BaseStage {
  type: 'order';
  items: string[];
}

export type AnyStage = SelectStage | McqStage | MeasureStage | DialStage | OrderStage;

export const LO1_STAGES: AnyStage[] = [
  {
    type: 'select',
    code: 'W1 · 1.1.1',
    label: 'Ingredient Selection',
    prompt: 'Select ALL essential bread ingredients from the shelf below.',
    hint: 'Recall Week 1: only the four essentials belong on your table.',
    fb: 'Flour, water, yeast, and salt are essential bread ingredients; unrelated items must not be included.',
    options: [
      { text: 'Bread Flour', correct: true },
      { text: 'Water', correct: true },
      { text: 'Yeast', correct: true },
      { text: 'Salt', correct: true },
      { text: 'Soy Sauce', correct: false },
      { text: 'Potato Chips', correct: false },
      { text: 'Calamansi Juice', correct: false },
      { text: 'Chocolate Syrup', correct: false }
    ]
  },
  {
    type: 'measure',
    code: 'W1 · 1.1.1/1.1.2',
    label: 'Weighing Ingredients',
    prompt: 'Weigh the bread flour for the recipe using the scale.',
    hint: 'Use the +/- buttons to reach the exact amount on the scale.',
    fb: 'Accurate measurement matters: the recipe calls for exactly 500 g of bread flour.',
    unit: 'g',
    target: 500,
    tol: { easy: 25, medium: 12, hard: 5 }
  },
  {
    type: 'mcq',
    code: 'W2 · 1.2.1',
    label: 'Product Classification',
    prompt: 'Which product belongs to the BREAD classification of bakery products?',
    hint: 'Think of Week 2: which of these is a yeast-leavened bread?',
    fb: 'Pandesal is a bread; cupcakes, cream puffs, and brownies belong to other classifications.',
    options: [
      { text: 'Pandesal', correct: true },
      { text: 'Cupcake', correct: false },
      { text: 'Cream Puff', correct: false },
      { text: 'Brownie', correct: false }
    ]
  },
  {
    type: 'mcq',
    code: 'W2 · 1.2.2',
    label: "Baker's Percentage",
    prompt: 'Your formula uses 500 g flour (100%) and 60% hydration. How much water is needed?',
    hint: 'In baker percentage, multiply the flour weight by the given percent.',
    fb: '60% of 500 g flour = 300 g water — baker percentage scales every ingredient from the flour weight.',
    options: [
      { text: '250 g', correct: false },
      { text: '280 g', correct: false },
      { text: '300 g', correct: true },
      { text: '350 g', correct: false }
    ]
  },
  {
    type: 'select',
    code: 'W3 · 1.3.1',
    label: 'Equipment Selection',
    prompt: 'Select the equipment you will actually need for this bread-baking session.',
    hint: 'Choose tools for preparing, measuring, mixing, and baking bread.',
    fb: 'Scale, measuring spoons, mixing bowl, and oven are bread-baking equipment; unrelated kitchen tools are not needed.',
    options: [
      { text: 'Weighing Scale', correct: true },
      { text: 'Measuring Spoons', correct: true },
      { text: 'Mixing Bowl', correct: true },
      { text: 'Oven', correct: true },
      { text: 'Frying Pan', correct: false },
      { text: 'Grill Tongs', correct: false },
      { text: 'Ice Cream Scoop', correct: false }
    ]
  },
  {
    type: 'order',
    code: 'W4 · 1.4.1',
    label: 'Baking Technique Sequence',
    prompt: 'Arrange the bread-making steps in the correct order.',
    hint: 'Follow the standard flow taught in Week 4, from raw mix to oven.',
    fb: 'Correct sequence: weigh and mix, knead, shape, then bake in a preheated oven.',
    items: ['Weigh and mix the ingredients', 'Knead the dough', 'Shape the dough', 'Bake in a preheated oven']
  },
  {
    type: 'dial',
    code: 'W5 · 1.5.1',
    label: 'Oven Temperature',
    prompt: 'Set the oven temperature specified by the recipe.',
    hint: 'Recipes state an exact baking temperature — set the dial to it.',
    fb: 'The recipe requires 180 °C; precise temperature control ensures even rising and browning.',
    unit: '°C',
    target: 180,
    min: 120,
    max: 260,
    tol: { easy: 25, medium: 15, hard: 8 }
  },
  {
    type: 'mcq',
    code: 'W3 · 1.3.2',
    label: 'Proper Oven Use',
    prompt: 'When should you load the dough into the oven?',
    hint: 'Remember Week 3: prepare the oven before the product enters it.',
    fb: 'Load dough only after the oven is fully preheated to the target temperature.',
    options: [
      { text: 'After the oven is fully preheated to the target temperature', correct: true },
      { text: 'As soon as the oven is switched on', correct: false },
      { text: 'Anytime — oven timing does not matter', correct: false }
    ]
  }
];

export function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  let same = true;
  for (let guard = 0; guard < 5 && same; guard++) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    same = arr.length === input.length && arr.every((v, i) => v === input[i]);
  }
  return arr;
}

export interface ToppingDef {
  name: string;
  color: number;
}

export const LO2_TOPPINGS: ToppingDef[] = [
  { name: 'Glaze Drizzle', color: 0x8a5a2b },
  { name: 'Sugar Top', color: 0xf7f3e8 },
  { name: 'Seed Sprinkle', color: 0x6b4a26 },
  { name: 'Cheese Strips', color: 0xf2c14e }
];

export const LO2_MIN_COUNT = 3;
export const LO2_MIN_KINDS = 2;

export const LO2_REQ_BY_DIFFICULTY: Record<DifficultyId, { count: number; kinds: number }> = {
  easy: { count: 2, kinds: 1 },
  medium: { count: 3, kinds: 2 },
  hard: { count: 4, kinds: 3 }
};

export const LO2_PRESENTATION = {
  prompt: 'Presentation check: how should the finished products be arranged for serving?',
  fb: 'Neat arrangement on a clean plate gives a professional, appealing presentation (Week 6).',
  options: [
    { text: 'Arrange neatly on a clean plate ready to serve', correct: true },
    { text: 'Stack the products randomly on the tray', correct: false },
    { text: 'Serve directly on the bare table surface', correct: false }
  ]
};

export const LO3_HANDLING = {
  prompt: 'Fresh pandesal has just come out of the oven. What should you do first?',
  fb: 'Cool freshly baked goods on a rack first; sealing or leaving them out harms quality and shelf life.',
  options: [
    { text: 'Cool them on a wire rack', correct: true },
    { text: 'Seal them in a bag immediately while hot', correct: false },
    { text: 'Leave them uncovered on the counter overnight', correct: false }
  ]
};

export interface StoragePair {
  item: string;
  dest: string;
}

export const LO3_DESTS = ['Room-temperature Bread Box', 'Refrigerator', 'Freezer'];

export const LO3_PAIRS: StoragePair[] = [
  { item: 'Loaf to be eaten tomorrow', dest: 'Room-temperature Bread Box' },
  { item: 'Pastry with perishable filling', dest: 'Refrigerator' },
  { item: 'Loaf kept for next month', dest: 'Freezer' }
];

export const LO3_PACKAGING = {
  prompt: 'Final step: choose the packaging that protects quality and looks presentable.',
  fb: 'A sealed paper bag with a label protects the product and presents it professionally (Week 7).',
  options: [
    { text: 'Sealed paper bag with a neat product label', correct: true },
    { text: 'Open plastic left untied', correct: false },
    { text: 'Wrapped in old newspaper', correct: false }
  ]
};
