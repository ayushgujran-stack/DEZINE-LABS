/**
 * React mount point for "THE ARCHITECT" section.
 * Renders the AsciiElectricGaze Canvas2D dither engine into <div id="react-architect-root">.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { AsciiElectricGaze } from "@/components/ui/ascii-electric-gaze";
import "../styles/tailwind.css";

function ArchitectSection() {
  return (
    <div className="w-full text-center py-12 px-4 max-w-5xl mx-auto">
      {/* Badge & Title */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 mb-4 rounded-full border border-cyan-500/30 px-4 py-1.5 text-xs font-mono font-medium tracking-widest text-cyan-400 uppercase bg-cyan-950/30 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#3ca6ff]" />
          THE ARCHITECT
        </span>
        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-heading">
          COMMANDING THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
            DIGITAL FRONTIER
          </span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-white/50 max-w-xl mx-auto font-sans">
          Engineering category-defining brand identity, 3D spatial motion, and high-performance WebGL digital artifacts.
        </p>
      </div>

      {/* Electric Gaze Canvas Container */}
      <div className="relative mx-auto max-w-2xl rounded-2xl overflow-hidden border border-cyan-500/20 bg-black/90 shadow-[0_0_60px_rgba(60,166,255,0.15)] group transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_0_80px_rgba(60,166,255,0.25)]">
        <AsciiElectricGaze
          imageSrc="/images/architect-portrait.jpg"
          cellSize={9}
          contrast={158}
          animStyle="shimmer"
          animSpeed={100}
          animIntensity={60}
          className="rounded-2xl"
        />

        {/* Ambient overlay vignette */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl bg-radial-vignette opacity-80" />
      </div>
    </div>
  );
}

// Mount into page
const rootEl = document.getElementById("react-architect-root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <ArchitectSection />
    </React.StrictMode>
  );
}
