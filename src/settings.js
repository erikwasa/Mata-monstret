const STORAGE_KEY = "mata-monstret-settings-v5";
const OLD_STORAGE_KEYS = [
  "mata-monstret-settings-v4",
  "mata-monstret-settings-v3",
  "mata-monstret-settings-v2"
];

export const DEFAULT_SETTINGS = {
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

export function loadSettings() {
  try {
    const savedV5 = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (savedV5) {
      return normalizeSettings({
        ...DEFAULT_SETTINGS,
        ...savedV5
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

export function normalizeSettings(rawSettings) {
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

  if (!Array.isArray(normalized.enabledCategories)) {
    normalized.enabledCategories = DEFAULT_SETTINGS.enabledCategories;
  }

  return normalized;
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function getEnabledCategories(settings) {
  if (!Array.isArray(settings.enabledCategories) || settings.enabledCategories.length === 0) {
    return DEFAULT_SETTINGS.enabledCategories;
  }

  return settings.enabledCategories;
}

export function getChildName(settings) {
  return (settings.childName || "").trim();
}

export function getMonsterName(settings) {
  return (settings.monsterName || "Mumsis").trim();
}
