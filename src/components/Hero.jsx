import { motion, useReducedMotion } from 'framer-motion'
import { Download, ArrowRight, MapPin } from 'lucide-react'
import { profile, stats, RESUME_URL } from '../data/portfolio'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="home" className="scroll-mt-24 pt-32 sm:pt-36 lg:pt-40">
      <div className="container-px grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            Available for work
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[1.02] tracking-tightest"
          >
            <span className="text-gradient">Building apps</span>
            <br />
            that move people.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            I&apos;m {profile.name} — a Web &amp; Mobile Developer with 7+ years
            shipping payment systems, automated fare collection, parking
            platforms and enterprise apps to real users.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <a href={RESUME_URL} download="Ruel-Ybanez-Resume.pdf" className="btn-white">
              <Download size={16} /> Download Resume
            </a>
            <a href="#projects" className="btn-outline">
              View Work <ArrowRight size={16} />
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-6 flex items-center gap-2 text-sm text-zinc-500"
          >
            <MapPin size={15} /> {profile.location}
          </motion.div>

          {/* Stat row */}
          <motion.dl
            variants={item}
            className="mt-10 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="bg-base/40 p-4">
                <dt className="text-2xl font-bold text-white">{s.value}</dt>
                <dd className="mt-1 text-[11px] leading-tight text-zinc-500">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Right: blended, frameless portrait (headshot) */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm lg:max-w-md"
        >
          {/* Soft glow + ring backdrop */}
          <div className="absolute inset-x-6 top-4 -z-0 aspect-square rounded-full bg-gradient-to-b from-accent/30 via-accent-blue/12 to-transparent blur-3xl" />
          <div className="absolute inset-x-10 top-8 aspect-square rounded-full border border-white/[0.06]" />
          <div className="absolute inset-x-16 top-14 aspect-square rounded-full border border-white/[0.04]" />

          {/* Portrait cutout — the body/shoulders fade into the background */}
          <img
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            className={`portrait-fade relative z-10 mx-auto w-full max-w-[22rem] object-contain ${
              reduce ? '' : 'animate-float'
            }`}
            loading="eager"
          />

          {/* Floating badges */}
          <div className="absolute left-0 top-10 z-20 hidden rounded-2xl border border-white/10 bg-base/70 px-4 py-3 backdrop-blur-md sm:block">
            <p className="text-2xl font-bold text-white">{profile.yearsExperience}</p>
            <p className="text-[11px] text-zinc-400">Years exp.</p>
          </div>
          <div className="absolute bottom-10 right-0 z-20 hidden items-center gap-2 rounded-full border border-white/10 bg-base/70 px-3.5 py-2 backdrop-blur-md sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            <span className="text-xs font-medium text-zinc-200">Open to work</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
