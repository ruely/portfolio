import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

// Decorative, non-interactive background: a calm, uniform fall of dim mono
// letters. Drawn on a single <canvas> so the animation costs one paint per
// frame instead of re-rendering 150 DOM nodes through React. Pauses while the
// tab is hidden and renders a single static frame under reduced motion.

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
const randChar = () => CHARSET[Math.floor(Math.random() * CHARSET.length)]

export default function RainingLetters({ count = 150 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let raf = 0
    let last = 0

    // Positions are normalized (0–1) so a resize just rescales the field.
    const drops = Array.from({ length: count }, () => ({
      char: randChar(),
      x: Math.random(),
      y: Math.random(),
      speed: 0.05 + Math.random() * 0.25, // % of height per 60fps frame
    }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      // Setting width/height resets the context, so restore the style here.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = '16.8px "JetBrains Mono", ui-monospace, monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const d of drops) ctx.fillText(d.char, d.x * width, d.y * height)
    }

    const step = (t) => {
      // Frame-rate independent: 1 unit == one 60fps frame, capped after a stall.
      const dt = last ? Math.min((t - last) / 16.67, 3) : 1
      last = t
      for (const d of drops) {
        d.y += (d.speed / 100) * dt
        if (d.y >= 1) {
          d.y = -0.05
          d.x = Math.random()
          d.char = randChar()
        }
      }
      draw()
      raf = requestAnimationFrame(step)
    }

    const start = () => {
      if (reduce) return
      cancelAnimationFrame(raf)
      last = 0
      raf = requestAnimationFrame(step)
    }
    const stop = () => cancelAnimationFrame(raf)
    const onVisibility = () => (document.hidden ? stop() : start())

    resize()
    draw()
    // Redraw once the web font arrives so the static frame uses it too.
    document.fonts?.ready.then(draw)

    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      stop()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [count, reduce])

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
