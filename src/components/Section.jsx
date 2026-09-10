import { createContext, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { tones, sectionTones } from '../theme/tones'

// Progress of the section through the viewport (0 = entering at the bottom,
// 1 = gone off the top). Headings subscribe to it for a stronger drift.
export const SectionScroll = createContext(null)

// Page section with its own flat background colour and a parallax transition:
// the background scrolls with the page while the content lags a little behind
// it (and the heading lags more), so each section arrives and leaves with
// depth. Exposes the section hue as --tone, plus --fg / --fg-muted for text on
// light sections. A section can hand in its own colours (the projects slider
// follows the active project).
export default function Section({ id, bgColor, inkColor, className = '', children }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const base = tones[sectionTones[id] ?? 'black']
  const tone = { ...base, bg: bgColor ?? base.bg, ink: inkColor ?? base.ink }

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-60, 60])

  return (
    <section
      ref={ref}
      id={id}
      data-light={tone.light || undefined}
      className={`relative overflow-hidden scroll-mt-24 py-20 sm:py-28 ${className}`}
      style={{
        backgroundColor: tone.bg,
        '--tone': tone.ink,
        '--tone-fg': tone.light ? '#ffffff' : '#15122B',
        '--section-bg': tone.bg,
        '--fg': tone.light ? '#15122B' : '#ffffff',
        '--fg-muted': tone.light ? '#3F3A5C' : '#a1a1aa',
        transition: 'background-color 700ms ease',
      }}
    >
      <SectionScroll.Provider value={scrollYProgress}>
        <motion.div style={{ y }} className="relative">
          {children}
        </motion.div>
      </SectionScroll.Provider>
    </section>
  )
}
