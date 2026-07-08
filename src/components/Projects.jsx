import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Star, ArrowLeft, ArrowRight } from 'lucide-react'
import { projects } from '../data/portfolio'
import ProjectModal from './ProjectModal'
import SectionHeading from './SectionHeading'

function ProjectCard({ project, onOpen }) {
  const contain = project.coverContain || project.logoContain
  return (
    <motion.button
      onClick={() => onOpen(project)}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="card card-hover group flex h-full w-full flex-col overflow-hidden text-left"
    >
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden bg-base">
        <img
          src={project.cover}
          alt={`${project.name} preview`}
          loading="lazy"
          className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.04] ${
            contain ? 'object-contain p-10' : 'object-cover'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base/90 via-base/10 to-transparent" />

        <span className="absolute left-3 top-3 grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-white/10 bg-base/70 backdrop-blur">
          <img src={project.logo} alt="" className="h-6 w-6 object-contain" loading="lazy" />
        </span>

        {project.featured && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-base/70 px-2.5 py-1 text-[11px] font-medium text-amber-300 backdrop-blur">
            <Star size={11} className="fill-amber-300" /> Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-zinc-500">
              {project.category}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white">{project.name}</h3>
          </div>
          <ArrowUpRight
            size={20}
            className="shrink-0 text-zinc-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
          />
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{project.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 3).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  )
}

export default function Projects() {
  const [selected, setSelected] = useState(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const scroller = useRef(null)
  const reduce = useReducedMotion()

  // Featured first — keeps the strongest work at the front of the reel.
  const ordered = [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

  const updateEdges = useCallback(() => {
    const el = scroller.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateEdges()
    window.addEventListener('resize', updateEdges)
    return () => window.removeEventListener('resize', updateEdges)
  }, [updateEdges])

  const scrollByCards = (dir) => {
    const el = scroller.current
    if (!el) return
    // Scroll by roughly one card + gap.
    const card = el.querySelector('[data-card]')
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8
    el.scrollBy({ left: step * dir, behavior: reduce ? 'auto' : 'smooth' })
  }

  const ArrowBtn = ({ dir, disabled, label }) => (
    <button
      onClick={() => scrollByCards(dir)}
      disabled={disabled}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.1] bg-white/[0.03] text-zinc-300 transition-all hover:border-white/25 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
    >
      {dir < 0 ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
    </button>
  )

  return (
    <section id="projects" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-px">
        <SectionHeading
          index="01 · "
          eyebrow="Selected Work"
          title="Projects I've shipped"
          description="Real products across fintech, transport, healthcare and enterprise — swipe through, tap any card for detail and screenshots."
          action={
            <div className="hidden items-center gap-2 sm:flex">
              <span className="mr-1 font-mono text-xs text-zinc-500">{projects.length} projects</span>
              <ArrowBtn dir={-1} disabled={atStart} label="Previous projects" />
              <ArrowBtn dir={1} disabled={atEnd} label="Next projects" />
            </div>
          }
        />
      </div>

      {/* Carousel */}
      <div className="container-px relative mt-12">
        {/* Edge fades */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-base to-transparent transition-opacity sm:w-12 ${
            atStart ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-base to-transparent transition-opacity sm:w-12 ${
            atEnd ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <div
          ref={scroller}
          onScroll={updateEdges}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {ordered.map((project) => (
            <div
              key={project.id}
              data-card
              className="w-[82%] shrink-0 snap-start sm:w-[340px] lg:w-[360px]"
            >
              <ProjectCard project={project} onOpen={setSelected} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile hint */}
      <p className="container-px mt-4 font-mono text-xs text-zinc-600 sm:hidden">
        ← swipe to explore →
      </p>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
