import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { skillGroups, tools, aiTools } from '../data/portfolio'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-px">
        <SectionHeading
          index="03 · "
          eyebrow="Toolbox"
          title="Skills & technologies"
          description="Languages and frameworks grouped by where they live in the stack, plus the tools I build with."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} delay={(i % 4) * 0.06}>
              <div className="card h-full p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">{group.label}</h3>
                  <span className="font-mono text-xs text-zinc-600">
                    {String(group.skills.length).padStart(2, '0')}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ y: -2 }}
                      className="cursor-default rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* AI tools band */}
        <Reveal delay={0.08}>
          <div className="ring-gradient mt-4 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
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
                  className="inline-flex items-baseline gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5"
                >
                  <span className="text-sm font-semibold text-white">{ai.name}</span>
                  <span className="font-mono text-[10px] text-zinc-500">{ai.vendor}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Tools marquee */}
        <Reveal delay={0.1}>
          <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] py-5">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-base to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-base to-transparent" />
            <div className="group flex">
              <div className="flex w-max gap-2.5 animate-marquee px-1.5 group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap">
                {[...tools, ...tools].map((tool, i) => (
                  <span
                    key={`${tool}-${i}`}
                    className="whitespace-nowrap rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-zinc-400"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
