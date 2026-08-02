"use client";

import React, { useEffect, useRef } from "react";

export interface AsciiElectricGazeProps {
  imageSrc: string;
  cellSize?: number;
  contrast?: number;
  animStyle?: string;
  animSpeed?: number;
  animIntensity?: number;
  className?: string;
}

export function AsciiElectricGaze({
  imageSrc = "/images/architect-portrait.jpg",
  cellSize = 9,
  contrast = 158,
  animStyle = "shimmer",
  animSpeed = 100,
  animIntensity = 60,
  className = "",
}: AsciiElectricGazeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    let animationFrameId: number;
    let startTime = performance.now();

    img.onload = () => {
      const resizeAndRender = () => {
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        
        // Target display size
        const displayWidth = rect.width;
        const displayHeight = rect.height || displayWidth * (img.height / img.width);

        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        const W = canvas.width;
        const H = canvas.height;

        // Offscreen sampling canvas
        const offCanvas = document.createElement("canvas");
        offCanvas.width = W;
        offCanvas.height = H;
        const offCtx = offCanvas.getContext("2d");
        if (!offCtx) return;

        // Draw original photo into offscreen canvas
        offCtx.drawImage(img, 0, 0, W, H);
        const imgData = offCtx.getImageData(0, 0, W, H);
        const pixels = imgData.data;

        // Contrast adjustment multiplier
        const contrastFactor = Math.max(0, (255 + contrast) / (255 - Math.min(contrast, 254)));

        const renderFrame = (now: number) => {
          const elapsed = (now - startTime) / 1000;
          const speedMult = (animSpeed / 100) * 3;
          const timeOffset = elapsed * speedMult;

          ctx.clearRect(0, 0, W, H);
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, W, H);

          const scaledCell = cellSize * dpr;
          const cols = Math.floor(W / scaledCell);
          const rows = Math.floor(H / scaledCell);

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const startX = Math.floor(c * scaledCell);
              const startY = Math.floor(r * scaledCell);

              // Sample center of cell
              const sampleX = Math.min(W - 1, Math.floor(startX + scaledCell / 2));
              const sampleY = Math.min(H - 1, Math.floor(startY + scaledCell / 2));
              const idx = (sampleY * W + sampleX) * 4;

              let red = pixels[idx];
              let green = pixels[idx + 1];
              let blue = pixels[idx + 2];

              // Apply Contrast
              red = Math.min(255, Math.max(0, (red - 128) * contrastFactor + 128));
              green = Math.min(255, Math.max(0, (green - 128) * contrastFactor + 128));
              blue = Math.min(255, Math.max(0, (blue - 128) * contrastFactor + 128));

              // Compute Luminance
              let lum = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

              // Shimmer Animation Effect
              const wave = Math.sin(timeOffset * 2.5 + c * 0.12 + r * 0.15);
              const shimmerShift = wave * (animIntensity / 100) * 0.18;
              lum = Math.min(1, Math.max(0, lum + shimmerShift));

              // Check if electric blue eyes feature (high blue + bright)
              const isElectricBlue = blue > 160 && blue > red * 1.3;

              if (lum > 0.04 || isElectricBlue) {
                ctx.save();

                if (isElectricBlue) {
                  // Electric eye glow dither node
                  const dotRadius = (scaledCell / 2) * (0.6 + lum * 0.8);
                  ctx.fillStyle = `rgba(60, 166, 255, ${Math.min(1, 0.8 + Math.sin(timeOffset * 4 + c) * 0.2)})`;
                  ctx.shadowColor = "#3ca6ff";
                  ctx.shadowBlur = 12 * dpr;

                  ctx.beginPath();
                  ctx.arc(
                    startX + scaledCell / 2,
                    startY + scaledCell / 2,
                    dotRadius,
                    0,
                    Math.PI * 2
                  );
                  ctx.fill();
                } else {
                  // Standard dither matrix primitive rendering
                  const rad = (scaledCell / 2.2) * (lum * 0.95);
                  const alpha = Math.min(1, lum * 1.2);
                  ctx.fillStyle = `rgba(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)}, ${alpha.toFixed(2)})`;

                  ctx.beginPath();
                  ctx.arc(
                    startX + scaledCell / 2,
                    startY + scaledCell / 2,
                    Math.max(0.5, rad),
                    0,
                    Math.PI * 2
                  );
                  ctx.fill();
                }

                ctx.restore();
              }
            }
          }

          animationFrameId = requestAnimationFrame(renderFrame);
        };

        animationFrameId = requestAnimationFrame(renderFrame);
      };

      resizeAndRender();
      window.addEventListener("resize", resizeAndRender);

      return () => {
        window.removeEventListener("resize", resizeAndRender);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };
    };

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [imageSrc, cellSize, contrast, animStyle, animSpeed, animIntensity]);

  return (
    <div ref={containerRef} className={`relative w-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-auto mx-auto" />
    </div>
  );
}
