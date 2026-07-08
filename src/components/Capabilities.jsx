import { Monitor, Smartphone, Share2 } from 'lucide-react'
import { services } from '../data/portfolio'
import Reveal from './Reveal'

const icons = { Monitor, Smartphone, Share2 }

export default function Capabilities() {
  return (
    <section className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-px">
        <div className="grid gap-4 sm:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[s.icon]
            return (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="card card-hover group h-full p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-accent transition-colors group-hover:text-accent-cyan">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-1.5 font-mono text-xs text-zinc-500">{s.count}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
