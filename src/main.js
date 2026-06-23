import { DANCE_AFTER_CORRECT } from "./data.js";
import {
  DEFAULT_SETTINGS,
  getChildName as readChildName,
  getMonsterName as readMonsterName,
  loadSettings,
  saveSettings
} from "./settings.js";
import {
  playEffect,
  repeatSpeech,
  setupBrowserVoice,
  speak,
  testAudio
} from "./audio.js";
import {
  createQuestion,
  getAvailableQuestionTypes,
  getRandomItem
} from "./questions.js";
import {
  addFoodToBowl as renderFoodInBowl,
  clearBowl as clearBowlItems,
  clearChoices,
  clearProgress,
  renderChoices as renderChoiceButtons,
  renderProgress as renderRoundProgress,
  setChoiceButtonsDisabled,
  setMonsterMood as renderMonsterMood,
  showModeIntro as renderModeIntro,
  showSettingsMessage as renderSettingsMessage,
  updateTitle as renderTitle
} from "./render.js";

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

  childNameInput.addEventListener("input", () => updateSetting("childName", childNameInput.value.trim(), true));
  monsterNameInput.addEventListener("input", () => updateSetting("monsterName", monsterNameInput.value.trim(), true));
  voiceSelect.addEventListener("change", () => {
    settings.voiceMode = voiceSelect.value;
    settings.voiceEnabled = settings.voiceMode !== "off";
    saveSettings(settings);
    showSettingsMessage("Sparat!");
  });
  effectSelect.addEventListener("change", () => updateSetting("effectEnabled", effectSelect.value === "on"));
  optionCountSelect.addEventListener("change", () => updateSetting("optionCount", Number(optionCountSelect.value)));
  roundCountSelect.addEventListener("change", () => updateSetting("maxRounds", Number(roundCountSelect.value)));

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

function updateSetting(key, value, shouldUpdateTitle = false) {
  settings[key] = value;
  saveSettings(settings);

  if (shouldUpdateTitle) {
    updateTitle();
  }

  showSettingsMessage("Sparat!");
}

function startGame() {
  playEffect("click", settings);

  const availableQuestionTypes = getAvailableQuestionTypes(settings);

  if (availableQuestionTypes.length === 0) {
    speech.textContent = "Välj fler saker i vuxenläget.";
    instruction.textContent = "För få saker att leka med";
    speak("Välj fler saker i vuxenläget.", "settings_need_more_items", settings);
    return;
  }

  if (settings.selectedMode !== "mixed" && !availableQuestionTypes.includes(settings.selectedMode)) {
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

  clearBowlItems(bowlItems);
  startButton.classList.add("hidden");
  modeSelector.classList.add("hidden");
  repeatButton.classList.remove("hidden");

  setMonsterMood("hungry");
  nextRound();
}

function getUnavailableModeMessage(mode) {
  if (mode === "color") return "Välj fler tydliga färger i vuxenläget.";
  if (mode === "category") return "Välj minst två kategorier i vuxenläget.";
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

  const questionResult = createQuestion(settings, lastAnswerId);
  currentQuestion = questionResult.question;
  lastAnswerId = questionResult.lastAnswerId;

  instruction.textContent = `Runda ${currentRound} av ${settings.maxRounds}`;
  speech.textContent = currentQuestion.prompt;

  renderRoundProgress(progress, settings.maxRounds, currentRound);
  renderChoiceButtons(choices, currentQuestion, currentQuestion.options, handleChoice);
  speak(currentQuestion.prompt, currentQuestion.voiceKey, settings);
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
  renderFoodInBowl(bowlItems, item);
  playEffect("food", settings);
  button.classList.add("correct");
  setMonsterMood("chewing");
  playEffect("correct", settings);

  const feedback = getCorrectFeedback();
  speech.textContent = feedback.text;
  speak(feedback.text, feedback.voiceKey, settings);

  const shouldDance = !dancePauseUsed && correctAnswers >= DANCE_AFTER_CORRECT && currentRound < settings.maxRounds;

  if (shouldDance) {
    dancePauseUsed = true;
    setTimeout(startDancePause, 900);
    return;
  }

  setTimeout(nextRound, 1300);
}

function getCorrectFeedback() {
  const monsterName = getMonsterName();
  const feedbacks = [
    { text: "Mums! Tack!", voiceKey: "correct_mums" },
    { text: "Jättegott!", voiceKey: "correct_good" },
    { text: "Bra matat!", voiceKey: "correct_feeding" },
    { text: `${monsterName} blir glad!`, voiceKey: "correct_happy" },
    { text: "Tack för maten!", voiceKey: "correct_thanks" }
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

  clearChoices(choices);
  instruction.textContent = "Danspaus!";
  speech.textContent = `${monsterName} dansar!`;
  setMonsterMood("dancing");
  playEffect("dance", settings);
  speak(`${monsterName} dansar!`, "dance", settings);

  setTimeout(nextRound, 2200);
}

function endGame() {
  clearChoices(choices);
  clearProgress(progress);
  body.classList.remove("is-playing");

  const childName = getChildName();
  const monsterName = getMonsterName();
  const endMessage = childName
    ? `Nu är ${monsterName} mätt. Bra jobbat, ${childName}!`
    : `Nu är ${monsterName} mätt. Tack för maten!`;

  setMonsterMood("full");
  playEffect("end", settings);
  instruction.textContent = "Bra jobbat!";
  speech.textContent = endMessage;
  speak(endMessage, "end", settings);

  startButton.textContent = "Spela igen";
  startButton.classList.remove("hidden");
  modeSelector.classList.remove("hidden");
  repeatButton.classList.remove("hidden");
}

function setMonsterMood(mood) {
  renderMonsterMood(monster, mood, getMonsterName());
}

function getChildName() {
  return readChildName(settings);
}

function getMonsterName() {
  return readMonsterName(settings);
}

function showModeIntro() {
  renderModeIntro({
    instructionElement: instruction,
    speechElement: speech,
    selectedMode: settings.selectedMode,
    childName: getChildName(),
    monsterName: getMonsterName()
  });
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
  clearBowlItems(bowlItems);
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
  renderTitle(gameTitle, getMonsterName());
}

function showSettingsMessage(message) {
  renderSettingsMessage(settingsMessage, message);
}

function updateOnlineStatus() {
  appStatus.textContent = navigator.onLine ? "Redo att leka" : "Offline-läge";
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
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .catch(() => {
        appStatus.textContent = "Offline-stöd kunde inte starta";
      });
  });
}
