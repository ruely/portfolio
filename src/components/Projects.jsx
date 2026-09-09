import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Star, ArrowLeft, ArrowRight } from 'lucide-react'
import { projects } from '../data/portfolio'
import ProjectModal from './ProjectModal'
import ProjectCover from './ProjectCover'
import SectionHeading from './SectionHeading'
import Section from './Section'

// Quick filters for the reel. `platform` is derived from each project's
// category in the data file ("Mobile · Fintech" → "Mobile").
const FILTERS = [
  { key: 'all', label: 'All', test: () => true },
  { key: 'featured', label: 'Featured', test: (p) => p.featured },
  { key: 'mobile', label: 'Mobile', test: (p) => p.platform === 'Mobile' },
  { key: 'web', label: 'Web', test: (p) => p.platform === 'Web' },
]

function ProjectCard({ project, onOpen }) {
  const contain = project.coverContain || project.logoContain
  return (
    <motion.button
      onClick={() => onOpen(project)}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="card card-hover group flex h-full w-full flex-col overflow-hidden text-left"
    >
      {/* Cover — inset in a white card, like the hero reel */}
      <div className="p-3 pb-0">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-white p-1.5">
          <div className="h-full w-full overflow-hidden rounded-lg bg-base">
            {project.hasScreens ? (
              <img
                src={project.cover}
                alt={`${project.name} preview`}
                loading="lazy"
                className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.04] ${
                  contain ? 'object-contain p-8' : 'object-cover'
                } ${project.coverPosition === 'top' ? 'object-top' : ''}`}
              />
            ) : (
              <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
                <ProjectCover project={project} />
              </div>
            )}
          </div>

          {/* Small logo badge — only over real screenshots; the placeholder cover
              already shows the logo prominently. */}
          {project.hasScreens && (
            <span className="absolute left-3.5 top-3.5 grid h-9 w-9 place-items-center overflow-hidden rounded-lg border border-line bg-surface">
              <img
                src={project.logo}
                alt=""
                loading="lazy"
                className={`h-5 w-5 object-contain ${project.logoInvert ? 'invert' : ''}`}
              />
            </span>
          )}

          {project.featured && (
            <span className="absolute right-3.5 top-3.5 inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-amber-300">
              <Star size={11} className="fill-amber-300" /> Featured
            </span>
          )}
        </div>
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
  const [filter, setFilter] = useState('all')
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const scroller = useRef(null)
  const reduce = useReducedMotion()

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.key, projects.filter(f.test).length])),
    [],
  )

  // Featured first — keeps the strongest work at the front of the reel.
  const ordered = useMemo(() => {
    const active = FILTERS.find((f) => f.key === filter) ?? FILTERS[0]
    return projects
      .filter(active.test)
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  }, [filter])

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

  // Other sections (the hero coverflow) can open a project by id.
  useEffect(() => {
    const onOpen = (e) => {
      const match = projects.find((p) => p.id === e.detail)
      if (match) setSelected(match)
    }
    window.addEventListener('open-project', onOpen)
    return () => window.removeEventListener('open-project', onOpen)
  }, [])

  // Jump back to the start of the reel whenever the filter changes.
  useEffect(() => {
    // 'instant' — 'auto' would defer to the scroller's CSS scroll-smooth.
    scroller.current?.scrollTo({ left: 0, behavior: 'instant' })
    updateEdges()
  }, [filter, updateEdges])

  const scrollByCards = (dir) => {
    const el = scroller.current
    if (!el) return
    // Scroll by roughly one card + gap.
    const card = el.querySelector('[data-card]')
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8
    el.scrollBy({ left: step * dir, behavior: reduce ? 'instant' : 'smooth' })
  }

  const ArrowBtn = ({ dir, disabled, label }) => (
    <button
      onClick={() => scrollByCards(dir)}
      disabled={disabled}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-line bg-elevated text-zinc-300 transition-all hover:border-line-strong hover:bg-elevated-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
    >
      {dir < 0 ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
    </button>
  )

  return (
    <Section id="projects" watermark="WORK">
      <div className="container-px">
        <SectionHeading
          index="01 · "
          eyebrow="Selected Work"
          title="Projects I've shipped"
          description="Real products across fintech, transport, healthcare and enterprise — swipe through, tap any card for detail and screenshots."
          action={
            <div className="hidden items-center gap-2 sm:flex">
              <span className="mr-1 font-mono text-xs text-zinc-500">
                {ordered.length} {ordered.length === 1 ? 'project' : 'projects'}
              </span>
              <ArrowBtn dir={-1} disabled={atStart} label="Previous projects" />
              <ArrowBtn dir={1} disabled={atEnd} label="Next projects" />
            </div>
          }
        />

        {/* Filters */}
        <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => {
            const active = f.key === filter
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'border-white bg-white text-base'
                    : 'border-line bg-card text-zinc-400 hover:border-line-strong hover:text-white'
                }`}
              >
                {f.label}
                <span className={`font-mono text-[10px] ${active ? 'text-zinc-500' : 'text-zinc-600'}`}>
                  {counts[f.key]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Carousel — full-bleed: the track runs to the screen edges, with the
          first card aligned to the content column via matching padding. */}
      <div className="relative mt-8">
        {/* Edge fades at the screen edges */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[color:var(--section-bg)] to-transparent transition-opacity sm:w-16 ${
            atStart ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[color:var(--section-bg)] to-transparent transition-opacity sm:w-16 ${
            atEnd ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <div
          ref={scroller}
          onScroll={updateEdges}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-2 scroll-pl-5 sm:px-[max(2rem,calc((100vw-72rem)/2+2rem))] sm:scroll-pl-[max(2rem,calc((100vw-72rem)/2+2rem))]"
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
    </Section>
  )
}
