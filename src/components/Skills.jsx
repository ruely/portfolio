import { forwardRef, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
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
const SkillCard = forwardRef(function SkillCard({ skill, animate }, ref) {
  return (
    <motion.li
      ref={ref}
      layout={animate}
      initial={animate ? { opacity: 0, scale: 0.92 } : false}
      animate={{ opacity: 1, scale: 1 }}
      exit={animate ? { opacity: 0, scale: 0.92 } : undefined}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="list-none"
    >
      <div className="tone-card group flex h-full flex-col items-center justify-center gap-3 rounded-2xl border bg-card px-3 py-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-card-hover sm:py-7">
        {skill.icon ? (
          <img
            src={skill.icon}
            alt=""
            loading="lazy"
            className="h-9 w-9 object-contain sm:h-10 sm:w-10"
          />
        ) : (
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-elevated font-display text-xs font-bold tracking-tight text-zinc-200 sm:h-10 sm:w-10">
            {initials(skill.name)}
          </span>
        )}
        <span className="text-xs font-medium leading-tight text-zinc-200 sm:text-sm">
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
    <Section id="skills" watermark="SKILLS">
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
                      ? 'tone-tab text-base'
                      : 'border-line bg-card text-zinc-400 hover:border-line-strong hover:text-white'
                  }`}
                >
                  {t.label}
                  <span
                    className={`font-mono text-[10px] ${active ? 'text-base/70' : 'text-zinc-600'}`}
                  >
                    {counts[t.key] ?? 0}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Logo grid */}
          <motion.ul
            layout={!reduce}
            className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((skill) => (
                <SkillCard key={skill.name} skill={skill} animate={!reduce} />
              ))}
            </AnimatePresence>
          </motion.ul>

          {tab === 'all' && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="btn-outline"
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
          <div className="ring-gradient mt-4 flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-cyan text-white">
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
                  className="inline-flex items-baseline gap-1.5 rounded-lg border border-line bg-elevated px-3 py-1.5"
                >
                  <span className="text-sm font-semibold text-white">{ai.name}</span>
                  <span className="font-mono text-[10px] text-zinc-500">{ai.vendor}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
