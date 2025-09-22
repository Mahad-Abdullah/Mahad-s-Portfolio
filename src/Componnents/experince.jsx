// Experience.jsx — React + JS + Tailwind v4 (fixed timeline badges, Saiyan theme-synced)
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaLaptopCode } from "react-icons/fa"

const VALID_FORMS = ["ssj1", "ssj2", "ssj3", "ssb", "ui"]

export default function Experience() {
  const [form, setForm] = useState(getInitialForm())
  const isUI = form === "ui"

  // Reactively track Saiyan form
  useEffect(() => {
    const mo = new MutationObserver(() => {
      const ds = document.documentElement.dataset.saiyan?.toLowerCase()
      if (ds && VALID_FORMS.includes(ds) && ds !== form) setForm(ds)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-saiyan"] })

    const onStorage = (e) => {
      if (e.key === "saiyan_form" && e.newValue) {
        const v = e.newValue.toLowerCase()
        if (VALID_FORMS.includes(v) && v !== form) setForm(v)
      }
    }
    window.addEventListener("storage", onStorage)

    const onEvt = (e) => {
      const v = String(e?.detail || "").toLowerCase()
      if (VALID_FORMS.includes(v) && v !== form) setForm(v)
    }
    window.addEventListener("saiyan:form", onEvt)

    return () => {
      mo.disconnect()
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("saiyan:form", onEvt)
    }
  }, [form])

  const experiences = [
    {
      id: 1,
      role: "Frontend Developer (Freelance & Self-Learning)",
      company: "Independent",
      duration: "2024 - Present",
      description:
        "Designed and developed responsive websites for clients and practice, focusing on React and Tailwind CSS. Improved UI/UX and built clean, modern components.",
    },
    {
      id: 2,
      role: "Personal Projects",
      company: "Portfolio Work",
      duration: "2023 - Present",
      description:
        "Created projects like Spotify Clone, Netflix Landing Page, and a responsive Portfolio Website to strengthen practical frontend development skills.",
    },
    {
      id: 3,
      role: "Academic Learning",
      company: "University & Online Courses",
      duration: "Ongoing",
      description:
        "Gained hands-on experience in HTML, CSS, JavaScript, and modern frameworks. Applied knowledge by working on course-based assignments and mini projects.",
    },
  ]

  return (
    <section id="experience" className="relative py-20 bg-[#0b0f14] text-slate-200">
      {/* Glow accent */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/3 left-1/4 h-[50vh] w-[60vw] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--saiyanA) 22%, transparent), transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-14 text-transparent bg-clip-text"
          style={{ backgroundImage: "linear-gradient(90deg, var(--saiyanA), var(--saiyanB))" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.7 }}
        >
          Experience
        </motion.h2>

        {/* Timeline rail */}
        <div className="relative">
          <div
            className="absolute top-0 bottom-0 left-6 md:left-8 w-px"
            style={{
              background: `linear-gradient(180deg, var(--saiyanA), var(--saiyanB))`,
              opacity: isUI ? 0.7 : 1,
            }}
          />

          <ul className="space-y-12">
            {experiences.map((exp, i) => (
              <li key={exp.id} className="relative pl-16 md:pl-20">
                {/* Badge */}
                <span
                  className="absolute left-6 md:left-8 top-0 -translate-x-1/2 translate-y-2 grid place-items-center rounded-full shadow-lg"
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    background: isUI
                      ? "linear-gradient(90deg, rgba(226,232,240,0.98), rgba(148,163,184,0.95))"
                      : "linear-gradient(90deg, var(--saiyanA), var(--saiyanB))",
                    color: isUI ? "#0b0f14" : "#ffffff",
                    boxShadow: isUI
                      ? "0 8px 22px -8px rgba(148,163,184,.45)"
                      : "0 8px 22px -8px color-mix(in oklab, var(--saiyanA) 55%, black)",
                  }}
                >
                  <FaLaptopCode className="text-lg" />
                </span>

                {/* Card */}
                <motion.div
                  className="p-6 rounded-xl backdrop-blur-sm transition"
                  style={{
                    background: "color-mix(in oklab, #111827 85%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--saiyanA) 26%, #ffffff 6%)",
                    boxShadow:
                      "0 10px 40px -18px color-mix(in oklab, var(--saiyanA) 40%, black)",
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-1">{exp.role}</h3>
                  <p className="text-sm text-slate-400 mb-3">
                    {exp.company} • {exp.duration}
                  </p>
                  <p className="text-slate-300 text-base leading-relaxed">
                    {exp.description}
                  </p>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---------- helpers ---------- */
function getInitialForm() {
  const ds = document.documentElement.dataset.saiyan?.toLowerCase()
  const ls = localStorage.getItem("saiyan_form")?.toLowerCase()
  if (ds && VALID_FORMS.includes(ds)) return ds
  if (ls && VALID_FORMS.includes(ls)) return ls
  return "ssb"
}
