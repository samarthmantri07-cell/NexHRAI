import Link from "next/link";
import { Zap, ExternalLink, Globe2 } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden pt-20 pb-10"
      style={{
        background: "oklch(0.07 0.012 265)",
        borderTop: "1px solid oklch(1 0 0 / 0.07)",
      }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% -10%, oklch(0.70 0.22 265 / 0.06), transparent)",
        }}
      />

      <div className="container px-4 md:px-8 mx-auto max-w-7xl relative z-10">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand col — 2 wide */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
                  boxShadow: "0 0 20px oklch(0.70 0.22 265 / 0.3)",
                }}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span
                className="font-bold text-xl text-white tracking-tight"
                style={{ fontFamily: "Syne, system-ui" }}
              >
                NexHR
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  -AI
                </span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Intelligent workforce analytics and employee retention powered by enterprise-grade machine learning. Built for the modern people team.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2">
              {[
                { icon: ExternalLink, label: "GitHub" },
                { icon: Globe2, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-white transition-all duration-200 hover:scale-110"
                  style={{
                    background: "oklch(1 0 0 / 0.04)",
                    border: "1px solid oklch(1 0 0 / 0.08)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Security", "Changelog", "Roadmap"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Press", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h5
                className="text-white font-semibold text-sm mb-5"
                style={{ fontFamily: "Syne, system-ui" }}
              >
                {col.title}
              </h5>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-white transition-colors duration-200"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          className="h-px mb-8"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.10), transparent)",
          }}
        />

        {/* Built With section */}
        <div className="flex justify-center mb-8">
          <p className="text-sm text-muted-foreground/80 text-center flex items-center flex-wrap justify-center gap-1">
            Built with <span className="text-red-500 animate-pulse mx-1">❤️</span> using 
            <span className="font-medium text-white">Next.js</span>, 
            <span className="font-medium text-white">React</span>, 
            <span className="font-medium text-white">Python</span>, 
            <span className="font-medium text-white">FastAPI</span>, 
            <span className="font-medium text-white">PostgreSQL</span> and 
            <span className="font-medium text-white">Machine Learning</span>.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} NexHR-AI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.72 0.18 145)" }}
              />
              All Systems Operational
            </div>
            <span style={{ color: "oklch(1 0 0 / 0.2)" }}>·</span>
            <span>v2.4.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
