import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import ProjectCover from './ProjectCover'

// Horizontal infinite slider for the projects, after the "argent loop"
// pattern: slides sit on an endless track (indices wrap around the list),
// motion eases toward a target, the track snaps to the nearest slide once
// input stops, and each image drifts with a little parallax. Driven by
// trackpad swipes, drag, arrow keys and the section's arrow buttons. The
// active slide sits a little left of centre so the next project peeks in
// more than the previous one. Each
// slide is a white card carrying the screenshot and the full write-up; there
// is nothing to tap.
const BUFFER = 2 // slides rendered on each side of the active one
const LERP = 0.1
const SNAP_MS = 520
const IDLE_MS = 120
const gapFor = (w) => (w < 640 ? 16 : 24)
const mod = (i, n) => ((i % n) + n) % n
const pad2 = (n) => String(n).padStart(2, '0')

// Facebook-style collage of a project's screenshots: one image fills the
// frame, two sit side by side, three become one large plus two stacked, and
// four or more form a 2×2 grid with a "+N" badge on the last tile.
function Collage({ project }) {
  if (!project.hasScreens) return <ProjectCover project={project} large />
  const imgs = project.gallery
  const pos = project.coverPosition === 'top' ? 'object-top' : ''
  const Tile = ({ src, i, badge }) => (
    <div className="relative min-h-0 overflow-hidden bg-base">
      <img
        src={src}
        alt={`${project.name} screenshot ${i + 1}`}
        loading="lazy"
        draggable="false"
        className={`h-full w-full object-cover ${pos}`}
      />
      {badge > 0 && (
        <span className="absolute inset-0 grid place-items-center bg-black/50 text-2xl font-bold text-white">
          +{badge}
        </span>
      )}
    </div>
  )
  if (imgs.length === 1) return <Tile src={imgs[0]} i={0} />
  if (imgs.length === 2)
    return (
      <div className="grid h-full grid-cols-2 gap-1">
        <Tile src={imgs[0]} i={0} />
        <Tile src={imgs[1]} i={1} />
      </div>
    )
  if (imgs.length === 3)
    return (
      <div className="grid h-full grid-cols-[1.35fr_1fr] gap-1">
        <Tile src={imgs[0]} i={0} />
        <div className="grid min-h-0 grid-rows-2 gap-1">
          <Tile src={imgs[1]} i={1} />
          <Tile src={imgs[2]} i={2} />
        </div>
      </div>
    )
  return (
    <div className="grid h-full grid-cols-2 grid-rows-2 gap-1">
      {imgs.slice(0, 4).map((src, i) => (
        <Tile key={src} src={src} i={i} badge={i === 3 ? imgs.length - 4 : 0} />
      ))}
    </div>
  )
}

const ProjectSlider = forwardRef(function ProjectSlider({ items, onChange }, ref) {
  const container = useRef(null)
  const slides = useRef(new Map())
  const reduce = useReducedMotion()
  const [width, setWidth] = useState(1200)
  const [range, setRange] = useState({ min: -BUFFER, max: BUFFER })
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const st = useRef({
    x: 0, // rendered offset
    target: 0, // where the track is heading
    active: 0, // absolute (unwrapped) index of the centred slide
    dragging: false,
    drag: null,
    snapping: false,
    snap: null,
    lastInput: 0,
    moved: 0,
  })

  const n = items.length
  // The active slide sits left of centre: the previous project peeks in about
  // 8% of a slide on the left and the next about 15% on the right (the spare
  // width is split 8:15 when the slide hits its cap).
  const GAP = gapFor(width)
  const slideW = Math.min(Math.round((width - 2 * GAP) / 1.23), 1100)
  const step = slideW + GAP
  const leftPeek = GAP + (width - slideW - 2 * GAP) * (8 / 23)

  useEffect(() => {
    const el = container.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // New list (filter change): jump back to the first slide.
  useEffect(() => {
    const s = st.current
    s.x = 0
    s.target = 0
    s.active = 0
    s.snapping = false
    setRange({ min: -BUFFER, max: BUFFER })
    onChangeRef.current?.(0)
  }, [items])

  const goTo = useCallback(
    (index) => {
      const s = st.current
      s.snapping = true
      s.snap = { t0: performance.now(), from: s.target, to: -index * step }
      s.lastInput = performance.now()
    },
    [step],
  )
  // Index the track is heading to (the snap destination while snapping).
  const heading = useCallback(() => {
    const s = st.current
    return Math.round(-(s.snapping ? s.snap.to : s.target) / step)
  }, [step])
  useImperativeHandle(
    ref,
    () => ({ next: () => goTo(heading() + 1), prev: () => goTo(heading() - 1) }),
    [goTo, heading],
  )

  // Animation loop: snap, ease, position slides, parallax, track the active index.
  useEffect(() => {
    let raf = 0
    const frame = (t) => {
      const s = st.current
      if (!s.dragging && !s.snapping && t - s.lastInput > IDLE_MS) {
        const snapTo = -Math.round(-s.target / step) * step
        if (Math.abs(s.target - snapTo) > 0.5) {
          s.snapping = true
          s.snap = { t0: t, from: s.target, to: snapTo }
        }
      }
      if (s.snapping) {
        const p = Math.min((t - s.snap.t0) / SNAP_MS, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        s.target = s.snap.from + (s.snap.to - s.snap.from) * eased
        if (p >= 1) s.snapping = false
      }
      s.x = reduce ? s.target : s.x + (s.target - s.x) * (s.dragging ? 0.35 : LERP)

      const base = leftPeek
      slides.current.forEach((el, i) => {
        const left = base + i * step + s.x
        el.style.transform = `translate3d(${left.toFixed(2)}px,0,0)`
        const media = el.querySelector('[data-parallax]')
        if (media) {
          const off = (left - base) / step // 0 = centred, ±1 = one slide away
          media.style.transform = reduce
            ? ''
            : `translate3d(${(-off * 4).toFixed(2)}%,0,0) scale(1.08)`
        }
      })

      const active = Math.round(-s.target / step)
      if (active !== s.active) {
        s.active = active
        onChangeRef.current?.(mod(active, n))
        setRange({ min: active - BUFFER, max: active + BUFFER })
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [step, slideW, leftPeek, n, reduce])

  // Trackpad / horizontal wheel moves the track; vertical scrolling is left to the page.
  useEffect(() => {
    const el = container.current
    if (!el) return
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      const s = st.current
      s.snapping = false
      s.lastInput = performance.now()
      s.target -= Math.max(-120, Math.min(120, e.deltaX))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // Drag / swipe.
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const s = st.current
    s.dragging = true
    s.snapping = false
    s.moved = 0
    s.drag = { x: e.clientX, start: s.target }
    const onMove = (ev) => {
      if (!s.dragging) return
      const dx = ev.clientX - s.drag.x
      s.moved = Math.max(s.moved, Math.abs(dx))
      s.target = s.drag.start + dx
      s.lastInput = performance.now()
    }
    const onUp = () => {
      s.dragging = false
      s.lastInput = performance.now()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') goTo(heading() + 1)
    if (e.key === 'ArrowLeft') goTo(heading() - 1)
  }

  const indices = []
  for (let i = range.min; i <= range.max; i++) indices.push(i)

  return (
    <div
      ref={container}
      role="region"
      aria-label="Project slider"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className="relative h-[560px] w-full cursor-grab select-none overflow-hidden outline-none active:cursor-grabbing sm:h-[520px] md:h-[440px] lg:h-[470px]"
      style={{ touchAction: 'pan-y' }}
    >
      {indices.map((i) => {
        const project = items[mod(i, n)]
        const num = pad2(mod(i, n) + 1)
        const showPeriod = project.companyPeriod && /\d/.test(project.companyPeriod)
        return (
          <article
            key={i}
            ref={(el) => (el ? slides.current.set(i, el) : slides.current.delete(i))}
            aria-label={project.name}
            className="absolute left-0 top-0 h-full will-change-transform"
            style={{ width: slideW }}
          >
            <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden rounded-3xl bg-white p-2.5 text-zinc-900 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] md:grid-cols-[1.05fr_1fr] md:grid-rows-none md:gap-4">
              {/* Screenshots (collage) with the stack underneath */}
              <div className="flex min-h-0 flex-col">
                <div className="h-[170px] shrink-0 overflow-hidden rounded-2xl bg-base sm:h-[200px] md:h-auto md:min-h-0 md:flex-1">
                  <div data-parallax className="h-full w-full">
                    <Collage project={project} />
                  </div>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5 px-1">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 font-mono text-[11px] text-zinc-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Write-up — scrolls when it runs long */}
              <div className="thin-scroll min-h-0 overflow-y-auto px-3 pb-3 pt-1 md:px-5 md:py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  {num} / {pad2(n)} · {project.category}
                </p>
                <h3 className="mt-1.5 text-xl font-bold leading-tight text-zinc-900 md:text-2xl">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-zinc-600">{project.tagline}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-zinc-600 lg:text-sm">{project.description}</p>
                {project.highlights.length > 0 && (
                  <ul className="mt-2.5 space-y-1">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-[13px] text-zinc-700 lg:text-sm">
                        <Check size={15} className="mt-0.5 shrink-0" style={{ color: project.color }} />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                {project.company && (
                  <p className="mt-3 font-mono text-[11px] text-zinc-500">
                    {project.company}
                    {showPeriod && ` · ${project.companyPeriod}`}
                  </p>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
})

export default ProjectSlider
