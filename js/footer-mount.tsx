/**
 * React mount point for the RuixenGradientFooter.
 * This renders the gradient footer into a <div id="react-footer-root"> 
 * element in the existing vanilla HTML page.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { RuixenGradientFooter } from "@/components/ui/ruixen-gradient-footer";
import "../styles/tailwind.css";

const columns = [
  {
    title: "Services",
    links: ["Brand Identity", "3D Motion", "Web Design", "Digital Strategy", "E-Commerce"],
  },
  {
    title: "Company",
    links: ["About Us", "Our Work", "Careers", "Blog", "Press Kit"],
  },
  {
    title: "Resources",
    links: ["Estimator", "Case Studies", "Process", "FAQ", "Support"],
  },
  {
    title: "Connect",
    links: [
      { name: "LinkedIn", href: "https://www.linkedin.com/in/ayush-poojary-7237362b9" },
      { name: "Instagram", href: "https://www.instagram.com/dezine.labs?utm_source=ig_web_button_share_sheet&obrf=ZDNlZDc0MzIxNw==" },
      { name: "Fiverr", href: "https://www.fiverr.com/ayush_poojary" },
      { name: "Email", href: "mailto:contact@dezinelabs.com" },
    ],
  },
];

function DezineFooter() {
  return (
    <RuixenGradientFooter gradientHeight="40vh">
      <div className="mx-auto w-full max-w-5xl px-6 pt-12">
        <div className="grid gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-foreground">
              <span
                style={{
                  width: 10,
                  height: 10,
                  background: "#FFFFFF",
                  borderRadius: "50%",
                  boxShadow: "none",
                  display: "inline-block",
                }}
              />
              <span className="font-mono text-sm uppercase tracking-widest">
                DEZINE
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Next-gen creative agency specializing in high-end brand identity,
              scroll-driven web experiences, 3D motion graphics, and digital
              strategy.
            </p>

            <div className="mt-6 flex max-w-xs gap-2">
              <input
                type="email"
                aria-label="Email address"
                placeholder="you@company.com"
                className="h-9 w-full rounded-md border border-border bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none"
              />
              <button
                type="button"
                className="h-9 shrink-0 rounded-md bg-foreground px-3 font-mono text-xs uppercase tracking-wider text-background transition-opacity hover:opacity-90"
              >
                Join
              </button>
            </div>
          </div>

          {/* Link columns */}
          <nav className="grid grid-cols-2 gap-10 font-mono text-xs uppercase tracking-wider sm:grid-cols-4 lg:col-span-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-foreground">{col.title}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => {
                    const isObj = typeof link === "object";
                    const label = isObj ? link.name : link;
                    const href = isObj ? link.href : "#";
                    const isExternal = href.startsWith("http");
                    return (
                      <li key={label}>
                        <a
                          href={href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 pb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground sm:flex-row">
          <span>© 2026 DEZINE Creative Agency</span>
          <span className="flex items-center gap-2">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#FFFFFF",
                display: "inline-block",
              }}
            />
            All systems normal
          </span>
          <span>Global · Remote</span>
        </div>
      </div>
    </RuixenGradientFooter>
  );
}

// Mount into the page
const rootEl = document.getElementById("react-footer-root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <DezineFooter />
    </React.StrictMode>
  );
}
