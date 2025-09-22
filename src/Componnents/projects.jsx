// Projects.jsx — React + JS + Tailwind v4 (Saiyan theme-synced & reactive)
import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

const VALID_FORMS = ["ssj1", "ssj2", "ssj3", "ssb", "ui"];

export default function Projects() {
  // Reactively track current Saiyan form so UI-specific styles update instantly
  const [form, setForm] = useState(getInitialForm());
  const isUI = form === "ui";

  useEffect(() => {
    // 1) <html data-saiyan="...">
    const mo = new MutationObserver(() => {
      const ds = document.documentElement.dataset.saiyan?.toLowerCase();
      if (ds && VALID_FORMS.includes(ds) && ds !== form) setForm(ds);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-saiyan"] });

    // 2) localStorage changes
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

  const projects = [
    {
      id: 1,
      title: "Appliances Repair",
      description: "A responsive Landing page built with React & Tailwind CSS.",
      image: "/public/Home appliances fix.png",
      demo: "https://mahad-abdullah.github.io/Home-Appliances-react-website/",
      github: "#",
    },
    {
      id: 2,
      title: "Hakeem",
      description: "Hakeem financial company website with modern UI and responsiveness.",
      image: "/public/hakeem.png",
      demo: "https://hakeem.tech/",
      github: "#",
    },
    {
      id: 3,
      title: "Amazone Clone",
      description: "An Amazon clone with product listings, cart, and responsive design.",
      image: "/public/Amazon Clone.png",
      demo: "#",
      github: "#",
    },
  ];

  return (
    <section id="projects" className="relative py-20 bg-[#0b0f14] text-slate-200">
      {/* themed glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/4 -left-1/3 h-[40vh] w-[60vw] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--saiyanA) 22%, transparent), transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-14 text-transparent bg-clip-text"
          style={{ backgroundImage: "linear-gradient(90deg, var(--saiyanA), var(--saiyanB))" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.7 }}
        >
          My Projects
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="group rounded-2xl overflow-hidden backdrop-blur-sm transition"
              style={{
                background: "color-mix(in oklab, #111827 85%, transparent)",
                border: "1px solid color-mix(in oklab, var(--saiyanA) 26%, #ffffff 6%)",
                boxShadow:
                  "0 20px 60px -18px color-mix(in oklab, var(--saiyanA) 40%, black)",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-contain transform group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6 text-left">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-base">{project.description}</p>

                <div className="flex justify-center gap-4 mt-5">
                  {/* Demo button – themed; UI gets silver variant for contrast */}
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full justify-center py-2 rounded-lg text-sm font-medium transition active:scale-[.97]"
                    style={{
                      background: isUI
                        ? "linear-gradient(90deg, rgba(226,232,240,0.98), rgba(148,163,184,0.95))"
                        : "linear-gradient(90deg, var(--saiyanA), var(--saiyanB))",
                      color: isUI ? "#0b0f14" : "#ffffff",
                      border: isUI ? "1px solid rgba(148,163,184,.55)" : "1px solid transparent",
                      boxShadow: isUI
                        ? "0 8px 22px -10px rgba(148,163,184,.45), 0 1px 0 rgba(0,0,0,.2) inset"
                        : "0 10px 30px -12px color-mix(in oklab, var(--saiyanA) 55%, black)",
                    }}
                  >
                    <FaExternalLinkAlt /> Demo
                  </a>

                  {/* Code button – neutral */}
                  {/* <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border text-slate-300 hover:bg-slate-800/60 transition active:scale-[.97]"
                    style={{ borderColor: "color-mix(in oklab, #64748b 60%, transparent)" }}
                  >
                    <FaGithub /> Code
                  </a> */}
                </div>
              </div>

              {/* card bottom accent bar using theme */}
              <div
                className="h-[3px] w-full"
                style={{ background: "linear-gradient(90deg, var(--saiyanA), var(--saiyanB))" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
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
