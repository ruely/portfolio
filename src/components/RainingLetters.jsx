import { useState, useEffect, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'

// Adapted from the "modern-animated-hero-section" raining-letters effect.
// Used purely as a decorative, non-interactive BACKGROUND layer: the scrambled
// demo title and the random "flicker" highlight are dropped, leaving a calm,
// uniform fall of dim letters. Fully skipped when the user prefers reduced
// motion.

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
const randChar = () => CHARSET[Math.floor(Math.random() * CHARSET.length)]

export default function RainingLetters({ count = 150 }) {
  const [characters, setCharacters] = useState([])
  const reduce = useReducedMotion()

  const createCharacters = useCallback(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        char: randChar(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.05 + Math.random() * 0.25,
      })
    }
    return arr
  }, [count])

  useEffect(() => {
    setCharacters(createCharacters())
  }, [createCharacters])

  // Fall + recycle at the bottom.
  useEffect(() => {
    if (reduce) return
    let raf
    const step = () => {
      setCharacters((prev) =>
        prev.map((c) => {
          const y = c.y + c.speed
          if (y >= 100) {
            return { ...c, y: -5, x: Math.random() * 100, char: randChar() }
          }
          return { ...c, y }
        }),
      )
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {characters.map((c, index) => (
        <span
          key={index}
          className="absolute font-mono text-white"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: '1.05rem',
            opacity: 0.1,
            willChange: 'transform, top',
          }}
        >
          {c.char}
        </span>
      ))}
    </div>
  )
}
