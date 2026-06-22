const STORAGE_KEY = "mata-monstret-settings-v4";
const OLD_STORAGE_KEYS = [
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

const COLOR_VOICE_SLUGS = {
  "gult": "yellow",
  "rött": "red",
  "orange": "orange",
  "grönt": "green",
  "blått": "blue",
  "brunt": "brown",
  "vitt": "white",
  "rosa": "pink",
  "svart": "black"
};

const CATEGORY_VOICE_SLUGS = {
  mat: "food",
  djur: "animal",
  leksak: "toy",
  fordon: "vehicle",
  klader: "clothes"
};

const CATEGORY_INFO = {
  mat: {
    label: "mat",
    prompt: "Ge mig något man kan äta!"
  },
  djur: {
    label: "djur",
    prompt: "Ge mig ett djur!"
  },
  leksak: {
    label: "leksak",
    prompt: "Ge mig en leksak!"
  },
  fordon: {
    label: "fordon",
    prompt: "Ge mig ett fordon!"
  },
  klader: {
    label: "kläder",
    prompt: "Ge mig något man kan ha på sig!"
  }
};

const items = [
  {
    id: "banana",
    name: "banan",
    emoji: "🍌",
    category: "mat",
    color: "gult"
  },
  {
    id: "apple",
    name: "äpple",
    emoji: "🍎",
    category: "mat",
    color: "rött"
  },
  {
    id: "carrot",
    name: "morot",
    emoji: "🥕",
    category: "mat",
    color: "orange"
  },
  {
    id: "cucumber",
    name: "gurka",
    emoji: "🥒",
    category: "mat",
    color: "grönt"
  },
  {
    id: "lemon",
    name: "citron",
    emoji: "🍋",
    category: "mat",
    color: "gult"
  },
  {
    id: "strawberry",
    name: "jordgubbe",
    emoji: "🍓",
    category: "mat",
    color: "rött"
  },
  {
    id: "cheese",
    name: "ost",
    emoji: "🧀",
    category: "mat",
    color: "gult"
  },
  {
    id: "cookie",
    name: "kaka",
    emoji: "🍪",
    category: "mat",
    color: "brunt"
  },

  {
    id: "dog",
    name: "hund",
    emoji: "🐶",
    category: "djur",
    color: "brunt"
  },
  {
    id: "cat",
    name: "katt",
    emoji: "🐱",
    category: "djur",
    color: "orange"
  },
  {
    id: "frog",
    name: "groda",
    emoji: "🐸",
    category: "djur",
    color: "grönt"
  },
  {
    id: "cow",
    name: "ko",
    emoji: "🐮",
    category: "djur",
    color: "vitt"
  },
  {
    id: "pig",
    name: "gris",
    emoji: "🐷",
    category: "djur",
    color: "rosa"
  },

  {
    id: "teddy",
    name: "nalle",
    emoji: "🧸",
    category: "leksak",
    color: "brunt"
  },
  {
    id: "ball",
    name: "boll",
    emoji: "⚽",
    category: "leksak",
    color: "vitt"
  },
  {
    id: "blocks",
    name: "klossar",
    emoji: "🧱",
    category: "leksak",
    color: "rött"
  },
  {
    id: "kite",
    name: "drake",
    emoji: "🪁",
    category: "leksak",
    color: "blått"
  },

  {
    id: "car",
    name: "bil",
    emoji: "🚙",
    category: "fordon",
    color: "blått"
  },
  {
    id: "bus",
    name: "buss",
    emoji: "🚌",
    category: "fordon",
    color: "gult"
  },
  {
    id: "train",
    name: "tåg",
    emoji: "🚂",
    category: "fordon",
    color: "svart"
  },
  {
    id: "tractor",
    name: "traktor",
    emoji: "🚜",
    category: "fordon",
    color: "grönt"
  },

  {
    id: "shoe",
    name: "sko",
    emoji: "👟",
    category: "klader",
    color: "blått"
  },
  {
    id: "hat",
    name: "mössa",
    emoji: "🧢",
    category: "klader",
    color: "blått"
  },
  {
    id: "sock",
    name: "strumpa",
    emoji: "🧦",
    category: "klader",
    color: "vitt"
  },
  {
    id: "scarf",
    name: "halsduk",
    emoji: "🧣",
    category: "klader",
    color: "rött"
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

  const activeItems = getActiveItems();

  if (activeItems.length < 2) {
    speech.textContent = "Välj minst två saker i vuxenläget.";
    instruction.textContent = "För få saker att leka med";
    speak("Välj minst två saker i vuxenläget.", "settings_need_two_items");
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
  const answer = getRandomAnswer();

  lastAnswerId = answer.id;

  if (questionType === "color") {
    return createColorQuestion(answer);
  }

  if (questionType === "category") {
    return createCategoryQuestion();
  }

  return createNameQuestion(answer);
}

function getQuestionType() {
  if (settings.selectedMode !== "mixed") {
    return settings.selectedMode;
  }

  const possibleTypes = ["name", "color"];

  if (getAvailableCategoryKeys().length >= 2) {
    possibleTypes.push("category");
  }

  return getRandomItem(possibleTypes);
}

function createNameQuestion(answer) {
  const activeItems = getActiveItems();
  const wrongOptions = activeItems.filter((item) => item.id !== answer.id);
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
  const activeItems = getActiveItems();
  const wrongOptions = activeItems.filter((item) => item.color !== answer.color);
  const fallbackWrongOptions = activeItems.filter((item) => item.id !== answer.id);
  const usefulWrongOptions = wrongOptions.length > 0 ? wrongOptions : fallbackWrongOptions;
  const options = createOptions(answer, usefulWrongOptions);
  const colorSlug = COLOR_VOICE_SLUGS[answer.color] || slugify(answer.color);

  return {
    type: "color",
    answer,
    targetColor: answer.color,
    prompt: `Ge mig något ${answer.color}!`,
    voiceKey: `give_color_${colorSlug}`,
    options,
    isCorrect: (item) => item.color === answer.color
  };
}

function createCategoryQuestion() {
  const activeItems = getActiveItems();
  const availableCategoryKeys = getAvailableCategoryKeys();
  const targetCategory = getRandomItem(availableCategoryKeys);
  const categoryInfo = CATEGORY_INFO[targetCategory];

  const correctOptions = activeItems.filter((item) => item.category === targetCategory);
  const wrongOptions = activeItems.filter((item) => item.category !== targetCategory);
  const answer = getRandomItem(correctOptions);
  const options = createOptions(answer, wrongOptions);
  const categorySlug = CATEGORY_VOICE_SLUGS[targetCategory] || slugify(targetCategory);

  lastAnswerId = answer.id;

  return {
    type: "category",
    answer,
    targetCategory,
    prompt: categoryInfo.prompt,
    voiceKey: `give_category_${categorySlug}`,
    options,
    isCorrect: (item) => item.category === targetCategory
  };
}

function createOptions(answer, wrongOptions) {
  const safeOptionCount = Math.min(settings.optionCount, getActiveItems().length);
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
    button.innerHTML = `
      <span>${item.emoji || "❓"}</span>
      <span class="choice-label">${item.name}</span>
    `;

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

    if (i < currentRound) {
      dot.classList.add("done");
    }

    progress.appendChild(dot);
  }
}

function addFoodToBowl(item) {
  const food = document.createElement("span");

  food.className = "bowl-food";
  food.textContent = item.emoji || "⭐";

  bowlItems.appendChild(food);

  playEffect("food");
}

function clearBowl() {
  bowlItems.innerHTML = "";
}

function setMonsterMood(mood) {
  monster.className = `monster monster-${mood}`;
  monster.setAttribute("aria-label", `${getMonsterName()} är ${mood}`);
}

function getRandomAnswer() {
  const activeItems = getActiveItems();
  const possibleAnswers = activeItems.filter((item) => item.id !== lastAnswerId);

  if (possibleAnswers.length === 0) {
    return getRandomItem(activeItems);
  }

  return getRandomItem(possibleAnswers);
}

function getActiveItems() {
  const enabledCategories = getEnabledCategories();

  return items.filter((item) => enabledCategories.includes(item.category));
}

function getEnabledCategories() {
  if (!Array.isArray(settings.enabledCategories) || settings.enabledCategories.length === 0) {
    return DEFAULT_SETTINGS.enabledCategories;
  }

  return settings.enabledCategories;
}

function getAvailableCategoryKeys() {
  const activeItems = getActiveItems();
  const categoryKeys = Object.keys(CATEGORY_INFO);

  return categoryKeys.filter((categoryKey) => {
    const hasCorrectItem = activeItems.some((item) => item.category === categoryKey);
    const hasWrongItem = activeItems.some((item) => item.category !== categoryKey);

    return hasCorrectItem && hasWrongItem;
  });
}

function getChildName() {
  return (settings.childName || "").trim();
}

function getMonsterName() {
  return (settings.monsterName || "Mumsis").trim();
}

function getRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replaceAll("å", "a")
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function speak(text, voiceKey = "") {
  lastSpokenText = text;
  lastVoiceKey = voiceKey;

  if (settings.voiceMode === "off") return;

  stopBrowserVoice();

  if (settings.voiceMode === "custom") {
    const customVoicePlayed = await playCustomVoice(voiceKey);

    if (customVoicePlayed) {
      return;
    }

    speakWithBrowserVoice(text);
    return;
  }

  speakWithBrowserVoice(text);
}

function speakWithBrowserVoice(text) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "sv-SE";
  utterance.rate = 0.85;
  utterance.pitch = 1.15;

  const voices = window.speechSynthesis.getVoices();
  const swedishVoice = voices.find((voice) =>
    voice.lang.toLowerCase().startsWith("sv")
  );

  if (swedishVoice) {
    utterance.voice = swedishVoice;
  }

  window.speechSynthesis.speak(utterance);
}

function stopBrowserVoice() {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
}

function repeatSpeech() {
  if (!lastSpokenText) {
    speak(speech.textContent, "");
    return;
  }

  speak(lastSpokenText, lastVoiceKey);
}

async function playCustomVoice(voiceKey) {
  if (!voiceKey) return false;

  const source = `./audio/voice/${voiceKey}.mp3`;

  return playAudioFile(source, 1);
}

function playEffect(effectKey) {
  if (!settings.effectEnabled) return Promise.resolve(false);

  const source = EFFECT_PATHS[effectKey];

  if (!source) return Promise.resolve(false);

  return playAudioFile(source, 0.9);
}

function playAudioFile(source, volume = 1) {
  return new Promise((resolve) => {
    const audio = new Audio(source);
    let settled = false;

    audio.preload = "auto";
    audio.volume = volume;

    const finish = (result) => {
      if (settled) return;

      settled = true;
      resolve(result);
    };

    audio.addEventListener("ended", () => finish(true), { once: true });
    audio.addEventListener("error", () => finish(false), { once: true });

    audio.play().catch(() => {
      finish(false);
    });
  });
}

function testAudio() {
  playEffect("correct");
  speak("Mums! Tack!", "correct_mums");
  showSettingsMessage("Testar ljud!");
}

function showModeIntro() {
  const monsterName = getMonsterName();
  const childName = getChildName();

  if (settings.selectedMode === "name") {
    instruction.textContent = "Ordläge valt!";
    speech.textContent = childName
      ? `${childName}, kan du mata ${monsterName}?`
      : `Kan du mata ${monsterName}?`;
  }

  if (settings.selectedMode === "color") {
    instruction.textContent = "Färgläge valt!";
    speech.textContent = `${monsterName} vill öva på färger.`;
  }

  if (settings.selectedMode === "category") {
    instruction.textContent = "Kategoriläge valt!";
    speech.textContent = `${monsterName} vill sortera saker.`;
  }

  if (settings.selectedMode === "mixed") {
    instruction.textContent = "Blandat läge valt!";
    speech.textContent = `${monsterName} blandar ord, färger och kategorier.`;
  }
}

function openSettings() {
  playEffect("click");
  settingsPanel.classList.remove("hidden");
  settingsMessage.textContent = "";
  applySettingsToUI();
}

function closeSettings() {
  playEffect("click");
  settingsPanel.classList.add("hidden");
  updateTitle();
  showModeIntro();
}

function updateEnabledCategoriesFromUI() {
  const selectedCategories = Array.from(categoryCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  if (selectedCategories.length === 0) {
    const firstCheckbox = categoryCheckboxes[0];

    firstCheckbox.checked = true;
    settings.enabledCategories = [firstCheckbox.value];
    showSettingsMessage("Minst en kategori behövs.");
  } else {
    settings.enabledCategories = selectedCategories;
    showSettingsMessage("Sparat!");
  }

  saveSettings();
}

function resetSettings() {
  settings = { ...DEFAULT_SETTINGS };
  saveSettings();
  applySettingsToUI();
  updateTitle();
  clearBowl();
  setMonsterMood("hungry");

  instruction.textContent = "Inställningar återställda!";
  speech.textContent = "Nu är allt som från början.";

  showSettingsMessage("Återställt!");
}

function applySettingsToUI() {
  childNameInput.value = settings.childName || "";
  monsterNameInput.value = settings.monsterName || "Mumsis";
  voiceSelect.value = settings.voiceMode || "custom";
  effectSelect.value = settings.effectEnabled ? "on" : "off";
  optionCountSelect.value = String(settings.optionCount);
  roundCountSelect.value = String(settings.maxRounds);

  categoryCheckboxes.forEach((checkbox) => {
    checkbox.checked = settings.enabledCategories.includes(checkbox.value);
  });

  updateModeButtons();
}

function updateModeButtons() {
  modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === settings.selectedMode;
    button.classList.toggle("active", isActive);
  });
}

function updateTitle() {
  gameTitle.textContent = `Mata ${getMonsterName()}`;
}

function showSettingsMessage(message) {
  settingsMessage.textContent = message;

  setTimeout(() => {
    if (settingsMessage.textContent === message) {
      settingsMessage.textContent = "";
    }
  }, 1800);
}

function loadSettings() {
  try {
    const savedV4 = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (savedV4) {
      return normalizeSettings({
        ...DEFAULT_SETTINGS,
        ...savedV4
      });
    }

    for (const oldKey of OLD_STORAGE_KEYS) {
      const oldSettings = JSON.parse(localStorage.getItem(oldKey));

      if (oldSettings) {
        return normalizeSettings({
          ...DEFAULT_SETTINGS,
          ...oldSettings
        });
      }
    }

    return { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function normalizeSettings(rawSettings) {
  const normalized = {
    ...DEFAULT_SETTINGS,
    ...rawSettings
  };

  if (!normalized.voiceMode) {
    normalized.voiceMode = normalized.voiceEnabled === false ? "off" : "custom";
  }

  normalized.voiceEnabled = normalized.voiceMode !== "off";

  if (typeof normalized.effectEnabled !== "boolean") {
    normalized.effectEnabled = true;
  }

  return normalized;
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function updateOnlineStatus() {
  if (navigator.onLine) {
    appStatus.textContent = "Redo att leka";
  } else {
    appStatus.textContent = "Offline-läge";
  }
}

function setupInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();

    deferredInstallPrompt = event;
    installButton.classList.remove("hidden");
  });

  installButton.addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
      showSettingsMessage("Installera via webbläsarens meny.");
      return;
    }

    deferredInstallPrompt.prompt();

    await deferredInstallPrompt.userChoice;

    deferredInstallPrompt = null;
    installButton.classList.add("hidden");
    showSettingsMessage("Klart!");
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    installButton.classList.add("hidden");
    showSettingsMessage("Appen är installerad!");
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .catch(() => {
        appStatus.textContent = "Offline-stöd kunde inte starta";
      });
  });
}