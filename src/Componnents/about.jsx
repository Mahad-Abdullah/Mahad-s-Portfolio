// About.jsx — React + JS + Tailwind v4 (Saiyan theme-synced & reactive)
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const VALID_FORMS = ["ssj1", "ssj2", "ssj3", "ssb", "ui"];

export default function About() {
  const [form, setForm] = useState(getInitialForm());
  const isUI = form === "ui";

  // keep form in sync with html dataset / localStorage / custom event
  useEffect(() => {
    // 1) watch <html data-saiyan="...">
    const mo = new MutationObserver(() => {
      const ds = document.documentElement.dataset.saiyan?.toLowerCase();
      if (ds && VALID_FORMS.includes(ds) && ds !== form) setForm(ds);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-saiyan"] });

    // 2) listen to localStorage changes (other tabs/components)
    const onStorage = (e) => {
      if (e.key === "saiyan_form" && e.newValue) {
        const v = e.newValue.toLowerCase();
        if (VALID_FORMS.includes(v) && v !== form) setForm(v);
      }
    };
    window.addEventListener("storage", onStorage);

    // 3) custom event
    const onEvt = (e) => {
      const v = String(e?.detail || "").toLowerCase();
      if (VALID_FORMS.includes(v) && v !== form) setForm(v);
    };
    window.addEventListener("saiyan:form", onEvt);

    return () => {
      mo.disconnect();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("saiyan:form", onEvt);
    };
  }, [form]);

  return (
    <section
      id="about"
      className="relative w-full bg-[#0b0f14] text-slate-200 py-20 px-4"
      aria-labelledby="about-title"
    >
      {/* Background glow (tinted by current form) */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-1/4 left-1/2 -translate-x-1/2 h-[50vh] w-[70vw] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--saiyanB) 25%, transparent), transparent 70%)",
          }}
        />
      </div>

      <motion.div
        className="relative max-w-5xl mx-auto flex flex-col gap-8"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <header className="text-center">
          <h2
            id="about-title"
            className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg, var(--saiyanA), var(--saiyanB))" }}
          >
            About Me
          </h2>

          {/* availability badge — themed border & dot */}
          <div className="flex justify-center">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
              style={{
                border: "1px solid",
                borderColor: "color-mix(in oklab, var(--saiyanB) 45%, #ffffff 10%)",
                color: "color-mix(in oklab, var(--saiyanB) 75%, #d1fae5 10%)",
                background: "color-mix(in oklab, var(--saiyanB) 12%, transparent)",
              }}
            >
              <span
                className="inline-block h-2 w-2 rounded-full animate-pulse"
                style={{ background: "var(--saiyanB)" }}
              />
              Available for hire!
            </span>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Text block */}
          <div className="lg:col-span-7">
            <p className="text-lg md:text-xl leading-relaxed text-slate-300 mb-4">
              Hi, I’m <span className="font-semibold text-white">Mahad</span>, a{" "}
              <span style={{ color: "var(--saiyanB)" }}>Frontend Web Developer</span> who
              loves building clean, responsive, and user-friendly interfaces with React and
              Tailwind. I focus on accessibility, performance, and smooth micro-interactions
              that make products feel premium.
            </p>

            <p className="text-lg md:text-xl leading-relaxed text-slate-400 mb-4">
              I’m currently pursuing a{" "}
              <span className="font-semibold text-slate-200">Bachelor’s in Computer Science</span>.
              My goal is to help businesses ship impactful digital experiences while
              continuously leveling up my craft.
            </p>

            <p className="text-lg md:text-xl leading-relaxed text-slate-400">
              Outside of coding, I explore design systems, animation patterns, and new tooling
              to keep my workflow sharp and future-ready.
            </p>

            {/* CTA — uses --saiyan vars; UI gets higher contrast */}
            <div className="mt-6">
              <a
                href="#projects"
                className="inline-block px-7 py-3 text-base md:text-lg rounded-full transition-transform active:scale-[.98]"
                style={{
                  background: isUI
                    ? "linear-gradient(90deg, rgba(226,232,240,0.98), rgba(148,163,184,0.95))"
                    : "linear-gradient(90deg, var(--saiyanA), var(--saiyanB))",
                  color: isUI ? "#0b0f14" : "#ffffff",
                  border: isUI ? "1px solid rgba(148,163,184,.55)" : "1px solid transparent",
                  boxShadow: isUI
                    ? "0 10px 30px -10px rgba(148,163,184,.45), 0 1px 0 rgba(0,0,0,.2) inset"
                    : "0 10px 30px -10px color-mix(in oklab, var(--saiyanA) 55%, black)",
                }}
              >
                Explore Projects
              </a>
            </div>
          </div>

          {/* Quick facts / highlights */}
          <div className="lg:col-span-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {[
                {
                  title: "Core Stack",
                  body:
                    "React, JavaScript (ES6+), Tailwind CSS, Framer Motion, HTML5/CSS3.",
                },
                {
                  title: "What I Deliver",
                  body:
                    "Responsive layouts, accessible components, clean animations, and performance-focused builds.",
                },
                {
                  title: "Currently Learning",
                  body:
                    "Advanced animation patterns, design systems, and modern tooling best practices.",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  className="rounded-2xl backdrop-blur-sm p-5 transition-shadow"
                  style={{
                    background: "color-mix(in oklab, #111827 85%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--saiyanA) 28%, #ffffff 6%)",
                    boxShadow:
                      "0 10px 40px -18px color-mix(in oklab, var(--saiyanA) 40%, black)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-base font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- helpers ---------- */
function getInitialForm() {
  const ds = document.documentElement.dataset.saiyan?.toLowerCase();
  const ls = localStorage.getItem("saiyan_form")?.toLowerCase();
  if (ds && VALID_FORMS.includes(ds)) return ds;
  if (ls && VALID_FORMS.includes(ls)) return ls;
  return "ssb";
}
