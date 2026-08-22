/**
 * DEZINE — Scroll Typography Mount Point
 *
 * Bridges the browser scroll position to the ScrollTypography React component.
 * Reads progress from the same .scroll-sequence-container that drives the
 * video frame engine, ensuring perfect sync. Computes scroll velocity for
 * distortion effects.
 *
 * Mounts into <div id="react-scroll-typography-root"> inside the sticky viewport.
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { ScrollTypography } from "@/components/ui/scroll-typography";

function ScrollTypographyBridge() {
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);

  const prevProgressRef = useRef(0);
  const prevTimeRef = useRef(performance.now());
  const smoothVelocityRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // Find the container once
  useEffect(() => {
    containerRef.current = document.querySelector(".scroll-sequence-container");
  }, []);

  // Scroll + velocity loop using rAF for smoothness
  const tick = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const scrollDistance = container.offsetHeight - window.innerHeight;
      const currentScroll = Math.max(0, -rect.top);
      const rawProgress = Math.min(1, Math.max(0, currentScroll / scrollDistance));

      // Compute velocity (change in progress per frame, normalized)
      const now = performance.now();
      const dt = Math.max(1, now - prevTimeRef.current);
      const rawVelocity = (rawProgress - prevProgressRef.current) / (dt / 16.667);

      // Smooth velocity with exponential decay
      smoothVelocityRef.current += (rawVelocity - smoothVelocityRef.current) * 0.15;

      // Clamp velocity to sane range
      const clampedVelocity = Math.max(
        -1,
        Math.min(1, smoothVelocityRef.current * 8)
      );

      prevProgressRef.current = rawProgress;
      prevTimeRef.current = now;

      setProgress(rawProgress);
      setVelocity(clampedVelocity);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [tick]);

  return <ScrollTypography progress={progress} velocity={velocity} />;
}

// Mount
const rootEl = document.getElementById("react-scroll-typography-root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <ScrollTypographyBridge />
    </React.StrictMode>
  );
}
