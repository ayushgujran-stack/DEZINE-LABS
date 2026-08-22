/**
 * DEZINE — Experimental Scroll Typography Engine
 *
 * A cinematic, progress-synced typography system where each word is its own
 * animated element. Driven by a single 0→1 progress value shared with the
 * video frame engine. Scroll velocity adds physical distortion (skew, blur,
 * letter-spacing, drift).
 *
 * Usage:
 *   <ScrollTypography progress={0.42} velocity={0.01} />
 */
import React, { useMemo } from "react";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

type LayoutPosition =
  | "center"
  | "left"
  | "right"
  | "top-left"
  | "bottom-right"
  | "edge"
  | "off-center";

type EmphasisType =
  | "huge"
  | "outline"
  | "serif-italic"
  | "inverted"
  | "clipped"
  | "wide-spacing"
  | "rotation"
  | "mask-reveal"
  | "muted"
  | "gold"
  | null;

type FontFamily = "satoshi" | "serif" | "mono" | "calligraphic";
type WordScale = "hero" | "large" | "medium" | "small" | "tiny";

type MicroPosition = "tl" | "tr" | "bl" | "br" | "ml" | "mr";

interface WordAnimation {
  translateY?: number[]; // in px
  translateX?: number[];
  scale?: number[];
  blur?: number[]; // in px
  opacity?: number[];
  rotate?: number[]; // in deg
  skewX?: number[];
  letterSpacing?: [string, string];
}

interface WordConfig {
  text: string;
  font?: FontFamily;
  scale?: WordScale;
  emphasis?: EmphasisType;
  animation: WordAnimation;
  /** Delay within scene as fraction 0–1 of scene duration */
  delay?: number;
  /** Duration as fraction of scene duration (default: 1.0 - delay) */
  duration?: number;
  inline?: boolean;
}

interface MicroText {
  text: string;
  position: MicroPosition;
  start: number; // local progress 0–1
  end: number;
}

interface Scene {
  id: string;
  start: number;
  end: number;
  words: WordConfig[];
  micro?: MicroText[];
  layout: LayoutPosition;
}

/* ═══════════════════════════════════════════════════
   SCENE CONFIGURATION
   ═══════════════════════════════════════════════════ */

const scenes: Scene[] = [
  // ── SCENE 01: DON'T BLINK. ──────────────────
  {
    id: "dont-blink",
    start: 0.0,
    end: 0.10,
    layout: "center",
    words: [
      {
        text: "DON'T",
        font: "satoshi",
        scale: "large",
        animation: {
          translateY: [60, 0],
          opacity: [0, 1],
          blur: [4, 0],
        },
        delay: 0,
        duration: 0.4,
      },
      {
        text: "BLINK.",
        font: "satoshi",
        emphasis: "huge",
        animation: {
          scale: [0.7, 1],
          translateX: [30, 0],
          blur: [12, 0],
          opacity: [0, 1],
        },
        delay: 0.15,
        duration: 0.5,
      },
    ],
    micro: [
      { text: "/ 001", position: "tl", start: 0.2, end: 0.9 },
      { text: "SCROLL // ACTIVE", position: "br", start: 0.4, end: 0.85 },
    ],
  },

  // ── SCENE 02: THIS ISN'T A WEBSITE. ─────────
  {
    id: "not-a-website",
    start: 0.10,
    end: 0.20,
    layout: "left",
    words: [
      {
        text: "THIS",
        font: "satoshi",
        scale: "medium",
        emphasis: "muted",
        animation: {
          translateY: [40, 0],
          opacity: [0, 1],
        },
        delay: 0,
        duration: 0.3,
      },
      {
        text: "ISN'T",
        font: "satoshi",
        scale: "medium",
        emphasis: "muted",
        animation: {
          translateY: [50, 0],
          opacity: [0, 1],
        },
        delay: 0.1,
        duration: 0.3,
      },
      {
        text: "A WEBSITE.",
        font: "satoshi",
        emphasis: "huge",
        animation: {
          translateX: [-60, 8],
          scale: [0.9, 1.02],
          opacity: [0, 1],
          blur: [8, 0],
          rotate: [0, -1.2],
        },
        delay: 0.2,
        duration: 0.5,
      },
    ],
    micro: [
      { text: "FRAME 0342", position: "tr", start: 0.3, end: 0.8 },
      { text: "OBJECT_07", position: "bl", start: 0.1, end: 0.6 },
    ],
  },

  // ── SCENE 03: KEEP SCROLLING. ───────────────
  {
    id: "keep-scrolling",
    start: 0.20,
    end: 0.30,
    layout: "off-center",
    words: [
      {
        text: "KEEP",
        font: "satoshi",
        scale: "large",
        emphasis: "wide-spacing",
        animation: {
          translateX: [-100, 0],
          opacity: [0, 1],
          blur: [6, 0],
        },
        delay: 0,
        duration: 0.4,
      },
      {
        text: "SCROLLING.",
        font: "satoshi",
        scale: "hero",
        animation: {
          translateX: [120, 0],
          opacity: [0, 1],
          blur: [10, 0],
        },
        delay: 0.15,
        duration: 0.5,
      },
    ],
    micro: [
      { text: "DESIGN_SYSTEM.EXE", position: "mr", start: 0.2, end: 0.75 },
    ],
  },

  // ── SCENE 04: STATIC? NAH. ──────────────────
  {
    id: "static-nah",
    start: 0.30,
    end: 0.40,
    layout: "right",
    words: [
      {
        text: "STATIC?",
        font: "satoshi",
        scale: "hero",
        emphasis: "outline",
        animation: {
          translateY: [0, 0],
          opacity: [0, 1],
          blur: [0, 0],
        },
        delay: 0,
        duration: 0.3,
      },
      {
        text: "NAH.",
        font: "satoshi",
        emphasis: "huge",
        animation: {
          translateY: [200, 0],
          translateX: [80, 0],
          scale: [1.4, 1],
          opacity: [0, 1],
          blur: [20, 0],
        },
        delay: 0.4,
        duration: 0.35,
      },
    ],
    micro: [
      { text: "MOTION / 024", position: "tl", start: 0.1, end: 0.7 },
      { text: "RENDERING...", position: "bl", start: 0.5, end: 0.9 },
    ],
  },

  // ── SCENE 05: WE MAKE SCREENS MOVE. ─────────
  {
    id: "screens-move",
    start: 0.40,
    end: 0.50,
    layout: "bottom-right",
    words: [
      {
        text: "WE",
        font: "satoshi",
        scale: "medium",
        emphasis: "muted",
        animation: {
          translateY: [30, 0],
          opacity: [0, 1],
        },
        delay: 0,
        duration: 0.2,
      },
      {
        text: "MAKE",
        font: "satoshi",
        scale: "medium",
        emphasis: "muted",
        animation: {
          translateY: [40, 0],
          opacity: [0, 1],
        },
        delay: 0.08,
        duration: 0.2,
      },
      {
        text: "SCREENS",
        font: "satoshi",
        scale: "large",
        animation: {
          translateY: [50, 0],
          opacity: [0, 1],
          blur: [4, 0],
        },
        delay: 0.15,
        duration: 0.3,
      },
      {
        text: "MOVE.",
        font: "satoshi",
        emphasis: "clipped",
        animation: {
          translateX: [200, 0],
          scale: [0.8, 1],
          opacity: [0, 1],
          blur: [16, 0],
        },
        delay: 0.3,
        duration: 0.45,
      },
    ],
    micro: [
      { text: "PX_00291", position: "tl", start: 0.2, end: 0.65 },
      { text: "INTERACTION_01", position: "tr", start: 0.35, end: 0.85 },
    ],
  },

  // ── SCENE 06: LOOK CLOSER. ──────────────────
  {
    id: "look-closer",
    start: 0.50,
    end: 0.59,
    layout: "center",
    words: [
      {
        text: "LOOK",
        font: "satoshi",
        scale: "hero",
        animation: {
          scale: [0.15, 1],
          opacity: [0, 1],
          blur: [20, 0],
        },
        delay: 0,
        duration: 0.5,
      },
      {
        text: "closer.",
        font: "serif",
        scale: "hero",
        emphasis: "serif-italic",
        animation: {
          scale: [0.1, 1.4],
          opacity: [0, 1],
          blur: [15, 0],
        },
        delay: 0.25,
        duration: 0.75,
      },
    ],
    micro: [
      { text: "BUILDING...", position: "bl", start: 0.1, end: 0.5 },
    ],
  },

  // ── SCENE 07: YEAH. WE MADE THAT. ──────────
  {
    id: "yeah-we-made-that",
    start: 0.59,
    end: 0.68,
    layout: "top-left",
    words: [
      {
        text: "YEAH.",
        font: "satoshi",
        emphasis: "huge",
        animation: {
          translateX: [-80, 0],
          opacity: [0, 1],
          rotate: [-3, 0],
          blur: [6, 0],
        },
        delay: 0,
        duration: 0.3,
      },
      {
        text: "WE",
        font: "satoshi",
        scale: "small",
        emphasis: "wide-spacing",
        animation: {
          translateY: [30, 0],
          opacity: [0, 1],
        },
        delay: 0.25,
        duration: 0.2,
      },
      {
        text: "MADE",
        font: "satoshi",
        scale: "large",
        emphasis: "outline",
        animation: {
          translateX: [60, 0],
          opacity: [0, 1],
          blur: [8, 0],
        },
        delay: 0.35,
        duration: 0.3,
      },
      {
        text: "THAT.",
        font: "serif",
        scale: "hero",
        emphasis: "serif-italic",
        animation: {
          scale: [0.6, 1],
          translateY: [80, 0],
          opacity: [0, 1],
          blur: [12, 0],
        },
        delay: 0.5,
        duration: 0.4,
      },
    ],
    micro: [
      { text: "001 → 002 → 003", position: "br", start: 0.2, end: 0.8 },
    ],
  },

  // ── SCENE 08: BORING IS EASY. / WE DON'T DO EASY. ──
  {
    id: "boring-is-easy",
    start: 0.68,
    end: 0.80,
    layout: "center",
    words: [
      // Phase 1: calm statement
      {
        text: "BORING",
        font: "satoshi",
        scale: "hero",
        animation: {
          translateY: [40, 0],
          opacity: [0, 1],
        },
        delay: 0,
        duration: 0.15,
      },
      {
        text: "IS",
        font: "satoshi",
        scale: "medium",
        emphasis: "muted",
        animation: {
          translateY: [30, 0],
          opacity: [0, 1],
        },
        delay: 0.05,
        duration: 0.12,
      },
      {
        text: "EASY.",
        font: "satoshi",
        scale: "hero",
        animation: {
          translateY: [40, 0],
          opacity: [0, 1],
        },
        delay: 0.1,
        duration: 0.15,
      },
      // Phase 2: aggressive transition — shown in second half of scene
      {
        text: "WE DON'T",
        font: "satoshi",
        scale: "medium",
        emphasis: "wide-spacing",
        animation: {
          translateY: [100, 0],
          scale: [1.3, 1],
          opacity: [0, 1],
          blur: [20, 0],
        },
        delay: 0.55,
        duration: 0.2,
      },
      {
        text: "DO EASY.",
        font: "satoshi",
        emphasis: "huge",
        animation: {
          translateY: [160, 0],
          translateX: [-40, 0],
          scale: [1.5, 1],
          opacity: [0, 1],
          blur: [30, 0],
          skewX: [-8, 0],
        },
        delay: 0.6,
        duration: 0.3,
      },
    ],
    micro: [
      { text: "SYSTEM ONLINE", position: "tr", start: 0.0, end: 0.4 },
    ],
  },

  // ── SCENE 09: NOT ANOTHER TEMPLATE. ─────────
  {
    id: "not-template",
    start: 0.77,
    end: 0.86,
    layout: "edge",
    words: [
      {
        text: "NOT",
        font: "satoshi",
        scale: "large",
        emphasis: "rotation",
        animation: {
          rotate: [12, -2],
          translateX: [-40, 20],
          opacity: [0, 1],
          blur: [6, 0],
        },
        delay: 0,
        duration: 0.35,
      },
      {
        text: "ANOTHER",
        font: "satoshi",
        emphasis: "huge",
        animation: {
          translateX: [100, -10],
          rotate: [-6, 1.5],
          opacity: [0, 1],
          blur: [10, 0],
        },
        delay: 0.15,
        duration: 0.4,
      },
      {
        text: "TEMPLATE.",
        font: "serif",
        scale: "hero",
        emphasis: "serif-italic",
        animation: {
          translateY: [120, 0],
          rotate: [8, -3],
          scale: [0.8, 1.05],
          opacity: [0, 1],
          blur: [14, 0],
        },
        delay: 0.3,
        duration: 0.5,
      },
    ],
    micro: [
      { text: "/ 009", position: "tl", start: 0.1, end: 0.7 },
    ],
  },

  // ── SCENE 10: WELCOME TO THE LAB. ───
  {
    id: "welcome-lab",
    start: 0.86,
    end: 1.00,
    layout: "center",
    words: [
      {
        text: "Welcome",
        font: "calligraphic",
        scale: "large",
        emphasis: "gold",
        animation: {
          translateY: [35, 0, 0, 0, -40],
          scale: [0.85, 1.0, 1.0, 1.0, 2.2],
          opacity: [0, 1, 1, 1, 0],
          blur: [6, 0, 0, 0, 25],
        },
        delay: 0,
        duration: 0.98,
      },
      {
        text: "TO THE",
        font: "satoshi",
        scale: "small",
        emphasis: "wide-spacing",
        animation: {
          translateY: [25, 0, 0, 0, -30],
          scale: [0.9, 1.0, 1.0, 1.0, 1.7],
          opacity: [0, 1, 1, 1, 0],
          blur: [4, 0, 0, 0, 18],
        },
        delay: 0.02,
        duration: 0.96,
      },
      {
        text: "Lab!",
        font: "calligraphic",
        scale: "hero",
        emphasis: "gold",
        animation: {
          translateY: [50, 0, 0, 0, -55],
          scale: [0.8, 1.0, 1.0, 1.0, 2.6],
          opacity: [0, 1, 1, 1, 0],
          blur: [8, 0, 0, 0, 30],
        },
        delay: 0.05,
        duration: 0.94,
      },
    ],
    micro: [
      { text: "/ 010", position: "tl", start: 0.15, end: 0.85 },
      { text: "DESIGN_SYSTEM.EXE", position: "br", start: 0.3, end: 0.75 },
    ],
  },
];

/* ═══════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════ */

/** Clamp a value between 0 and 1 */
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Linearly interpolate from a to b by t */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Ease-out cubic for snappy settling */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Ease-out back for words that slightly overshoot */
function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/** Map a progress range to 0–1 within a sub-range */
function mapRange(value: number, inMin: number, inMax: number): number {
  return clamp01((value - inMin) / (inMax - inMin));
}

/** Interpolate an array of keyframes at t (0 to 1) */
function lerpKeyframes(values: number[] | undefined, fallback: number, t: number): number {
  if (!values || values.length === 0) return fallback;
  if (values.length === 1) return values[0];
  const clampedT = clamp01(t);
  const segments = values.length - 1;
  const index = Math.min(Math.floor(clampedT * segments), segments - 1);
  const segmentT = clampedT * segments - index;
  return lerp(values[index], values[index + 1], segmentT);
}

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════ */

interface AnimatedWordProps {
  word: WordConfig;
  localProgress: number; // 0–1 within this scene
  velocity: number;
}

const AnimatedWord: React.FC<AnimatedWordProps> = React.memo(
  ({ word, localProgress, velocity }) => {
    const delay = word.delay ?? 0;
    const duration = word.duration ?? 1 - delay;
    const wordProgress = clamp01(mapRange(localProgress, delay, delay + duration));

    const a = word.animation;

    // Base animation transforms using keyframe interpolation
    const tx = lerpKeyframes(a.translateX, 0, wordProgress);
    const ty = lerpKeyframes(a.translateY, 0, wordProgress);
    const sc = lerpKeyframes(a.scale, 1, wordProgress);
    const bl = lerpKeyframes(a.blur, 0, wordProgress);
    const op = lerpKeyframes(a.opacity, 1, wordProgress);
    const rot = lerpKeyframes(a.rotate, 0, wordProgress);
    const skX = lerpKeyframes(a.skewX, 0, wordProgress);

    // Velocity-based distortion (only when word is visible)
    const vel = Math.abs(velocity);
    const velDistortion = op > 0.1 ? vel : 0;
    const velSkew = velDistortion * 6;
    const velDrift = velDistortion * 15;
    const velBlur = velDistortion * 3;
    const velSpacing = velDistortion * 0.04;

    const transform = [
      `translateX(${tx + velDrift}px)`,
      `translateY(${ty}px)`,
      `scale(${sc})`,
      `rotate(${rot}deg)`,
      `skewX(${skX + velSkew}deg)`,
    ].join(" ");

    const totalBlur = bl + velBlur;
    const filter = totalBlur > 0.1 ? `blur(${totalBlur}px)` : "none";
    const ls = a.letterSpacing
      ? undefined // handled by CSS class
      : `${-0.03 + velSpacing}em`;

    // Font class
    const fontClass = word.font === "serif"
      ? "font-serif"
      : word.font === "mono"
        ? "font-mono"
        : word.font === "calligraphic"
          ? "font-calligraphic"
          : "font-satoshi";

    // Scale class
    const scaleClass = word.scale
      ? `word-scale-${word.scale}`
      : "";

    // Emphasis class
    const emphasisClass = word.emphasis
      ? `emphasis-${word.emphasis}`
      : "";

    const className = [
      "scene-word",
      word.inline ? "scene-word-inline" : "",
      fontClass,
      scaleClass,
      emphasisClass,
    ]
      .filter(Boolean)
      .join(" ");

    const style: React.CSSProperties = {
      transform,
      opacity: op,
      filter,
      letterSpacing: ls,
      willChange: "transform, opacity, filter",
    };

    return (
      <span className={className} style={style} aria-hidden="true">
        {word.text}
      </span>
    );
  }
);

AnimatedWord.displayName = "AnimatedWord";

/* ─── Micro Label ─────────────────────────────── */

interface MicroLabelProps {
  micro: MicroText;
  localProgress: number;
}

const MicroLabel: React.FC<MicroLabelProps> = React.memo(
  ({ micro, localProgress }) => {
    const isVisible = localProgress >= micro.start && localProgress <= micro.end;
    // Fade near edges
    const fadeIn = mapRange(localProgress, micro.start, micro.start + 0.08);
    const fadeOut = 1 - mapRange(localProgress, micro.end - 0.08, micro.end);
    const opacity = isVisible ? Math.min(fadeIn, fadeOut) : 0;

    return (
      <span
        className={`micro-label micro-label-${micro.position}`}
        style={{ opacity }}
        aria-hidden="true"
      >
        {micro.text}
      </span>
    );
  }
);

MicroLabel.displayName = "MicroLabel";

/* ─── Scene Renderer ──────────────────────────── */

interface SceneRendererProps {
  scene: Scene;
  progress: number; // global 0–1
  velocity: number;
}

const SceneRenderer: React.FC<SceneRendererProps> = React.memo(
  ({ scene, progress, velocity }) => {
    const localProgress = mapRange(progress, scene.start, scene.end);

    // Scene visibility with soft fade
    const fadeIn = mapRange(progress, scene.start, scene.start + 0.008);
    const fadeOut = 1 - mapRange(progress, scene.end - 0.008, scene.end);
    const sceneOpacity = Math.min(fadeIn, fadeOut);

    // Don't render if totally invisible
    if (sceneOpacity <= 0) return null;

    const layoutClass = `scene-layout-${scene.layout}`;

    // Special handling for Scene 08: two-phase layout
    const isScene08 = scene.id === "boring-is-easy";
    const phase2Progress = isScene08 ? mapRange(localProgress, 0.5, 0.55) : 0;

    return (
      <div
        className={`scene-container ${layoutClass}`}
        style={{ opacity: sceneOpacity }}
      >
        {/* Words */}
        {scene.words.map((word, i) => {
          // Scene 08: hide phase-1 words when phase-2 begins
          if (isScene08 && i < 3 && phase2Progress > 0) {
            const hideOpacity = 1 - easeOutCubic(phase2Progress);
            return (
              <span
                key={`${scene.id}-w${i}`}
                style={{
                  opacity: hideOpacity,
                  display: "contents",
                }}
              >
                <AnimatedWord
                  word={word}
                  localProgress={localProgress}
                  velocity={velocity}
                />
              </span>
            );
          }

          return (
            <AnimatedWord
              key={`${scene.id}-w${i}`}
              word={word}
              localProgress={localProgress}
              velocity={velocity}
            />
          );
        })}

        {/* Micro text */}
        {scene.micro?.map((m, i) => (
          <MicroLabel
            key={`${scene.id}-m${i}`}
            micro={m}
            localProgress={localProgress}
          />
        ))}
      </div>
    );
  }
);

SceneRenderer.displayName = "SceneRenderer";

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */

interface ScrollTypographyProps {
  progress: number; // 0–1
  velocity: number; // signed, scroll speed
}

export const ScrollTypography: React.FC<ScrollTypographyProps> = React.memo(
  ({ progress, velocity }) => {
    // Memoize which scenes are potentially active (with padding)
    const activeScenes = useMemo(() => {
      const pad = 0.02;
      return scenes.filter(
        (s) => progress >= s.start - pad && progress <= s.end + pad
      );
    }, [
      // Re-compute only when progress crosses a scene boundary
      // Using bucketed progress for stable memo
      Math.floor(progress * 200),
    ]);

    // Frame counter micro text — always visible during scroll sequence
    const frameNum = String(Math.floor(progress * 99) + 1).padStart(4, "0");

    return (
      <div className="scroll-typo-root" id="scroll-typography-layer">
        {/* Global frame counter */}
        {progress > 0.01 && progress < 0.95 && (
          <span
            className="micro-label micro-label-tr"
            style={{ opacity: 0.15 }}
            aria-hidden="true"
          >
            FRAME {frameNum}
          </span>
        )}

        {/* Active scenes */}
        {activeScenes.map((scene) => (
          <SceneRenderer
            key={scene.id}
            scene={scene}
            progress={progress}
            velocity={velocity}
          />
        ))}
      </div>
    );
  }
);

ScrollTypography.displayName = "ScrollTypography";

export { scenes };
export type { Scene, WordConfig, MicroText };
