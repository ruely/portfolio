import { forwardRef, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { Sparkles, ChevronDown } from 'lucide-react'
import { skills, skillCategories, aiTools } from '../data/portfolio'
import Reveal from './Reveal'
import Section from './Section'
import SectionHeading from './SectionHeading'

const TABS = [{ key: 'all', label: 'All' }, ...skillCategories]

// Fallback tile text for skills without a logo: "OneSignal" → "OS".
const initials = (name) =>
  name
    .split(/[\s/.+#-]+|(?<=[a-z])(?=[A-Z])/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

// forwardRef: AnimatePresence's popLayout mode measures each child via a ref.
// Each card gets a fixed random "scattered" pose (far off its slot, tilted,
// small, transparent). Whenever the grid scrolls into view the cards spring
// from there back into place; when it scrolls out they scatter again, so
// the entrance replays on every visit.
const scatterPose = () => ({
  x: (Math.random() - 0.5) * 1400,
  y: (Math.random() - 0.5) * 900,
  rotate: (Math.random() - 0.5) * 160,
  scale: 0.55,
  opacity: 0,
})
const SETTLED = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
const SPRING = { type: 'spring', stiffness: 40, damping: 15 }

const SkillCard = forwardRef(function SkillCard({ skill, animate, settled, scatter, order }, ref) {
  return (
    <motion.li
      ref={ref}
      layout={animate}
      initial={animate ? scatter : false}
      animate={animate ? (settled ? SETTLED : scatter) : SETTLED}
      exit={animate ? { opacity: 0, scale: 0.9, transition: { duration: 0.2 } } : undefined}
      transition={animate ? { ...SPRING, delay: settled ? Math.min(order * 0.02, 0.5) : 0 } : { duration: 0 }}
      className="list-none"
    >
      <div className="tone-card group flex h-full flex-col items-center justify-center gap-3 rounded-2xl border bg-card px-3 py-6 text-center transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#9F86F0] hover:bg-hero sm:py-7">
        {skill.icon ? (
          <img
            src={skill.icon}
            alt=""
            loading="lazy"
            className="h-9 w-9 object-contain sm:h-10 sm:w-10"
          />
        ) : (
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-elevated font-display text-xs font-bold tracking-tight text-zinc-200 transition-colors duration-300 group-hover:border-hero-ink/20 group-hover:bg-white group-hover:text-hero-ink sm:h-10 sm:w-10">
            {initials(skill.name)}
          </span>
        )}
        <span className="text-xs font-medium leading-tight text-zinc-200 transition-colors duration-300 group-hover:text-hero-ink sm:text-sm">
          {skill.name}
        </span>
      </div>
    </motion.li>
  )
})

export default function Skills() {
  const [tab, setTab] = useState('all')
  const [expanded, setExpanded] = useState(false)
  const reduce = useReducedMotion()
  const grid = useRef(null)
  const inView = useInView(grid, { amount: 0.2 })
  const settled = reduce || inView
  // One scattered pose per skill, fixed for the session.
  const scatter = useMemo(() => Object.fromEntries(skills.map((s) => [s.name, scatterPose()])), [])

  const counts = useMemo(() => {
    const c = { all: skills.length }
    for (const s of skills) c[s.category] = (c[s.category] ?? 0) + 1
    return c
  }, [])

  // "All" starts with the core stack and can expand to the full list; category
  // tabs always show everything in that category.
  const visible = useMemo(() => {
    if (tab !== 'all') return skills.filter((s) => s.category === tab)
    return expanded ? skills : skills.filter((s) => s.core)
  }, [tab, expanded])

  return (
    <Section id="skills">
      <div className="container-px">
        <SectionHeading
          index="03 · "
          eyebrow="Toolbox"
          title="Technical skills"
          description="The languages, frameworks, databases and tools I build with. Filter by area."
        />

        <Reveal>
          {/* Category tabs */}
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Skill categories">
            {TABS.map((t) => {
              const active = tab === t.key
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.key)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'tone-tab'
                      : 'border-line bg-card text-zinc-400 hover:border-line-strong hover:text-white'
                  }`}
                >
                  {t.label}
                  <span
                    className={`font-mono text-[10px] ${active ? 'opacity-70' : 'text-zinc-600'}`}
                  >
                    {counts[t.key] ?? 0}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Logo grid */}
          <motion.ul
            ref={grid}
            layout={!reduce}
            className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((skill, i) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  animate={!reduce}
                  settled={settled}
                  scatter={scatter[skill.name]}
                  order={i}
                />
              ))}
            </AnimatePresence>
          </motion.ul>

          {tab === 'all' && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="btn-tone"
              >
                {expanded ? 'Show core skills' : `Show all ${skills.length} skills`}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          )}
        </Reveal>

        {/* AI tools band */}
        <Reveal delay={0.08}>
          <div className="ring-gradient mt-4 flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-[#7E6BE0] text-hero-ink">
                <Sparkles size={18} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">AI Tools & Assistants</h3>
                <p className="text-xs text-zinc-500">AI I build and ship with</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiTools.map((ai) => (
                <span
                  key={ai.name}
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-elevated py-1.5 pl-1.5 pr-3"
                >
                  {ai.icon ? (
                    <img src={ai.icon} alt="" loading="lazy" className="h-6 w-6 object-contain" />
                  ) : (
                    <span className="grid h-6 w-6 place-items-center rounded-md border border-line bg-card font-display text-[10px] font-bold text-zinc-200">
                      {initials(ai.name)}
                    </span>
                  )}
                  <span className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-white">{ai.name}</span>
                    <span className="font-mono text-[10px] text-zinc-500">{ai.vendor}</span>
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
