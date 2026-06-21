const items = [
  { name: "banan", emoji: "🍌", type: "mat" },
  { name: "äpple", emoji: "🍎", type: "mat" },
  { name: "morot", emoji: "🥕", type: "mat" },
  { name: "boll", emoji: "⚽", type: "sak" },
  { name: "sko", emoji: "👟", type: "sak" },
  { name: "bil", emoji: "🚗", type: "sak" },
  { name: "katt", emoji: "🐱", type: "djur" },
  { name: "hund", emoji: "🐶", type: "djur" }
];

const monster = document.getElementById("monster");
const speech = document.getElementById("speech");
const instruction = document.getElementById("instruction");
const choices = document.getElementById("choices");
const startButton = document.getElementById("startButton");

let currentAnswer = null;
let round = 0;

startButton.addEventListener("click", startGame);

function startGame() {
  round = 0;
  startButton.classList.add("hidden");
  nextRound();
}

function nextRound() {
  round += 1;

  monster.textContent = "😋";
  monster.className = "monster";

  const answer = getRandomItem(items);
  currentAnswer = answer;

  const options = createOptions(answer, items, 3);

  instruction.textContent = `Runda ${round}`;
  speech.textContent = `Ge mig ${answer.name}!`;

  renderChoices(options);
  speak(`Ge mig ${answer.name}`);
}

function renderChoices(options) {
  choices.innerHTML = "";

  options.forEach((item) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.innerHTML = `
      <span>${item.emoji}</span>
      <span class="choice-label">${item.name}</span>
    `;

    button.addEventListener("click", () => handleChoice(item));

    choices.appendChild(button);
  });
}

function handleChoice(item) {
  if (item.name === currentAnswer.name) {
    monster.textContent = "🥳";
    monster.className = "monster happy";
    speech.textContent = "Mums! Tack!";
    speak("Mums! Tack!");

    setTimeout(nextRound, 1300);
  } else {
    monster.textContent = "🤔";
    monster.className = "monster sad";
    speech.textContent = `Oj! Det där var ${item.name}. Försök igen.`;
    speak(`Oj! Det där var ${item.name}. Försök igen.`);

    setTimeout(() => {
      monster.textContent = "😋";
      monster.className = "monster";
      speech.textContent = `Ge mig ${currentAnswer.name}!`;
    }, 1300);
  }
}

function getRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function createOptions(answer, allItems, count) {
  const wrongOptions = allItems.filter((item) => item.name !== answer.name);
  const shuffledWrong = shuffle(wrongOptions);
  const options = [answer, ...shuffledWrong.slice(0, count - 1)];

  return shuffle(options);
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "sv-SE";
  utterance.rate = 0.85;
  utterance.pitch = 1.2;

  window.speechSynthesis.speak(utterance);
}