import { useRef, useCallback, useEffect } from "react";

/**
 * Web Audio API ambient tone generator.
 * Creates mood-appropriate generative audio using oscillators and filters.
 * No external audio files required.
 */

type Mood = "tense" | "calm" | "urgent" | "emotional" | "neutral" | "hopeful";

interface MoodProfile {
  /** Base frequencies for layered oscillators */
  frequencies: number[];
  /** Oscillator waveform types */
  waveforms: OscillatorType[];
  /** Gain levels per oscillator (0-1) */
  gains: number[];
  /** LFO rate for subtle volume modulation (Hz) */
  lfoRate: number;
  /** LFO depth (0-1) */
  lfoDepth: number;
  /** Low-pass filter cutoff (Hz) */
  filterCutoff: number;
  /** Master volume (0-1) */
  masterGain: number;
}

const MOOD_PROFILES: Record<Mood, MoodProfile> = {
  tense: {
    frequencies: [110, 138.59, 164.81], // A2, C#3, E3 (A minor feel, slight dissonance)
    waveforms: ["sawtooth", "sine", "triangle"],
    gains: [0.08, 0.05, 0.04],
    lfoRate: 0.15,
    lfoDepth: 0.3,
    filterCutoff: 600,
    masterGain: 0.12,
  },
  calm: {
    frequencies: [174.61, 220, 261.63], // F3, A3, C4 (F major — warm, resolved)
    waveforms: ["sine", "sine", "triangle"],
    gains: [0.06, 0.05, 0.03],
    lfoRate: 0.08,
    lfoDepth: 0.15,
    filterCutoff: 800,
    masterGain: 0.10,
  },
  urgent: {
    frequencies: [146.83, 185, 220], // D3, F#3, A3 (D major — forward momentum)
    waveforms: ["square", "sawtooth", "sine"],
    gains: [0.06, 0.04, 0.05],
    lfoRate: 0.5,
    lfoDepth: 0.4,
    filterCutoff: 1000,
    masterGain: 0.11,
  },
  emotional: {
    frequencies: [130.81, 155.56, 196], // C3, Eb3, G3 (C minor — introspective)
    waveforms: ["sine", "triangle", "sine"],
    gains: [0.07, 0.05, 0.04],
    lfoRate: 0.06,
    lfoDepth: 0.2,
    filterCutoff: 700,
    masterGain: 0.10,
  },
  neutral: {
    frequencies: [196, 246.94], // G3, B3 (simple fifth — unobtrusive)
    waveforms: ["sine", "sine"],
    gains: [0.04, 0.03],
    lfoRate: 0.05,
    lfoDepth: 0.1,
    filterCutoff: 500,
    masterGain: 0.06,
  },
  hopeful: {
    frequencies: [196, 246.94, 293.66, 392], // G3, B3, D4, G4 (G major — bright, open)
    waveforms: ["sine", "triangle", "sine", "sine"],
    gains: [0.06, 0.04, 0.04, 0.02],
    lfoRate: 0.1,
    lfoDepth: 0.15,
    filterCutoff: 1200,
    masterGain: 0.10,
  },
};

const FADE_DURATION = 1.5; // seconds

export function useAmbientAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    oscillators: OscillatorNode[];
    gains: GainNode[];
    lfo: OscillatorNode | null;
    lfoGain: GainNode | null;
    masterGain: GainNode | null;
    filter: BiquadFilterNode | null;
  }>({
    oscillators: [],
    gains: [],
    lfo: null,
    lfoGain: null,
    masterGain: null,
    filter: null,
  });
  const isPlayingRef = useRef(false);
  const currentMoodRef = useRef<Mood | null>(null);

  const ensureContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const teardownNodes = useCallback(() => {
    const nodes = nodesRef.current;
    nodes.oscillators.forEach((osc) => {
      try { osc.stop(); osc.disconnect(); } catch {}
    });
    if (nodes.lfo) {
      try { nodes.lfo.stop(); nodes.lfo.disconnect(); } catch {}
    }
    nodes.gains.forEach((g) => { try { g.disconnect(); } catch {} });
    if (nodes.lfoGain) try { nodes.lfoGain.disconnect(); } catch {}
    if (nodes.masterGain) try { nodes.masterGain.disconnect(); } catch {}
    if (nodes.filter) try { nodes.filter.disconnect(); } catch {}

    nodesRef.current = {
      oscillators: [],
      gains: [],
      lfo: null,
      lfoGain: null,
      masterGain: null,
      filter: null,
    };
  }, []);

  const play = useCallback(
    (mood: Mood) => {
      const ctx = ensureContext();
      const profile = MOOD_PROFILES[mood];
      if (!profile) return;

      // If already playing the same mood, skip
      if (isPlayingRef.current && currentMoodRef.current === mood) return;

      // Teardown any existing nodes
      if (isPlayingRef.current) {
        teardownNodes();
      }

      const now = ctx.currentTime;

      // Master gain with fade-in
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(profile.masterGain, now + FADE_DURATION);

      // Low-pass filter for warmth
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(profile.filterCutoff, now);
      filter.Q.setValueAtTime(0.7, now);

      // LFO for volume modulation
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(profile.lfoRate, now);

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(profile.lfoDepth * profile.masterGain, now);

      lfo.connect(lfoGain);
      lfoGain.connect(masterGain.gain);
      lfo.start(now);

      // Create oscillators
      const oscillators: OscillatorNode[] = [];
      const gains: GainNode[] = [];

      profile.frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = profile.waveforms[i] || "sine";
        osc.frequency.setValueAtTime(freq, now);
        // Slight detuning for richness
        osc.detune.setValueAtTime((i - 1) * 3, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(profile.gains[i] || 0.04, now);

        osc.connect(gain);
        gain.connect(filter);
        osc.start(now);

        oscillators.push(osc);
        gains.push(gain);
      });

      // Signal chain: oscillators → filter → masterGain → destination
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      nodesRef.current = {
        oscillators,
        gains,
        lfo,
        lfoGain,
        masterGain,
        filter,
      };

      isPlayingRef.current = true;
      currentMoodRef.current = mood;
    },
    [ensureContext, teardownNodes]
  );

  const stop = useCallback(() => {
    if (!isPlayingRef.current || !ctxRef.current) return;

    const ctx = ctxRef.current;
    const now = ctx.currentTime;
    const masterGain = nodesRef.current.masterGain;

    if (masterGain) {
      // Fade out before stopping
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(0, now + FADE_DURATION);

      // Schedule teardown after fade
      setTimeout(() => {
        teardownNodes();
        isPlayingRef.current = false;
        currentMoodRef.current = null;
      }, FADE_DURATION * 1000 + 100);
    } else {
      teardownNodes();
      isPlayingRef.current = false;
      currentMoodRef.current = null;
    }
  }, [teardownNodes]);

  const crossfade = useCallback(
    (newMood: Mood) => {
      if (!isPlayingRef.current) {
        play(newMood);
        return;
      }
      if (currentMoodRef.current === newMood) return;

      const ctx = ctxRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;
      const masterGain = nodesRef.current.masterGain;

      if (masterGain) {
        // Fade out current
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(masterGain.gain.value, now);
        masterGain.gain.linearRampToValueAtTime(0, now + FADE_DURATION * 0.7);

        setTimeout(() => {
          teardownNodes();
          isPlayingRef.current = false;
          currentMoodRef.current = null;
          play(newMood);
        }, FADE_DURATION * 700);
      } else {
        play(newMood);
      }
    },
    [play, teardownNodes]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      teardownNodes();
      if (ctxRef.current) {
        try { ctxRef.current.close(); } catch {}
        ctxRef.current = null;
      }
    };
  }, [teardownNodes]);

  return { play, stop, crossfade };
}
