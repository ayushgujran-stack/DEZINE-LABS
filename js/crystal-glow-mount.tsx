/**
 * React mount bridge for Originkit "Crystal Glow" (SparkleButton)
 * in the Agency Philosophy section.
 * Replaces the static highlighted "DEZINE" with animated "DEZINE LABS"
 * featuring layered 3D crystal lighting, amber glow, and interactive sparkles.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import SparkleButton from '@/components/originkit/ui/crystal-glow';
import '../styles/tailwind.css';

export function PhilosophyCrystalGlow() {
  return (
    <SparkleButton
      text="DEZINE LABS"
      fontFamily="'Archivo', sans-serif"
      fontWeight={800}
      fontSize="clamp(30px, 5vw, 82px)"
      textColor="#ffffff"
      shadowColor="#f59e0b"
      glareColor="rgba(255, 255, 255, 0.95)"
      glareSpeed={1.2}
      padding="0.02em 0.2em"
      borderRadius="8px"
      style={{
        verticalAlign: 'baseline',
        display: 'inline-flex',
        margin: '0 0.08em',
      }}
    />
  );
}

const rootEl = document.getElementById('react-crystal-glow-root');
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <PhilosophyCrystalGlow />
    </React.StrictMode>
  );
}
