/**
 * React mount bridge for the 3D Photography Gallery (Infinite Cloth Shader)
 * in "The Journey" section of DEZINE LABS.
 * Features 6 cinematic close-up planes with hybrid video & image support,
 * pinned sticky-scroll immersion, and click-to-expand cinematic viewer.
 */
import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import InfiniteGallery from '@/components/ui/3d-gallery-photography';
import '../styles/tailwind.css';

export interface JourneySlot {
  src: string;
  type?: 'image' | 'video';
  alt?: string;
}

const JOURNEY_ITEMS: JourneySlot[] = [
  {
    src: '/videos/journey/journey-01.mp4',
    type: 'video',
    alt: 'The Journey — Video 01',
  },
  {
    src: '/videos/journey/journey-02.mp4',
    type: 'video',
    alt: 'The Journey — Video 02',
  },
  {
    src: '/videos/journey/journey-03.mp4',
    type: 'video',
    alt: 'The Journey — Video 03',
  },
  {
    src: '/videos/journey/journey-04.mp4',
    type: 'video',
    alt: 'The Journey — Video 04',
  },
  {
    src: '/images/journey/journey-05.png',
    type: 'image',
    alt: 'The Journey — Milestone 05',
  },
  {
    src: '/images/journey/journey-06.png',
    type: 'image',
    alt: 'The Journey — Milestone 06',
  },
];

export function TheJourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[240vh]"
    >
      {/* Sticky Viewport: Pins on screen while user scrolls through depth */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black select-none border-y border-white/10 pointer-events-none">
        <InfiniteGallery
          images={JOURNEY_ITEMS}
          speed={1.2}
          zSpacing={3.2}
          visibleCount={6}
          falloff={{ near: 0.8, far: 14 }}
          className="h-full w-full"
        />

        {/* Center "The Journey" headline in serif italics with mix-blend-exclusion */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-center px-4 mix-blend-exclusion text-white z-10">
          <h1 className="font-serif text-5xl sm:text-7xl md:text-9xl tracking-tight">
            <span className="italic">The Journey</span>
          </h1>
        </div>
      </div>
    </div>
  );
}

const rootEl = document.getElementById('react-upclose-root');
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <TheJourneySection />
    </React.StrictMode>
  );
}
