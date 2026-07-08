import { Mail, Phone, MapPin, Download, Github, Gitlab, ArrowUpRight } from 'lucide-react'
import { profile, socials, RESUME_URL } from '../data/portfolio'
import Reveal from './Reveal'

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-px">
        <Reveal>
          <div className="ring-gradient relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-12">
            {/* Glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[100px]" />

            <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <span className="eyebrow">Get in touch</span>
                <h2 className="mt-4 text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.05] tracking-tightest">
                  Let&apos;s build something{' '}
                  <span className="accent-gradient">great together.</span>
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-400">
                  Have a project in mind or a role to fill? I&apos;m open to new
                  opportunities and always happy to talk shop.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={`mailto:${profile.email}`} className="btn-white">
                    <Mail size={16} /> Say Hello
                  </a>
                  <a href={RESUME_URL} download="Ruel-Ybanez-Resume.pdf" className="btn-outline">
                    <Download size={16} /> Download Resume
                  </a>
                </div>

                <div className="mt-7 flex gap-2.5">
                  <a
                    href={socials.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                  >
                    <Github size={17} />
                  </a>
                  <a
                    href={socials.gitlab}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitLab"
                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                  >
                    <Gitlab size={17} />
                  </a>
                </div>
              </div>

              {/* Contact rows */}
              <div className="space-y-2.5">
                {[
                  { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
                  { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
                  { icon: MapPin, label: 'Location', value: profile.location, href: null },
                ].map((c) => {
                  const Icon = c.icon
                  const inner = (
                    <div className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.14]">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-accent">
                        <Icon size={17} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[11px] uppercase tracking-wide text-zinc-600">
                          {c.label}
                        </p>
                        <p className="truncate text-sm font-medium text-white">{c.value}</p>
                      </div>
                      {c.href && (
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-zinc-600 transition-colors group-hover:text-white"
                        />
                      )}
                    </div>
                  )
                  return c.href ? (
                    <a key={c.label} href={c.href} className="block">
                      {inner}
                    </a>
                  ) : (
                    <div key={c.label}>{inner}</div>
                  )
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
