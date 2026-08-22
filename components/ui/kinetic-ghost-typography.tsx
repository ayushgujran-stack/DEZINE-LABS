"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import { useKineticEnvironment } from "./kinetic-environment";

export function KineticGhostTypography({ text = "CREATE" }: { text?: string }) {
  const { cursorX, cursorY, radius } = useKineticEnvironment();

  // The ghost text moves slightly in parallax against the cursor
  // When cursor goes right (x=1), text moves left (e.g. -20px)
  const xOffset = useTransform(cursorX, [0, 1], [40, -40]);
  const yOffset = useTransform(cursorY, [0, 1], [40, -40]);

  // It becomes slightly more visible and blurs less when the cursor is near the center
  const opacity = useTransform(radius, [0, 1], [0.03, 0.08]);
  const blur = useTransform(radius, [0, 1], [8, 2]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
      style={{
        x: xOffset,
        y: yOffset,
        opacity,
        filter: useTransform(blur, (v) => `blur(${v}px)`),
      }}
    >
      <h1 
        className="font-satoshi text-white whitespace-nowrap select-none font-black tracking-tighter"
        style={{
          // Massive scale to fill/overflow the screen
          fontSize: "clamp(20rem, 40vw, 50rem)",
          lineHeight: 0.8,
        }}
      >
        {text}
      </h1>
    </motion.div>
  );
}
