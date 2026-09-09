import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { navLinks, profile, RESUME_URL } from '../data/portfolio'
import { tones, sectionTones } from '../theme/tones'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')
  const pill = tones[sectionTones[active.slice(1)] ?? 'violet'].pill

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href)).filter(Boolean)
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`))
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5 ${
          scrolled
            ? 'border border-line bg-surface shadow-lg shadow-black/40'
            : 'border border-transparent'
        }`}
      >
        <a href="#home" className="flex items-center gap-2 pl-1 font-semibold text-white">
<span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-elevated ring-1 ring-line">
            <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
          </span>
          <span className="hidden sm:inline">Ruel Ybañez</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active === link.href ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {active === link.href && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-full"
                  style={{ backgroundColor: pill }}
                  transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                />
              )}
              {link.label}
            </a>
          ))}
        </div>

        <a
          href={RESUME_URL}
          download="Ruel-Ybanez-Resume.pdf"
          className="hidden items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-base transition-colors hover:bg-zinc-200 md:inline-flex"
        >
          Resume <ArrowUpRight size={15} />
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-full border border-line bg-elevated text-white md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-x-4 top-[4.5rem] rounded-3xl border border-line bg-surface p-3 shadow-2xl shadow-black/60 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={active === link.href ? { backgroundColor: pill } : undefined}
                className={`block rounded-2xl px-4 py-3 text-base font-medium ${
                  active === link.href ? 'text-white' : 'text-zinc-300'
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href={RESUME_URL}
              download="Ruel-Ybanez-Resume.pdf"
              onClick={() => setOpen(false)}
              className="btn-white mt-2 w-full justify-center"
            >
              Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
