// Rules-based knowledge for the site's chat assistant. It answers only from
// the portfolio data — who Ruel is, his skills, projects, experience,
// education, awards and contact details — and declines anything else. No
// network, no model: it runs entirely in the browser, so it works on GitHub
// Pages without exposing an API key.
import {
  profile,
  projects,
  skills,
  skillCategories,
  experience,
  education,
  awards,
  aiTools,
  RESUME_URL,
} from '../data/portfolio'

const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}\s+#.]/gu, ' ').replace(/\s+/g, ' ').trim()
const has = (text, words) => words.some((w) => text.includes(w))
const list = (arr) => (arr.length <= 1 ? arr.join('') : `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`)
const firstName = profile.name.split(' ')[0]

const featured = projects.filter((p) => p.featured)
const byCategory = (key) => skills.filter((s) => s.category === key).map((s) => s.name)

export const suggestions = [
  `Who is ${firstName}?`,
  'What are his skills?',
  'Show me his projects',
  'Where has he worked?',
  'How can I contact him?',
]

const GREETINGS = ['hi', 'hello', 'hey', 'kumusta', 'kamusta', 'hola', 'yo', 'good morning', 'good afternoon', 'good evening', 'maayong']

export function answer(raw) {
  const q = norm(raw)
  if (!q) return `Ask me anything about ${firstName} — his skills, projects, experience, education or how to reach him.`

  // A specific project mentioned by name?
  const project = projects.find((p) => q.includes(norm(p.name)) || q.includes(norm(p.id)))
  if (project) {
    return (
      `${project.name} — ${project.tagline}. ${project.description} ` +
      `Built with ${list(project.tech)}.` +
      (project.company ? ` Done at ${project.company.replace(/\.$/, '')}.` : '')
    )
  }

  // A specific skill mentioned?
  const skill = skills.find((s) => {
    const n = norm(s.name)
    return n.length > 1 && new RegExp(`(^|\\s)${n.replace(/[.+#]/g, (c) => '\\' + c)}(\\s|$)`).test(q)
  })
  if (skill && !has(q, ['project', 'app', 'built', 'made'])) {
    const cat = skillCategories.find((c) => c.key === skill.category)?.label ?? skill.category
    const used = projects.filter((p) => p.tech.some((t) => norm(t) === norm(skill.name))).map((p) => p.name)
    return (
      `Yes — ${skill.name} is part of ${firstName}'s toolbox (${cat}).` +
      (used.length ? ` He used it on ${list(used.slice(0, 4))}${used.length > 4 ? ' and more' : ''}.` : '')
    )
  }

  if (GREETINGS.some((g) => q === g || q.startsWith(g + ' ') || q.endsWith(' ' + g))) {
    return `Hi there! I'm ${firstName}'s assistant. Ask me about his skills, projects, experience, education or how to get in touch.`
  }
  if (has(q, ['who', 'about', 'introduce', 'yourself', 'tell me', 'what do', 'what does', 'summary', 'background'])) {
    return `${profile.name} is a ${profile.title} based in ${profile.location}. ${profile.summary}`
  }
  if (has(q, ['contact', 'email', 'phone', 'reach', 'hire', 'available', 'call', 'message', 'touch'])) {
    return `You can reach ${firstName} at ${profile.email} or ${profile.phone}. He's based in ${profile.location} and is open to new opportunities.`
  }
  if (has(q, ['where', 'location', 'based', 'live', 'from', 'city', 'country'])) {
    return `${firstName} is based in ${profile.location}.`
  }
  if (has(q, ['resume', 'cv', 'curriculum'])) {
    return `His resume is available here: ${window.location.origin}${RESUME_URL}`
  }
  if (has(q, ['year', 'how long', 'experience', 'work', 'career', 'job', 'compan', 'employ', 'clever', 'zetta', 'litecloud'])) {
    const lines = experience.map((j) => `${j.role} at ${j.company} (${j.period}, ${j.location})`)
    return `${firstName} has ${profile.yearsExperience} years of experience: ${list(lines)}.`
  }
  if (has(q, ['education', 'school', 'study', 'studied', 'degree', 'graduat', 'college', 'university'])) {
    return `Education: ${list(education.map((e) => `${e.program} at ${e.school} (${e.detail})`))}.`
  }
  if (has(q, ['award', 'honor', 'achievement', 'recogni', 'champion'])) {
    return `Awards: ${list(awards.map((a) => `${a.title} (${a.org}, ${a.year})`))}.`
  }
  if (has(q, ['ai', 'assistant', 'copilot', 'chatgpt', 'claude', 'gemini', 'codex', 'cursor'])) {
    return `${firstName} builds with AI tools including ${list(aiTools.map((t) => t.name))}.`
  }
  if (has(q, ['project', 'portfolio', 'built', 'made', 'app', 'apps', 'work on', 'shipped', 'product'])) {
    return (
      `${firstName} has shipped ${projects.length} projects. Highlights: ${list(featured.map((p) => p.name))}. ` +
      `Ask about any of them by name.`
    )
  }
  if (has(q, ['skill', 'stack', 'tech', 'technolog', 'language', 'framework', 'tool', 'database', 'frontend', 'backend', 'mobile'])) {
    const cat = skillCategories.find((c) => has(q, [c.key, c.label.toLowerCase()]))
    if (cat) return `${cat.label}: ${list(byCategory(cat.key))}.`
    return (
      `${firstName}'s main stack: mobile with ${list(byCategory('mobile'))}; frontend with ${list(byCategory('frontend').slice(0, 5))}; ` +
      `backend with ${list(byCategory('backend'))}; databases like ${list(byCategory('databases').slice(0, 4))}. Ask about a category or a specific tool.`
    )
  }
  if (has(q, ['thank', 'thanks', 'salamat'])) return "You're welcome! Anything else about " + firstName + '?'
  if (has(q, ['bye', 'goodbye', 'see you'])) return 'Bye! Come back anytime.'

  return (
    `That's not in my knowledge — I can only answer questions about ${firstName}: ` +
    `his skills, projects, experience, education, awards and how to reach him.`
  )
}
