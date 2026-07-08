import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'

// Dark gallery modal for a single project.
export default function ProjectModal({ project, onClose }) {
  const [index, setIndex] = useState(0)
  const gallery = project?.gallery ?? []

  const next = useCallback(() => setIndex((i) => (i + 1) % gallery.length), [gallery.length])
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + gallery.length) % gallery.length),
    [gallery.length],
  )

  useEffect(() => setIndex(0), [project?.id])

  useEffect(() => {
    if (!project) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [project, next, prev, onClose])

  const contain = project?.coverContain || project?.logoContain

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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 grid max-h-[92vh] w-full max-w-4xl grid-rows-[auto_1fr] overflow-hidden rounded-3xl border border-white/[0.1] bg-surface shadow-2xl md:max-h-[86vh] md:grid-cols-[1.25fr_1fr] md:grid-rows-none"
          >
            {/* Gallery */}
            <div className="relative flex min-h-[240px] items-center justify-center border-b border-white/[0.06] bg-base p-4 md:border-b-0 md:border-r">
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

              {gallery.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous"
                    className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-base/80 text-white backdrop-blur hover:bg-white/10"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next"
                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-base/80 text-white backdrop-blur hover:bg-white/10"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {gallery.map((g, i) => (
                      <button
                        key={g}
                        onClick={() => setIndex(i)}
                        aria-label={`Image ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                          i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Details */}
            <div className="overflow-y-auto p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-accent">
                  {project.category}
                </span>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-white">{project.name}</h3>
              <p className="mt-1 text-sm text-zinc-400">{project.tagline}</p>

              <p className="mt-5 border-t border-white/[0.06] pt-5 text-sm leading-relaxed text-zinc-400">
                {project.description}
              </p>

              <ul className="mt-5 space-y-2.5">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent-cyan" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-white/[0.06] pt-5">
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
