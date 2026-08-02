/**
 * React mount point for the Container Scroll Animation Estimator section.
 * Mounts into <div id="react-estimator-root"> in index.html.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { EstimatorInteractive } from "@/components/ui/estimator-interactive";
import "../styles/tailwind.css";

function EstimatorScrollSection() {
  return (
    <div className="w-full relative overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center">
            <span className="inline-flex items-center gap-2 mb-4 rounded-full border border-white/15 px-4 py-1.5 text-xs font-mono font-medium tracking-widest text-cyan-400 uppercase bg-white/5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              PROJECT ESTIMATOR
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-heading">
              BUILD YOUR <br />
              <span className="text-4xl sm:text-6xl md:text-[5rem] font-extrabold mt-2 leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
                PROJECT SCOPE
              </span>
            </h1>
            <p className="mt-4 text-sm md:text-base text-white/50 max-w-xl mx-auto font-sans">
              Scroll down to reveal the interactive calculator. Select services, scale, and timeline to build your estimate.
            </p>
          </div>
        }
      >
        <EstimatorInteractive />
      </ContainerScroll>
    </div>
  );
}

// Mount into the page
const rootEl = document.getElementById("react-estimator-root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <EstimatorScrollSection />
    </React.StrictMode>
  );
}
