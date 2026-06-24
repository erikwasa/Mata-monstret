import { EFFECT_PATHS } from "./data.js";
import { getVoiceAssetPath } from "./voice-lines.js";

let lastSpokenText = "";
let lastVoiceKey = "";
let lastSpeechParts = null;
let activeSpeechRun = 0;
let currentVoiceAudio = null;
let currentVoiceCancel = null;

export function setupBrowserVoice() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }
}

export async function speak(text, voiceKey = "", settings) {
  lastSpokenText = text;
  lastVoiceKey = voiceKey;
  lastSpeechParts = null;

  if (settings.voiceMode === "off") return;

  const speechRun = startSpeechRun();

  if (settings.voiceMode === "custom") {
    const customVoicePlayed = await playCustomVoice(voiceKey);

    if (customVoicePlayed || speechRun !== activeSpeechRun) {
      return;
    }

    speakWithBrowserVoice(text);
    return;
  }

  speakWithBrowserVoice(text);
}

export async function speakParts(parts, settings, fallbackText = "") {
  const speechParts = parts.filter((part) => part?.text || part?.voiceKey);
  const text = fallbackText || speechParts.map((part) => part.text || "").join("");

  lastSpokenText = text;
  lastVoiceKey = "";
  lastSpeechParts = speechParts;

  if (settings.voiceMode === "off") return;

  const speechRun = startSpeechRun();

  if (settings.voiceMode !== "custom") {
    speakWithBrowserVoice(text);
    return;
  }

  for (const part of speechParts) {
    if (speechRun !== activeSpeechRun) return;

    if (part.voiceKey) {
      const customVoicePlayed = await playCustomVoice(part.voiceKey);

      if (customVoicePlayed || speechRun !== activeSpeechRun) {
        continue;
      }
    }

    if (part.text) {
      await speakWithBrowserVoice(part.text);
    }
  }
}

function startSpeechRun() {
  activeSpeechRun += 1;
  stopVoiceAudio();
  stopBrowserVoice();

  return activeSpeechRun;
}

export function speakWithBrowserVoice(text) {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window) || !text) {
      resolve(false);
      return;
    }

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

    utterance.addEventListener("end", () => resolve(true), { once: true });
    utterance.addEventListener("error", () => resolve(false), { once: true });

    window.speechSynthesis.speak(utterance);
  });
}

export function stopBrowserVoice() {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
}

function stopVoiceAudio() {
  if (currentVoiceAudio) {
    currentVoiceAudio.pause();
    currentVoiceAudio.currentTime = 0;
    currentVoiceAudio = null;
  }

  if (currentVoiceCancel) {
    currentVoiceCancel(false);
    currentVoiceCancel = null;
  }
}

export function repeatSpeech(fallbackText, settings) {
  if (lastSpeechParts) {
    speakParts(lastSpeechParts, settings, lastSpokenText || fallbackText);
    return;
  }

  if (!lastSpokenText) {
    speak(fallbackText, "", settings);
    return;
  }

  speak(lastSpokenText, lastVoiceKey, settings);
}

export async function playCustomVoice(voiceKey) {
  if (!voiceKey) return false;

  return playAudioFile(getVoiceAssetPath(voiceKey), 1, "voice");
}

export function playEffect(effectKey, settings) {
  if (!settings.effectEnabled) return Promise.resolve(false);

  const source = EFFECT_PATHS[effectKey];

  if (!source) return Promise.resolve(false);

  return playAudioFile(source, 0.9);
}

export function playAudioFile(source, volume = 1, channel = "effect") {
  return new Promise((resolve) => {
    const audio = new Audio(source);
    let settled = false;

    audio.preload = "auto";
    audio.volume = volume;

    const finish = (result) => {
      if (settled) return;

      settled = true;

      if (channel === "voice" && currentVoiceAudio === audio) {
        currentVoiceAudio = null;
        currentVoiceCancel = null;
      }

      resolve(result);
    };

    if (channel === "voice") {
      stopVoiceAudio();
      currentVoiceAudio = audio;
      currentVoiceCancel = finish;
    }

    audio.addEventListener("ended", () => finish(true), { once: true });
    audio.addEventListener("error", () => finish(false), { once: true });

    audio.play().catch(() => {
      finish(false);
    });
  });
}

export function testAudio(settings, showMessage) {
  playEffect("correct", settings);
  speak("Mums! Tack!", "correct_mums", settings);
  showMessage("Testar ljud!");
}
