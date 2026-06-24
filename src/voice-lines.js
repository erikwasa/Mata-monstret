import { CATEGORY_INFO, COLOR_INFO, items } from "./data.js";
import {
  CHILD_NAME_OPTIONS,
  MONSTER_NAME_OPTIONS,
  getPresetNameOptions
} from "./name-options.js";

const VOICE_PATH_PREFIX = "./audio/voice";

function createVoiceLine(key, text, group) {
  return {
    key,
    text,
    group,
    path: `${VOICE_PATH_PREFIX}/${key}.mp3`
  };
}

const itemVoiceLines = Object.fromEntries(
  items.map((item) => {
    const key = `give_${item.id}`;

    return [key, createVoiceLine(key, `Ge mig ${item.name}!`, "items")];
  })
);

const categoryVoiceLines = Object.fromEntries(
  Object.entries(CATEGORY_INFO).map(([categoryKey, category]) => {
    const key = category.voiceKey;

    return [key, createVoiceLine(key, category.prompt, `categories/${categoryKey}`)];
  })
);

const colorVoiceLines = Object.fromEntries(
  Object.entries(COLOR_INFO).map(([colorKey, color]) => {
    const key = color.voiceKey;

    return [key, createVoiceLine(key, `Ge mig något ${color.label}!`, `colors/${colorKey}`)];
  })
);

const childNameVoiceLines = Object.fromEntries(
  getPresetNameOptions(CHILD_NAME_OPTIONS).map((option) =>
    [option.voiceKey, createVoiceLine(option.voiceKey, option.name, "names/children")]
  )
);

const monsterNameVoiceLines = Object.fromEntries(
  getPresetNameOptions(MONSTER_NAME_OPTIONS).map((option) =>
    [option.voiceKey, createVoiceLine(option.voiceKey, option.name, "names/monsters")]
  )
);

export const STATIC_VOICE_LINES = {
  settings_need_more_items: createVoiceLine(
    "settings_need_more_items",
    "Välj fler saker i vuxenläget.",
    "system"
  ),
  correct_mums: createVoiceLine("correct_mums", "Mums! Tack!", "feedback"),
  correct_good: createVoiceLine("correct_good", "Jättegott!", "feedback"),
  correct_feeding: createVoiceLine("correct_feeding", "Bra matat!", "feedback"),
  correct_happy: createVoiceLine("correct_happy", "Monstret blir glad!", "feedback"),
  correct_thanks: createVoiceLine("correct_thanks", "Tack för maten!", "feedback"),
  try_again: createVoiceLine("try_again", "Nästan! Försök igen.", "feedback"),
  dance: createVoiceLine("dance", "Monstret dansar!", "events"),
  end: createVoiceLine("end", "Nu är monstret mätt. Tack för maten!", "events")
};

export const VOICE_LINES = {
  ...itemVoiceLines,
  ...categoryVoiceLines,
  ...colorVoiceLines,
  ...childNameVoiceLines,
  ...monsterNameVoiceLines,
  ...STATIC_VOICE_LINES
};

export function getVoiceLine(voiceKey) {
  if (!voiceKey) return null;

  return VOICE_LINES[voiceKey] || null;
}

export function getVoiceAssetPath(voiceKey) {
  const voiceLine = getVoiceLine(voiceKey);

  return voiceLine?.path || `${VOICE_PATH_PREFIX}/${voiceKey}.mp3`;
}

export function getVoiceLinesForTts() {
  return Object.values(VOICE_LINES).sort((first, second) =>
    first.key.localeCompare(second.key)
  );
}
