// HeroSS.jsx — React + JS + Tailwind v4 friendly (Site-wide Saiyan theme sync)
import React, { useEffect, useRef, useState } from "react";

/**
 * Forms:
 * 1: SSJ1  (gold aura)
 * 2: SSJ2  (gold aura + lightning)
 * 3: SSJ3  (intense gold/orange aura + dense lightning)
 * 4: SSB   (blue aura)
 * 5: UI    (silver/white aura with subtle prism)
 */

// Visual/aura tokens just for hero FX (background, particles)
const THEMES = {
  ssj1: {
    label: "SSJ1",
    aura1: "rgba(251, 191, 36, .30)",
    aura2: "rgba(245, 158, 11, .22)",
    beamA: "rgba(250, 204, 21, .28)",
    beamB: "rgba(242, 132, 34, .20)",
    star:  "#FFD86A",
    spark: "#F59E0B",
    lightning: false,
    prism: false,
  },
  ssj2: {
    label: "SSJ2",
    aura1: "rgba(251, 191, 36, .34)",
    aura2: "rgba(245, 158, 11, .26)",
    beamA: "rgba(250, 204, 21, .32)",
    beamB: "rgba(252, 211, 77, .22)",
    star:  "#FFE694",
    spark: "#FBBF24",
    lightning: true,
    prism: false,
  },
  ssj3: {
    label: "SSJ3",
    aura1: "rgba(252, 211, 77, .36)",
    aura2: "rgba(251, 146, 60, .26)",
    beamA: "rgba(255, 214, 94, .34)",
    beamB: "rgba(255, 147, 79, .22)",
    star:  "#FFD070",
    spark: "#FB923C",
    lightning: true,
    prism: false,
  },
  ssb: {
    label: "Blue",
    aura1: "rgba(59, 130, 246, .30)",
    aura2: "rgba(14, 165, 233, .22)",
    beamA: "rgba(56, 189, 248, .28)",
    beamB: "rgba(59, 130, 246, .24)",
    star:  "#9ED3FF",
    spark: "#38BDF8",
    lightning: false,
    prism: false,
  },
  ui: {
    label: "Ultra",
    aura1: "rgba(255, 255, 255, .28)",
    aura2: "rgba(203, 213, 225, .20)",
    beamA: "rgba(255, 255, 255, .24)",
    beamB: "rgba(168, 162, 158, .18)",
    star:  "#EAF2FF",
    spark: "#FFFFFF",
    lightning: false,
    prism: true,
  },
};

// Site-wide palette (for gradients, borders, focus rings)
const PALETTES = {
  ssj1: { a: "#F59E0B", b: "#FCD34D", ring: "rgba(245,158,11,.7)" },
  ssj2: { a: "#FBBF24", b: "#FDE68A", ring: "rgba(251,191,36,.7)" },
  ssj3: { a: "#FB923C", b: "#F59E0B", ring: "rgba(251,146,60,.7)" },
  ssb:  { a: "#3B82F6", b: "#38BDF8", ring: "rgba(56,189,248,.7)" },
  ui:   { a: "#FFFFFF", b: "#94A3B8", ring: "rgba(148,163,184,.7)" },
};

const FORM_KEYS = ["ssj1", "ssj2", "ssj3", "ssb", "ui"];
const FALLBACK = "ssb";

export default function HeroSS() {
  const [form, setForm] = useState(getInitialForm());
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const prefersReduced = useRef(false);

  // keyboard: 1–5 to switch
  useEffect(() => {
    const onKey = (e) => {
      const idx = ["1","2","3","4","5"].indexOf(e.key);
      if (idx >= 0) setForm(FORM_KEYS[idx]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // sync site-wide theme + set hero CSS vars whenever form changes
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const t = THEMES[form];
    // hero FX vars
    el.style.setProperty("--aura1", t.aura1);
    el.style.setProperty("--aura2", t.aura2);
    el.style.setProperty("--beamA", t.beamA);
    el.style.setProperty("--beamB", t.beamB);
    el.style.setProperty("--star",  t.star);
    el.style.setProperty("--spark", t.spark);

    // site-wide vars + broadcast (navbar & others listen)
    const pal = PALETTES[form] || PALETTES[FALLBACK];
    document.documentElement.dataset.saiyan = form;
    localStorage.setItem("saiyan_form", form);
    document.documentElement.style.setProperty("--saiyanA", pal.a);
    document.documentElement.style.setProperty("--saiyanB", pal.b);
    document.documentElement.style.setProperty("--saiyanRing", pal.ring);
    window.dispatchEvent(new CustomEvent("saiyan:form", { detail: form }));
  }, [form]);

  // initialize from dataset/localStorage if present
  useEffect(() => {
    const ds = document.documentElement.dataset.saiyan;
    const ls = localStorage.getItem("saiyan_form");
    if (ds && FORM_KEYS.includes(ds) && ds !== form) setForm(ds);
    else if (ls && FORM_KEYS.includes(ls) && ls !== form) setForm(ls);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // cursor spotlight
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const setVars = (x, y) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${x - r.left}px`);
      el.style.setProperty("--my", `${y - r.top}px`);
    };
    const move = (e) => {
      if (e.touches?.[0]) setVars(e.touches[0].clientX, e.touches[0].clientY);
      else setVars(e.clientX, e.clientY);
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("touchmove", move, { passive: true });
    requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      setVars(r.left + r.width / 2, r.top + r.height / 3);
    });
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("touchmove", move);
    };
  }, []);

  // star/spark particles (canvas) tinted by theme
  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext("2d");
    prefersReduced.current =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = cvs.parentElement.clientWidth;
      const h = Math.max(window.innerHeight * 0.88, 560);
      cvs.width = Math.floor(w * dpr);
      cvs.height = Math.floor(h * dpr);
      cvs.style.width = `${w}px`;
      cvs.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs.parentElement);

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * cvs.clientWidth,
      y: Math.random() * cvs.clientHeight,
      s: 0.7 + Math.random() * 1.6,
      v: 0.25 + Math.random() * 0.75,
      a: 0.25 + Math.random() * 0.55,
    }));
    const sparks = Array.from({ length: 26 }, () => ({
      x: Math.random() * cvs.clientWidth,
      y: Math.random() * cvs.clientHeight,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      life: 60 + Math.random() * 120,
    }));

    const loop = () => {
      ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight);

      // stars drift right
      ctx.fillStyle =
        getComputedStyle(rootRef.current).getPropertyValue("--star") || "#ffffff";
      stars.forEach((st) => {
        ctx.globalAlpha = st.a;
        ctx.fillRect(st.x, st.y, st.s, st.s);
        st.x += st.v;
        if (st.x > cvs.clientWidth + 2) {
          st.x = -2;
          st.y = Math.random() * cvs.clientHeight;
        }
      });

      // sparks jitter near center (aura particles)
      if (!prefersReduced.current) {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle =
          getComputedStyle(rootRef.current).getPropertyValue("--spark") || "#ffffff";
        sparks.forEach((p) => {
          ctx.fillRect(p.x, p.y, 1.5, 1.5);
          p.x += p.dx;
          p.y += p.dy;
          p.life--;
          if (
            p.life <= 0 ||
            p.x < 0 ||
            p.x > cvs.clientWidth ||
            p.y < 0 ||
            p.y > cvs.clientHeight
          ) {
            p.x = cvs.clientWidth * 0.5 + (Math.random() - 0.5) * 200;
            p.y = cvs.clientHeight * 0.55 + (Math.random() - 0.5) * 140;
            p.dx = (Math.random() - 0.5) * 0.6;
            p.dy = (Math.random() - 0.5) * 0.6;
            p.life = 60 + Math.random() * 120;
          }
        });
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [form]);

  const t = THEMES[form];
  const isUI = form === "ui"; // UI-specific CTA styling fix

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative min-h-[88vh] md:min-h-screen isolate overflow-hidden bg-[#0b0f14] text-slate-200"
      aria-label="Hero – Saiyan Transformations"
    >
      {/* keyframes */}
      <style>{`
        @keyframes aurora {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes shimmer {0%{opacity:.1}50%{opacity:.25}100%{opacity:.1}}
        @keyframes bolts {0%,100%{opacity:.15} 50%{opacity:.45}}
        @keyframes prism {0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}
      `}</style>

      {/* base deep gradient */}
      <div className="absolute inset-0 -z-50 [background:linear-gradient(180deg,#0b0f14,#0f172a)]" />

      {/* aura bloom */}
      <div
        className="absolute -z-40 inset-0"
        style={{
          background: `
            radial-gradient(60% 40% at 50% -10%, var(--aura1), transparent 70%),
            radial-gradient(50% 30% at 50% 90%, var(--aura2), transparent 70%)
          `,
        }}
      />

      {/* animated beams */}
      <div
        className="absolute inset-0 -z-30 opacity-40"
        style={{
          background: `linear-gradient(120deg, var(--beamA), var(--beamB), transparent)`,
          backgroundSize: "200% 200%",
          animation: "aurora 14s ease-in-out infinite",
        }}
      />

      {/* lightning for SSJ2/3 */}
      {t.lightning && (
        <>
          <div
            className="absolute inset-0 -z-20 opacity-50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(65deg, rgba(255,255,255,.12) 0 2px, transparent 2px 10px)",
              animation: "bolts 1.2s ease-in-out infinite",
              mixBlendMode: "screen",
            }}
          />
          <div
            className="absolute inset-0 -z-20 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-70deg, rgba(255,255,255,.10) 0 2px, transparent 2px 12px)",
              animation: "bolts 1.6s ease-in-out infinite",
              mixBlendMode: "screen",
            }}
          />
        </>
      )}

      {/* prism shimmer for Ultra Instinct */}
      {t.prism && (
        <div
          className="absolute inset-0 -z-20 opacity-35"
          style={{
            background:
              "conic-gradient(from 120deg at 60% 40%, rgba(255,255,255,.18), transparent 40%, rgba(255,255,255,.18))",
            animation: "prism 10s linear infinite",
            mixBlendMode: "soft-light",
          }}
        />
      )}

      {/* particles */}
      <div className="absolute inset-0 -z-10">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto w-[88%] md:w-[70%] max-w-5xl min-h-[88vh] md:min-h-screen grid place-items-center">
        <div className="text-center space-y-6">
          {/* Heading uses site gradient vars, so it syncs with navbar & CTAs */}
          <h1
            className="font-extrabold text-transparent bg-clip-text text-4xl md:text-6xl lg:text-7xl drop-shadow-[0_0_40px_rgba(255,255,255,.18)] tracking-tight"
            style={{ backgroundImage: "linear-gradient(90deg, var(--saiyanA), var(--saiyanB))" }}
          >
            I’m Mahad Abdullah
          </h1>

          <p className="text-lg md:text-2xl text-slate-300">
            Frontend Web Developer — React & Tailwind
          </p>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            Professional interfaces with cinematic, transformation-grade motion.
          </p>

          {/* CTAs driven by site vars (UI-specific contrast fix) */}
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <a
              href="#projects"
              className="px-6 py-3 rounded-full text-base md:text-lg shadow-lg transition-all active:scale-[.98]"
              style={{
                background: isUI
                  ? "linear-gradient(90deg, rgba(226,232,240,0.98), rgba(148,163,184,0.95))" // darker silver
                  : "linear-gradient(90deg, var(--saiyanA), var(--saiyanB))",
                color: isUI ? "#0b0f14" : "#ffffff",
                border: isUI ? "1px solid rgba(148,163,184,.55)" : "1px solid transparent",
                boxShadow: isUI
                  ? "0 10px 30px -10px rgba(148,163,184,.45), 0 1px 0 rgba(0,0,0,.2) inset"
                  : "0 10px 30px -10px color-mix(in oklab, var(--saiyanA) 55%, black)",
                textShadow: isUI
                  ? "0 1px 0 rgba(255,255,255,.45), 0 0 1px rgba(0,0,0,.35)"
                  : "none",
              }}
            >
              View Projects
            </a>

            <a
              href="#contact"
              className="px-6 py-3 rounded-full text-base md:text-lg border transition"
              style={{ borderColor: "var(--saiyanA)", color: "var(--saiyanA)" }}
            >
              Contact Me
            </a>
          </div>

          {/* form selector */}
          <div className="pt-6 flex flex-wrap justify-center gap-2 text-sm">
            {FORM_KEYS.map((k) => (
              <button
                key={k}
                onClick={() => setForm(k)}
                className={`px-3 py-1.5 rounded-full border transition ${
                  form === k
                    ? "bg-white/10 border-white/30 text-white"
                    : "border-white/15 text-slate-300 hover:bg-white/5"
                }`}
                title={`Transform: ${THEMES[k].label}`}
              >
                {THEMES[k].label}
              </button>
            ))}
            <span className="text-slate-500 ml-2">(press 1–5)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- helpers ---------- */
function getInitialForm() {
  const ds = document.documentElement.dataset.saiyan;
  const ls = localStorage.getItem("saiyan_form");
  const pick = (v) => (FORM_KEYS.includes(v) ? v : null);
  return pick(ds) || pick(ls) || "ssb";
}
