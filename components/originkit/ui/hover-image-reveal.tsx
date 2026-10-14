"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type Transition as MotionTransition,
} from "framer-motion";

interface Item {
  text?: string;
  image?: { src?: string; srcSet?: string; alt?: string };
  link?: string;
}

interface ItemsValue {
  itemCount?: number;
  [key: string]: unknown;
}

const MAX_ITEMS = 6;

interface FontValue {
  fontSize?: number | string;
  letterSpacing?: number | string;
  lineHeight?: number | string;
  [key: string]: unknown;
}

interface HoverImageRevealProps {
  items?: ItemsValue;
  font?: FontValue;
  textColor?: string;
  dimColor?: string;
  align?: "left" | "center" | "right";
  rowGap?: number;
  imageWidth?: number;
  imageHeight?: number;
  rounded?: number;
  offsetX?: number;
  offsetY?: number;
  followStrength?: number;
  transition?: MotionTransition;
  backgroundColor?: string;
  style?: CSSProperties;
}

const DEFAULT_ITEMS_DATA: { text: string; src: string }[] = [
  {
    text: "NEW SEASON DROP",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/8e0d22a8-ac82-4893-90d8-3403f80ec600/w=800",
  },
  {
    text: "ESSENTIAL COLLECTION",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/d6af07a0-4dc5-4de4-07b1-9d2ad6100000/w=800",
  },
  {
    text: "SUMMER EDITION",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/c083d83a-f5a4-4434-989f-4eaa9bbe7500/w=800",
  },
  {
    text: "STREET ICONS",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/93bad0e0-e2ab-4e21-de9c-4cb54b028f00/w=800",
  },
  {
    text: "PREMIUM DENIM",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/09a59a65-3c07-4500-f72c-68c824168c00/w=800",
  },
  {
    text: "ARCHIVE PIECES",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/8e0d22a8-ac82-4893-90d8-3403f80ec600/w=800",
  },
];

const DEFAULT_ITEMS: ItemsValue = {
  itemCount: 5,
  item1: {
    text: DEFAULT_ITEMS_DATA[0].text,
    image: { src: DEFAULT_ITEMS_DATA[0].src },
  },
  item2: {
    text: DEFAULT_ITEMS_DATA[1].text,
    image: { src: DEFAULT_ITEMS_DATA[1].src },
  },
  item3: {
    text: DEFAULT_ITEMS_DATA[2].text,
    image: { src: DEFAULT_ITEMS_DATA[2].src },
  },
  item4: {
    text: DEFAULT_ITEMS_DATA[3].text,
    image: { src: DEFAULT_ITEMS_DATA[3].src },
  },
  item5: {
    text: DEFAULT_ITEMS_DATA[4].text,
    image: { src: DEFAULT_ITEMS_DATA[4].src },
  },
  item6: {
    text: DEFAULT_ITEMS_DATA[5].text,
    image: { src: DEFAULT_ITEMS_DATA[5].src },
  },
};

const DEFAULT_FONT: FontValue = {
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: 61,
  lineHeight: "0.9em",
  letterSpacing: "-0.05em",
  textAlign: "left",
};

const DEFAULT_TRANSITION: MotionTransition = {
  type: "spring",
  stiffness: 400,
  damping: 40,
  mass: 1,
};

const alignToFlex: Record<string, CSSProperties["alignItems"]> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};
const alignToText: Record<string, CSSProperties["textAlign"]> = {
  left: "left",
  center: "center",
  right: "right",
};

export default function HoverImageReveal({
  items = DEFAULT_ITEMS,
  font = DEFAULT_FONT,
  textColor = "#FFFFFF",
  dimColor = "#51565A",
  align = "center",
  rowGap = 30,
  imageWidth = 300,
  imageHeight = 400,
  rounded = 16,
  offsetX = 200,
  offsetY = 0,
  followStrength = 0,
  transition = DEFAULT_TRANSITION,
  backgroundColor = "#000000",
  style,
}: HoverImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isFirstHover = useRef(true);
  const [hovered, setHovered] = useState<number | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const stiffness = 90 + followStrength * 4;
  const springCfg = { stiffness, damping: 26, mass: 0.6 };
  const x = useSpring(rawX, springCfg);
  const y = useSpring(rawY, springCfg);

  const data = items || DEFAULT_ITEMS;
  const count = Math.max(
    1,
    Math.min(MAX_ITEMS, (data.itemCount as number) || 5)
  );
  const list: Item[] = [];
  for (let i = 1; i <= count; i++) {
    const it = data[`item${i}`] as Item | undefined;
    const fallback = DEFAULT_ITEMS_DATA[i - 1];
    list.push({
      text: it?.text ?? fallback?.text ?? `Item ${i}`,
      image: it?.image ?? (fallback ? { src: fallback.src } : undefined),
      link: it?.link,
    });
  }
  const anyActive = hovered != null;

  const updatePosition = (e: React.MouseEvent, hoveredIdx: number | null) => {
    if (hoveredIdx == null) return;
    const itemEl = itemRefs.current[hoveredIdx];
    const containerEl = containerRef.current;
    if (!itemEl || !containerEl) return;

    const itemRect = itemEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    // Right and top edges of the text relative to the container
    const textRight = itemRect.right - containerRect.left;
    const textTop = itemRect.top - containerRect.top;

    // Track cursor horizontally across the text width (0 at left edge, 1 at right edge)
    const cursorRelX = e.clientX - itemRect.left;
    const progressX = Math.max(0, Math.min(1, cursorRelX / Math.max(1, itemRect.width)));

    // Move left by a very tiny bit when moving cursor to the left, never covering the text
    const tinyMoveX = (progressX - 1) * 20;

    // Subtle gentle vertical parallax responsive to cursor Y
    const cursorRelY = e.clientY - itemRect.top;
    const progressY = Math.max(0, Math.min(1, cursorRelY / Math.max(1, itemRect.height)));
    const tinyMoveY = (progressY - 0.5) * 16;

    // Target position at top-right corner of the same text
    const baseGap = 28;
    let targetX = Math.max(textRight + 8, textRight + baseGap + tinyMoveX);
    let targetY = textTop + offsetY + tinyMoveY;

    // Boundary clamp: ensure image never overflows the screen / container width
    const containerWidth = containerRect.width;
    if (targetX + imageWidth > containerWidth - 16) {
      targetX = Math.max(16, containerWidth - imageWidth - 16);
    }

    if (isFirstHover.current) {
      if (typeof (rawX as unknown as { jump?: (v: number) => void }).jump === "function") {
        (rawX as unknown as { jump: (v: number) => void }).jump(targetX);
        (rawY as unknown as { jump: (v: number) => void }).jump(targetY);
      } else {
        rawX.set(targetX);
        rawY.set(targetY);
      }
      isFirstHover.current = false;
    } else {
      rawX.set(targetX);
      rawY.set(targetY);
    }
  };

  const onMove = (e: React.MouseEvent) => {
    if (hovered != null) {
      updatePosition(e, hovered);
    }
  };

  const handleMouseLeave = () => {
    setHovered(null);
    isFirstHover.current = true;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "visible",
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: alignToFlex[align],
        gap: `${rowGap}px`,
        padding: 24,
        boxSizing: "border-box",
        cursor: "default",
        ...(font as CSSProperties),
        ...style,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x,
          y,
          width: imageWidth,
          height: imageHeight,
          borderRadius: rounded,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 5,
        }}
        animate={{ opacity: anyActive ? 1 : 0 }}
        transition={transition}
      >
        {list.map((item, i) => {
          const src = item.image?.src;
          const yPos =
            hovered == null
              ? "100%"
              : i < hovered
                ? "-100%"
                : i > hovered
                  ? "100%"
                  : "0%";
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ y: yPos }}
              transition={transition}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              {src ? (
                <img
                  src={src}
                  alt={item.image?.alt || item.text || ""}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg,#333,#111)",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div
        onMouseLeave={handleMouseLeave}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: alignToFlex[align],
          gap: `${rowGap}px`,
          position: "relative",
          zIndex: 10,
        }}
      >
        {list.map((item, i) => {
          const isHovered = hovered === i;
          const color = anyActive ? (isHovered ? textColor : dimColor) : textColor;
          const copyStyle: CSSProperties = {
            display: "block",
            color,
            transition: "color 0.2s ease",
            whiteSpace: "pre",
            textAlign: alignToText[align],
          };
          const inner = (
            <motion.div
              style={{ position: "relative" }}
              animate={{ y: isHovered ? "-100%" : "0%" }}
              transition={transition}
            >
              <span style={copyStyle}>{item.text}</span>
              <span
                aria-hidden
                style={{
                  ...copyStyle,
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                }}
              >
                {item.text}
              </span>
            </motion.div>
          );
          return (
            <div
              key={i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onMouseEnter={(e) => {
                setHovered(i);
                updatePosition(e, i);
              }}
              onClick={(e) => {
                if (hovered === i) {
                  setHovered(null);
                } else {
                  setHovered(i);
                  updatePosition(e, i);
                }
              }}
              data-cursor="View"
              style={{
                overflow: "hidden",
                cursor: item.link ? "pointer" : "default",
                width: "fit-content",
              }}
            >
              {item.link ? (
                <a
                  href={item.link}
                  data-cursor="View"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  {inner}
                </a>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}