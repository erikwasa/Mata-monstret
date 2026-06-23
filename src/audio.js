import { EFFECT_PATHS } from "./data.js";
import { getVoiceAssetPath } from "./voice-lines.js";

let lastSpokenText = "";
let lastVoiceKey = "";

export function setupBrowserVoice() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }
}

export async function speak(text, voiceKey = "", settings) {
  lastSpokenText = text;
  lastVoiceKey = voiceKey;

  if (settings.voiceMode === "off") return;

  stopBrowserVoice();

  if (settings.voiceMode === "custom") {
    const customVoicePlayed = await playCustomVoice(voiceKey);

    if (customVoicePlayed) {
      return;
    }

    speakWithBrowserVoice(text);
    return;
  }

  speakWithBrowserVoice(text);
}

export function speakWithBrowserVoice(text) {
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

export function stopBrowserVoice() {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
}

export function repeatSpeech(fallbackText, settings) {
  if (!lastSpokenText) {
    speak(fallbackText, "", settings);
    return;
  }

  speak(lastSpokenText, lastVoiceKey, settings);
}

export async function playCustomVoice(voiceKey) {
  if (!voiceKey) return false;

  return playAudioFile(getVoiceAssetPath(voiceKey), 1);
}

export function playEffect(effectKey, settings) {
  if (!settings.effectEnabled) return Promise.resolve(false);

  const source = EFFECT_PATHS[effectKey];

  if (!source) return Promise.resolve(false);

  return playAudioFile(source, 0.9);
}

export function playAudioFile(source, volume = 1) {
  return new Promise((resolve) => {
    const audio = new Audio(source);
    let settled = false;

    audio.preload = "auto";
    audio.volume = volume;

    const finish = (result) => {
      if (settled) return;

      settled = true;
      resolve(result);
    };

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
