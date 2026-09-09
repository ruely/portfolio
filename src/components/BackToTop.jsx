import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

// Floating "back to top" control for the long single-page layout. Appears once
// the hero has scrolled out of view.
export default function BackToTop() {
  const [show, setShow] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'instant' : 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-zinc-200 shadow-lg shadow-black/50 transition-colors hover:border-line-strong hover:text-white sm:bottom-7 sm:right-7"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
