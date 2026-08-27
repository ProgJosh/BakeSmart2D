import type { LOKey } from '../core/GameState';

export interface LessonPage {
  heading: string;
  body: string[];
  points: string[];
}

export interface Lesson {
  id: string;
  lo: LOKey;
  week: number;
  topic: string;
  pages: LessonPage[];
}

export interface OutcomeMeta {
  id: LOKey;
  title: string;
  tagline: string;
  color: number;
  lessons: Lesson[];
}

const week1: Lesson = {
  id: 'LO1-W1',
  lo: 'LO1',
  week: 1,
  topic: 'Select, Measure and Weigh Ingredients',
  pages: [
    {
      heading: 'Week 1 Overview',
      body: [
        'This week covers selecting, measuring, and weighing ingredients for bakery products.'
      ],
      points: [
        '1.1.1 Essential Bread Ingredients and Accurate Measurements',
        '1.1.2 Tools and Techniques for Measuring Ingredients'
      ]
    },
    {
      heading: '1.1.1 Essential Bread Ingredients and Accurate Measurements',
      body: [
        'Bread making relies on a small set of essential ingredients, each with its own role in the finished product.',
        'Accurate measurement of every ingredient is emphasized because incorrect amounts affect the quality of the baked bread.'
      ],
      points: ['Identify the essential ingredients for bread', 'Apply accurate measurement practices']
    },
    {
      heading: '1.1.2 Tools and Techniques for Measuring Ingredients',
      body: [
        'Specific tools such as measuring cups, measuring spoons, and a weighing scale are used to measure baking ingredients.',
        'Using the correct tool and technique helps produce consistent results in every bake.'
      ],
      points: ['Recognize common measuring tools', 'Use proper measuring techniques']
    }
  ]
};

const week2: Lesson = {
  id: 'LO1-W2',
  lo: 'LO1',
  week: 2,
  topic: 'Bakery Products',
  pages: [
    {
      heading: 'Week 2 Overview',
      body: ['This week examines bakery products and how they are classified, together with the baker percentage concept used in bread formulas.'],
      points: ['1.2.1 Types / Classifications of Bakery Products', '1.2.2 Baker Percentage']
    },
    {
      heading: '1.2.1 Types / Classifications of Bakery Products',
      body: [
        'Bakery products can be grouped into classifications such as breads, pastries, cakes, and cookies.',
        'Recognizing these classifications guides the baker in choosing suitable methods and treatments for each product.'
      ],
      points: ['Identify the main classifications of bakery products', 'Classify common bakery products correctly']
    },
    {
      heading: '1.2.2 Baker Percentage',
      body: [
        'The baker percentage expresses ingredient amounts in relation to the weight of flour, which is always set at 100 percent.',
        'This makes it possible to scale a formula up or down while keeping ingredient proportions consistent.'
      ],
      points: ['Explain how baker percentage works', 'Compute ingredient amounts using baker percentage']
    }
  ]
};

const week3: Lesson = {
  id: 'LO1-W3',
  lo: 'LO1',
  week: 3,
  topic: 'Baking Equipment',
  pages: [
    {
      heading: 'Week 3 Overview',
      body: ['This week introduces the equipment used in bread baking and its proper use.'],
      points: ['1.3.1 Classification of Bread-Baking Equipment', '1.3.2 Proper Use of Oven for Bread Baking']
    },
    {
      heading: '1.3.1 Classification of Bread-Baking Equipment',
      body: [
        'Bread-baking equipment can be classified by purpose: preparation and measuring tools, mixing and shaping tools, and baking equipment such as the oven.',
        'Knowing the classification of each tool helps the baker select the right equipment for every step of the process.'
      ],
      points: ['Classify bread-baking equipment by purpose', 'Select appropriate equipment for each task']
    },
    {
      heading: '1.3.2 Proper Use of Oven for Bread Baking',
      body: [
        'Proper oven use includes preparing and preheating the oven, loading products at the right time, and handling baked goods safely.',
        'Following correct oven practices supports even baking and reliable results.'
      ],
      points: ['Prepare and preheat the oven properly', 'Follow safe and correct oven practices']
    }
  ]
};

const week4: Lesson = {
  id: 'LO1-W4',
  lo: 'LO1',
  week: 4,
  topic: 'Baking Techniques',
  pages: [
    {
      heading: 'Week 4 Overview',
      body: ['This week focuses on the essential techniques applied in bread making.'],
      points: ['1.4.1 Essential Baking Techniques for Bread Making']
    },
    {
      heading: '1.4.1 Essential Baking Techniques for Bread Making',
      body: [
        'Essential bread-making techniques include combining the ingredients properly, kneading the dough, shaping it, and baking it in the oven.',
        'Performing the techniques in the correct sequence is key to producing good-quality bread.'
      ],
      points: ['Describe essential bread-making techniques', 'Apply techniques in the correct order']
    }
  ]
};

const week5: Lesson = {
  id: 'LO1-W5',
  lo: 'LO1',
  week: 5,
  topic: 'Oven Temperature Control',
  pages: [
    {
      heading: 'Week 5 Overview',
      body: ['This week deals with controlling oven temperature during bread baking.'],
      points: ['1.5.1 Oven Temperature Control in Bread Baking']
    },
    {
      heading: '1.5.1 Oven Temperature Control in Bread Baking',
      body: [
        'Oven temperature control affects how bread rises, browns, and finishes inside.',
        'Baking at the temperature required by the recipe and keeping the temperature steady help produce consistent, well-baked bread.'
      ],
      points: ['Set the correct oven temperature', 'Maintain steady temperature while baking']
    }
  ]
};

const week6: Lesson = {
  id: 'LO2-W6',
  lo: 'LO2',
  week: 6,
  topic: 'Decoration and Presentation of Bakery Products',
  pages: [
    {
      heading: 'Week 6 Overview',
      body: ['This week covers decorating finished bakery products and presenting them well.'],
      points: [
        'Techniques for Decorating Breads and Pastries',
        'Product Presentation'
      ]
    },
    {
      heading: 'Techniques for Decorating Breads and Pastries',
      body: [
        'Decoration techniques such as glazes, toppings, and fillings are used to improve the appearance of breads and pastries.',
        'Decorating should suit the type of product and enhance, not hide, its qualities.'
      ],
      points: ['Identify decoration techniques for breads and pastries', 'Apply suitable decorations to a product']
    },
    {
      heading: 'Product Presentation',
      body: [
        'Presentation covers how finished products are arranged and served so they look appealing and professional.',
        'A neatly presented product reflects care and quality in the finished bake.'
      ],
      points: ['Arrange finished products attractively', 'Present products in a clean and organized way']
    }
  ]
};

const week7: Lesson = {
  id: 'LO3-W7',
  lo: 'LO3',
  week: 7,
  topic: 'Storage and Packaging of Bakery Products',
  pages: [
    {
      heading: 'Week 7 Overview',
      body: ['This week covers handling, storage, shelf life, and packaging of baked goods.'],
      points: [
        'Proper Handling, Storage, and Shelf Life of Baked Goods',
        'Packaging Techniques for Quality and Presentation'
      ]
    },
    {
      heading: 'Proper Handling, Storage, and Shelf Life of Baked Goods',
      body: [
        'Proper handling and storage protect the quality of baked goods and determine how long they stay fresh, known as shelf life.',
        'Choosing the right storage condition for each product helps preserve its quality for as long as possible.'
      ],
      points: ['Handle baked goods properly after baking', 'Match products with suitable storage conditions', 'Explain shelf life at a basic level']
    },
    {
      heading: 'Packaging Techniques for Quality and Presentation',
      body: [
        'Packaging protects baked products during storage and transport and contributes to both quality and presentation.',
        'Selecting suitable packaging keeps the product secure and presentable until it reaches the customer.'
      ],
      points: ['Select packaging suited to the product', 'Package products for protection and presentation']
    }
  ]
};

export const OUTCOMES: OutcomeMeta[] = [
  {
    id: 'LO1',
    title: 'Prepare bakery products',
    tagline: 'Ingredients · Equipment · Techniques · Oven control',
    color: 0xd97b29,
    lessons: [week1, week2, week3, week4, week5]
  },
  {
    id: 'LO2',
    title: 'Decorate bakery products',
    tagline: 'Decoration techniques · Presentation',
    color: 0xf2b134,
    lessons: [week6]
  },
  {
    id: 'LO3',
    title: 'Present bakery products',
    tagline: 'Handling · Storage · Shelf life · Packaging',
    color: 0x55935f,
    lessons: [week7]
  }
];

export function findLesson(lessonId: string): Lesson {
  const all = OUTCOMES.flatMap((o) => o.lessons);
  const found = all.find((l) => l.id === lessonId);
  if (!found) throw new Error(`Unknown lesson: ${lessonId}`);
  return found;
}
