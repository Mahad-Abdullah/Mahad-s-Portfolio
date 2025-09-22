// Footer.jsx — React + JS + Tailwind v4 (Saiyan theme-synced, simplified animations)
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const container = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Footer() {
  const ref = useRef(null);
  // Trigger once when ~20% of footer is in view (more reliable at page bottom)
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.footer
      ref={ref}
      className="relative bg-[#0b0f14] text-slate-400 py-10"
      variants={container}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {/* top glow themed by --saiyanB */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-1/3 left-1/2 -translate-x-1/2 h-[40vh] w-[60vw] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--saiyanB) 20%, transparent), transparent 70%)",
          }}
        />
      </div>

      {/* thin accent bar */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, var(--saiyanA), var(--saiyanB))" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: copyright */}
        <motion.p className="text-sm text-slate-500" variants={item}>
          © {new Date().getFullYear()} Mahad Abdullah. All rights reserved.
        </motion.p>

        {/* Middle: nav links with motion underline */}
        <motion.nav className="flex gap-6 text-sm" aria-label="Footer" variants={item}>
          {[
            { label: "Home", href: "#home" },
            { label: "About", href: "#about" },
            { label: "Skills", href: "#skills" },
            { label: "Projects", href: "#projects" },
            { label: "Contact", href: "#contact" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative inline-block hover:text-white transition-colors duration-200"
            >
              {link.label}
              <motion.span
                className="absolute left-0 right-0 -bottom-1 h-[2px]"
                style={{ background: "linear-gradient(90deg, var(--saiyanA), var(--saiyanB))" }}
                initial={{ scaleX: 0, opacity: 0, originX: 0 }}
                whileHover={{ scaleX: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
              />
            </a>
          ))}
        </motion.nav>

        {/* Right: socials with motion hover ring */}
        <motion.div className="flex gap-5 text-xl" variants={item}>
          {[
            { Icon: FaGithub, href: "https://github.com/yourusername", label: "GitHub" },
            { Icon: FaLinkedin, href: "https://linkedin.com/in/yourusername", label: "LinkedIn" },
            { Icon: FaEnvelope, href: "mailto:your@email.com", label: "Email" },
          ].map(({ Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="relative grid place-items-center h-9 w-9 rounded-full text-slate-400 hover:text-white"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
            >
              <Icon />
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  boxShadow: "0 0 0 2px color-mix(in oklab, var(--saiyanB) 65%, transparent)",
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </motion.footer>
  );
}
