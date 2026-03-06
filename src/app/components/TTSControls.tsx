import { useState } from "react";
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  Square,
  Settings2,
  ChevronDown,
  Gauge,
} from "lucide-react";
import { useTTS } from "./useTTS";
import { motion, AnimatePresence } from "motion/react";

interface TTSControlsProps {
  text: string;
  label?: string;
  compact?: boolean;
}

export function TTSControls({ text, label = "Listen", compact = false }: TTSControlsProps) {
  const {
    toggle,
    stop,
    isSpeaking,
    isPaused,
    voices,
    selectedVoice,
    setSelectedVoice,
    currentRate,
    setCurrentRate,
  } = useTTS();
  const [showSettings, setShowSettings] = useState(false);

  const rateOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  if (compact) {
    return (
      <button
        onClick={() => toggle(text)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all ${
          isSpeaking && !isPaused
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
        }`}
        title={isSpeaking && !isPaused ? "Pause" : isPaused ? "Resume" : "Listen"}
      >
        {isSpeaking && !isPaused ? (
          <>
            <Pause className="w-3 h-3" />
            <span className="sr-only sm:not-sr-only">Pause</span>
          </>
        ) : isPaused ? (
          <>
            <Play className="w-3 h-3" />
            <span className="sr-only sm:not-sr-only">Resume</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3 h-3" />
            <span className="sr-only sm:not-sr-only">{label}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-gradient-to-r from-primary/5 to-accent/30 rounded-xl px-4 py-2.5 border border-primary/10">
        {/* Play/Pause */}
        <button
          onClick={() => toggle(text)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isSpeaking && !isPaused
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          {isSpeaking && !isPaused ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>

        {/* Stop */}
        {isSpeaking && (
          <button
            onClick={stop}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Waveform visualization */}
        <div className="flex items-center gap-0.5 flex-1 px-2">
          {isSpeaking && !isPaused ? (
            Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary/40 rounded-full"
                animate={{
                  height: [4, Math.random() * 16 + 4, 4],
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.05,
                }}
              />
            ))
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                {isPaused ? "Paused" : label}
              </span>
            </>
          )}
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-1">
          <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={currentRate}
            onChange={(e) => setCurrentRate(Number(e.target.value))}
            className="bg-transparent text-xs text-muted-foreground border-none outline-none cursor-pointer pr-1"
          >
            {rateOptions.map((r) => (
              <option key={r} value={r}>
                {r}x
              </option>
            ))}
          </select>
        </div>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="absolute z-20 top-full left-0 right-0 mt-1 bg-card rounded-xl border border-border shadow-lg p-4 overflow-hidden"
          >
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Voice</label>
                <select
                  value={selectedVoice?.name || ""}
                  onChange={(e) => {
                    const v = voices.find((voice) => voice.name === e.target.value);
                    if (v) setSelectedVoice(v);
                  }}
                  className="w-full bg-input-background text-sm rounded-lg border border-border px-3 py-2"
                >
                  {voices
                    .filter((v) => v.lang.startsWith("en"))
                    .map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Speed: {currentRate}x
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={2}
                  step={0.25}
                  value={currentRate}
                  onChange={(e) => setCurrentRate(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Inline TTS button for individual text elements */
export function InlineTTSButton({ text }: { text: string }) {
  const { toggle, isSpeaking, isPaused } = useTTS();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle(text);
      }}
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-all ${
        isSpeaking && !isPaused
          ? "bg-primary text-primary-foreground"
          : "bg-transparent text-muted-foreground hover:bg-primary/10 hover:text-primary"
      }`}
      title="Listen to this text"
    >
      {isSpeaking && !isPaused ? (
        <Pause className="w-3 h-3" />
      ) : (
        <Volume2 className="w-3 h-3" />
      )}
    </button>
  );
}
