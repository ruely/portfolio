import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Download, ArrowRight } from 'lucide-react'
import { profile, projects, RESUME_URL } from '../data/portfolio'
import CircularGallery from './CircularGallery'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}
// Each word of the name slides up out of a clipped line.
const word = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

// Only projects with real screenshots go on the reel; the ring repeats them
// to fill its circumference.
const reel = projects.filter((p) => p.hasScreens)
const featuredCount = projects.filter((p) => p.featured).length

export default function Hero() {
  const reduce = useReducedMotion()
  const openProject = (p) => window.dispatchEvent(new CustomEvent('open-project', { detail: p.id }))

  // Scroll parallax: as the hero leaves the viewport its layers drift down at
  // different rates — the big name (back) most, the text block less, the reel
  // (front) least — and a shade settles over everything, so the hero sinks
  // away with depth instead of sliding off as one flat block.
  const ref = useRef(null)
  const [heroH, setHeroH] = useState(800)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setHeroH(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const layer = (rate) => useTransform(scrollYProgress, (v) => (reduce ? 0 : v * heroH * rate))
  const yName = layer(0.55)
  const yText = layer(0.38)
  const yReel = layer(0.14)
  const shade = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 0.55])
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, reduce ? 1 : 0.15])

  return (
    <section
      id="home"
      ref={ref}
      className="relative overflow-hidden bg-hero pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pt-36"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative text-center"
      >
        {/* Two big lines on phones, one line from sm up (font scales with the
            viewport so the whole name always fits). */}
        <motion.div style={{ y: yName, opacity: fade }}>
        <h1
          className="mx-auto flex flex-wrap justify-center gap-x-[0.24em] px-4 text-[clamp(2.75rem,14vw,4.5rem)] font-medium uppercase leading-[0.95] tracking-[-0.02em] text-hero-ink sm:flex-nowrap sm:text-[min(8.6vw,9.5rem)]"
          aria-label={profile.name}
        >
          {profile.name.split(' ').map((w) => (
            <span key={w} className="-mt-[0.16em] shrink-0 overflow-hidden pb-[0.06em] pt-[0.16em]">
              <motion.span variants={reduce ? rise : word} className="block">
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        </motion.div>

        <motion.div className="container-px" style={{ y: yText, opacity: fade }}>
        <motion.p variants={rise} className="mt-4 text-lg text-hero-ink/80 sm:text-xl">
          {profile.title}
        </motion.p>

        <motion.p
          variants={rise}
          className="mx-auto mt-3 max-w-2xl font-mono text-[11px] uppercase tracking-[0.22em] text-hero-ink/60 sm:text-xs"
        >
          {profile.yearsExperience} years · {projects.length} projects shipped ·{' '}
          {profile.location.replace(/ \d+$/, '')}
        </motion.p>

        <motion.div variants={rise} className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={RESUME_URL} download="Ruel-Ybanez-Resume.pdf" className="btn-ink">
            <Download size={16} /> Download Resume
          </a>
          <a href="#projects" className="btn-ink-outline">
            View Work <ArrowRight size={16} />
          </a>
        </motion.div>
        </motion.div>
      </motion.div>

      {/* Project reel */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-10 sm:mt-14"
      >
        <motion.div style={{ y: yReel }}>
        <CircularGallery items={reel} onSelect={openProject} />
        <p className="container-px mt-5 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-hero-ink/60 sm:text-xs">
          {projects.length} builds · {featuredCount} featured · tap a card to open
        </p>
        </motion.div>
      </motion.div>

      {/* Shade that settles over the hero as it scrolls away */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: shade }}
        className="pointer-events-none absolute inset-0 bg-[#0B0A14]"
      />

    </section>
  )
}
