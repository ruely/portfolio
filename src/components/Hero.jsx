import { motion, useReducedMotion } from 'framer-motion'
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

  return (
    <section
      id="home"
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

        <div className="container-px">
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
        </div>
      </motion.div>

      {/* Project reel */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-10 sm:mt-14"
      >
        <CircularGallery items={reel} onSelect={openProject} />
        <p className="container-px mt-5 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-hero-ink/60 sm:text-xs">
          {projects.length} builds · {featuredCount} featured · tap a card to open
        </p>
      </motion.div>

    </section>
  )
}
