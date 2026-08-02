/**
 * React mount point for the Card Fan Carousel on the Portfolio section.
 * Replaces the old filterable portfolio grid with a minimal, animated
 * fanned card carousel using the same project images.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";
import "../styles/tailwind.css";

// Portfolio project images — same as the original portfolio data
const PORTFOLIO_CARDS: CardItem[] = [
  {
    imgUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    alt: "Aetheria Brand System",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    alt: "VORTEX Cyber Dashboard",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    alt: "Kinetic Fluid Mechanics",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    alt: "NEO-LUXE Fashion House",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    alt: "Hyperion Aerospace Brand",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    alt: "Quantum Intelligence Web Engine",
  },
];

function PortfolioCarousel() {
  return (
    <div className="dark">
      {/* Minimal header */}
      <div className="text-center pt-16 pb-4 px-6">
        <span className="inline-block mb-4 rounded-full border border-white/10 px-3 py-1 text-xs font-medium tracking-widest uppercase text-white/50">
          Selected Work
        </span>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          Featured Projects
        </h2>
      </div>

      {/* Card fan carousel */}
      <SocialCards cards={PORTFOLIO_CARDS} />
    </div>
  );
}

// Mount into the page
const rootEl = document.getElementById("react-portfolio-root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <PortfolioCarousel />
    </React.StrictMode>
  );
}
