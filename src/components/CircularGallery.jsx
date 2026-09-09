import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

// 3D ring of project covers, after the "circular gallery" pattern: cards sit
// on a cylinder (rotateY + translateZ) that turns slowly and continuously, so
// each card swings in from one side, faces the viewer, and swings out the
// other. Only the front half is shown — cards fade out by 80° and are hidden
// beyond — and the ring's radius is fitted so its widest point stays inside a
// small margin at the screen edges. Each cover is inset in a white card.
const GAP = 24
const SPEED = 4 // degrees per second
const PERSPECTIVE = 2000 // must match the container's CSS perspective
const EDGE_PAD = 20 // horizontal padding at the screen edges
const EDGE_ANGLE = 60 // the card turned this far sits right at the padding line
const FADE_START = 38 // fully opaque up to this angle from the front
const FADE_END = 66 // invisible from here on (just past the edge; the back never shows)

// About nine cards across a desktop screen, like the reference strip.
const cardWidthFor = (w) => Math.round(Math.max(120, Math.min(260, w * 0.13)))

// On-screen reach of a card's outer edge at `deg` from the front.
const reachAt = (r, cw, deg) => {
  const a = (deg * Math.PI) / 180
  const scale = PERSPECTIVE / (PERSPECTIVE + r * (1 - Math.cos(a)))
  return (r * Math.sin(a) + (cw / 2) * Math.cos(a)) * scale
}
// Radius that puts the card at EDGE_ANGLE exactly at `half` (viewport half
// minus the padding). Beyond that angle cards are off-screen and faded out.
const fitRadius = (half, cw) => {
  let lo = 40
  let hi = 6000
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (reachAt(mid, cw, EDGE_ANGLE) > half) hi = mid
    else lo = mid
  }
  return Math.round(lo)
}

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
  // Ring fitted to the viewport minus the edge margin; as many cards around it
  // as fit with GAP between neighbours at the front.
  const radius = fitRadius(width / 2 - EDGE_PAD, cw)
  const n = Math.max(6, Math.round((2 * Math.PI * radius) / (cw + GAP)))
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
        const deg = rel > 180 ? 360 - rel : rel // 0 = facing the viewer, 180 = behind
        // Eased fade between FADE_START and FADE_END; nothing past FADE_END.
        const u = Math.min(1, Math.max(0, (deg - FADE_START) / (FADE_END - FADE_START)))
        const opacity = 1 - u * u * (3 - 2 * u)
        node.style.opacity = opacity.toFixed(3)
        node.style.visibility = opacity > 0.01 ? 'visible' : 'hidden'
        node.style.pointerEvents = opacity > 0.4 ? 'auto' : 'none'
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [n, step, radius, reduce])

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
            className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_18px_40px_-18px_rgba(30,20,80,0.45)] [backface-visibility:hidden] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
