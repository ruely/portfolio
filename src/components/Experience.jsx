import { experience } from '../data/portfolio'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-px">
        <SectionHeading
          index="02 · "
          eyebrow="Career"
          title="Experience"
          description="Seven-plus years building and shipping software across three companies."
        />

        <div className="mt-12 space-y-4">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 0.06}>
              <div className="card card-hover grid gap-4 p-6 md:grid-cols-[220px_1fr] md:gap-8 md:p-8">
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] ${
                      job.current
                        ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                        : 'border-white/[0.08] bg-white/[0.03] text-zinc-400'
                    }`}
                  >
                    {job.current && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                    {job.period}
                  </span>
                  <p className="mt-3 text-sm text-zinc-500">{job.location}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white">{job.role}</h3>
                  <p className="mt-0.5 text-sm font-medium accent-gradient">{job.company}</p>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {job.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-zinc-400">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
