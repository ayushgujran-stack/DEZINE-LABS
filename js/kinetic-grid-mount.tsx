import React from "react";
import { createRoot } from "react-dom/client";
import DefaultDemo from "@/components/ui/demo";

const rootEl = document.getElementById("react-kinetic-grid-root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <DefaultDemo />
    </React.StrictMode>
  );
}
