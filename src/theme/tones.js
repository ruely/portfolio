// One hue per section. `bg` is the flat section background, `ink` the accent
// used for the heading index, watermark, glow and active controls, `pill` a
// solid dark tint for the navbar's active link.
export const tones = {
  violet: { bg: '#0E0B1C', ink: '#7C5CFF', pill: '#2B2360' },
  blue: { bg: '#0A0E18', ink: '#4F9DFF', pill: '#1A2B4A' },
  cyan: { bg: '#081315', ink: '#22D3EE', pill: '#123F46' },
  amber: { bg: '#15110A', ink: '#F5B544', pill: '#3B2D12' },
  emerald: { bg: '#0A1410', ink: '#34D399', pill: '#163A2A' },
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
