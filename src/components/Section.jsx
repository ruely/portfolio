import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { tones, sectionTones } from '../theme/tones'

// Page section with its own flat background tint and a parallax backdrop: a
// huge faint watermark word and a soft glow that move at different speeds
// from the content as the section scrolls through the viewport. Exposes the
// section hue as --tone for headings, tabs and cards inside it.
export default function Section({ id, watermark, className = '', children }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const tone = tones[sectionTones[id] ?? 'violet']

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const wordY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [110, -110])
  const glowY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-90, 90])

  return (
    <section
      ref={ref}
      id={id}
      className={`relative overflow-hidden scroll-mt-24 py-20 sm:py-28 ${className}`}
      style={{ backgroundColor: tone.bg, '--tone': tone.ink, '--section-bg': tone.bg }}
    >
      <motion.div
        aria-hidden="true"
        style={{ y: glowY, background: `radial-gradient(closest-side, ${tone.ink}2E, transparent)` }}
        className="pointer-events-none absolute -right-48 top-0 h-[36rem] w-[36rem] rounded-full blur-[120px]"
      />
      {watermark && (
        <motion.span
          aria-hidden="true"
          style={{ y: wordY, color: tone.ink }}
          className="pointer-events-none absolute -top-6 right-[-1vw] select-none whitespace-nowrap font-display text-[clamp(6rem,17vw,15rem)] font-extrabold uppercase leading-none tracking-tighter opacity-[0.07]"
        >
          {watermark}
        </motion.span>
      )}
      <div className="relative">{children}</div>
    </section>
  )
}
