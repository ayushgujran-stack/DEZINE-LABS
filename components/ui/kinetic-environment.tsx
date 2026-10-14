"use client";

import React, { createContext, useContext, useRef, useEffect } from "react";
import { useMotionValue, useSpring, MotionValue } from "framer-motion";

interface KineticContextType {
  cursorX: MotionValue<number>; // Normalized 0 -> 1
  cursorY: MotionValue<number>; // Normalized 0 -> 1
  rawX: MotionValue<number>; // Pixels
  rawY: MotionValue<number>; // Pixels
  isActive: MotionValue<number>; // 0 or 1
  radius: MotionValue<number>; // Proximity to center (0 = edge, 1 = exact center)
}

export const KineticContext = createContext<KineticContextType | null>(null);

export function useKineticEnvironment() {
  const context = useContext(KineticContext);
  if (!context) {
    throw new Error("useKineticEnvironment must be used within a KineticEnvironment");
  }
  return context;
}

export function KineticEnvironment({ children, className }: { children: React.ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Raw pixel coordinates
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Normalized coordinates (0 to 1)
  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

  // Active state (is pointer inside)
  const active = useMotionValue(0);
  
  // Proximity to center (1 = center, 0 = edge)
  const prox = useMotionValue(0);

  // Spring physics config - heavy, springy feel
  const springConfig = { damping: 20, stiffness: 100, mass: 1 };
  
  // Smoothed values
  const cursorX = useSpring(normX, springConfig);
  const cursorY = useSpring(normY, springConfig);
  const isActive = useSpring(active, { damping: 20, stiffness: 100 });
  const radius = useSpring(prox, springConfig);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    rawX.set(x);
    rawY.set(y);
    
    // Normalize to 0 -> 1
    const nx = x / rect.width;
    const ny = y / rect.height;
    
    normX.set(nx);
    normY.set(ny);
    
    // Calculate proximity to center (0.5, 0.5)
    const dx = nx - 0.5;
    const dy = ny - 0.5;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // 0 distance = 1 prox, 0.5 distance = 0 prox
    const p = Math.max(0, 1 - dist * 2);
    prox.set(p);
    
    active.set(1);
  };

  const handlePointerLeave = () => {
    // Return to center
    normX.set(0.5);
    normY.set(0.5);
    prox.set(0);
    active.set(0);
  };

  // Setup global touch move for mobile drag
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // If touch is within section bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        rawX.set(x);
        rawY.set(y);
        
        const nx = x / rect.width;
        const ny = y / rect.height;
        normX.set(nx);
        normY.set(ny);
        
        const dx = nx - 0.5;
        const dy = ny - 0.5;
        const p = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) * 2);
        prox.set(p);
        active.set(1);
      }
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => window.removeEventListener("touchmove", handleTouchMove);
  }, [normX, normY, prox, active, rawX, rawY]);

  return (
    <KineticContext.Provider value={{ cursorX, cursorY, rawX, rawY, isActive, radius }}>
      <div 
        ref={containerRef} 
        className={className}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ touchAction: "pan-y" }} // Allow natural vertical scrolling on touch devices
      >
        {children}
      </div>
    </KineticContext.Provider>
  );
}
