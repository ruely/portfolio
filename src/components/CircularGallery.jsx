import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

// 3D ring of project covers. Cards sit on a cylinder (rotateY + translateZ)
// that turns slowly and continuously; nothing pauses it. Each card's opacity
// comes from where it lands on screen, so the reel dissolves just inside a
// margin at both edges of the viewport. Each cover is inset in a white card.
// Static under reduced motion.
const GAP = 18
const SPEED = 3.5 // degrees per second
const PERSPECTIVE = 2000 // must match the container's CSS perspective

// Card width follows the viewport so about seven cards span a desktop screen.
const cardWidthFor = (w) => Math.round(Math.max(140, Math.min(240, w * 0.135)))
// Fade margin at the screen edge. Phones get a negative margin so the two
// neighbours of the centre card stay partly visible instead of vanishing.
const edgePadFor = (w) => (w < 640 ? -w * 0.25 : Math.max(16, Math.min(48, w * 0.035)))

// Repeat the items so the ring always has `count` cards.
const cycle = (items, count) => Array.from({ length: count }, (_, i) => items[i % items.length])

export default function CircularGallery({ items, onSelect }) {
  const container = useRef(null)
  const ring = useRef(null)
  const cards = useRef([])
  const reduce = useReducedMotion()
  const [width, setWidth] = useState(1200)
  const angle = useRef(0)

  const cw = cardWidthFor(width)
  const ch = Math.round(cw * 0.95)
  // Wide enough that the visible arc reaches the screen edges; holds as many
  // cards as fit around it with GAP between them.
  const radius = Math.max(Math.round(width * 0.9), 260)
  const n = Math.max(items.length, Math.round((2 * Math.PI * radius) / (cw + GAP)))
  const ringItems = cycle(items, n)
  const step = 360 / n

  useEffect(() => {
    const el = container.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let raf = 0
    let last = 0
    const limit = width / 2 - edgePadFor(width)

    const frame = (t) => {
      const dt = last ? Math.min(t - last, 64) : 16
      last = t
      if (!reduce) angle.current = (angle.current + (SPEED * dt) / 1000) % 360
      const rot = angle.current
      if (ring.current) {
        ring.current.style.transform = `translateZ(${-radius}px) rotateY(${rot}deg)`
      }
      for (let i = 0; i < n; i++) {
        const node = cards.current[i]
        if (!node) continue
        const rel = (((i * step + rot) % 360) + 360) % 360
        const a = (rel > 180 ? rel - 360 : rel) * (Math.PI / 180) // -π..π, 0 = front
        let opacity = 0
        if (Math.abs(a) < Math.PI / 2) {
          // Project the card onto the screen the way the browser will.
          const scale = PERSPECTIVE / (PERSPECTIVE + radius * (1 - Math.cos(a)))
          const x = Math.abs(radius * Math.sin(a)) * scale
          const halfWidth = (cw / 2) * Math.cos(a) * scale
          const t = (x + halfWidth) / limit // 1 = card's outer edge at the margin
          // Long, eased fade: full until 45% of the way out, ~0.2 at the margin,
          // gone a little past it — so a card eases in and out over a couple of
          // card widths instead of dropping off at the edge.
          const u = Math.min(1, Math.max(0, (t - 0.45) / 0.75))
          opacity = 1 - u * u * (3 - 2 * u)
        }
        node.style.opacity = opacity.toFixed(3)
        node.style.pointerEvents = opacity > 0.3 ? 'auto' : 'none'
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [n, step, radius, cw, width, reduce])

  return (
    <div
      ref={container}
      role="region"
      aria-label="Project reel"
      className="relative h-[220px] w-full select-none sm:h-[260px] lg:h-[300px]"
      style={{ perspective: `${PERSPECTIVE}px` }}
    >
      <div ref={ring} className="absolute inset-0 [transform-style:preserve-3d]">
        {ringItems.map((item, i) => (
          <button
            key={`${item.id}-${i}`}
            ref={(el) => (cards.current[i] = el)}
            type="button"
            onClick={() => onSelect?.(item)}
            aria-label={`Open ${item.name}`}
            className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] [backface-visibility:hidden] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            style={{
              width: cw,
              height: ch,
              marginLeft: -cw / 2,
              marginTop: -ch / 2,
              transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
            }}
          >
            <img
              src={item.cover}
              alt=""
              draggable="false"
              className={`h-full w-full rounded-xl object-cover ${
                item.coverPosition === 'top' ? 'object-top' : ''
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
