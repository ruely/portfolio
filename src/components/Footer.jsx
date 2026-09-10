import { profile, navLinks } from '../data/portfolio'
import { ChatLauncher } from './ChatBot'

export default function Footer() {
  return (
    <footer className="border-t border-line">
      {/* Chat launcher docked on the footer's edge, straddling the border */}
      <div className="relative z-10 -mt-14 flex justify-center">
        <ChatLauncher />
      </div>
      <div className="container-px flex flex-col items-center justify-between gap-6 pb-10 pt-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
<span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-elevated ring-1 ring-line">
            <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
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
          © {new Date().getFullYear()} · Built with React &amp; Tailwind
        </p>
      </div>
    </footer>
  )
}
