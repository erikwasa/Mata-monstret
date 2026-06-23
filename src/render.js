import { COLOR_INFO } from "./data.js";

export function renderChoices(choicesElement, currentQuestion, options, onChoice) {
  choicesElement.innerHTML = "";
  choicesElement.className = `choices choices-${options.length}`;

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

    button.addEventListener("click", () => onChoice(item, button));

    choicesElement.appendChild(button);
  });
}

export function clearChoices(choicesElement) {
  choicesElement.innerHTML = "";
  choicesElement.className = "choices";
}

export function setChoiceButtonsDisabled(disabled) {
  const buttons = document.querySelectorAll(".choice-button");

  buttons.forEach((button) => {
    button.disabled = disabled;
  });
}

export function renderProgress(progressElement, maxRounds, currentRound) {
  progressElement.innerHTML = "";

  for (let i = 1; i <= maxRounds; i += 1) {
    const dot = document.createElement("span");

    dot.className = "progress-dot";

    if (i < currentRound) {
      dot.classList.add("done");
    }

    progressElement.appendChild(dot);
  }
}

export function clearProgress(progressElement) {
  progressElement.innerHTML = "";
}

export function addFoodToBowl(bowlItemsElement, item) {
  const food = document.createElement("span");

  food.className = "bowl-food";
  food.textContent = item.emoji || "⭐";

  bowlItemsElement.appendChild(food);
}

export function clearBowl(bowlItemsElement) {
  bowlItemsElement.innerHTML = "";
}

export function setMonsterMood(monsterElement, mood, monsterName) {
  monsterElement.className = `monster monster-${mood}`;
  monsterElement.setAttribute("aria-label", `${monsterName} är ${mood}`);
}

export function updateTitle(gameTitleElement, monsterName) {
  gameTitleElement.textContent = `Mata ${monsterName}`;
}

export function showModeIntro({
  instructionElement,
  speechElement,
  selectedMode,
  childName,
  monsterName
}) {
  if (selectedMode === "name") {
    instructionElement.textContent = "Ordläge valt!";
    speechElement.textContent = childName
      ? `${childName}, kan du mata ${monsterName}?`
      : `Kan du mata ${monsterName}?`;
  }

  if (selectedMode === "color") {
    instructionElement.textContent = "Färgläge valt!";
    speechElement.textContent = `${monsterName} vill öva på tydliga färger.`;
  }

  if (selectedMode === "category") {
    instructionElement.textContent = "Kategoriläge valt!";
    speechElement.textContent = `${monsterName} vill sortera saker.`;
  }

  if (selectedMode === "mixed") {
    instructionElement.textContent = "Blandat läge valt!";
    speechElement.textContent = `${monsterName} blandar ord, färger och kategorier.`;
  }
}

export function showSettingsMessage(settingsMessageElement, message) {
  settingsMessageElement.textContent = message;

  setTimeout(() => {
    if (settingsMessageElement.textContent === message) {
      settingsMessageElement.textContent = "";
    }
  }, 1800);
}
