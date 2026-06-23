export const DANCE_AFTER_CORRECT = 3;

export const EFFECT_PATHS = {
  correct: "./audio/effects/correct.mp3",
  wrong: "./audio/effects/wrong.mp3",
  food: "./audio/effects/food.mp3",
  dance: "./audio/effects/dance.mp3",
  end: "./audio/effects/end.mp3",
  click: "./audio/effects/click.mp3"
};

export const CATEGORY_INFO = {
  mat: {
    label: "mat",
    prompt: "Ge mig maten!",
    voiceKey: "give_category_food"
  },
  djur: {
    label: "djur",
    prompt: "Ge mig djuret!",
    voiceKey: "give_category_animal"
  },
  leksak: {
    label: "leksak",
    prompt: "Ge mig leksaken!",
    voiceKey: "give_category_toy"
  },
  fordon: {
    label: "fordon",
    prompt: "Ge mig fordonet!",
    voiceKey: "give_category_vehicle"
  },
  klader: {
    label: "kläder",
    prompt: "Ge mig klädesplagget!",
    voiceKey: "give_category_clothes"
  }
};

export const COLOR_INFO = {
  yellow: {
    label: "gult",
    voiceKey: "give_color_yellow"
  },
  red: {
    label: "rött",
    voiceKey: "give_color_red"
  },
  orange: {
    label: "orange",
    voiceKey: "give_color_orange"
  },
  green: {
    label: "grönt",
    voiceKey: "give_color_green"
  },
  blue: {
    label: "blått",
    voiceKey: "give_color_blue"
  },
  brown: {
    label: "brunt",
    voiceKey: "give_color_brown"
  },
  white: {
    label: "vitt",
    voiceKey: "give_color_white"
  },
  pink: {
    label: "rosa",
    voiceKey: "give_color_pink"
  },
  black: {
    label: "svart",
    voiceKey: "give_color_black"
  }
};

export const items = [
  {
    id: "banana",
    name: "banan",
    emoji: "🍌",
    category: "mat",
    color: "yellow",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },
  {
    id: "apple",
    name: "äpple",
    emoji: "🍎",
    category: "mat",
    color: "red",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },
  {
    id: "carrot",
    name: "morot",
    emoji: "🥕",
    category: "mat",
    color: "orange",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },
  {
    id: "cucumber",
    name: "gurka",
    emoji: "🥒",
    category: "mat",
    color: "green",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },
  {
    id: "lemon",
    name: "citron",
    emoji: "🍋",
    category: "mat",
    color: "yellow",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },
  {
    id: "strawberry",
    name: "jordgubbe",
    emoji: "🍓",
    category: "mat",
    color: "red",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },
  {
    id: "cheese",
    name: "ost",
    emoji: "🧀",
    category: "mat",
    color: "yellow",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },
  {
    id: "cookie",
    name: "kaka",
    emoji: "🍪",
    category: "mat",
    color: "brown",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },

  {
    id: "dog",
    name: "hund",
    emoji: "🐶",
    category: "djur",
    color: "brown",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: false
  },
  {
    id: "cat",
    name: "katt",
    emoji: "🐱",
    category: "djur",
    color: "orange",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },
  {
    id: "frog",
    name: "groda",
    emoji: "🐸",
    category: "djur",
    color: "green",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },
  {
    id: "cow",
    name: "ko",
    emoji: "🐮",
    category: "djur",
    color: "white",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: false
  },
  {
    id: "pig",
    name: "gris",
    emoji: "🐷",
    category: "djur",
    color: "pink",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },

  {
    id: "teddy",
    name: "nalle",
    emoji: "🧸",
    category: "leksak",
    color: "brown",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },
  {
    id: "ball",
    name: "boll",
    emoji: "⚽",
    category: "leksak",
    color: "white",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: false
  },
  {
    id: "blocks",
    name: "klossar",
    emoji: "🧱",
    category: "leksak",
    color: "red",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: false
  },
  {
    id: "kite",
    name: "drake",
    emoji: "🪁",
    category: "leksak",
    color: "blue",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: false
  },

  {
    id: "car",
    name: "bil",
    emoji: "🚙",
    category: "fordon",
    color: "blue",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: false
  },
  {
    id: "bus",
    name: "buss",
    emoji: "🚌",
    category: "fordon",
    color: "yellow",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },
  {
    id: "train",
    name: "tåg",
    emoji: "🚂",
    category: "fordon",
    color: "black",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: false
  },
  {
    id: "tractor",
    name: "traktor",
    emoji: "🚜",
    category: "fordon",
    color: "green",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },

  {
    id: "shoe",
    name: "sko",
    emoji: "👟",
    category: "klader",
    color: "blue",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: false
  },
  {
    id: "hat",
    name: "mössa",
    emoji: "🧢",
    category: "klader",
    color: "blue",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  },
  {
    id: "sock",
    name: "strumpa",
    emoji: "🧦",
    category: "klader",
    color: "white",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: false
  },
  {
    id: "scarf",
    name: "halsduk",
    emoji: "🧣",
    category: "klader",
    color: "red",
    useInNameMode: true,
    useInCategoryMode: true,
    useInColorMode: true
  }
];
