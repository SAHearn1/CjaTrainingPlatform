import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Film,
  Eye,
  MessageCircle,
  MapPin,
  Ear,
  ChevronRight,
  Music,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { VignetteScene, VignetteCharacter } from "./data";
import { useTTS } from "./useTTS";
import { useAmbientAudio } from "./useAmbientAudio";

interface VideoVignetteProps {
  scenes: VignetteScene[];
  title: string;
  onComplete: () => void;
  /** When true, renders a smaller version suitable for learning sections */
  compact?: boolean;
}

const MOOD_GRADIENTS: Record<string, string> = {
  tense: "from-slate-900 via-red-950/40 to-slate-900",
  calm: "from-slate-800 via-teal-950/40 to-slate-800",
  urgent: "from-slate-900 via-amber-950/50 to-slate-900",
  emotional: "from-slate-900 via-indigo-950/40 to-slate-900",
  neutral: "from-slate-800 via-slate-900 to-slate-800",
  hopeful: "from-slate-800 via-emerald-950/40 to-slate-800",
};

const MOOD_ACCENT: Record<string, string> = {
  tense: "text-red-400",
  calm: "text-teal-400",
  urgent: "text-amber-400",
  emotional: "text-indigo-400",
  neutral: "text-slate-400",
  hopeful: "text-emerald-400",
};

const MOOD_BORDER: Record<string, string> = {
  tense: "border-red-500/30",
  calm: "border-teal-500/30",
  urgent: "border-amber-500/30",
  emotional: "border-indigo-500/30",
  neutral: "border-slate-500/30",
  hopeful: "border-emerald-500/30",
};

const MOOD_BG: Record<string, string> = {
  tense: "bg-red-500/10",
  calm: "bg-teal-500/10",
  urgent: "bg-amber-500/10",
  emotional: "bg-indigo-500/10",
  neutral: "bg-slate-500/10",
  hopeful: "bg-emerald-500/10",
};

const EMOTION_INDICATORS: Record<string, { color: string; pulse: boolean; label: string }> = {
  neutral: { color: "bg-slate-400", pulse: false, label: "Neutral" },
  distressed: { color: "bg-red-400", pulse: true, label: "Distressed" },
  angry: { color: "bg-red-500", pulse: true, label: "Angry" },
  calm: { color: "bg-teal-400", pulse: false, label: "Calm" },
  anxious: { color: "bg-amber-400", pulse: true, label: "Anxious" },
  hopeful: { color: "bg-emerald-400", pulse: false, label: "Hopeful" },
  withdrawn: { color: "bg-indigo-400", pulse: true, label: "Withdrawn" },
  defensive: { color: "bg-orange-400", pulse: true, label: "Defensive" },
  focused: { color: "bg-blue-400", pulse: false, label: "Focused" },
  caring: { color: "bg-pink-400", pulse: false, label: "Caring" },
};

export function VideoVignette({ scenes, title, onComplete, compact = false }: VideoVignetteProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showNarration, setShowNarration] = useState(false);
  const [narrationText, setNarrationText] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const progressRef = useRef<number | null>(null);
  const narrationTimerRef = useRef<number | null>(null);
  const { toggle, stop, isSpeaking } = useTTS();
  const ambientAudio = useAmbientAudio();

  const scene = scenes[currentScene];
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  const elapsedBefore = scenes.slice(0, currentScene).reduce((sum, s) => sum + s.duration, 0);

  // Typewriter narration effect
  const typeNarration = useCallback((text: string) => {
    setNarrationText("");
    setShowNarration(true);
    let i = 0;
    const speed = Math.max(15, (scene.duration * 800) / text.length);
    const type = () => {
      if (i < text.length) {
        setNarrationText(text.slice(0, i + 1));
        i++;
        narrationTimerRef.current = window.setTimeout(type, speed);
      }
    };
    type();
  }, [scene.duration]);

  // Progress animation
  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const startTime = Date.now();
    const duration = scene.duration * 1000;
    const initialProgress = sceneProgress;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(initialProgress + (elapsed / duration) * 100, 100);
      setSceneProgress(progress);

      const overallElapsed = elapsedBefore + (scene.duration * progress / 100);
      setTotalProgress((overallElapsed / totalDuration) * 100);

      if (progress >= 100) {
        if (currentScene < scenes.length - 1) {
          setCurrentScene(prev => prev + 1);
          setSceneProgress(0);
          setShowNarration(false);
          setNarrationText("");
          if (narrationTimerRef.current) clearTimeout(narrationTimerRef.current);
          stop();
        } else {
          setIsPlaying(false);
          setIsComplete(true);
          ambientAudio.stop();
        }
        return;
      }

      progressRef.current = requestAnimationFrame(tick);
    };

    progressRef.current = requestAnimationFrame(tick);

    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [isPlaying, currentScene, scene, scenes, elapsedBefore, totalDuration, isComplete, stop, ambientAudio]);

  // Start narration, TTS, and ambient audio when scene changes while playing
  useEffect(() => {
    if (isPlaying && scene) {
      typeNarration(scene.narration);
      if (ttsEnabled) {
        stop();
        setTimeout(() => toggle(scene.narration), 200);
      }
      // Crossfade ambient audio to match new scene mood
      if (audioEnabled) {
        ambientAudio.crossfade(scene.mood as any);
      }
    }
    return () => {
      if (narrationTimerRef.current) clearTimeout(narrationTimerRef.current);
    };
  }, [currentScene, isPlaying]);

  // Stop ambient audio when component unmounts or stops
  useEffect(() => {
    return () => {
      ambientAudio.stop();
    };
  }, []);

  const handlePlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    if (audioEnabled) {
      ambientAudio.play(scene.mood as any);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    stop();
    ambientAudio.stop();
    if (narrationTimerRef.current) clearTimeout(narrationTimerRef.current);
  };

  const handleSkipScene = () => {
    stop();
    if (narrationTimerRef.current) clearTimeout(narrationTimerRef.current);
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
      setSceneProgress(0);
      setShowNarration(false);
      setNarrationText("");
    } else {
      setIsPlaying(false);
      setIsComplete(true);
      setTotalProgress(100);
      ambientAudio.stop();
    }
  };

  const handleToggleTTS = () => {
    if (ttsEnabled) stop();
    setTtsEnabled(!ttsEnabled);
  };

  const handleToggleAudio = () => {
    if (audioEnabled) {
      ambientAudio.stop();
    } else if (isPlaying) {
      ambientAudio.play(scene.mood as any);
    }
    setAudioEnabled(!audioEnabled);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const currentTime = elapsedBefore + (scene.duration * sceneProgress / 100);

  return (
    <div className={`rounded-2xl overflow-hidden border border-border shadow-xl bg-black ${compact ? "max-w-lg" : ""}`}>
      {/* Cinema header bar */}
      <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-700/50">
        <Film className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs text-slate-400 flex-1 truncate">
          {compact ? title : `Vignette — ${title}`}
        </span>
        <span className="text-[10px] text-slate-500">
          Scene {currentScene + 1}/{scenes.length}
        </span>
      </div>

      {/* Main viewport */}
      <div className={`relative ${compact ? "aspect-[2/1]" : "aspect-video"} bg-gradient-to-br ${MOOD_GRADIENTS[scene.mood]} overflow-hidden`}>
        {/* Ambient particles */}
        <AmbientParticles mood={scene.mood} isPlaying={isPlaying} />

        {/* Scene content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col"
          >
            {/* Setting banner */}
            {hasStarted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-3 left-3 right-3 z-10"
              >
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${MOOD_BG[scene.mood]} backdrop-blur-sm border ${MOOD_BORDER[scene.mood]}`}>
                  <MapPin className={`w-3 h-3 ${MOOD_ACCENT[scene.mood]}`} />
                  <span className="text-[11px] text-white/80">{scene.setting}</span>
                </div>
              </motion.div>
            )}

            {/* Characters */}
            {hasStarted && (
              <div className="flex-1 flex items-end justify-center px-4 pb-4 gap-3">
                {scene.characters.map((char, i) => (
                  <CharacterDisplay
                    key={`${currentScene}-${i}`}
                    character={char}
                    index={i}
                    total={scene.characters.length}
                    isPlaying={isPlaying}
                    compact={compact}
                  />
                ))}
              </div>
            )}

            {/* Play overlay (initial state) */}
            {!hasStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <button
                    onClick={handlePlay}
                    className={`${compact ? "w-14 h-14" : "w-20 h-20"} rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-105 mb-3 mx-auto`}
                  >
                    <Play className={`${compact ? "w-6 h-6" : "w-8 h-8"} text-white ml-0.5`} />
                  </button>
                  <p className="text-white/90 text-sm mb-1">{compact ? "Watch Intro" : "Watch Vignette"}</p>
                  <p className="text-white/50 text-xs">{scenes.length} scenes · {formatTime(totalDuration)}</p>
                </motion.div>
              </div>
            )}

            {/* Sound cue indicator */}
            {hasStarted && scene.soundCue && isPlaying && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute top-3 right-3 z-10"
              >
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                  <Ear className="w-3 h-3 text-white/50" />
                  <span className="text-[10px] text-white/50 italic">{scene.soundCue}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Narration overlay (bottom) */}
        <AnimatePresence>
          {showNarration && hasStarted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 z-20"
            >
              <div className={`bg-gradient-to-t from-black/90 via-black/70 to-transparent ${compact ? "pt-6 pb-3 px-4" : "pt-12 pb-4 px-5"}`}>
                <p className={`text-white/95 ${compact ? "text-xs" : "text-sm"} leading-relaxed`}>
                  {narrationText}
                  {narrationText.length < scene.narration.length && (
                    <span className="inline-block w-0.5 h-4 bg-white/70 ml-0.5 animate-pulse align-middle" />
                  )}
                </p>
                {!compact && scene.ambientDetail && narrationText.length >= scene.narration.length * 0.8 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/40 text-xs mt-2 italic flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> {scene.ambientDetail}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls bar */}
      <div className="bg-slate-900 px-3 py-2.5 space-y-1.5">
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-8 text-right tabular-nums">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden relative cursor-pointer group">
            {scenes.map((_, i) => {
              const pos = (scenes.slice(0, i).reduce((sum, sc) => sum + sc.duration, 0) / totalDuration) * 100;
              if (i === 0) return null;
              return (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-slate-500/50 z-10"
                  style={{ left: `${pos}%` }}
                />
              );
            })}
            <motion.div
              className="h-full bg-primary rounded-full relative"
              style={{ width: `${totalProgress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </div>
          <span className="text-[10px] text-slate-400 w-8 tabular-nums">
            {formatTime(totalDuration)}
          </span>
        </div>

        {/* Control buttons */}
        <div className="flex items-center gap-1">
          {/* Play/Pause */}
          {!isComplete ? (
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-slate-700/50 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs hover:opacity-90 flex items-center gap-1.5 transition-opacity"
            >
              Continue <ChevronRight className="w-3 h-3" />
            </button>
          )}

          {/* Skip scene */}
          {!isComplete && (
            <button
              onClick={handleSkipScene}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="Skip to next scene"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          )}

          <div className="flex-1" />

          {/* Ambient audio toggle */}
          <button
            onClick={handleToggleAudio}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              audioEnabled
                ? "text-amber-400 hover:bg-slate-700/50"
                : "text-slate-500 hover:bg-slate-700/50"
            }`}
            title={audioEnabled ? "Mute ambient audio" : "Enable ambient audio"}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* TTS toggle */}
          <button
            onClick={handleToggleTTS}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              ttsEnabled
                ? "text-primary hover:bg-slate-700/50"
                : "text-slate-500 hover:bg-slate-700/50"
            }`}
            title={ttsEnabled ? "Mute narration" : "Enable narration"}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mood indicator */}
          <div className={`px-2 py-0.5 rounded text-[10px] ${MOOD_BG[scene.mood]} ${MOOD_ACCENT[scene.mood]} border ${MOOD_BORDER[scene.mood]}`}>
            {scene.mood.charAt(0).toUpperCase() + scene.mood.slice(1)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Character Display ---------- */

function CharacterDisplay({
  character,
  index,
  total,
  isPlaying,
  compact = false,
}: {
  character: VignetteCharacter;
  index: number;
  total: number;
  isPlaying: boolean;
  compact?: boolean;
}) {
  const emotion = EMOTION_INDICATORS[character.emotion] || EMOTION_INDICATORS.neutral;
  const positionClass =
    total === 1
      ? "mx-auto"
      : character.position === "left"
      ? "mr-auto"
      : character.position === "right"
      ? "ml-auto"
      : "mx-auto";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.15, type: "spring", damping: 20 }}
      className={`flex flex-col items-center ${compact ? "max-w-[150px]" : "max-w-[200px]"} ${positionClass}`}
    >
      {/* Dialogue bubble */}
      {character.dialogue && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.8 + index * 0.2 }}
          className="mb-2 relative"
        >
          <div className={`bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-3 py-2 ${compact ? "max-w-[140px]" : "max-w-[180px]"}`}>
            <div className="flex items-start gap-1.5">
              <MessageCircle className="w-3 h-3 text-white/40 mt-0.5 shrink-0" />
              <p className="text-xs text-white/90 leading-relaxed">{character.dialogue}</p>
            </div>
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/10 border-r border-b border-white/15 rotate-45" />
        </motion.div>
      )}

      {/* Avatar */}
      <div className="relative">
        <motion.div
          animate={
            isPlaying && character.action
              ? { y: [0, -3, 0] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`${compact ? "w-11 h-11 text-xl" : "w-14 h-14 text-2xl"} rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center shadow-lg`}
        >
          {character.avatar}
        </motion.div>
        {/* Emotion dot */}
        <div className="absolute -bottom-0.5 -right-0.5">
          <div className={`${compact ? "w-3 h-3" : "w-4 h-4"} rounded-full ${emotion.color} border-2 border-slate-900 ${emotion.pulse ? "animate-pulse" : ""}`} />
        </div>
      </div>

      {/* Name + role */}
      <div className="mt-1.5 text-center">
        <p className="text-white text-xs">{character.name}</p>
        {!compact && <p className="text-white/40 text-[10px]">{character.role}</p>}
      </div>

      {/* Action indicator */}
      {!compact && character.action && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 + index * 0.2 }}
          className="text-white/30 text-[10px] italic mt-1 text-center max-w-[160px] leading-tight"
        >
          *{character.action}*
        </motion.p>
      )}
    </motion.div>
  );
}

/* ---------- Ambient Particles ---------- */

function AmbientParticles({ mood, isPlaying }: { mood: string; isPlaying: boolean }) {
  const [particleInitX] = useState<number[]>(() => Array.from({ length: 12 }, () => Math.random() * 100));
  const [particleInitY] = useState<number[]>(() => Array.from({ length: 12 }, () => Math.random() * 100));
  const [particleAnimY1] = useState<number[]>(() => Array.from({ length: 12 }, () => 50 + Math.random() * 50));
  const [particleAnimY2] = useState<number[]>(() => Array.from({ length: 12 }, () => Math.random() * 40));
  const [particleDuration] = useState<number[]>(() => Array.from({ length: 12 }, () => 4 + Math.random() * 4));

  if (!isPlaying) return null;

  const particleColor =
    mood === "tense"
      ? "bg-red-400/20"
      : mood === "urgent"
      ? "bg-amber-400/20"
      : mood === "emotional"
      ? "bg-indigo-400/20"
      : mood === "hopeful"
      ? "bg-emerald-400/20"
      : "bg-white/10";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${particleColor}`}
          initial={{
            x: `${particleInitX[i]}%`,
            y: `${particleInitY[i]}%`,
            opacity: 0,
          }}
          animate={{
            y: [`${particleAnimY1[i]}%`, `${particleAnimY2[i]}%`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particleDuration[i],
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
