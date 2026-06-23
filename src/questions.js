import { CATEGORY_INFO, COLOR_INFO, items } from "./data.js";
import { getEnabledCategories } from "./settings.js";

export function createQuestion(settings, lastAnswerId) {
  const questionType = getQuestionType(settings);

  if (questionType === "color") {
    const answer = getRandomAnswer("color", settings, lastAnswerId);

    return {
      question: createColorQuestion(answer, settings),
      lastAnswerId: answer.id
    };
  }

  if (questionType === "category") {
    return createCategoryQuestion(settings);
  }

  const answer = getRandomAnswer("name", settings, lastAnswerId);

  return {
    question: createNameQuestion(answer, settings),
    lastAnswerId: answer.id
  };
}

export function getAvailableQuestionTypes(settings) {
  const availableTypes = [];

  if (getModeItems("name", settings).length >= 2) {
    availableTypes.push("name");
  }

  const colorItems = getModeItems("color", settings);
  const distinctColors = new Set(colorItems.map((item) => item.color));

  if (colorItems.length >= 2 && distinctColors.size >= 2) {
    availableTypes.push("color");
  }

  if (getAvailableCategoryKeys(settings).length >= 2) {
    availableTypes.push("category");
  }

  return availableTypes;
}

export function getRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function getQuestionType(settings) {
  if (settings.selectedMode !== "mixed") {
    return settings.selectedMode;
  }

  return getRandomItem(getAvailableQuestionTypes(settings));
}

function createNameQuestion(answer, settings) {
  const nameItems = getModeItems("name", settings);
  const wrongOptions = nameItems.filter((item) => item.id !== answer.id);
  const options = createOptions(answer, wrongOptions, settings.optionCount);

  return {
    type: "name",
    answer,
    prompt: `Ge mig ${answer.name}!`,
    voiceKey: `give_${answer.id}`,
    options,
    isCorrect: (item) => item.id === answer.id
  };
}

function createColorQuestion(answer, settings) {
  const colorItems = getModeItems("color", settings);
  const wrongOptions = colorItems.filter((item) => item.color !== answer.color);
  const colorInfo = COLOR_INFO[answer.color];

  const options = createOptions(answer, wrongOptions, settings.optionCount);

  return {
    type: "color",
    answer,
    targetColor: answer.color,
    prompt: `Ge mig något ${colorInfo.label}!`,
    voiceKey: colorInfo.voiceKey,
    options,
    isCorrect: (item) => item.color === answer.color
  };
}

function createCategoryQuestion(settings) {
  const categoryItems = getModeItems("category", settings);
  const availableCategoryKeys = getAvailableCategoryKeys(settings);
  const targetCategory = getRandomItem(availableCategoryKeys);
  const categoryInfo = CATEGORY_INFO[targetCategory];

  const correctOptions = categoryItems.filter((item) => item.category === targetCategory);
  const wrongOptions = categoryItems.filter((item) => item.category !== targetCategory);
  const answer = getRandomItem(correctOptions);
  const options = createOptions(answer, wrongOptions, settings.optionCount);

  return {
    question: {
      type: "category",
      answer,
      targetCategory,
      prompt: categoryInfo.prompt,
      voiceKey: categoryInfo.voiceKey,
      options,
      isCorrect: (item) => item.category === targetCategory
    },
    lastAnswerId: answer.id
  };
}

function createOptions(answer, wrongOptions, optionCount) {
  const safeOptionCount = Math.min(optionCount, wrongOptions.length + 1);
  const shuffledWrongOptions = shuffle(wrongOptions);
  const chosenWrongOptions = shuffledWrongOptions.slice(0, safeOptionCount - 1);

  return shuffle([answer, ...chosenWrongOptions]);
}

function getRandomAnswer(mode, settings, lastAnswerId) {
  const modeItems = getModeItems(mode, settings);
  const possibleAnswers = modeItems.filter((item) => item.id !== lastAnswerId);

  if (possibleAnswers.length === 0) {
    return getRandomItem(modeItems);
  }

  return getRandomItem(possibleAnswers);
}

function getModeItems(mode, settings) {
  const activeItems = getActiveItems(settings);

  if (mode === "color") {
    return activeItems.filter((item) => item.useInColorMode);
  }

  if (mode === "category") {
    return activeItems.filter((item) => item.useInCategoryMode);
  }

  return activeItems.filter((item) => item.useInNameMode);
}

function getActiveItems(settings) {
  const enabledCategories = getEnabledCategories(settings);

  return items.filter((item) => enabledCategories.includes(item.category));
}

function getAvailableCategoryKeys(settings) {
  const categoryItems = getModeItems("category", settings);
  const categoryKeys = Object.keys(CATEGORY_INFO);

  return categoryKeys.filter((categoryKey) => {
    const hasCorrectItem = categoryItems.some((item) => item.category === categoryKey);
    const hasWrongItem = categoryItems.some((item) => item.category !== categoryKey);

    return hasCorrectItem && hasWrongItem;
  });
}
