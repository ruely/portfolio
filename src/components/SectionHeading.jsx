import { useContext } from 'react'
import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import Reveal from './Reveal'
import { SectionScroll } from './Section'

// Section header: mono index eyebrow + tight title + optional description and
// right-aligned action. Colours follow the section (--fg on light sections),
// and the whole header drifts a little more than the body as the section
// scrolls, on top of the section's own parallax.
export default function SectionHeading({ index, eyebrow, title, description, action }) {
  const progress = useContext(SectionScroll)
  const fallback = useMotionValue(0)
  const reduce = useReducedMotion()
  const y = useTransform(progress ?? fallback, [0, 1], reduce ? [0, 0] : [-70, 70])

  return (
    <motion.div style={{ y }}>
      <Reveal>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow" style={{ color: 'var(--fg-muted, #71717a)' }}>
              {index && <span style={{ color: 'var(--tone, #C4B5FD)' }}>{index}</span>}
              {eyebrow}
            </span>
            <h2
              className="mt-3 text-[clamp(1.85rem,4vw,2.75rem)] font-extrabold leading-[1.05] tracking-tightest"
              style={{ color: 'var(--fg, #fff)' }}
            >
              {title}
            </h2>
            {description && (
              <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--fg-muted, #a1a1aa)' }}>
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      </Reveal>
    </motion.div>
  )
}
