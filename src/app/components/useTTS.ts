import { useState, useEffect, useCallback, useRef } from "react";

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

export function useTTS(options: TTSOptions = {}) {
  const { rate = 1, pitch = 1, volume = 1 } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [currentRate, setCurrentRate] = useState(rate);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (!selectedVoice && available.length > 0) {
        const english = available.find(
          (v) => v.lang.startsWith("en") && v.name.includes("Google")
        ) || available.find((v) => v.lang.startsWith("en")) || available[0];
        setSelectedVoice(english);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = currentRate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [currentRate, pitch, volume, selectedVoice]
  );

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const toggle = useCallback(
    (text: string) => {
      if (isSpeaking && !isPaused) {
        pause();
      } else if (isPaused) {
        resume();
      } else {
        speak(text);
      }
    },
    [isSpeaking, isPaused, speak, pause, resume]
  );

  return {
    speak,
    pause,
    resume,
    stop,
    toggle,
    isSpeaking,
    isPaused,
    voices,
    selectedVoice,
    setSelectedVoice,
    currentRate,
    setCurrentRate,
  };
}
