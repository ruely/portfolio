// One hue per section. `bg` is the flat section background, `ink` the accent
// used for the heading index, watermark, glow and active controls, `pill` a
// solid dark tint for the navbar's active link.
export const tones = {
  violet: { bg: '#181235', ink: '#7C5CFF', pill: '#2B2360' },
  blue: { bg: '#0E1B30', ink: '#4F9DFF', pill: '#1A2B4A' },
  cyan: { bg: '#0A2327', ink: '#22D3EE', pill: '#123F46' },
  amber: { bg: '#2A1E0C', ink: '#F5B544', pill: '#3B2D12' },
  emerald: { bg: '#0D2619', ink: '#34D399', pill: '#163A2A' },
}

// Section id → tone. Shared by the sections and the navbar.
export const sectionTones = {
  home: 'violet',
  projects: 'violet',
  experience: 'blue',
  skills: 'cyan',
  education: 'amber',
  contact: 'emerald',
}

// Blend two hex colours: t = 0 → a, t = 1 → b.
export const mixHex = (a, b, t) => {
  const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16))
  const pb = b.match(/\w\w/g).map((h) => parseInt(h, 16))
  return (
    '#' +
    pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('')
  )
}
