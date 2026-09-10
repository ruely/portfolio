import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { projects } from '../data/portfolio'
import { mixHex } from '../theme/tones'
import ProjectModal from './ProjectModal'
import ProjectReel from './ProjectReel'
import SectionHeading from './SectionHeading'
import Section from './Section'

// Quick filters for the slider. `platform` is derived from each project's
// category in the data file ("Mobile · Fintech" → "Mobile").
const FILTERS = [
  { key: 'all', label: 'All', test: () => true },
  { key: 'featured', label: 'Featured', test: (p) => p.featured },
  { key: 'mobile', label: 'Mobile', test: (p) => p.platform === 'Mobile' },
  { key: 'web', label: 'Web', test: (p) => p.platform === 'Web' },
]

// How far the project colour is pulled toward the dark page for the backdrop.
const BACKDROP_MIX = 0.35
const PAGE_DARK = '#0B0A14'

// Defined outside Projects so it keeps its identity across re-renders.
function ArrowBtn({ dir, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/20 text-white transition-colors hover:border-white/50 hover:bg-black/30"
    >
      {dir < 0 ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
    </button>
  )
}

export default function Projects() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [activeColor, setActiveColor] = useState(null)
  const slider = useRef(null)

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.key, projects.filter(f.test).length])),
    [],
  )

  // Featured first — keeps the strongest work at the front.
  const ordered = useMemo(() => {
    const active = FILTERS.find((f) => f.key === filter) ?? FILTERS[0]
    return projects
      .filter(active.test)
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  }, [filter])

  const handleChange = useCallback((i) => setActiveColor(ordered[i]?.color ?? null), [ordered])

  // Other sections (the hero ring) can open a project by id.
  useEffect(() => {
    const onOpen = (e) => {
      const match = projects.find((p) => p.id === e.detail)
      if (match) setSelected(match)
    }
    window.addEventListener('open-project', onOpen)
    return () => window.removeEventListener('open-project', onOpen)
  }, [])

  return (
    <Section
      id="projects"
      bgColor={activeColor ? mixHex(activeColor, PAGE_DARK, BACKDROP_MIX) : undefined}
      inkColor={activeColor ?? undefined}
    >
      <div className="container-px">
        <SectionHeading
          index="01 · "
          eyebrow="Selected Work"
          title="Projects I've shipped"
          description="Real products across fintech, transport, healthcare and enterprise — step through the reel; each entry carries the full story."
          action={
            <div className="hidden items-center gap-2 sm:flex">
              <span className="mr-1 font-mono text-xs text-zinc-400">
                {ordered.length} {ordered.length === 1 ? 'project' : 'projects'}
              </span>
              <ArrowBtn dir={-1} label="Previous project" onClick={() => slider.current?.prev()} />
              <ArrowBtn dir={1} label="Next project" onClick={() => slider.current?.next()} />
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
                    : 'border-white/20 bg-black/20 text-white/80 hover:border-white/50 hover:text-white'
                }`}
              >
                {f.label}
                <span className={`font-mono text-[10px] ${active ? 'text-zinc-500' : 'text-white/50'}`}>
                  {counts[f.key]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Reel — the active project's colour drives the section backdrop */}
      <div className="container-px mt-10">
        <ProjectReel ref={slider} items={ordered} onChange={handleChange} />
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </Section>
  )
}
