/**
 * React mount point for the KineticGrid background — shows the DEZINE LABS
 * logo centered on a pure-black interactive grid with a 3D hover tilt effect.
 */
import React, { useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import KineticGrid from "@/components/ui/kinetic-grid";
import "../styles/tailwind.css";

function Logo3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt: ±15deg max
    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = ((centerY - y) / centerY) * 15;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;

    // Move glow to follow cursor
    if (glow) {
      glow.style.opacity = "1";
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,220,255,0.15) 0%, transparent 60%)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (card) {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
    if (glow) {
      glow.style.opacity = "0";
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="relative cursor-pointer select-none"
    >
      {/* Glow overlay that follows cursor */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-2xl pointer-events-none z-20"
        style={{
          opacity: 0,
          transition: "opacity 0.3s ease",
          mixBlendMode: "screen",
        }}
      />

      {/* Subtle reflection / shine layer */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)",
        }}
      />

      <img
        src="/images/dezine-labs-logo.png"
        alt="DEZINE LABS"
        className="w-[220px] sm:w-[300px] md:w-[380px] lg:w-[450px] h-auto relative z-0"
        draggable={false}
      />
    </div>
  );
}

function KineticLogoSection() {
  return (
    <KineticGrid globalColor="monochrome">
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <Logo3D />
      </div>
    </KineticGrid>
  );
}

// Mount into the page
const rootEl = document.getElementById("react-kinetic-grid-root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <KineticLogoSection />
    </React.StrictMode>
  );
}

