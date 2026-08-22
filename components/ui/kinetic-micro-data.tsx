"use client";

import React, { useState, useEffect } from "react";
import { motion, useTransform } from "framer-motion";
import { useKineticEnvironment } from "./kinetic-environment";

export function KineticMicroData() {
  const { cursorX, cursorY, radius } = useKineticEnvironment();

  // We need to render the numeric values of the motion values
  // Framer Motion useTransform allows mapping, but to render text content from a MotionValue 
  // safely in React without constant re-renders, we use the `useMotionTemplate` or 
  // subscribe to the motion value. However, <motion.span>{value}</motion.span> handles it if we use motion elements!
  // Wait, React requires text to be static or passed via `motion` hooks.
  // We can format numbers directly using a simple state subscription for micro-data (since it's just text).
  // But for performance, it's better to use `useTransform` and pass it to a motion element's style or use `useMotionTemplate`.
  
  // A clean way to animate text content with Framer Motion without re-renders is to use an isolated component.
  
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden text-[10px] sm:text-[11px] font-mono text-slate-500 uppercase tracking-[0.12em]">
      {/* Top Right - Live Cursor Position */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 flex flex-col gap-1 text-right items-end">
        <DataRow label="CURSOR_X" motionValue={cursorX} format={(v) => Math.round(v * 1000).toString().padStart(4, "0")} />
        <DataRow label="CURSOR_Y" motionValue={cursorY} format={(v) => Math.round(v * 1000).toString().padStart(4, "0")} />
      </div>

      {/* Bottom Right - Live Depth & Tilt */}
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col gap-1 text-right items-end">
        <DataRow label="DEPTH" motionValue={radius} format={(v) => `${Math.round(v * 100).toString().padStart(3, "0")}%`} />
        <DataRow label="TILT" motionValue={cursorX} format={(v) => `${((v - 0.5) * 30).toFixed(1).padStart(4, "0")}°`} />
      </div>
    </div>
  );
}

// Isolated component to render a motion value as text without re-rendering the parent
function DataRow({ label, motionValue, format }: { label: string; motionValue: any; format: (v: number) => string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    // Initial format
    setText(format(motionValue.get()));
    
    // Subscribe to changes
    return motionValue.on("change", (v: number) => {
      setText(format(v));
    });
  }, [motionValue, format]);

  return (
    <div className="flex gap-3 justify-between min-w-[120px]">
      <span className="opacity-60">{label}</span>
      <span className="text-slate-300 font-medium">{text}</span>
    </div>
  );
}
