import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { navLinks, RESUME_URL } from '../data/portfolio'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')

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
            ? 'border border-white/[0.08] bg-base/70 backdrop-blur-xl'
            : 'border border-transparent'
        }`}
      >
        <a href="#home" className="flex items-center gap-2 pl-1 font-semibold text-white">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-cyan text-xs font-bold text-white">
            RY
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
                  className="absolute inset-0 -z-10 rounded-full bg-white/[0.08]"
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
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white md:hidden"
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
            className="absolute inset-x-4 top-[4.5rem] rounded-3xl border border-white/[0.08] bg-base/95 p-3 backdrop-blur-xl md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-2xl px-4 py-3 text-base font-medium ${
                  active === link.href ? 'bg-white/[0.06] text-white' : 'text-zinc-300'
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
