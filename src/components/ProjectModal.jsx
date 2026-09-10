import { useEffect, useState, useCallback, useRef, useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import ProjectCover from './ProjectCover'
import { lockScroll } from '../lib/smoothScroll'

// Dark gallery modal for a single project.
export default function ProjectModal({ project, onClose }) {
  const [index, setIndex] = useState(0)
  const closeRef = useRef(null)
  const titleId = useId()
  const gallery = project?.gallery ?? []
  const hasScreens = gallery.length > 0

  const next = useCallback(
    () => setIndex((i) => (gallery.length ? (i + 1) % gallery.length : 0)),
    [gallery.length],
  )
  const prev = useCallback(
    () => setIndex((i) => (gallery.length ? (i - 1 + gallery.length) % gallery.length : 0)),
    [gallery.length],
  )

  useEffect(() => setIndex(0), [project?.id])

  // Keyboard controls.
  useEffect(() => {
    if (!project) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [project, next, prev, onClose])

  // Lock page scroll, move focus into the dialog, and hand it back to the
  // card that opened it when the dialog closes.
  useEffect(() => {
    if (!project) return
    const opener = document.activeElement
    lockScroll(true)
    const t = setTimeout(() => closeRef.current?.focus(), 30)
    return () => {
      clearTimeout(t)
      lockScroll(false)
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const contain = project?.coverContain || project?.logoContain
  const showPeriod = project?.companyPeriod && /\d/.test(project.companyPeriod)

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            // Flex (not grid): under a max-height, a flex child with min-h-0
            // shrinks and scrolls, while a 1fr grid row would overflow and clip.
            className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl md:max-h-[86vh] md:flex-row"
          >
            {/* Gallery */}
            <div className="relative flex min-h-[240px] shrink-0 items-center justify-center border-b border-line bg-base p-4 md:min-w-0 md:flex-[1.25_1_0%] md:border-b-0 md:border-r">
              {hasScreens ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={gallery[index]}
                    src={gallery[index]}
                    alt={`${project.name} view ${index + 1}`}
                    loading="lazy"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`max-h-[36vh] w-auto max-w-full rounded-xl md:max-h-[72vh] ${
                      contain ? 'object-contain p-6' : 'object-contain'
                    }`}
                  />
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0">
                  <ProjectCover project={project} large />
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-card px-3 py-1 font-mono text-[11px] text-zinc-400">
                    No public screenshots
                  </span>
                </div>
              )}

              {gallery.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-card text-white hover:bg-elevated-hover"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-card text-white hover:bg-elevated-hover"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1.5">
                    {gallery.map((g, i) => (
                      <button
                        key={g}
                        onClick={() => setIndex(i)}
                        aria-label={`Image ${i + 1}`}
                        aria-current={i === index}
                        className={`h-1.5 rounded-full transition-all ${
                          i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/60'
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 font-mono text-[10px] tabular-nums text-zinc-400">
                      {index + 1}/{gallery.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Details */}
            <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8 md:min-w-0 md:flex-[1_1_0%]">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full border border-line bg-elevated px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-accent">
                  {project.category}
                </span>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-full border border-line bg-elevated text-zinc-300 hover:bg-elevated-hover hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 id={titleId} className="mt-4 text-2xl font-bold text-white">
                {project.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">{project.tagline}</p>
              {project.company && (
                <p className="mt-2 font-mono text-[11px] text-zinc-500">
                  {project.company}
                  {showPeriod && ` · ${project.companyPeriod}`}
                </p>
              )}

              <p className="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-zinc-400">
                {project.description}
              </p>

              <ul className="mt-5 space-y-2.5">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-line pt-5">
                <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wide text-zinc-600">
                  Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
