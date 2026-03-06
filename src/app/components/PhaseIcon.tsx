/**
 * PhaseIcon — Centralized 5Rs phase icon component
 *
 * Uses brand icon assets for all five phases.
 *
 * Asset mapping:
 *   Root       → d4082f51… (plant with roots)
 *   Regulate   → 80b12299… (hands cradling plant with roots)
 *   Reflect    → 97f5d9bd… (head with leaf / thought bubbles — introspection)
 *   Restore    → d1d90c77… (leaves with radiant light — renewal)
 *   Reconnect  → 994430be… (two faces with heart & growing plant)
 */

import rootIcon from "figma:asset/d4082f517d888310790b6ba55649de5b4495e42a.png";
import regulateIcon from "figma:asset/80b122995af3c6ba8f50b872adae3c892699e1ca.png";
import reflectIcon from "figma:asset/97f5d9bd4c328aedf7e07443f890d06401ccd697.png";
import restoreIcon from "figma:asset/d1d90c77434f638109ff656a22165c8e60b881a5.png";
import reconnectIcon from "figma:asset/994430be09302c9f3d93db524829bcf8847611c9.png";

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
  /** Wrap icon in a circular background */
  withBg?: boolean;
  /** Background color override (CSS color string) */
  bgColor?: string;
}

/**
 * Renders the brand icon for a given 5Rs phase.
 * Falls back to emoji if no asset is mapped.
 */
export function PhaseIcon({ phase, size = 32, className = "", style, withBg, bgColor }: PhaseIconProps) {
  const asset = PHASE_ASSET[phase];

  const inner = asset ? (
    <img
      src={asset}
      alt={`${phase} phase icon`}
      width={size}
      height={size}
      className={`object-contain ${withBg ? "" : className}`}
      style={{ width: size, height: size, ...(withBg ? {} : style) }}
    />
  ) : (
    <span
      className={withBg ? "" : className}
      style={{ fontSize: size * 0.7, lineHeight: `${size}px`, display: "inline-block", width: size, height: size, textAlign: "center", ...(withBg ? {} : style) }}
      role="img"
      aria-label={`${phase} phase`}
    >
      {PHASE_EMOJI[phase] || "🌱"}
    </span>
  );

  if (withBg) {
    const bg = bgColor || PHASE_HEX[phase] || "#082A19";
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full ${className}`}
        style={{ width: size + 16, height: size + 16, background: bg, ...style }}
      >
        {inner}
      </div>
    );
  }

  return inner;
}

/** Small inline variant for lists / badges */
export function PhaseIconSmall({ phase, size = 16 }: { phase: string; size?: number }) {
  return <PhaseIcon phase={phase} size={size} />;
}
