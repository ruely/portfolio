import Lenis from 'lenis'

// Smooth (inertial) scrolling for the whole page, powered by Lenis. Also
// routes in-page anchor clicks through Lenis so the nav still eases to each
// section, and exposes lock/unlock for the modal and mobile menu. Skipped for
// users who prefer reduced motion — native scrolling is used instead.
const NAV_OFFSET = 0 // Lenis already honours the sections' scroll-margin-top

let lenis = null

export function initSmoothScroll() {
  if (lenis) return lenis
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return null

  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
  let raf = 0
  const loop = (t) => {
    lenis.raf(t)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  const onClick = (e) => {
    const a = e.target.closest?.('a[href^="#"]')
    if (!a || a.getAttribute('href') === '#') return
    const target = document.querySelector(a.getAttribute('href'))
    if (!target) return
    e.preventDefault()
    scrollTo(target)
    history.replaceState(null, '', a.getAttribute('href'))
  }
  document.addEventListener('click', onClick)

  return () => {
    cancelAnimationFrame(raf)
    document.removeEventListener('click', onClick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollTo(target) {
  if (lenis) lenis.scrollTo(target, { offset: target === 0 ? 0 : NAV_OFFSET, duration: 1.2 })
  else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' })
  else target.scrollIntoView({ behavior: 'smooth' })
}

// Freeze page scrolling while an overlay (modal, mobile menu) is open.
export function lockScroll(locked) {
  document.body.style.overflow = locked ? 'hidden' : ''
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}
