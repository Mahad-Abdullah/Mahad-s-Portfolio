// Skills.jsx — React + JS + Tailwind v4 (Saiyan theme + icon sway)
import React from "react";
import { motion } from "framer-motion";
import { FaHtml5, FaCss3Alt, FaJs, FaReact } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";

export default function Skills() {
  const skills = [
    { name: "HTML", icon: <FaHtml5 className="text-orange-500 text-5xl" /> },
    { name: "CSS", icon: <FaCss3Alt className="text-blue-500 text-5xl" /> },
    { name: "JavaScript", icon: <FaJs className="text-yellow-400 text-5xl" /> },
    { name: "React", icon: <FaReact className="text-cyan-400 text-5xl" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss className="text-sky-500 text-5xl" /> },
  ];

  return (
    <section id="skills" className="relative py-20 bg-[#0b0f14] text-slate-200">
      {/* themed background accent */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute bottom-1/4 right-1/3 h-[40vh] w-[60vw] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--saiyanB) 22%, transparent), transparent 70%)",
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
          My Skills
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="group flex flex-col items-center rounded-2xl p-6 backdrop-blur-sm transition-transform"
              style={{
                background: "color-mix(in oklab, #111827 85%, transparent)",
                border: "1px solid color-mix(in oklab, var(--saiyanA) 26%, #ffffff 6%)",
                boxShadow:
                  "0 10px 34px -18px color-mix(in oklab, var(--saiyanA) 38%, black)",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.08 }}
            >
              {/* icon: gentle back-and-forth (no rotation) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 2 + (index % 3) * 0.25, // thoda sa offset per icon
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {skill.icon}
              </motion.div>

              <p className="mt-3 text-lg font-medium text-slate-200">{skill.name}</p>

              {/* underline accent using theme */}
              <span
                className="mt-2 block h-[2px] w-10 origin-left scale-x-0 opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"
                style={{ background: "linear-gradient(90deg, var(--saiyanA), var(--saiyanB))" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
