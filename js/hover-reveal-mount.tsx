/**
 * React mount bridge for the Originkit "Hover Image Reveal" component.
 * Minimalist, high-end editorial selected work display where sweeping over
 * each project title reveals its visual with smooth fluid motion.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import HoverImageReveal from "@/components/originkit/ui/hover-image-reveal";
import "../styles/tailwind.css";

const DEZINE_EXPERTISE = {
  itemCount: 6,
  item1: {
    text: "01  VISUAL ARCHITECTURE & SOUL",
    image: {
      src: "/images/expertise/visual-architecture.jpg",
      alt: "Visual Architecture & Brand Systems Monolith",
    },
    link: "#services",
  },
  item2: {
    text: "02  KINETIC REALMS & SPATIAL 3D",
    image: {
      src: "/images/expertise/kinetic-realms.jpg",
      alt: "Kinetic Motion & Spatial Worlds Sculpture",
    },
    link: "#services",
  },
  item3: {
    text: "03  CREATIVE CODE & INTERACTION",
    image: {
      src: "/images/expertise/creative-code.jpg",
      alt: "Creative Code & Interactive Web Wireframe Mesh",
    },
    link: "#services",
  },
  item4: {
    text: "04  TACTILE INTERFACES & SYSTEMS",
    image: {
      src: "/images/expertise/tactile-interfaces.jpg",
      alt: "Tactile Digital Interface Calibrations & Frosted Glass",
    },
    link: "#services",
  },
  item5: {
    text: "05  CINEMATIC VISION & DIRECTION",
    image: {
      src: "/images/expertise/cinematic-vision.jpg",
      alt: "Cinematic Art Direction & Sensory Aesthetics",
    },
    link: "#services",
  },
  item6: {
    text: "06  CATALYTIC DIGITAL STRATEGY",
    image: {
      src: "/images/expertise/catalytic-strategy.jpg",
      alt: "Catalytic Strategy & Equilibrium Balance",
    },
    link: "#services",
  },
};

function MinimalSelectedWork() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="w-full relative py-8">
      <HoverImageReveal
        items={DEZINE_EXPERTISE}
        textColor="#edeae4"
        dimColor="#3e3c38"
        backgroundColor="transparent"
        align="left"
        rowGap={isMobile ? 18 : 24}
        imageWidth={isMobile ? 240 : 340}
        imageHeight={isMobile ? 310 : 440}
        rounded={14}
        offsetY={isMobile ? -10 : -30}
        followStrength={8}
        font={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(22px, 5.2vw, 76px)",
          lineHeight: "1.06em",
          letterSpacing: "-0.03em",
          fontVariationSettings: '"wdth" 76, "wght" 800',
        }}
        style={{
          padding: 0,
        }}
      />
    </div>
  );
}

const rootEl = document.getElementById("react-hover-reveal-root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <MinimalSelectedWork />
    </React.StrictMode>
  );
}
