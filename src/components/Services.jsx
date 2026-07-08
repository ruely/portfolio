import { motion } from 'framer-motion'
import { Monitor, Smartphone, Share2 } from 'lucide-react'
import { services, stats } from '../data/portfolio'
import Reveal from './Reveal'

const icons = { Monitor, Smartphone, Share2 }
const colorMap = {
  teal: 'bg-teal text-cream',
  yellow: 'bg-yellow text-ink',
  coral: 'bg-coral text-cream',
}

export default function Services() {
  return (
    <section className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left: service cards */}
        <div className="space-y-4">
          {services.map((s, i) => {
            const Icon = icons[s.icon]
            return (
              <Reveal key={s.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="soft-card flex items-center gap-5 p-5 sm:p-6"
                >
                  <span
                    className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${colorMap[s.color]}`}
                  >
                    <Icon size={24} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-ink">{s.title}</h3>
                    <p className="text-sm text-body">{s.count}</p>
                  </div>
                </motion.div>
              </Reveal>
            )
          })}
        </div>

        {/* Right: heading + copy + stats */}
        <Reveal delay={0.1}>
          <p className="eyebrow">What do I help?</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] text-ink">
            I turn ideas into
            <br />
            products that ship.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-body">
            From payment wallets and automated fare collection to parking
            platforms and enterprise systems — I handle full-cycle development
            across web and mobile, and integrate the pieces so they just work.
          </p>

          <div className="mt-9 flex flex-wrap gap-10">
            {stats.slice(0, 3).map((s) => (
              <div key={s.label}>
                <p className="font-display text-4xl font-extrabold text-ink sm:text-5xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm font-medium text-body">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
