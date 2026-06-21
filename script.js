const STORAGE_KEY = "mata-monstret-settings-v2";

const DEFAULT_SETTINGS = {
  selectedMode: "mixed",
  voiceEnabled: true,
  optionCount: 3,
  maxRounds: 5,
  enabledCategories: ["mat", "djur", "leksak", "fordon", "klader"]
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

const adultButton = document.getElementById("adultButton");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const voiceSelect = document.getElementById("voiceSelect");
const optionCountSelect = document.getElementById("optionCountSelect");
const roundCountSelect = document.getElementById("roundCountSelect");
const categoryCheckboxes = document.querySelectorAll(".category-checkbox");
const resetSettingsButton = document.getElementById("resetSettingsButton");
const installButton = document.getElementById("installButton");
const settingsMessage = document.getElementById("settingsMessage");

let settings = loadSettings();
let currentQuestion = null;
let currentRound = 0;
let correctAnswers = 0;
let lastAnswerId = null;
let lastSpokenText = "";
let buttonsLocked = false;
let deferredInstallPrompt = null;

applySettingsToUI();
bindEvents();
registerServiceWorker();
setupInstallPrompt();
updateOnlineStatus();

function bindEvents() {
  startButton.addEventListener("click", startGame);
  repeatButton.addEventListener("click", repeatSpeech);

  adultButton.addEventListener("click", openSettings);
  closeSettingsButton.addEventListener("click", closeSettings);

  resetSettingsButton.addEventListener("click", resetSettings);

  voiceSelect.addEventListener("change", () => {
    settings.voiceEnabled = voiceSelect.value === "on";
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
  const activeItems = getActiveItems();

  if (activeItems.length < 2) {
    speech.textContent = "Välj minst två saker i vuxenläget.";
    instruction.textContent = "För få saker att leka med";
    speak("Välj minst två saker i vuxenläget.");
    return;
  }

  currentRound = 0;
  correctAnswers = 0;
  lastAnswerId = null;
  buttonsLocked = false;

  startButton.classList.add("hidden");
  modeSelector.classList.add("hidden");
  repeatButton.classList.remove("hidden");

  nextRound();
}

function nextRound() {
  if (currentRound >= settings.maxRounds) {
    endGame();
    return;
  }

  currentRound += 1;
  buttonsLocked = false;

  monster.textContent = "😋";
  monster.className = "monster";

  currentQuestion = createQuestion();

  instruction.textContent = `Runda ${currentRound} av ${settings.maxRounds}`;
  speech.textContent = currentQuestion.prompt;

  renderProgress();
  renderChoices(currentQuestion.options);
  speak(currentQuestion.prompt);
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

  return {
    type: "color",
    answer,
    targetColor: answer.color,
    prompt: `Ge mig något ${answer.color}!`,
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

  lastAnswerId = answer.id;

  return {
    type: "category",
    answer,
    targetCategory,
    prompt: categoryInfo.prompt,
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
    handleCorrectChoice(button);
  } else {
    handleWrongChoice(item, button);
  }
}

function handleCorrectChoice(button) {
  correctAnswers += 1;

  setChoiceButtonsDisabled(true);

  button.classList.add("correct");

  monster.textContent = "🥳";
  monster.className = "monster happy";

  const feedback = getCorrectFeedback();

  speech.textContent = feedback;
  speak(feedback);

  setTimeout(() => {
    nextRound();
  }, 1300);
}

function getCorrectFeedback() {
  const feedbacks = [
    "Mums! Tack!",
    "Jättegott!",
    "Bra matat!",
    "Mumsis blir glad!",
    "Tack för maten!"
  ];

  return getRandomItem(feedbacks);
}

function handleWrongChoice(item, button) {
  setChoiceButtonsDisabled(true);

  button.classList.add("wrong");

  monster.textContent = "🤔";
  monster.className = "monster thinking";

  const feedback = `Nästan! Det där var ${item.name}. Försök igen.`;

  speech.textContent = feedback;
  speak(feedback);

  setTimeout(() => {
    button.classList.remove("wrong");

    monster.textContent = "😋";
    monster.className = "monster";

    speech.textContent = currentQuestion.prompt;

    setChoiceButtonsDisabled(false);
    buttonsLocked = false;
  }, 1600);
}

function endGame() {
  choices.innerHTML = "";
  progress.innerHTML = "";

  monster.textContent = "🥰";
  monster.className = "monster dancing";

  instruction.textContent = "Bra jobbat!";
  speech.textContent = `Nu är Mumsis mätt. Du hjälpte ${correctAnswers} gånger!`;

  startButton.textContent = "Spela igen";
  startButton.classList.remove("hidden");
  modeSelector.classList.remove("hidden");
  repeatButton.classList.remove("hidden");

  speak("Nu är Mumsis mätt. Tack för maten!");
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

function getRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function speak(text) {
  lastSpokenText = text;

  if (!settings.voiceEnabled) return;
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

function repeatSpeech() {
  if (!lastSpokenText) {
    speak(speech.textContent);
    return;
  }

  speak(lastSpokenText);
}

function showModeIntro() {
  if (settings.selectedMode === "name") {
    instruction.textContent = "Ordläge valt!";
    speech.textContent = "Jag säger vad jag vill ha.";
  }

  if (settings.selectedMode === "color") {
    instruction.textContent = "Färgläge valt!";
    speech.textContent = "Jag säger vilken färg jag vill ha.";
  }

  if (settings.selectedMode === "category") {
    instruction.textContent = "Kategoriläge valt!";
    speech.textContent = "Jag säger vilken sorts sak jag vill ha.";
  }

  if (settings.selectedMode === "mixed") {
    instruction.textContent = "Blandat läge valt!";
    speech.textContent = "Jag blandar ord, färger och kategorier.";
  }
}

function openSettings() {
  settingsPanel.classList.remove("hidden");
  settingsMessage.textContent = "";
  applySettingsToUI();
}

function closeSettings() {
  settingsPanel.classList.add("hidden");
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

  instruction.textContent = "Inställningar återställda!";
  speech.textContent = "Nu är allt som från början.";

  showSettingsMessage("Återställt!");
}

function applySettingsToUI() {
  voiceSelect.value = settings.voiceEnabled ? "on" : "off";
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
    const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEY));

    return {
      ...DEFAULT_SETTINGS,
      ...savedSettings
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
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