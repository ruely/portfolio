import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

// Scroll-reveal wrapper. Fades/slides children in whenever they enter the
// viewport and back out when they leave, so every section's widgets replay
// their entrance on each visit. When hiding, the element always moves away
// from the viewport (down if it left at the bottom, up if it left at the top),
// so the hide animation can never carry it back into view and flicker.
// Pass `once` to reveal a single time. Becomes a no-op animation when the
// user prefers reduced motion.
export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 56,
  className = '',
  once = false,
  ...rest
}) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-80px 0px -80px 0px' })
  const [dir, setDir] = useState(1) // 1 = hidden below the viewport, -1 = above
  useEffect(() => {
    if (inView || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    setDir(r.top + r.height / 2 < window.innerHeight / 2 ? -1 : 1)
  }, [inView])
  const MotionTag = motion[as] ?? motion.div

  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y: y * dir, scale: 0.94, filter: 'blur(8px)' }
  const shown = reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }

  return (
    <MotionTag
      ref={ref}
      {...rest}
      className={className}
      initial={hidden}
      animate={inView ? shown : hidden}
      transition={{ duration: inView ? 0.8 : 0.45, delay: inView ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </MotionTag>
  )
}
