import { GraduationCap, Trophy } from 'lucide-react'
import { education, awards } from '../data/portfolio'
import Reveal from './Reveal'
import Section from './Section'
import SectionHeading from './SectionHeading'

export default function Education() {
  return (
    <Section id="education" watermark="STUDY">
      <div className="container-px">
        <SectionHeading
          index="04 · "
          eyebrow="Background"
          title="Education & awards"
          description="Where I studied and a few honors picked up along the way."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="card h-full p-6 sm:p-8">
              <h3 className="flex items-center gap-2.5 text-base font-semibold text-white">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-elevated" style={{ color: 'var(--tone)' }}>
                  <GraduationCap size={18} />
                </span>
                Education
              </h3>
              <div className="mt-6 space-y-5">
                {education.map((e) => (
                  <div key={e.school} className="relative border-l border-line pl-5">
                    <span className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--tone)' }} />
                    <p className="font-semibold text-white">{e.school}</p>
                    <p className="text-sm text-zinc-400">{e.program}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-zinc-600">
                      {e.detail} · {e.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="card h-full p-6 sm:p-8">
              <h3 className="flex items-center gap-2.5 text-base font-semibold text-white">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-elevated text-amber-300">
                  <Trophy size={18} />
                </span>
                Awards
              </h3>
              <div className="mt-6 space-y-2.5">
                {awards.map((a) => (
                  <div
                    key={a.title}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-elevated px-4 py-3 transition-colors hover:border-line-strong"
                  >
                    <div className="flex items-center gap-3">
                      <Trophy size={15} className="shrink-0 text-amber-300" />
                      <div>
                        <p className="text-sm font-medium text-white">{a.title}</p>
                        <p className="font-mono text-[11px] text-zinc-600">{a.org}</p>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-zinc-500">{a.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
