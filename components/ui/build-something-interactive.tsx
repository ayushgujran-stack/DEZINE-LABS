"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BuildSomethingInteractive() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    brief: "",
    budget: "$10k - $25k",
  });

  // Auto-expand form when user clicks nav links targeting #contact
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#contact") {
        setIsExpanded(true);
      }
    };
    
    // Check initial hash
    if (window.location.hash === "#contact") {
      setIsExpanded(true);
    }

    // Intercept clicks on links targeting #contact
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    contactLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setIsExpanded(true);
      });
    });

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0, scale: 0.98 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-[#161514] backdrop-blur-xl shadow-2xl transition-all duration-300"
    >
      <div className="relative z-10 p-6 md:p-10">
        
        {/* Header Section */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer group select-none text-center flex flex-col items-center justify-center space-y-4"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono font-medium uppercase tracking-widest text-neutral-300 transition-all duration-300 group-hover:border-white/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Project Inquiry</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-heading">
            START A PROJECT BRIEF
          </h2>

          <p className="text-sm md:text-base text-neutral-400 max-w-xl">
            Have an upcoming project or looking to build a new brand experience? Tell us about your goals.
          </p>

          {/* Expand pill button indicator */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-2 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs md:text-sm uppercase tracking-wider shadow-md transition-all duration-300 hover:bg-neutral-200"
          >
            <span>{isExpanded ? "Collapse Brief Form" : "Open Project Brief Form"}</span>
            <motion.svg
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.div>
        </div>

        {/* Collapsible Input Detail Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 32 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-white/10 pt-8"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-white font-heading">
                    Brief Received
                  </h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto">
                    Thank you, {formData.name || "Partner"}. Our team will review your specifications and follow up within one business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setIsExpanded(false);
                    }}
                    className="mt-4 px-5 py-2 rounded-full border border-white/20 text-xs font-mono uppercase text-gray-300 hover:text-white hover:border-white transition-all"
                  >
                    Close Brief
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-left max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">
                        Your Name / Company *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Mercer"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                      Budget Tier
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["$5k - $10k", "$10k - $25k", "$25k+"].map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setFormData({ ...formData, budget: tier })}
                          className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                            formData.budget === tier
                              ? "bg-white text-black border-white"
                              : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/30"
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brief */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                      Project Brief & Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your project goals, timelines, and requirements..."
                      value={formData.brief}
                      onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-mono text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 shadow-lg transition-all"
                  >
                    Submit Project Brief &rarr;
                  </motion.button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
