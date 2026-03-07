/**
 * TraceIcon — Centralized TRACE cognitive cycle icon component
 *
 * Uses a single sprite sheet with 10 icons (2 rows x 5 columns).
 * Top row: gold/flat style (fallback)  |  Bottom row: evergreen circular style (primary)
 * Columns: T  R  A  C  E
 *
 * Asset: trace-sprite.png (TRACE icon sprite sheet)
 */

import traceSprite from "@/assets/trace-sprite.png";

export type TraceLetter = "T" | "R" | "A" | "C" | "E";

/** Full labels for each TRACE phase */
export const TRACE_LABELS: Record<TraceLetter, string> = {
  T: "Trigger Recognition",
  R: "Regulate Response",
  A: "Analyze Systematically",
  C: "Contextualize Findings",
  E: "Evaluate & Document",
};

/** Column index for each letter (0-based) */
const COL_INDEX: Record<TraceLetter, number> = {
  T: 0,
  R: 1,
  A: 2,
  C: 3,
  E: 4,
};

/** Ordered list */
export const TRACE_ORDER: TraceLetter[] = ["T", "R", "A", "C", "E"];

/** Brand colors per TRACE letter */
export const TRACE_HEX: Record<TraceLetter, string> = {
  T: "#0D3B22",
  R: "#1C4D36",
  A: "#1E3A5F",
  C: "#5C3200",
  E: "#3A1550",
};

interface TraceIconProps {
  /** Which TRACE letter to display */
  letter: TraceLetter;
  /** Size of the icon in px (default 40) */
  size?: number;
  /** "green" uses the bottom row (evergreen circular, primary), "gold" uses the top row (flat gold, fallback) */
  variant?: "green" | "gold";
  /** Extra class names */
  className?: string;
  /** Extra inline styles */
  style?: React.CSSProperties;
}

/**
 * Renders a single TRACE icon from the sprite sheet.
 */
export function TraceIcon({
  letter,
  size = 40,
  variant = "green",
  className = "",
  style,
}: TraceIconProps) {
  const col = COL_INDEX[letter];
  // Each icon is ~20% of the width, 50% of the height
  // objectPosition offsets: x = col * 20%, y = 0% (gold) or 50% (green)
  const xPercent = col * 25; // 0, 25, 50, 75, 100
  const yPercent = variant === "gold" ? 0 : 100;

  return (
    <div
      className={`overflow-hidden shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        ...style,
      }}
    >
      <img
        src={traceSprite}
        alt={`TRACE ${letter} — ${TRACE_LABELS[letter]}`}
        style={{
          width: size * 5,
          height: size * 2,
          maxWidth: "none",
          objectFit: "cover",
          marginLeft: -(col * size),
          marginTop: variant === "gold" ? 0 : -size,
        }}
      />
    </div>
  );
}

/**
 * Inline small TRACE icon for use in text flows
 */
export function TraceIconSmall({
  letter,
  size = 20,
  variant = "green",
}: {
  letter: TraceLetter;
  size?: number;
  variant?: "green" | "gold";
}) {
  return <TraceIcon letter={letter} size={size} variant={variant} />;
}