import React, { useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { motion, useTransform, useMotionTemplate } from "framer-motion";
import KineticGrid from "@/components/ui/kinetic-grid";
import { KineticEnvironment, useKineticEnvironment } from "@/components/ui/kinetic-environment";
import { KineticGhostTypography } from "@/components/ui/kinetic-ghost-typography";
import "../styles/tailwind.css";

const easterEggMessages = [
  "CAREFUL.",
  "YOU FOUND IT.",
  "TOO CLOSE.",
  "IT'S ALIVE.",
  "OBJECT DETECTED."
];

function Logo3D() {
  const { cursorX, cursorY, radius, rawX, rawY } = useKineticEnvironment();
  const [easterEgg, setEasterEgg] = useState<string | null>(null);

  // Tilt: ±15deg max, mapped from cursor (0->1) to (-15->15)
  const rotateY = useTransform(cursorX, [0, 1], [-15, 15]);
  const rotateX = useTransform(cursorY, [0, 1], [15, -15]); // Inverted for natural tilt

  // Scale up slightly when close to center (radius 0 -> 1)
  const scale = useTransform(radius, [0, 1], [1, 1.04]);
  
  // Transform string for Framer Motion
  const transform = useMotionTemplate`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

  // Glow moves with raw cursor
  const glowOpacity = useTransform(radius, [0, 1], [0, 1]);
  const glowBackground = useMotionTemplate`radial-gradient(circle at ${rawX}px ${rawY}px, rgba(0,220,255,0.15) 0%, transparent 60%)`;

  // Easter Egg logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Subscribe to radius changes
    const unsubscribe = radius.on("change", (v) => {
      // If cursor is very close to center (e.g. > 0.95)
      if (v > 0.95) {
        if (!easterEgg) {
          // Set a random message if one isn't already set
          timeout = setTimeout(() => {
            const randomMsg = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];
            setEasterEgg(randomMsg);
          }, 600);
        }
      } else {
        if (easterEgg) {
          clearTimeout(timeout);
          setEasterEgg(null);
        }
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [radius, easterEgg]);

  return (
    <motion.div
      style={{
        transform,
        transformStyle: "preserve-3d",
      }}
      className="relative cursor-none select-none z-20"
    >
      {/* Subtle glow overlay that follows cursor */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-20"
        style={{
          opacity: glowOpacity,
          background: glowBackground,
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

      {/* Easter Egg Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: easterEgg ? 1 : 0, y: easterEgg ? 0 : 10 }}
        className="absolute -top-12 left-1/2 -translate-x-1/2 text-neutral-300 font-mono text-[10px] tracking-widest whitespace-nowrap z-30"
      >
        {easterEgg}
      </motion.div>

      <img
        src="/images/dezine-labs-logo.png"
        alt="DEZINE LABS"
        className="w-[220px] sm:w-[300px] md:w-[380px] lg:w-[450px] h-auto relative z-0"
        draggable={false}
      />
    </motion.div>
  );
}

// Wrapper to pass shared spring values down to KineticGrid 
function UnifiedGrid() {
  return <KineticGrid globalColor="monochrome" />;
}

function KineticLogoSection() {
  return (
    <KineticEnvironment className="relative w-full min-h-screen overflow-hidden bg-black cursor-crosshair">
      <UnifiedGrid />
      <KineticGhostTypography text="CREATE" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-none">
        {/* pointer-events-auto on the logo so it can be hovered if needed, but the environment captures the mouse */}
        <div className="pointer-events-auto">
          <Logo3D />
        </div>
      </div>
    </KineticEnvironment>
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
