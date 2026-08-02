"use client";
import React, { useState, useMemo } from "react";

const SERVICE_OPTIONS = [
  { id: "branding", label: "Branding & Logo", price: 3500, display: "$3.5k" },
  { id: "web", label: "Web Development", price: 4800, display: "$4.8k" },
  { id: "motion", label: "3D Motion Reel", price: 3200, display: "$3.2k" },
  { id: "ecommerce", label: "E-Commerce Store", price: 6500, display: "$6.5k" },
  { id: "strategy", label: "Growth Strategy", price: 2500, display: "$2.5k" },
];

const SCALE_OPTIONS = [
  { id: "startup", label: "Startup MVP", mult: 0.85 },
  { id: "growth", label: "Growth Phase", mult: 1.0 },
  { id: "enterprise", label: "Global Enterprise", mult: 1.6 },
];

export function EstimatorInteractive() {
  const [selectedServices, setSelectedServices] = useState<string[]>(["web"]);
  const [selectedScale, setSelectedScale] = useState<string>("growth");
  const [timelineWeeks, setTimelineWeeks] = useState<number>(4);

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const calculatedTotal = useMemo(() => {
    const base = selectedServices.reduce((sum, sId) => {
      const s = SERVICE_OPTIONS.find((opt) => opt.id === sId);
      return sum + (s ? s.price : 0);
    }, 0);

    const scaleObj = SCALE_OPTIONS.find((s) => s.id === selectedScale);
    const scaleMult = scaleObj ? scaleObj.mult : 1.0;

    let timelineFactor = 1.0;
    if (timelineWeeks <= 2) timelineFactor = 1.25;
    else if (timelineWeeks <= 4) timelineFactor = 1.1;

    return Math.round(base * scaleMult * timelineFactor);
  }, [selectedServices, selectedScale, timelineWeeks]);

  return (
    <div className="w-full text-left text-white space-y-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Options Column */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* 1. Services */}
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-white/50 font-mono mb-2 font-semibold">
              1. Choose Services
            </label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map((srv) => {
                const isSelected = selectedServices.includes(srv.id);
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => toggleService(srv.id)}
                    className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                      isSelected
                        ? "bg-white text-black border-white scale-[1.02]"
                        : "bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:border-white/40"
                    }`}
                  >
                    {srv.label} ({srv.display})
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Project Scale */}
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-white/50 font-mono mb-2 font-semibold">
              2. Project Scale
            </label>
            <div className="flex flex-wrap gap-2">
              {SCALE_OPTIONS.map((scale) => {
                const isSelected = selectedScale === scale.id;
                return (
                  <button
                    key={scale.id}
                    type="button"
                    onClick={() => setSelectedScale(scale.id)}
                    className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                      isSelected
                        ? "bg-white text-black border-white scale-[1.02]"
                        : "bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:border-white/40"
                    }`}
                  >
                    {scale.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Timeline Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] uppercase tracking-widest text-white/50 font-mono font-semibold">
                3. Desired Timeline
              </label>
              <span className="text-white font-mono font-bold text-xs">
                {timelineWeeks} Weeks
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              value={timelineWeeks}
              onChange={(e) => setTimelineWeeks(parseInt(e.target.value, 10))}
              className="w-full accent-white bg-white/20 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Summary Card Column */}
        <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 backdrop-blur-xl p-4 md:p-5 rounded-xl flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono font-bold block mb-1">
              Estimated Investment
            </span>
            <div className="text-3xl md:text-4xl font-extrabold font-heading text-white">
              ${calculatedTotal.toLocaleString()}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-white/50">Services:</span>
                <span className="text-white font-semibold truncate max-w-[150px]">
                  {selectedServices.map((s) => s.toUpperCase()).join(", ")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50">Scale Level:</span>
                <span className="text-white font-semibold">
                  {selectedScale.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50">Target Timeline:</span>
                <span className="text-white font-semibold">
                  {timelineWeeks} Weeks
                </span>
              </div>
            </div>
          </div>

          <a
            href="#contact"
            className="w-full py-2.5 px-4 rounded-lg font-mono text-xs uppercase tracking-wider font-bold text-center bg-white text-black hover:bg-gray-200 shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Book Scope Review &rarr;
          </a>
        </div>

      </div>
    </div>
  );
}
