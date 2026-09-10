import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import ProjectCover from './ProjectCover'

// Projects display after the "scroll reel" pattern: a reel of tiles on the
// left where the middle column holds one featured tile per project and steps
// by one pitch per project while the outer columns counter-scroll; on the
// right the write-up rises in character by character, the old block exiting
// as a whole before the new one enters. The boxes around each featured tile
// carry the project's other screenshots, its logo and its company's logo,
// scattered in a random arrangement.
// Flat throughout — solid tiles, no blur or sheen. Fixed height; the write-up
// scrolls when it runs long. Driven by buttons, arrow keys and a swipe.
const CELL = 140
const GAP = 8
const PITCH = CELL + GAP
const STEP = 3 * PITCH // pitch between featured tiles (featured + 2 cells)
const EXIT_MS = 240
const SLIDE_MS = 800
const EASE = 'cubic-bezier(0.65,0,0.35,1)'
const pad2 = (n) => String(n).padStart(2, '0')

// Extra tiles for a project, in priority order: remaining screenshots, then
// its logo, then the company logo when it differs. They fill the four boxes
// around the featured tile: left, right, and the two below it.
const extrasFor = (p) => {
  const out = p.gallery.slice(1).map((src, i) => ({ kind: 'image', src, alt: `${p.name} screenshot ${i + 2}`, top: p.coverPosition === 'top' }))
  if (p.logo) out.push({ kind: 'logo', src: p.logo, alt: `${p.name} logo`, invert: p.logoInvert })
  if (p.companyLogo && p.companyLogo !== p.logo) out.push({ kind: 'logo', src: p.companyLogo, alt: `${p.company} logo` })
  return out.slice(0, 4)
}

// Fisher–Yates shuffle (returns a new array).
const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function Tile({ item }) {
  if (!item) {
    return (
      <div aria-hidden="true" className="shrink-0 rounded-xl border border-line bg-elevated" style={{ width: CELL, height: CELL }} />
    )
  }
  if (item.kind === 'logo') {
    return (
      <div className="grid shrink-0 place-items-center rounded-xl border border-line bg-elevated p-6" style={{ width: CELL, height: CELL }}>
        <img src={item.src} alt={item.alt} loading="lazy" draggable="false" className={`max-h-full max-w-full object-contain ${item.invert ? 'invert' : ''}`} />
      </div>
    )
  }
  return (
    <div className="shrink-0 overflow-hidden rounded-xl border-2 border-white bg-white" style={{ width: CELL, height: CELL }}>
      <img src={item.src} alt={item.alt} loading="lazy" draggable="false" className={`h-full w-full rounded-[10px] object-cover ${item.top ? 'object-top' : ''}`} />
    </div>
  )
}

function Featured({ project }) {
  return (
    <div className="shrink-0 overflow-hidden rounded-xl border-2 border-white bg-white" style={{ width: CELL, height: CELL }}>
      {project.hasScreens ? (
        <img
          src={project.cover}
          alt={`${project.name} preview`}
          loading="lazy"
          draggable="false"
          className={`h-full w-full rounded-[10px] object-cover ${project.coverPosition === 'top' ? 'object-top' : ''}`}
        />
      ) : (
        <div className="h-full w-full overflow-hidden rounded-[10px]">
          <ProjectCover project={project} />
        </div>
      )}
    </div>
  )
}

// Text that rises in sequence: per character (`char`) or per word (`word`).
// Spaces stay as plain text between word spans so lines still wrap.
function Rise({ text, mode = 'char', base = 0, stagger = 6 }) {
  let i = 0
  const words = text.split(' ')
  return words.map((word, wi) => {
    const node =
      mode === 'word' ? (
        <span className="reel-rise inline-block whitespace-nowrap" style={{ animationDelay: `${base + wi * stagger}ms` }}>
          {word}
        </span>
      ) : (
        <span className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, ci) => (
            <span key={ci} className="reel-rise" style={{ animationDelay: `${base + i++ * stagger}ms` }}>
              {ch}
            </span>
          ))}
        </span>
      )
    if (mode === 'char') i++
    return (
      <span key={wi}>
        {node}
        {wi < words.length - 1 ? ' ' : null}
      </span>
    )
  })
}

function WriteUp({ project, num, count, exiting }) {
  const showPeriod = project.companyPeriod && /\d/.test(project.companyPeriod)
  return (
    <div className={`flex flex-col ${exiting ? 'reel-exit' : ''}`}>
      <p className="reel-block font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
        {num} / {pad2(count)} · {project.category}
      </p>
      <h3 className="mt-2 text-2xl font-bold leading-tight text-white md:text-3xl">
        <Rise text={project.name} base={40} stagger={18} />
      </h3>
      <p className="mt-1.5 text-base font-medium text-zinc-300">
        <Rise text={project.tagline} base={160} stagger={5} />
      </p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        <Rise text={project.description} mode="word" base={300} stagger={9} />
      </p>
      {project.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {project.highlights.map((h, i) => (
            <li key={h} className="reel-block flex items-start gap-2 text-sm text-zinc-300" style={{ animationDelay: `${520 + i * 70}ms` }}>
              <Check size={15} className="mt-0.5 shrink-0" style={{ color: project.color }} />
              {h}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((t, i) => (
          <span key={t} className="reel-block chip" style={{ animationDelay: `${640 + i * 40}ms` }}>
            {t}
          </span>
        ))}
      </div>
      {project.company && (
        <p className="reel-block mt-3 font-mono text-[11px] text-zinc-500" style={{ animationDelay: '760ms' }}>
          {project.company}
          {showPeriod && ` · ${project.companyPeriod}`}
        </p>
      )}
    </div>
  )
}

const ProjectReel = forwardRef(function ProjectReel({ items, onChange }, ref) {
  const [index, setIndex] = useState(0) // navigation (reel position)
  const [displayIndex, setDisplayIndex] = useState(0) // write-up being shown
  const [exiting, setExiting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const animating = useRef(false)
  const timeouts = useRef([])
  const swipe = useRef(null)
  const scrollArea = useRef(null)
  const count = items.length

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)))
    return () => {
      cancelAnimationFrame(raf)
      timeouts.current.forEach(clearTimeout)
    }
  }, [])

  // New list (filter change): back to the first project.
  useEffect(() => {
    timeouts.current.forEach(clearTimeout)
    animating.current = false
    setIndex(0)
    setDisplayIndex(0)
    setExiting(false)
    onChange?.(0)
  }, [items]) // eslint-disable-line react-hooks/exhaustive-deps

  // Write-up back to the top whenever a new project is shown.
  useEffect(() => {
    scrollArea.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [displayIndex])

  const paginate = useCallback(
    (dir) => {
      if (animating.current) return
      const next = index + dir
      if (next < 0 || next >= count) return
      animating.current = true
      setIndex(next)
      setExiting(true)
      onChange?.(next)
      timeouts.current.push(
        setTimeout(() => {
          setDisplayIndex(next)
          setExiting(false)
        }, EXIT_MS),
      )
      timeouts.current.push(setTimeout(() => (animating.current = false), SLIDE_MS))
    },
    [index, count, onChange],
  )
  useImperativeHandle(ref, () => ({ next: () => paginate(1), prev: () => paginate(-1) }), [paginate])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      paginate(1)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      paginate(-1)
    }
  }
  const onPointerDown = (e) => (swipe.current = e.clientX)
  const onPointerUp = (e) => {
    if (swipe.current == null) return
    const dx = e.clientX - swipe.current
    swipe.current = null
    if (Math.abs(dx) > 40) paginate(dx < 0 ? 1 : -1)
  }

  // Columns. Middle: 3 leading cells, then per project the featured tile with
  // one box above and one below, then 3 trailing cells. The side columns are as long
  // as the middle one and travel the same distance the other way, so the
  // tiles that line up with project i sit at row 3·(count − i).
  const { middle, left, right } = useMemo(() => {
    const n = 3 * count + 4
    const middle = Array(n).fill(null)
    const left = Array(n).fill(null)
    const right = Array(n).fill(null)
    items.forEach((p, i) => {
      const row = 3 + 3 * i
      middle[row] = { featured: p }
      // The extras and the four boxes around the featured tile are both
      // shuffled, so each project's screenshots and logos land in a
      // different arrangement (fixed for the session).
      // Boxes: left and right of the tile, and directly above and below it —
      // never the row after that, which is the next project's "above" box and
      // would show while that project is centred.
      const sideRow = 3 * (count - i)
      const boxes = shuffle([
        (t) => (left[sideRow] = t),
        (t) => (right[sideRow] = t),
        (t) => (middle[row - 1] = t),
        (t) => (middle[row + 1] = t),
      ])
      shuffle(extrasFor(p)).forEach((tile, k) => boxes[k](tile))
    })
    return { middle, left, right }
  }, [items, count])
  const middleY = ((count - 1) / 2 - index) * STEP
  const colStyle = (y) => ({
    gap: GAP,
    transform: `translateY(${y}px)`,
    transition: mounted ? `transform ${SLIDE_MS}ms ${EASE}` : 'none',
  })

  const current = items[displayIndex] ?? items[0]
  if (!current) return null

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="flex h-[640px] w-full flex-col overflow-hidden rounded-3xl border border-line bg-card outline-none focus-visible:ring-2 focus-visible:ring-accent md:h-[480px] md:flex-row"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Reel */}
      <div
        aria-hidden="true"
        className="relative h-60 w-full shrink-0 overflow-hidden md:h-full md:w-[470px]"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center" style={{ gap: GAP }}>
          <div className="flex shrink-0 flex-col will-change-transform" style={colStyle(-middleY)}>
            {left.map((item, i) => <Tile key={i} item={item} />)}
          </div>
          <div className="flex shrink-0 flex-col will-change-transform" style={colStyle(middleY)}>
            {middle.map((item, i) =>
              item?.featured ? <Featured key={i} project={item.featured} /> : <Tile key={i} item={item} />,
            )}
          </div>
          <div className="flex shrink-0 flex-col will-change-transform" style={colStyle(-middleY)}>
            {right.map((item, i) => <Tile key={i} item={item} />)}
          </div>
        </div>
      </div>

      {/* Write-up: fixed height, scrolls when it runs long */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col px-5 pt-6 md:px-8 md:pt-8">
        <div ref={scrollArea} className="thin-scroll relative min-h-0 flex-1 overflow-y-auto pb-4" aria-live="polite">
          {/* Invisible in-flow copy sizes the stage to the current write-up. */}
          <div aria-hidden="true" className="invisible">
            <WriteUp project={current} num={pad2(displayIndex + 1)} count={count} exiting={false} />
          </div>
          <div key={displayIndex} className="absolute inset-x-0 top-0">
            <WriteUp project={current} num={pad2(displayIndex + 1)} count={count} exiting={exiting} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex shrink-0 items-center gap-2 border-t border-line py-4">
          <button
            type="button"
            onClick={() => paginate(-1)}
            disabled={index === 0}
            aria-label="Previous project"
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-elevated text-white transition-transform hover:enabled:scale-105 disabled:opacity-40"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            disabled={index === count - 1}
            aria-label="Next project"
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-elevated text-white transition-transform hover:enabled:scale-105 disabled:opacity-40"
          >
            <ArrowRight size={16} />
          </button>
          <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            {pad2(index + 1)} / {pad2(count)} · arrow keys · swipe
          </span>
        </div>
      </div>
    </div>
  )
})

export default ProjectReel
