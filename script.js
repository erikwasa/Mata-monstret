import {
  CATEGORY_INFO,
  COLOR_INFO,
  DANCE_AFTER_CORRECT,
  items
} from "./src/data.js";
import {
  DEFAULT_SETTINGS,
  getChildName as getSettingsChildName,
  getEnabledCategories as getSettingsEnabledCategories,
  getMonsterName as getSettingsMonsterName,
  loadSettings,
  saveSettings
} from "./src/settings.js";
import {
  playEffect,
  repeatSpeech,
  setupBrowserVoice,
  speak,
  testAudio
} from "./src/audio.js";

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
  repeatButton.addEventListener("click", () => repeatSpeech(speech.textContent, settings));

  adultButton.addEventListener("click", openSettings);
  closeSettingsButton.addEventListener("click", closeSettings);

  resetSettingsButton.addEventListener("click", resetSettings);
  testAudioButton.addEventListener("click", () => testAudio(settings, showSettingsMessage));

  childNameInput.addEventListener("input", () => {
    settings.childName = childNameInput.value.trim();
    saveSettings(settings);
    updateTitle();
    showSettingsMessage("Sparat!");
  });

  monsterNameInput.addEventListener("input", () => {
    settings.monsterName = monsterNameInput.value.trim();
    saveSettings(settings);
    updateTitle();
    showSettingsMessage("Sparat!");
  });

  voiceSelect.addEventListener("change", () => {
    settings.voiceMode = voiceSelect.value;
    settings.voiceEnabled = settings.voiceMode !== "off";
    saveSettings(settings);
    showSettingsMessage("Sparat!");
  });

  effectSelect.addEventListener("change", () => {
    settings.effectEnabled = effectSelect.value === "on";
    saveSettings(settings);
    showSettingsMessage("Sparat!");
  });

  optionCountSelect.addEventListener("change", () => {
    settings.optionCount = Number(optionCountSelect.value);
    saveSettings(settings);
    showSettingsMessage("Sparat!");
  });

  roundCountSelect.addEventListener("change", () => {
    settings.maxRounds = Number(roundCountSelect.value);
    saveSettings(settings);
    showSettingsMessage("Sparat!");
  });

  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateEnabledCategoriesFromUI);
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      playEffect("click", settings);

      settings.selectedMode = button.dataset.mode;
      saveSettings(settings);
      updateModeButtons();
      showModeIntro();
    });
  });

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  setupBrowserVoice();
}

function startGame() {
  playEffect("click", settings);

  const availableQuestionTypes = getAvailableQuestionTypes();

  if (availableQuestionTypes.length === 0) {
    speech.textContent = "Välj fler saker i vuxenläget.";
    instruction.textContent = "För få saker att leka med";
    speak("Välj fler saker i vuxenläget.", "settings_need_more_items", settings);
    return;
  }

  if (
    settings.selectedMode !== "mixed" &&
    !availableQuestionTypes.includes(settings.selectedMode)
  ) {
    const message = getUnavailableModeMessage(settings.selectedMode);

    speech.textContent = message;
    instruction.textContent = "För få tydliga val";
    speak(message, "settings_need_more_items", settings);
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
  speak(currentQuestion.prompt, currentQuestion.voiceKey, settings);
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
  playEffect("correct", settings);

  const feedback = getCorrectFeedback();

  speech.textContent = feedback.text;
  speak(feedback.text, feedback.voiceKey, settings);

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
  playEffect("wrong", settings);

  const feedback = `Nästan! Det där var ${item.name}. Försök igen.`;

  speech.textContent = feedback;
  speak(feedback, "try_again", settings);

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
  playEffect("dance", settings);
  speak(`${monsterName} dansar!`, "dance", settings);

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
  playEffect("end", settings);

  instruction.textContent = "Bra jobbat!";

  if (childName) {
    speech.textContent = `Nu är ${monsterName} mätt. Bra jobbat, ${childName}!`;
    speak(`Nu är ${monsterName} mätt. Bra jobbat, ${childName}!`, "end", settings);
  } else {
    speech.textContent = `Nu är ${monsterName} mätt. Tack för maten!`;
    speak(`Nu är ${monsterName} mätt. Tack för maten!`, "end", settings);
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

  playEffect("food", settings);
}

function clearBowl() {
  bowlItems.innerHTML = "";
}

function setMonsterMood(mood) {
  monster.className = `monster monster-${mood}`;
  monster.setAttribute("aria-label", `${getMonsterName()} är ${mood}`);
}

function getRandomAnswer(mode) {
  const modeItems = getModeItems(mode);
  const possibleAnswers = modeItems.filter((item) => item.id !== lastAnswerId);

  if (possibleAnswers.length === 0) {
    return getRandomItem(modeItems);
  }

  return getRandomItem(possibleAnswers);
}

function getModeItems(mode) {
  const activeItems = getActiveItems();

  if (mode === "color") {
    return activeItems.filter((item) => item.useInColorMode);
  }

  if (mode === "category") {
    return activeItems.filter((item) => item.useInCategoryMode);
  }

  return activeItems.filter((item) => item.useInNameMode);
}

function getActiveItems() {
  const enabledCategories = getEnabledCategories();

  return items.filter((item) => enabledCategories.includes(item.category));
}

function getEnabledCategories() {
  return getSettingsEnabledCategories(settings);
}

function getAvailableCategoryKeys() {
  const categoryItems = getModeItems("category");
  const categoryKeys = Object.keys(CATEGORY_INFO);

  return categoryKeys.filter((categoryKey) => {
    const hasCorrectItem = categoryItems.some((item) => item.category === categoryKey);
    const hasWrongItem = categoryItems.some((item) => item.category !== categoryKey);

    return hasCorrectItem && hasWrongItem;
  });
}

function getChildName() {
  return getSettingsChildName(settings);
}

function getMonsterName() {
  return getSettingsMonsterName(settings);
}

function getRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
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
    speech.textContent = `${monsterName} vill öva på tydliga färger.`;
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
  playEffect("click", settings);
  settingsPanel.classList.remove("hidden");
  settingsMessage.textContent = "";
  applySettingsToUI();
}

function closeSettings() {
  playEffect("click", settings);
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

  saveSettings(settings);
}

function resetSettings() {
  settings = { ...DEFAULT_SETTINGS };
  saveSettings(settings);
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
