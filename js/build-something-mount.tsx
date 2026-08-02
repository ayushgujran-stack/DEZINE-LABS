/**
 * React mount point for the BuildSomethingInteractive section.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { BuildSomethingInteractive } from "@/components/ui/build-something-interactive";
import "../styles/tailwind.css";

const rootEl = document.getElementById("react-build-something-root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <BuildSomethingInteractive />
    </React.StrictMode>
  );
}
