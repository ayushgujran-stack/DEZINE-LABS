/**
 * React mount point for the Full-Frame Featured Projects section.
 * Combines:
 * 1. Background: Interactive WebGL Dither Reveal using Michelangelo's "The Creation of Adam"
 * 2. Foreground: 3D Curved Cylindrical Streaming Tilted Grid Hero with Clickable Projects
 * 3. Interactive Project Lightbox Modal with detailed case study preview
 */
import React, { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import { TiltedGridHero, type TiltedGridImage } from "@/components/ui/tilted-grid-hero";
import DitherReveal from "@/components/ui/dither-reveal";
import "../styles/tailwind.css";

interface ProjectDetail extends TiltedGridImage {
  id: string;
  title: string;
  category: string;
  year: string;
  client: string;
  description: string;
  tags: string[];
}

const FEATURED_PROJECTS: ProjectDetail[] = [
  {
    src: "/images/projects/swasti-business.png",
    alt: "Swasti Business Solutions Restaurant POS & Hotel PMS",
    id: "swasti-business",
    title: "Swasti Business Solutions",
    category: "Hospitality POS & Cloud Architecture",
    year: "2025",
    client: "Swasti Business Solutions",
    description: "A mission-critical digital flagship and cloud product portal built for an enterprise restaurant POS and hotel PMS software provider. The platform communicates high-availability infrastructure supporting over 1,000 hospitality outlets across India, translating complex technical capabilities—including self-service kiosks, kitchen display systems (KDS), table-side ordering, automated KOT workflows, and live inventory control—into a cohesive, conversion-focused web architecture.",
    tags: ["Hospitality POS", "Enterprise SaaS", "Cloud PMS", "Information Architecture", "UI/UX Systems"],
  },
  {
    src: "/images/projects/mcp-council.png",
    alt: "Mangalore Productivity Council Institutional Platform",
    id: "mcp-council",
    title: "Mangalore Productivity Council",
    category: "Institutional Archive & Event Platform",
    year: "2025",
    client: "Mangalore Productivity Council (NPC Affiliated)",
    description: "A digital platform and institutional portal engineered for the Mangalore Productivity Council, an esteemed civic body established in 1960 and recognized by the National Productivity Council (NPC), New Delhi. The site archives six decades of institutional dialogue, organizing executive directorates, industry seminar recaps, and leadership training programs across coastal Karnataka into an accessible, dignified editorial publication.",
    tags: ["Institutional Web", "Event Archives", "Editorial Design", "Civic Platform", "Affiliated NPC"],
  },
  {
    src: "/images/projects/survey-hub.png",
    alt: "SurveyHub Demographic and Family Census Master System",
    id: "survey-hub",
    title: "SurveyHub Master System",
    category: "Community Census & Real-Time Analytics",
    year: "2025",
    client: "SurveyHub Platform",
    description: "A high-performance demographic and census analytics console designed for community organizations and administrative directors. Featuring live database synchronization, multi-dimensional metric visualization (household counts, gender distributions, NRI tracking, blood group demographics, and educational attainment), and structured survey intake workflows built for clarity under high data density.",
    tags: ["Data Visualization", "Analytics Dashboard", "Census Engine", "Demographic UI", "Web Application"],
  },
];

export function FeaturedProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleImageClick = useCallback((image: TiltedGridImage, index: number) => {
    // Find matching project from list
    const foundIndex = FEATURED_PROJECTS.findIndex((p) => p.src === image.src);
    const resolvedIndex = foundIndex !== -1 ? foundIndex : index % FEATURED_PROJECTS.length;
    setSelectedProject(FEATURED_PROJECTS[resolvedIndex]);
    setSelectedIndex(resolvedIndex);
  }, []);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextIdx = (selectedIndex + 1) % FEATURED_PROJECTS.length;
    setSelectedIndex(nextIdx);
    setSelectedProject(FEATURED_PROJECTS[nextIdx]);
  }, [selectedIndex]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const prevIdx = (selectedIndex - 1 + FEATURED_PROJECTS.length) % FEATURED_PROJECTS.length;
    setSelectedIndex(prevIdx);
    setSelectedProject(FEATURED_PROJECTS[prevIdx]);
  }, [selectedIndex]);

  // Keyboard navigation (ESC to close, Left/Right arrows to cycle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === "Escape") {
        setSelectedProject(null);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, handleNext, handlePrev]);

  return (
    <div
      className="relative w-full overflow-hidden bg-black select-none"
      style={{ width: "100%", margin: 0, padding: 0, height: "100vh" }}
      data-cursor="Projects"
    >
      {/* Background: Interactive WebGL Dither Reveal using Michelangelo's "The Creation of Adam" */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-85">
        <DitherReveal
          image="/images/creation-of-adam.png"
          ditherStyle="bayer8"
          dotSize={4}
          revealRadius={280}
          revealSoftness={65}
          wave={true}
          waveSpeed={42}
          waveDensity={18}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
        />
        {/* Subtle top & bottom edge gradient fades */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* Foreground: 3D Curved Cylindrical Streaming Grid Hero — perfectly spaced with no overlap */}
      <TiltedGridHero
        images={FEATURED_PROJECTS}
        speed={4.0}
        tileHeight={28}
        aspectRatio={16 / 9}
        gap={14}
        curve={46}
        fade={12}
        onImageClick={handleImageClick}
        className="relative z-10 w-full bg-transparent"
        style={{ height: "100vh" }}
      >
        <div className="relative z-10 flex h-full flex-col items-center justify-between pt-28 md:pt-32 pb-10 text-center pointer-events-none">
          {/* Header */}
          <div className="px-6 pointer-events-auto">
            <span className="inline-block mb-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-4 py-1 text-xs font-mono tracking-widest uppercase text-white/70">
              Featured Projects
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-heading">
              Every Dimension,<br />
              <span className="italic font-serif font-normal text-white/90">Brought into Focus.</span>
            </h2>
          </div>

          {/* Glassmorphic Interactive Sticker Badge (Prompting users to tap/explore) */}
          <div className="my-auto pointer-events-auto">
            <div
              onClick={() => {
                setSelectedProject(FEATURED_PROJECTS[0]);
                setSelectedIndex(0);
              }}
              className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.07] hover:bg-white/[0.14] active:scale-95 backdrop-blur-2xl border border-white/25 hover:border-white/50 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.4)] text-white transition-all duration-300 hover:rotate-[-1.5deg] hover:scale-105 cursor-pointer select-none -rotate-1"
              data-cursor="Tap"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedProject(FEATURED_PROJECTS[0]);
                  setSelectedIndex(0);
                }
              }}
            >
              {/* Sticker sheen / peel highlight effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.08] to-white/[0.25] pointer-events-none" />

              {/* Pulsing indicator dot */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>

              {/* Sticker typography */}
              <span className="font-mono text-[11px] md:text-xs font-semibold tracking-wider uppercase text-white/90 group-hover:text-white transition-colors">
                Tap to Explore
              </span>

              {/* Subtle sticker arrow badge */}
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/10 group-hover:bg-cyan-400 group-hover:text-black font-mono text-[9px] transition-all">
                ↗
              </span>
            </div>
          </div>

          {/* Footer Label */}
          <p className="max-w-md px-6 text-[10px] sm:text-xs font-mono tracking-widest uppercase text-white/50 pointer-events-auto">
            CYLINDER ARC STREAM • MICHELANGELO DITHER FIELD
          </p>
        </div>
      </TiltedGridHero>

      {/* Interactive Project Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 md:p-10 cursor-default"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#0b0c10] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.95)] p-4 sm:p-6 md:p-10 flex flex-col gap-5 sm:gap-6"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm sm:text-base transition-all z-30 backdrop-blur-md"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Prev / Next Navigation Controls */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 bg-black/60 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-all z-20 backdrop-blur-md"
                aria-label="Previous project"
              >
                ←
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 bg-black/60 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-all z-20 backdrop-blur-md"
                aria-label="Next project"
              >
                →
              </button>

              {/* Image Frame */}
              <div className="relative w-full h-[260px] sm:h-[360px] md:h-[420px] rounded-2xl overflow-hidden border border-white/10 bg-black">
                <img
                  src={selectedProject.src}
                  alt={selectedProject.alt}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/80">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                    {selectedProject.client}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                    {selectedProject.year}
                  </span>
                </div>
              </div>

              {/* Content Header & Body */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
                    {selectedProject.title}
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {selectedProject.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/15 text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer Action */}
                <div className="pt-4 flex items-center justify-between gap-4 border-t border-white/10">
                  <span className="text-xs font-mono text-white/60">
                    Project {selectedIndex + 1} of {FEATURED_PROJECTS.length}
                  </span>
                  <span className="text-xs font-mono text-white/40">
                    Press [ESC] or ✕ to close
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const rootEl = document.getElementById("react-portfolio-root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <FeaturedProjectsSection />
    </React.StrictMode>
  );
}
