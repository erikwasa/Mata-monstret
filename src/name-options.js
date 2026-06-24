export const CUSTOM_NAME_VALUE = "custom";
export const NO_CHILD_NAME_VALUE = "none";

export const CHILD_NAME_OPTIONS = [
  {
    value: NO_CHILD_NAME_VALUE,
    label: "Inget namn",
    name: "",
    voiceKey: ""
  },
  {
    value: "fideli",
    label: "Fideli",
    name: "Fideli",
    voiceKey: "name_child_fideli"
  },
  {
    value: "erik",
    label: "Erik",
    name: "Erik",
    voiceKey: "name_child_erik"
  },
  {
    value: "oskar",
    label: "Oskar",
    name: "Oskar",
    voiceKey: "name_child_oskar"
  },
  {
    value: CUSTOM_NAME_VALUE,
    label: "Eget namn",
    name: "",
    voiceKey: ""
  }
];

export const MONSTER_NAME_OPTIONS = [
  {
    value: "mamma",
    label: "Mamma",
    name: "Mamma",
    voiceKey: "name_monster_mamma"
  },
  {
    value: "pappa",
    label: "Pappa",
    name: "Pappa",
    voiceKey: "name_monster_pappa"
  },
  {
    value: "monstret",
    label: "Monstret",
    name: "Monstret",
    voiceKey: "name_monster_monstret"
  },
  {
    value: "moa",
    label: "Moa",
    name: "Moa",
    voiceKey: "name_monster_moa"
  },
  {
    value: CUSTOM_NAME_VALUE,
    label: "Eget namn",
    name: "",
    voiceKey: ""
  }
];

export function getNameOption(options, value) {
  return options.find((option) => option.value === value) || null;
}

export function getPresetNameOptions(options) {
  return options.filter((option) => option.voiceKey);
}

export function getNameOptionByName(options, name) {
  const normalizedName = normalizeName(name).toLowerCase();

  if (!normalizedName) return null;

  return options.find((option) => option.name.toLowerCase() === normalizedName) || null;
}

export function normalizeName(name) {
  return (name || "").trim();
}
