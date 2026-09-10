// Two-tone theme: lavender and black. `bg` is the flat section background,
// `ink` the accent used for heading indexes, bullets, tabs and the navbar
// pill, `light` flags sections whose text must be dark.
export const tones = {
  black: { bg: '#0B0B0F', ink: '#C4B5FD', pill: '#2B2360', light: false },
  lavender: { bg: '#C4B5FD', ink: '#15122B', pill: '#15122B', light: true },
  white: { bg: '#FFFFFF', ink: '#15122B', pill: '#15122B', light: true },
}

// Section id → tone. Sections alternate down the page; the projects slider
// overrides its background with the active project's colour.
export const sectionTones = {
  home: 'lavender',
  projects: 'black',
  experience: 'black',
  skills: 'white',
  education: 'black',
  contact: 'lavender',
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
