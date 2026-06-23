import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getVoiceLinesForTts } from "../src/voice-lines.js";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const command = process.argv[2] || "missing";

function toRepoPath(appPath) {
  return appPath.replace(/^\.\//, "");
}

function hasAudioFile(voiceLine) {
  return existsSync(join(repoRoot, toRepoPath(voiceLine.path)));
}

const rows = getVoiceLinesForTts().map((voiceLine) => ({
  ...voiceLine,
  file: toRepoPath(voiceLine.path),
  exists: hasAudioFile(voiceLine)
}));

function printTable(tableRows) {
  if (tableRows.length === 0) {
    console.log("Inga rader att visa.");
    return;
  }

  const longestKey = Math.max(...tableRows.map((row) => row.key.length));
  const longestGroup = Math.max(...tableRows.map((row) => row.group.length));

  tableRows.forEach((row) => {
    const status = row.exists ? "ok" : "saknas";
    const group = row.group.padEnd(longestGroup, " ");
    const key = row.key.padEnd(longestKey, " ");

    console.log(`${status.padEnd(7, " ")} ${group} ${key} ${row.text}`);
  });
}

function toCsv(tableRows) {
  const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const header = ["key", "group", "text", "file", "exists"].map(escape).join(",");
  const body = tableRows.map((row) =>
    [row.key, row.group, row.text, row.file, row.exists ? "yes" : "no"].map(escape).join(",")
  );

  return [header, ...body].join("\n");
}

function toJson(tableRows) {
  return JSON.stringify(
    tableRows.map(({ key, group, text, file, exists }) => ({ key, group, text, file, exists })),
    null,
    2
  );
}

if (command === "list") {
  printTable(rows);
} else if (command === "missing") {
  const missingRows = rows.filter((row) => !row.exists);
  printTable(missingRows);

  if (missingRows.length > 0) {
    process.exitCode = 1;
  }
} else if (command === "csv") {
  console.log(toCsv(rows));
} else if (command === "json") {
  console.log(toJson(rows));
} else if (command === "tts-input") {
  console.log(toJson(rows.filter((row) => !row.exists)));
} else {
  console.error("Okänt kommando. Använd: list, missing, csv, json eller tts-input.");
  process.exitCode = 1;
}
