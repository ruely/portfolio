// Designed cover for projects that have no real screenshots. Replaces the stock
// "No Available Image" graphic with a tinted gradient, a faint grid, a large
// monogram watermark and the project logo in a frosted tile, so every card in
// the reel looks intentional.

const TONES = [
  { match: /fintech|payments|accounting|payroll/i, hue: 258 }, // violet
  { match: /transport|logistics|location|fleet/i, hue: 190 }, // cyan
  { match: /healthcare/i, hue: 160 }, // emerald
  { match: /analytics|data/i, hue: 36 }, // amber
  { match: /events|productivity|utility/i, hue: 320 }, // pink
  { match: /enterprise|operations/i, hue: 214 }, // blue
]

const hueFor = (category = '') => TONES.find((t) => t.match.test(category))?.hue ?? 258

// "LuvPay" → "LP", "Material Tracking" → "MT", "HCM" → "HCM", "Towing" → "T".
const monogram = (name = '') => {
  const words = name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+|(?<=[a-z])(?=[A-Z])/)
    .filter(Boolean)
  if (words.length === 1 && /^[A-Z0-9]{2,4}$/.test(words[0])) return words[0]
  return words
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
}

export default function ProjectCover({ project, large = false, className = '' }) {
  const hue = hueFor(project.category)
  const tile = large ? 'h-32 w-32 sm:h-40 sm:w-40' : 'h-20 w-20 sm:h-24 sm:w-24'
  const logo = large ? 'h-20 w-20 sm:h-24 sm:w-24' : 'h-12 w-12 sm:h-14 sm:w-14'

  return (
    <div
      aria-hidden="true"
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{
        background: [
          `radial-gradient(120% 90% at 18% 0%, hsl(${hue} 85% 62% / 0.30), transparent 55%)`,
          `radial-gradient(90% 80% at 100% 100%, hsl(${(hue + 40) % 360} 85% 60% / 0.18), transparent 60%)`,
          '#0E0E11',
        ].join(', '),
      }}
    >
      <div className="bg-grid absolute inset-0 opacity-80 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_78%)]" />

      <span
        className={`pointer-events-none absolute -right-2 -top-3 select-none font-display font-extrabold leading-none tracking-tightest text-white/[0.045] ${
          large ? 'text-[11rem]' : 'text-[7rem]'
        }`}
      >
        {monogram(project.name)}
      </span>

      <div
        className={`relative grid place-items-center rounded-2xl border border-line bg-elevated ${tile}`}
        style={{ boxShadow: `0 0 70px -12px hsl(${hue} 85% 62% / 0.55)` }}
      >
        <img
          src={project.logo}
          alt=""
          loading="lazy"
          className={`${logo} object-contain ${project.logoInvert ? 'invert' : ''}`}
        />
      </div>
    </div>
  )
}
