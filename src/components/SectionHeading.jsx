import Reveal from './Reveal'

// Dark section header: mono index eyebrow + tight title + optional description
// and right-aligned action.
export default function SectionHeading({ index, eyebrow, title, description, action }) {
  return (
    <Reveal>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <span className="eyebrow">
            {index && <span className="text-accent">{index}</span>}
            {eyebrow}
          </span>
          <h2 className="mt-3 text-[clamp(1.85rem,4vw,2.75rem)] font-extrabold leading-[1.05] tracking-tightest">
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-base leading-relaxed text-zinc-400">{description}</p>
          )}
        </div>
        {action}
      </div>
    </Reveal>
  )
}
