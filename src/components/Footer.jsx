import { profile, navLinks } from '../data/portfolio'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="container-px flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-cyan text-xs font-bold text-white">
            RY
          </span>
          <div>
            <p className="text-sm font-semibold text-white">{profile.name}</p>
            <p className="font-mono text-[11px] text-zinc-600">{profile.title}</p>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-500 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <p className="font-mono text-[11px] text-zinc-600">
          © 2026 · Built with React &amp; Tailwind
        </p>
      </div>
    </footer>
  )
}
