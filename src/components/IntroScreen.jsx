import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { profile, projects } from '../data/portfolio'
import { lockScroll } from '../lib/smoothScroll'
import { BotFace, GreetingBadge } from './ChatBot'

// Entrance screen shown before the main page. A wall of tiles in the style
// of the project reel — white-framed screenshots and solid cells — fills the
// screen; columns drift up and down in an endless loop while tiles swap to a
// random screenshot every so often. The bot bobs above a welcome line in the
// centre with a progress bar that runs for DURATION, then the screen lifts
// away. A tap anywhere skips it.
const DURATION = 5000
const CELL = 140
const GAP = 8
const PITCH = CELL + GAP
const SWAP_EVERY = 900
const IMAGES = projects.filter((p) => p.hasScreens).flatMap((p) => p.gallery.map((src) => ({ src, top: p.coverPosition === 'top', name: p.name })))

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const firstName = profile.name.split(' ')[0]

function Tile({ item }) {
  if (!item) return <div className="shrink-0 rounded-xl border border-line bg-elevated" style={{ width: CELL, height: CELL }} />
  return (
    <div className="shrink-0 overflow-hidden rounded-xl border-2 border-white bg-white" style={{ width: CELL, height: CELL }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.img
          key={item.src}
          src={item.src}
          alt=""
          draggable="false"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className={`h-full w-full rounded-[10px] object-cover ${item.top ? 'object-top' : ''}`}
        />
      </AnimatePresence>
    </div>
  )
}

export default function IntroScreen({ onDone }) {
  const reduce = useReducedMotion()
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  const done = useRef(false)
  const total = reduce ? 1800 : DURATION

  // Grid: enough columns to cover the width, each with enough rows to cover
  // the height twice (the column loops over half its length).
  const cols = Math.ceil(size.w / PITCH) + 1
  const rows = Math.ceil(size.h / PITCH) + 2
  const [grid, setGrid] = useState(() => build(cols, rows))
  function build(c, r) {
    return Array.from({ length: c }, () => Array.from({ length: r }, () => (Math.random() < 0.72 ? pick(IMAGES) : null)))
  }

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  useEffect(() => setGrid(build(cols, rows)), [cols, rows]) // eslint-disable-line react-hooks/exhaustive-deps

  // Swap a random image tile every SWAP_EVERY ms.
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => {
      setGrid((g) => {
        const c = Math.floor(Math.random() * g.length)
        const imgs = g[c].map((it, i) => (it ? i : -1)).filter((i) => i >= 0)
        if (!imgs.length) return g
        const r = pick(imgs)
        const next = g.map((col) => [...col])
        let choice = pick(IMAGES)
        if (choice.src === next[c][r].src) choice = pick(IMAGES)
        next[c][r] = choice
        return next
      })
    }, SWAP_EVERY)
    return () => clearInterval(t)
  }, [reduce])

  // Lock the page behind, run the clock, and leave.
  useEffect(() => {
    lockScroll(true)
    const t = setTimeout(finish, total)
    return () => {
      clearTimeout(t)
      lockScroll(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  function finish() {
    if (done.current) return
    done.current = true
    lockScroll(false)
    onDone?.()
  }

  const speeds = useMemo(() => Array.from({ length: 40 }, () => 26 + Math.random() * 22), [])

  return (
    <motion.div
      role="dialog"
      aria-label="Welcome"
      onClick={finish}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -60, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
      className="fixed inset-0 z-[100] cursor-pointer select-none overflow-hidden bg-base"
    >
      {/* Tile wall */}
      <div aria-hidden="true" className="absolute inset-0 flex justify-center" style={{ gap: GAP, opacity: 0.45 }}>
        {grid.map((col, ci) => (
          <div
            key={ci}
            className="flex shrink-0 flex-col will-change-transform"
            style={{
              gap: GAP,
              animation: reduce ? 'none' : `${ci % 2 ? 'intro-down' : 'intro-up'} ${speeds[ci % speeds.length]}s linear infinite`,
            }}
          >
            {[...col, ...col].map((item, ri) => (
              <Tile key={ri} item={item} />
            ))}
          </div>
        ))}
      </div>

      {/* Flat dimming toward the centre so the text reads over the tiles (no blur) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(11,11,15,0.92) 0%, rgba(11,11,15,0.7) 45%, rgba(11,11,15,0) 100%)' }}
      />

      {/* Centre */}
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.2 }}
          className="relative h-28 w-28"
        >
          <GreetingBadge />
          <BotFace size={112} onClick={finish} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-accent"
        >
          Welcome, visitor
        </motion.p>
        <h1 className="mt-3 flex flex-wrap justify-center gap-x-[0.3em] text-[clamp(2.4rem,7vw,5.5rem)] font-semibold uppercase leading-none tracking-[-0.02em] text-white">
          {`${firstName}'s portfolio`.split(' ').map((w, i) => (
            <span key={w} className="overflow-hidden pb-[0.08em] pt-[0.12em]">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.7 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-4 text-base text-zinc-300 sm:text-lg"
        >
          {profile.title} · {projects.length} projects shipped
        </motion.p>

        {/* Progress */}
        <div className="mt-10 h-1 w-56 overflow-hidden rounded-full bg-elevated">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: total / 1000, ease: 'linear' }}
            className="h-full rounded-full bg-hero"
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500"
        >
          Loading · tap anywhere to skip
        </motion.p>
      </div>
    </motion.div>
  )
}
