/**
 * React mount point for the "Build Your Project Scope" section.
 * Transfers the UI from "Let's Build Something Iconic" into this existing
 * section, copying the UI exactly.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { BuildSomethingInteractive } from "@/components/ui/build-something-interactive";
import "../styles/tailwind.css";

function ScopeSection() {
  return (
    <div className="w-full relative py-8 px-4 sm:px-6 lg:px-8">
      <BuildSomethingInteractive />
    </div>
  );
}

const rootEl = document.getElementById("react-estimator-root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <ScopeSection />
    </React.StrictMode>
  );
}
