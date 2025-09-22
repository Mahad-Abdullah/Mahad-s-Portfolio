// Contact.jsx — React + JS + Tailwind v4 (Saiyan theme-synced)
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const VALID_FORMS = ['ssj1','ssj2','ssj3','ssb','ui']

export default function Contact() {
  // Reactively track current form so the UI variant updates instantly if user switches modes
  const [form, setForm] = useState(getInitialForm())
  const isUI = form === 'ui'

  useEffect(() => {
    const mo = new MutationObserver(() => {
      const ds = document.documentElement.dataset.saiyan?.toLowerCase()
      if (ds && VALID_FORMS.includes(ds) && ds !== form) setForm(ds)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-saiyan'] })

    const onStorage = (e) => {
      if (e.key === 'saiyan_form' && e.newValue) {
        const v = e.newValue.toLowerCase()
        if (VALID_FORMS.includes(v) && v !== form) setForm(v)
      }
    }
    const onEvt = (e) => {
      const v = String(e?.detail || '').toLowerCase()
      if (VALID_FORMS.includes(v) && v !== form) setForm(v)
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('saiyan:form', onEvt)

    return () => {
      mo.disconnect()
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('saiyan:form', onEvt)
    }
  }, [form])

  return (
    <section id="contact" className="relative py-20 bg-[#0b0f14] text-slate-200">
      {/* themed background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute bottom-1/3 left-1/2 -translate-x-1/2 h-[48vh] w-[70vw] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(closest-side, color-mix(in oklab, var(--saiyanB) 20%, transparent), transparent 70%)',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(90deg, var(--saiyanA), var(--saiyanB))' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.7 }}
        >
          Contact Me
        </motion.h2>

        {/* Available for hire badge (subtly themed) */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
            style={{
              border: '1px solid color-mix(in oklab, var(--saiyanB) 45%, #ffffff 10%)',
              color: 'color-mix(in oklab, var(--saiyanB) 75%, #d1fae5 10%)',
              background: 'color-mix(in oklab, var(--saiyanB) 12%, transparent)',
            }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full animate-pulse"
              style={{ background: 'var(--saiyanB)' }}
            />
            Available for hire
          </span>
        </motion.div>

        <motion.p
          className="text-slate-400 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          Have a project in mind or just want to say hi? I’m open to freelance work and opportunities. Fill out the form and I’ll get back to you soon.
        </motion.p>

        <motion.form
          className="relative text-left rounded-2xl p-8 shadow-xl backdrop-blur-sm space-y-6"
          style={{
            background: 'color-mix(in oklab, #111827 85%, transparent)',
            border: '1px solid color-mix(in oklab, var(--saiyanA) 24%, #ffffff 6%)',
            boxShadow: '0 10px 40px -18px color-mix(in oklab, var(--saiyanA) 38%, black)',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.6 }}
          onSubmit={(e) => {
            e.preventDefault()
            alert('Thanks! Your message has been submitted.')
          }}
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Name"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-slate-200 placeholder:text-slate-500 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--saiyanRing)]"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-slate-200 placeholder:text-slate-500 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--saiyanRing)]"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Write your message..."
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-slate-200 placeholder:text-slate-500 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--saiyanRing)]"
              required
            />
          </div>

          {/* Submit Button (UI gets silver variant) */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold active:scale-[.99] transition"
            style={{
              background: isUI
                ? 'linear-gradient(90deg, rgba(226,232,240,0.98), rgba(148,163,184,0.95))'
                : 'linear-gradient(90deg, var(--saiyanA), var(--saiyanB))',
              color: isUI ? '#0b0f14' : '#ffffff',
              border: isUI ? '1px solid rgba(148,163,184,.55)' : '1px solid transparent',
              boxShadow: isUI
                ? '0 10px 30px -10px rgba(148,163,184,.45), 0 1px 0 rgba(0,0,0,.2) inset'
                : '0 10px 30px -10px color-mix(in oklab, var(--saiyanA) 55%, black)',
            }}
          >
            Send Message
          </button>
        </motion.form>
      </div>
    </section>
  )
}

/* ---------- helpers ---------- */
function getInitialForm() {
  const ds = document.documentElement.dataset.saiyan?.toLowerCase()
  const ls = localStorage.getItem('saiyan_form')?.toLowerCase()
  if (ds && VALID_FORMS.includes(ds)) return ds
  if (ls && VALID_FORMS.includes(ls)) return ls
  return 'ssb'
}
