// Navbar.jsx — React + JS + Tailwind v4-ready (Goku/Kakarot theming, mobile-first)
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { HiMiniXMark } from "react-icons/hi2";

const LINKS = [
  { label: "Home", id: "home", href: "#home" },
  { label: "About", id: "about", href: "#about" },
  { label: "Skills", id: "skills", href: "#skills" },
  { label: "Projects", id: "projects", href: "#projects" },
  { label: "Experience", id: "experience", href: "#experience" },
  { label: "Contact", id: "contact", href: "#contact" },
];

// Saiyan palettes
const FORM_COLORS = {
  ssj1: { a: "#F59E0B", b: "#FCD34D", ring: "rgba(245,158,11,.7)" },
  ssj2: { a: "#FBBF24", b: "#FDE68A", ring: "rgba(251,191,36,.7)" },
  ssj3: { a: "#FB923C", b: "#F59E0B", ring: "rgba(251,146,60,.7)" },
  ssb:  { a: "#3B82F6", b: "#38BDF8", ring: "rgba(56,189,248,.7)" },
  ui:   { a: "#FFFFFF", b: "#94A3B8", ring: "rgba(148,163,184,.7)" },
};
const DEFAULT_FORM = "ssb";

// measure navbar height for precise offset
function getNavOffset() {
  const bar =
    document.querySelector("nav[aria-label='Primary'] .js-nav-shell") ||
    document.querySelector("nav[aria-label='Primary']");
  const h = bar ? bar.getBoundingClientRect().height + 12 : 88;
  return Math.max(64, Math.min(128, Math.round(h)));
}
function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - getNavOffset();
  window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState(getInitialForm());
  const lastY = useRef(0);
  const progressRef = useRef(null);
  const ticking = useRef(false);

  // derive theme colors
  const theme = FORM_COLORS[form] || FORM_COLORS[DEFAULT_FORM];
  const grad = `linear-gradient(90deg, ${theme.a}, ${theme.b})`;
  const ringCls = `focus-visible:ring-2 focus-visible:ring-[${theme.ring}]`;

  // listen for form changes (dataset, localStorage, custom event)
  useEffect(() => {
    const mo = new MutationObserver(() => {
      const ds = document.documentElement.dataset.saiyan;
      if (ds && ds !== form) setForm(sanitizeForm(ds));
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-saiyan"] });

    const onStorage = (e) => {
      if (e.key === "saiyan_form" && e.newValue) setForm(sanitizeForm(e.newValue));
    };
    window.addEventListener("storage", onStorage);

    const onEvt = (e) => {
      if (e?.detail) setForm(sanitizeForm(e.detail));
    };
    window.addEventListener("saiyan:form", onEvt);

    return () => {
      mo.disconnect();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("saiyan:form", onEvt);
    };
  }, [form]);

  // active section highlight
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // anchor click handler (desktop + mobile)
  useEffect(() => {
    function handleClick(e) {
      const a = e.target.closest?.("a[href^='#']");
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return;
      const id = hash.slice(1);
      if (!document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
      setOpen(false);
      history.replaceState(null, "", hash);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // /#hash load + hash changes
  useEffect(() => {
    const onHash = () => {
      const id = (location.hash || "#home").slice(1);
      if (document.getElementById(id)) scrollToId(id);
    };
    requestAnimationFrame(() => {
      if (location.hash) onHash();
    });
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // hide on scroll down, show on up + progress bar + style toggle (rAF throttled)
  useEffect(() => {
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        setScrolled(y > 8);

        // progress
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const p = h > 0 ? Math.min(1, y / h) : 0;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${p})`;
        }

        // hide/show (skip if reduced motion)
        if (!prefersReduced) {
          const goingDown = y > lastY.current + 2;
          const goingUp = y < lastY.current - 2;
          if (y > 120 && goingDown) setHidden(true);
          if (goingUp) setHidden(false);
        }
        lastY.current = y;
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll + esc to close when mobile menu open
  useEffect(() => {
    const html = document.documentElement;
    if (open) {
      html.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
    }
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const underlineClass = useMemo(
    () =>
      "pointer-events-none absolute left-0 right-0 -bottom-1 h-[2px] origin-left scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 transition-all duration-300",
    []
  );

  return (
    <nav aria-label="Primary" className="relative z-50">
      {/* reduced-motion helper */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .rm-no-trans { transition: none !important; }
        }
      `}</style>

      {/* Top progress bar (respects safe area) */}
      <div
        ref={progressRef}
        className="fixed left-0 right-0 h-0.5 origin-left rm-no-trans"
        style={{
          top: "env(safe-area-inset-top, 0px)",
          transform: "scaleX(0)",
          background: grad,
          opacity: 0.9,
        }}
      />

      {/* Shell (safe-area aware) */}
      <div
        className={`w-full fixed transition-transform duration-300 ${hidden ? "-translate-y-16" : "translate-y-0"}`}
        style={{ top: "calc(0.75rem + env(safe-area-inset-top, 0px))" }}
      >
        <div
          className={`js-nav-shell mx-auto flex items-center justify-between px-4 md:px-6
                      py-3 rounded-full w-[94%] sm:w-[92%] md:w-[86%] lg:w-[72%]
                      border backdrop-blur-xl text-slate-300/95
                      shadow-[0_10px_30px_rgba(0,0,0,0.45)]
                      transition-all`}
          style={{
            background: scrolled
              ? "linear-gradient(180deg, rgba(22,22,24,.92), rgba(12,14,19,.92))"
              : "linear-gradient(180deg, rgba(26,26,26,.88), rgba(15,17,25,.88))",
            borderColor: scrolled ? "#2b2b2b" : "#252525",
          }}
        >
          {/* Brand */}
          <a
            href="#home"
            className={`relative font-bold text-slate-100 text-xl sm:text-2xl md:text-3xl px-3 md:px-4 tracking-tight select-none ${ringCls}`}
            aria-label="Mahad — Home"
          >
            <span className="[text-shadow:0_0_30px_rgba(157,78,221,0.25)]">Mahad</span>
            <span
              className="pointer-events-none absolute -inset-2 rounded-full"
              style={{
                background: `radial-gradient(20rem 12rem at top left, ${hexToRgba(theme.a, 0.18)}, transparent 60%)`,
              }}
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-6 lg:gap-7 px-2 lg:px-3 text-[15px] font-medium">
              {LINKS.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id} className="relative group">
                    <a
                      href={item.href}
                      className={`relative z-10 outline-none px-1 py-1 rounded-md transition-colors duration-200 ${ringCls}
                                  ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </a>
                    <span
                      className={underlineClass}
                      style={{
                        background: grad,
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                        opacity: isActive ? 1 : 0,
                        transition: "transform 300ms ease, opacity 300ms ease",
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className={`inline-flex items-center justify-center min-h-11 px-5 py-2.5 rounded-full outline-none transition-all duration-200 ${ringCls}
                         shadow-[0_0_24px_rgba(0,0,0,0.0)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.25)]
                         text-slate-900`}
              style={{ background: grad }}
            >
              Hire Me
            </a>
          </div>

          {/* Mobile toggle (larger tap area) */}
          <div className="block md:hidden">
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={`grid place-items-center h-11 w-11 text-2xl text-slate-100 rounded-xl ${ringCls}`}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <HiMiniXMark /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile full-screen sheet */}
      <div className="md:hidden">
        {/* Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        {/* Sheet */}
        <div
          className={`fixed z-50 left-0 right-0 rounded-t-3xl border-t
                      transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-[100%]"}
                      bg-[#11161f] text-slate-200`}
          style={{
            bottom: 0,
            borderColor: "#252525",
            // leave some top padding for safe area when fully open
            paddingTop: "calc(env(safe-area-inset-top, 0px) * 0.5)",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Grabber + gradient bar */}
          <div className="mx-auto mt-3 mb-2 h-1.5 w-10 rounded-full bg-white/20" />
          <div
            className="h-[2px] w-full"
            style={{ background: grad, opacity: 0.9 }}
          />

          {/* Scrollable content */}
          <div className="max-h-[70vh] overflow-y-auto overscroll-contain px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            <ul className="flex flex-col gap-2 text-base">
              {LINKS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-3 py-3 ${ringCls} hover:bg-white/5`}
                  >
                    <span className="font-medium">{item.label}</span>
                    {/* underline accent on active */}
                    <span
                      aria-hidden
                      className="ml-3 h-[2px] w-12 rounded-full"
                      style={{
                        background: grad,
                        opacity: active === item.id ? 1 : 0.25,
                      }}
                    />
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA row */}
            <div className="pt-4">
              <a
                href="#contact"
                className={`block text-center rounded-xl px-4 py-3 text-[15px] font-semibold ${ringCls}`}
                style={{
                  background: grad,
                  color: "#0b0f14",
                }}
                onClick={() => setOpen(false)}
              >
                Hire Me
              </a>
            </div>

            {/* Footer meta */}
            <div className="pt-4 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} Mahad Abdullah
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ---------- helpers ---------- */
function getInitialForm() {
  const ds = document.documentElement.dataset.saiyan;
  if (ds) return sanitizeForm(ds);
  const ls = localStorage.getItem("saiyan_form");
  if (ls) return sanitizeForm(ls);
  return DEFAULT_FORM;
}
function sanitizeForm(v) {
  const key = String(v || "").toLowerCase();
  return ["ssj1", "ssj2", "ssj3", "ssb", "ui"].includes(key) ? key : DEFAULT_FORM;
}
function hexToRgba(hex, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
