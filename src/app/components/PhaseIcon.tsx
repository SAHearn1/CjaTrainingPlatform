/**
 * PhaseIcon — Centralized 5Rs phase icon component
 *
 * Uses brand icon assets for all five phases.
 *
 * Asset mapping:
 *   Root       → phase-root.png (plant with roots)
 *   Regulate   → phase-regulate.png (hands cradling plant with roots)
 *   Reflect    → phase-reflect.png (head with leaf / thought bubbles — introspection)
 *   Restore    → phase-restore.png (leaves with radiant light — renewal)
 *   Reconnect  → phase-reconnect.png (two faces with heart & growing plant)
 */

import rootIcon from "@/assets/phase-root.png";
import regulateIcon from "@/assets/phase-regulate.png";
import reflectIcon from "@/assets/phase-reflect.png";
import restoreIcon from "@/assets/phase-restore.png";
import reconnectIcon from "@/assets/phase-reconnect.png";

/** Phase → brand icon asset */
const PHASE_ASSET: Record<string, string | null> = {
  Root: rootIcon,
  Regulate: regulateIcon,
  Reflect: reflectIcon,
  Restore: restoreIcon,
  Reconnect: reconnectIcon,
};

/** Emoji fallbacks for phases without brand icons */
const PHASE_EMOJI: Record<string, string> = {};

/** Brand hex colors per 5Rs phase */
export const PHASE_HEX: Record<string, string> = {
  Root: "#0D3B22",
  Regulate: "#1C4D36",
  Reflect: "#1E3A5F",
  Restore: "#5C3200",
  Reconnect: "#3A1550",
};

/** Utility: hex to rgba with alpha */
export function hexAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Ordered phase names */
export const PHASE_NAMES = ["Root", "Regulate", "Reflect", "Restore", "Reconnect"] as const;

interface PhaseIconProps {
  /** Phase name (Root, Regulate, Reflect, Restore, Reconnect) */
  phase: string;
  /** Size in px (default 32) */
  size?: number;
  /** Extra class names */
  className?: string;
  /** Extra inline styles */
  style?: React.CSSProperties;
}

/**
 * Renders the brand icon for a given 5Rs phase.
 * Falls back to emoji if no asset is mapped.
 */
export function PhaseIcon({ phase, size = 32, className = "", style }: PhaseIconProps) {
  const asset = PHASE_ASSET[phase];

  if (asset) {
    return (
      <img
        src={asset}
        alt={`${phase} phase icon`}
        width={size}
        height={size}
        className={`object-contain ${className}`}
        style={{ width: size, height: size, ...style }}
      />
    );
  }

  // Emoji fallback
  const emoji = PHASE_EMOJI[phase] || "🌱";
  return (
    <span
      className={className}
      style={{ fontSize: size * 0.7, lineHeight: `${size}px`, display: "inline-block", width: size, height: size, textAlign: "center", ...style }}
      role="img"
      aria-label={`${phase} phase`}
    >
      {emoji}
    </span>
  );
}

/** Small inline variant for lists / badges */
export function PhaseIconSmall({ phase, size = 16 }: { phase: string; size?: number }) {
  return <PhaseIcon phase={phase} size={size} />;
}
