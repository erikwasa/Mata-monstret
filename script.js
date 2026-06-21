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
    id: "car",
    name: "bil",
    emoji: "🚙",
    category: "sak",
    color: "blått"
  },
  {
    id: "teddy",
    name: "nalle",
    emoji: "🧸",
    category: "sak",
    color: "brunt"
  },
  {
    id: "ball",
    name: "boll",
    emoji: "⚽",
    category: "sak",
    color: "vitt"
  },
  {
    id: "frog",
    name: "groda",
    emoji: "🐸",
    category: "djur",
    color: "grönt"
  }
];

const MAX_ROUNDS = 5;
const OPTION_COUNT = 3;

const monster = document.getElementById("monster");
const speech = document.getElementById("speech");
const instruction = document.getElementById("instruction");
const choices = document.getElementById("choices");
const startButton = document.getElementById("startButton");
const repeatButton = document.getElementById("repeatButton");
const progress = document.getElementById("progress");
const modeSelector = document.getElementById("modeSelector");
const modeButtons = document.querySelectorAll(".mode-button");

let selectedMode = "mixed";
let currentQuestion = null;
let currentRound = 0;
let correctAnswers = 0;
let lastAnswerId = null;
let lastSpokenText = "";
let buttonsLocked = false;

startButton.addEventListener("click", startGame);
repeatButton.addEventListener("click", repeatSpeech);

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedMode = button.dataset.mode;

    modeButtons.forEach((modeButton) => {
      modeButton.classList.remove("active");
    });

    button.classList.add("active");

    if (selectedMode === "name") {
      instruction.textContent = "Ordläge valt!";
      speech.textContent = "Jag säger vad jag vill ha.";
    }

    if (selectedMode === "color") {
      instruction.textContent = "Färgläge valt!";
      speech.textContent = "Jag säger vilken färg jag vill ha.";
    }

    if (selectedMode === "mixed") {
      instruction.textContent = "Blandat läge valt!";
      speech.textContent = "Jag blandar ord och färger.";
    }
  });
});

function startGame() {
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
  if (currentRound >= MAX_ROUNDS) {
    endGame();
    return;
  }

  currentRound += 1;
  buttonsLocked = false;

  monster.textContent = "😋";
  monster.className = "monster";

  currentQuestion = createQuestion();

  instruction.textContent = `Runda ${currentRound} av ${MAX_ROUNDS}`;
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

  return createNameQuestion(answer);
}

function getQuestionType() {
  if (selectedMode === "mixed") {
    return Math.random() > 0.5 ? "name" : "color";
  }

  return selectedMode;
}

function createNameQuestion(answer) {
  const wrongOptions = items.filter((item) => item.id !== answer.id);
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
  const wrongOptions = items.filter((item) => item.color !== answer.color);
  const options = createOptions(answer, wrongOptions);

  return {
    type: "color",
    answer,
    targetColor: answer.color,
    prompt: `Ge mig något ${answer.color}!`,
    options,
    isCorrect: (item) => item.color === answer.color
  };
}

function createOptions(answer, wrongOptions) {
  const shuffledWrongOptions = shuffle(wrongOptions);
  const chosenWrongOptions = shuffledWrongOptions.slice(0, OPTION_COUNT - 1);

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

  speech.textContent = "Mums! Tack!";
  speak("Mums! Tack!");

  setTimeout(() => {
    nextRound();
  }, 1300);
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
  }, 1500);
}

function endGame() {
  choices.innerHTML = "";
  progress.innerHTML = "";

  monster.textContent = "🥰";
  monster.className = "monster dancing";

  instruction.textContent = "Bra jobbat!";
  speech.textContent = "Nu är Mumsis mätt. Tack för maten!";

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

  for (let i = 1; i <= MAX_ROUNDS; i += 1) {
    const dot = document.createElement("span");

    dot.className = "progress-dot";

    if (i < currentRound) {
      dot.classList.add("done");
    }

    progress.appendChild(dot);
  }
}

function getRandomAnswer() {
  const possibleAnswers = items.filter((item) => item.id !== lastAnswerId);

  if (possibleAnswers.length === 0) {
    return getRandomItem(items);
  }

  return getRandomItem(possibleAnswers);
}

function getRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function speak(text) {
  lastSpokenText = text;

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