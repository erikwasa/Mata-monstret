const STORAGE_KEY = "mata-monstret-settings-v5";
const OLD_STORAGE_KEYS = [
  "mata-monstret-settings-v4",
  "mata-monstret-settings-v3",
  "mata-monstret-settings-v2"
];

const DEFAULT_SETTINGS = {
  selectedMode: "mixed",
  voiceMode: "custom",
  voiceEnabled: true,
  effectEnabled: true,
  optionCount: 3,
  maxRounds: 5,
  childName: "",
  monsterName: "Mumsis",
  enabledCategories: ["mat", "djur", "leksak", "fordon", "klader"]
};

const DANCE_AFTER_CORRECT = 3;

const EFFECT_PATHS = {
  correct: "./audio/effects/correct.mp3",
  wrong: "./audio/effects/wrong.mp3",
  food: "./audio/effects/food.mp3",
  dance: "./audio/effects/dance.mp3",
  end: "./audio/effects/end.mp3",
  click: "./audio/effects/click.mp3"
};

const CATEGORY_INFO = {
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

const COLOR_INFO = {
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

const items = [
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

const body = document.body;
const gameTitle = document.getElementById("gameTitle");
const monster = document.getElementById("monster");
const speech = document.getElementById("speech");
const instruction = document.getElementById("instruction");
const choices = document.getElementById("choices");
const startButton = document.getElementById("startButton");
const repeatButton = document.getElementById("repeatButton");
const progress = document.getElementById("progress");
const modeSelector = document.getElementById("modeSelector");
const modeButtons = document.querySelectorAll(".mode-button");
const appStatus = document.getElementById("appStatus");
const bowlItems = document.getElementById("bowlItems");

const adultButton = document.getElementById("adultButton");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const childNameInput = document.getElementById("childNameInput");
const monsterNameInput = document.getElementById("monsterNameInput");
const voiceSelect = document.getElementById("voiceSelect");
const effectSelect = document.getElementById("effectSelect");
const optionCountSelect = document.getElementById("optionCountSelect");
const roundCountSelect = document.getElementById("roundCountSelect");
const categoryCheckboxes = document.querySelectorAll(".category-checkbox");
const resetSettingsButton = document.getElementById("resetSettingsButton");
const installButton = document.getElementById("installButton");
const testAudioButton = document.getElementById("testAudioButton");
const settingsMessage = document.getElementById("settingsMessage");

let settings = loadSettings();
let currentQuestion = null;
let currentRound = 0;
let correctAnswers = 0;
let lastAnswerId = null;
let lastSpokenText = "";
let lastVoiceKey = "";
let buttonsLocked = false;
let deferredInstallPrompt = null;
let dancePauseUsed = false;

applySettingsToUI();
updateTitle();
bindEvents();
registerServiceWorker();
setupInstallPrompt();
updateOnlineStatus();
showModeIntro();

function bindEvents() {
  startButton.addEventListener("click", startGame);
  repeatButton.addEventListener("click", repeatSpeech);

  adultButton.addEventListener("click", openSettings);
  closeSettingsButton.addEventListener("click", closeSettings);

  resetSettingsButton.addEventListener("click", resetSettings);
  testAudioButton.addEventListener("click", testAudio);

  childNameInput.addEventListener("input", () => {
    settings.childName = childNameInput.value.trim();
    saveSettings();
    updateTitle();
    showSettingsMessage("Sparat!");
  });

  monsterNameInput.addEventListener("input", () => {
    settings.monsterName = monsterNameInput.value.trim();
    saveSettings();
    updateTitle();
    showSettingsMessage("Sparat!");
  });

  voiceSelect.addEventListener("change", () => {
    settings.voiceMode = voiceSelect.value;
    settings.voiceEnabled = settings.voiceMode !== "off";
    saveSettings();
    showSettingsMessage("Sparat!");
  });

  effectSelect.addEventListener("change", () => {
    settings.effectEnabled = effectSelect.value === "on";
    saveSettings();
    showSettingsMessage("Sparat!");
  });

  optionCountSelect.addEventListener("change", () => {
    settings.optionCount = Number(optionCountSelect.value);
    saveSettings();
    showSettingsMessage("Sparat!");
  });

  roundCountSelect.addEventListener("change", () => {
    settings.maxRounds = Number(roundCountSelect.value);
    saveSettings();
    showSettingsMessage("Sparat!");
  });

  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateEnabledCategoriesFromUI);
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      playEffect("click");

      settings.selectedMode = button.dataset.mode;
      saveSettings();
      updateModeButtons();
      showModeIntro();
    });
  });

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }
}

function startGame() {
  playEffect("click");

  const availableQuestionTypes = getAvailableQuestionTypes();

  if (availableQuestionTypes.length === 0) {
    speech.textContent = "Välj fler saker i vuxenläget.";
    instruction.textContent = "För få saker att leka med";
    speak("Välj fler saker i vuxenläget.", "settings_need_more_items");
    return;
  }

  if (
    settings.selectedMode !== "mixed" &&
    !availableQuestionTypes.includes(settings.selectedMode)
  ) {
    const message = getUnavailableModeMessage(settings.selectedMode);

    speech.textContent = message;
    instruction.textContent = "För få tydliga val";
    speak(message, "settings_need_more_items");
    return;
  }

  body.classList.add("is-playing");

  currentRound = 0;
  correctAnswers = 0;
  lastAnswerId = null;
  buttonsLocked = false;
  dancePauseUsed = false;

  clearBowl();

  startButton.classList.add("hidden");
  modeSelector.classList.add("hidden");
  repeatButton.classList.remove("hidden");

  setMonsterMood("hungry");
  nextRound();
}

function getUnavailableModeMessage(mode) {
  if (mode === "color") {
    return "Välj fler tydliga färger i vuxenläget.";
  }

  if (mode === "category") {
    return "Välj minst två kategorier i vuxenläget.";
  }

  return "Välj fler saker i vuxenläget.";
}

function nextRound() {
  if (currentRound >= settings.maxRounds) {
    endGame();
    return;
  }

  currentRound += 1;
  buttonsLocked = false;

  setMonsterMood("hungry");

  currentQuestion = createQuestion();

  instruction.textContent = `Runda ${currentRound} av ${settings.maxRounds}`;
  speech.textContent = currentQuestion.prompt;

  renderProgress();
  renderChoices(currentQuestion.options);
  speak(currentQuestion.prompt, currentQuestion.voiceKey);
}

function createQuestion() {
  const questionType = getQuestionType();

  if (questionType === "color") {
    const answer = getRandomAnswer("color");
    lastAnswerId = answer.id;

    return createColorQuestion(answer);
  }

  if (questionType === "category") {
    return createCategoryQuestion();
  }

  const answer = getRandomAnswer("name");
  lastAnswerId = answer.id;

  return createNameQuestion(answer);
}

function getQuestionType() {
  if (settings.selectedMode !== "mixed") {
    return settings.selectedMode;
  }

  return getRandomItem(getAvailableQuestionTypes());
}

function getAvailableQuestionTypes() {
  const availableTypes = [];

  if (getModeItems("name").length >= 2) {
    availableTypes.push("name");
  }

  const colorItems = getModeItems("color");
  const distinctColors = new Set(colorItems.map((item) => item.color));

  if (colorItems.length >= 2 && distinctColors.size >= 2) {
    availableTypes.push("color");
  }

  if (getAvailableCategoryKeys().length >= 2) {
    availableTypes.push("category");
  }

  return availableTypes;
}

function createNameQuestion(answer) {
  const nameItems = getModeItems("name");
  const wrongOptions = nameItems.filter((item) => item.id !== answer.id);
  const options = createOptions(answer, wrongOptions);

  return {
    type: "name",
    answer,
    prompt: `Ge mig ${answer.name}!`,
    voiceKey: `give_${answer.id}`,
    options,
    isCorrect: (item) => item.id === answer.id
  };
}

function createColorQuestion(answer) {
  const colorItems = getModeItems("color");
  const wrongOptions = colorItems.filter((item) => item.color !== answer.color);
  const colorInfo = COLOR_INFO[answer.color];

  const options = createOptions(answer, wrongOptions);

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

function createCategoryQuestion() {
  const categoryItems = getModeItems("category");
  const availableCategoryKeys = getAvailableCategoryKeys();
  const targetCategory = getRandomItem(availableCategoryKeys);
  const categoryInfo = CATEGORY_INFO[targetCategory];

  const correctOptions = categoryItems.filter((item) => item.category === targetCategory);
  const wrongOptions = categoryItems.filter((item) => item.category !== targetCategory);
  const answer = getRandomItem(correctOptions);
  const options = createOptions(answer, wrongOptions);

  lastAnswerId = answer.id;

  return {
    type: "category",
    answer,
    targetCategory,
    prompt: categoryInfo.prompt,
    voiceKey: categoryInfo.voiceKey,
    options,
    isCorrect: (item) => item.category === targetCategory
  };
}

function createOptions(answer, wrongOptions) {
  const safeOptionCount = Math.min(settings.optionCount, wrongOptions.length + 1);
  const shuffledWrongOptions = shuffle(wrongOptions);
  const chosenWrongOptions = shuffledWrongOptions.slice(0, safeOptionCount - 1);

  return shuffle([answer, ...chosenWrongOptions]);
}

function renderChoices(options) {
  choices.innerHTML = "";
  choices.className = `choices choices-${options.length}`;

  options.forEach((item) => {
    const button = document.createElement("button");

    button.className = "choice-button";
    button.type = "button";

    if (currentQuestion.type === "color") {
      const colorInfo = COLOR_INFO[item.color];

      button.classList.add("choice-button-color");
      button.innerHTML = `
        <span class="choice-content">
          <span class="color-swatch color-swatch-${item.color}" aria-label="${colorInfo.label}"></span>
          <span class="choice-emoji">${item.emoji || "❓"}</span>
        </span>
        <span class="choice-label">${item.name}</span>
      `;
    } else {
      button.innerHTML = `
        <span class="choice-emoji">${item.emoji || "❓"}</span>
        <span class="choice-label">${item.name}</span>
      `;
    }

    button.addEventListener("click", () => handleChoice(item, button));

    choices.appendChild(button);
  });
}

function handleChoice(item, button) {
  if (buttonsLocked) return;

  buttonsLocked = true;

  if (currentQuestion.isCorrect(item)) {
    handleCorrectChoice(item, button);
  } else {
    handleWrongChoice(item, button);
  }
}

function handleCorrectChoice(item, button) {
  correctAnswers += 1;

  setChoiceButtonsDisabled(true);
  addFoodToBowl(item);

  button.classList.add("correct");

  setMonsterMood("chewing");
  playEffect("correct");

  const feedback = getCorrectFeedback();

  speech.textContent = feedback.text;
  speak(feedback.text, feedback.voiceKey);

  const shouldDance =
    !dancePauseUsed &&
    correctAnswers >= DANCE_AFTER_CORRECT &&
    currentRound < settings.maxRounds;

  if (shouldDance) {
    dancePauseUsed = true;

    setTimeout(() => {
      startDancePause();
    }, 900);

    return;
  }

  setTimeout(() => {
    nextRound();
  }, 1300);
}

function getCorrectFeedback() {
  const monsterName = getMonsterName();

  const feedbacks = [
    {
      text: "Mums! Tack!",
      voiceKey: "correct_mums"
    },
    {
      text: "Jättegott!",
      voiceKey: "correct_good"
    },
    {
      text: "Bra matat!",
      voiceKey: "correct_feeding"
    },
    {
      text: `${monsterName} blir glad!`,
      voiceKey: "correct_happy"
    },
    {
      text: "Tack för maten!",
      voiceKey: "correct_thanks"
    }
  ];

  return getRandomItem(feedbacks);
}

function handleWrongChoice(item, button) {
  setChoiceButtonsDisabled(true);

  button.classList.add("wrong");

  setMonsterMood("thinking");
  playEffect("wrong");

  const feedback = `Nästan! Det där var ${item.name}. Försök igen.`;

  speech.textContent = feedback;
  speak(feedback, "try_again");

  setTimeout(() => {
    button.classList.remove("wrong");

    setMonsterMood("hungry");

    speech.textContent = currentQuestion.prompt;

    setChoiceButtonsDisabled(false);
    buttonsLocked = false;
  }, 1600);
}

function startDancePause() {
  const monsterName = getMonsterName();

  choices.innerHTML = "";
  choices.className = "choices";

  instruction.textContent = "Danspaus!";
  speech.textContent = `${monsterName} dansar!`;

  setMonsterMood("dancing");
  playEffect("dance");
  speak(`${monsterName} dansar!`, "dance");

  setTimeout(() => {
    nextRound();
  }, 2200);
}

function endGame() {
  choices.innerHTML = "";
  choices.className = "choices";
  progress.innerHTML = "";

  body.classList.remove("is-playing");

  const childName = getChildName();
  const monsterName = getMonsterName();

  setMonsterMood("full");
  playEffect("end");

  instruction.textContent = "Bra jobbat!";

  if (childName) {
    speech.textContent = `Nu är ${monsterName} mätt. Bra jobbat, ${childName}!`;
    speak(`Nu är ${monsterName} mätt. Bra jobbat, ${childName}!`, "end");
  } else {
    speech.textContent = `Nu är ${monsterName} mätt. Tack för maten!`;
    speak(`Nu är ${monsterName} mätt. Tack för maten!`, "end");
  }

  startButton.textContent = "Spela igen";
  startButton.classList.remove("hidden");
  modeSelector.classList.remove("hidden");
  repeatButton.classList.remove("hidden");
}

function setChoiceButtonsDisabled(disabled) {
  const buttons = document.querySelectorAll(".choice-button");

  buttons.forEach((button) => {
    button.disabled = disabled;
  });
}

function renderProgress() {
  progress.innerHTML = "";

  for (let i = 1; i <= settings.maxRounds; i += 1) {
    const dot = document.createElement("span");

    dot.className = "progress-dot";

    if (i