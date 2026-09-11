import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { Send, X } from 'lucide-react'
import { profile } from '../data/portfolio'
import { answer, suggestions } from '../lib/assistant'

// Chat assistant. The bot (ChatDock) drops into the footer's edge when the
// page bottom comes into view and lifts away when it leaves — bobbing, with
// a speech bubble that cycles greetings in different languages. Tapping it
// opens this Messenger-style chat window
// docked to the bottom-right corner. The conversation is anchored to the
// bottom of the window, so the typing dots appear there too. Replies come from src/lib/assistant.js and are
// only about Ruel; a typing indicator precedes each one.
const BOT = `${import.meta.env.BASE_URL}assets/images/bot-icon.png`
const GREETINGS = [
  'Hello!', 'Kumusta!', 'Hola!', 'Bonjour!', 'こんにちは!', '안녕하세요!', 'Maayong adlaw!', 'Ciao!',
  'Hallo!', 'Olá!', 'Namaste!', '你好!', 'Salut!', 'Hej!', 'Merhaba!', 'Xin chào!', 'Sawasdee!',
]
const firstName = profile.name.split(' ')[0]

const ALIVE = { y: [0, -8, 0], rotate: [0, -4, 0, 4, 0], scale: [1, 1.04, 1] }
const ALIVE_T = { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
const openChat = () => window.dispatchEvent(new CustomEvent('open-chat'))

export function GreetingBadge() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1 + Math.floor(Math.random() * (GREETINGS.length - 1))) % GREETINGS.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.9 }}
        transition={{ duration: 0.28 }}
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-hero px-3 py-1 text-xs font-semibold text-hero-ink shadow-lg"
      >
        {GREETINGS[i]}
        <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-hero" />
      </motion.span>
    </AnimatePresence>
  )
}

export function BotFace({ size, onClick = openChat }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`Chat with ${firstName}'s assistant`}
      animate={ALIVE}
      transition={ALIVE_T}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="grid place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      style={{ width: size, height: size }}
    >
      <img
        src={BOT}
        alt=""
        className="pointer-events-none h-full w-full object-contain drop-shadow-[0_18px_30px_rgba(124,92,255,0.45)]"
        draggable="false"
      />
    </motion.button>
  )
}

// The bot docked on the footer's edge. It drops down into place whenever the
// footer scrolls into view and lifts away again when it leaves, so the
// entrance replays on every visit to the bottom of the page.
export function ChatDock({ dot = 'border-base', className = '' }) {
  const reduce = useReducedMotion()
  // The wrapper never moves, so what the observer sees is not changed by the
  // animation itself (otherwise hiding upward would put it back "in view").
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.5 })
  const shown = reduce || inView
  return (
    <div ref={ref} className={`relative h-28 w-28 ${className}`}>
    <motion.div
      initial={false}
      animate={shown ? { y: 0, opacity: 1, scale: 1 } : { y: -140, opacity: 0, scale: 0.8 }}
      transition={shown ? { type: 'spring', stiffness: 70, damping: 13 } : { duration: 0.35, ease: 'easeIn' }}
      className="absolute inset-0"
    >
      <GreetingBadge />
      <BotFace size={112} />
      <span className={`pointer-events-none absolute bottom-3 left-3 h-4 w-4 rounded-full border-2 ${dot} bg-emerald-400 animate-pulse-dot`} />
    </motion.div>
    </div>
  )
}

function Typing() {
  return (
    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-elevated px-3.5 py-3">
      {[0, 1, 2].map((k) => (
        <motion.span
          key={k}
          className="h-1.5 w-1.5 rounded-full bg-zinc-400"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: k * 0.15 }}
        />
      ))}
    </div>
  )
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const timers = useRef([])
  const greeted = useRef(false)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('open-chat', onOpen)
    return () => window.removeEventListener('open-chat', onOpen)
  }, [])
  useEffect(() => {
    if (!open) return
    setTimeout(() => inputRef.current?.focus(), 250)
    // First open: the assistant "types" for a moment before saying hello.
    if (greeted.current) return
    greeted.current = true
    setTyping(true)
    timers.current.push(
      setTimeout(() => {
        setTyping(false)
        setMessages([
          { from: 'bot', text: `Hi! I'm ${firstName}'s assistant. Ask me about his skills, projects, experience or how to reach him.` },
        ])
      }, 1400),
    )
  }, [open])
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const send = (text) => {
    const clean = text.trim()
    if (!clean || typing) return
    setMessages((m) => [...m, { from: 'user', text: clean }])
    setDraft('')
    setTyping(true)
    const reply = answer(clean)
    const delay = 500 + Math.min(1400, reply.length * 8)
    timers.current.push(
      setTimeout(() => {
        setTyping(false)
        setMessages((m) => [...m, { from: 'bot', text: reply }])
      }, delay),
    )
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          /* Placement wrapper: centred on phones, docked bottom-right from sm up.
             The animated panel sits inside so its transforms never fight this. */
          <div className="fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0">
          <motion.div
            role="dialog"
            aria-label={`Chat with ${firstName}'s assistant`}
            data-lenis-prevent
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-[min(520px,calc(100vh-2rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
              <span className="relative grid h-9 w-9 place-items-center">
                <img src={BOT} alt="" className="h-9 w-9 object-contain" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-400" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{firstName}'s assistant</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400">Online · answers about {firstName}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-8 w-8 place-items-center rounded-full border border-line bg-elevated text-zinc-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="thin-scroll flex-1 overflow-y-auto px-3 py-3">
              <div className="flex min-h-full flex-col justify-end gap-2.5">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.from === 'user'
                        ? 'rounded-br-md bg-hero text-hero-ink'
                        : 'rounded-bl-md bg-elevated text-zinc-100'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <Typing />
                </div>
              )}
              {messages.length === 1 && !typing && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-line bg-card px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-accent hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              </div>
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(draft)
              }}
              className="flex items-center gap-2 border-t border-line bg-surface p-2.5"
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Ask about ${firstName}…`}
                aria-label="Message"
                className="min-w-0 flex-1 rounded-full border border-line bg-card px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={!draft.trim() || typing}
                aria-label="Send"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-hero text-hero-ink transition-opacity disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
