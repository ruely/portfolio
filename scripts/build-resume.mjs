// Merges the two source resume PDFs into a single downloadable file.
//
// Order matters: the clean 1-page "RY Resume.pdf" goes first, then the more
// detailed 3-page resume is appended. Output lands in public/resume so Vite
// serves it at /resume/Ruel-Ybanez-Resume.pdf.
//
// Run with:  npm run build:resume

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

// Source PDFs. These live in the user's Downloads folder; adjust here if the
// source files ever move.
const HOME = process.env.HOME || process.env.USERPROFILE || ''
const SOURCES = [
  // First: the clean single-page version.
  join(HOME, 'Downloads', 'RY Resume.pdf'),
  // Then: the detailed three-page version.
  join(HOME, 'Downloads', 'RUEL_YBANEZ_resume (2).docx.pdf'),
]

const OUTPUT_DIR = join(projectRoot, 'public', 'resume')
const OUTPUT_FILE = join(OUTPUT_DIR, 'Ruel-Ybanez-Resume.pdf')

// AI tools/assistants used in recent development work — added as a clean
// addendum page at the end of the merged resume.
const AI_TOOLS = [
  [
    'Claude (Anthropic)',
    'AI pair-programmer used via Claude Code for full-stack development, UI/UX design, and code review.',
  ],
  [
    'Codex (OpenAI)',
    'AI coding assistant used for code generation, refactoring, and workflow automation.',
  ],
  [
    'Antigravity (Google)',
    'Agentic AI development environment used for multi-file editing and task automation.',
  ],
]

// Colours for the addendum page.
const INK = rgb(0.09, 0.09, 0.09)
const MUTED = rgb(0.36, 0.36, 0.36)
const ACCENT = rgb(0.11, 0.35, 0.32)

// Very small word-wrap helper for drawing paragraph text.
function wrap(text, font, size, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

// Draws the "AI Tools & Assistants" addendum page onto the merged document.
async function addAiToolsPage(pdf) {
  const helv = await pdf.embedFont(StandardFonts.Helvetica)
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold)

  // Match the size of the existing first page for consistency.
  const { width, height } = pdf.getPage(0).getSize()
  const page = pdf.addPage([width, height])

  const marginX = 56
  const contentW = width - marginX * 2
  let y = height - 72

  // Title
  page.drawText('AI Tools & Development Assistants', {
    x: marginX,
    y,
    size: 20,
    font: helvBold,
    color: INK,
  })
  y -= 14
  page.drawLine({
    start: { x: marginX, y },
    end: { x: width - marginX, y },
    thickness: 2,
    color: ACCENT,
  })
  y -= 26

  // Intro
  const intro =
    'This portfolio and recent projects were built with the assistance of modern AI development tools:'
  for (const l of wrap(intro, helv, 11, contentW)) {
    page.drawText(l, { x: marginX, y, size: 11, font: helv, color: MUTED })
    y -= 16
  }
  y -= 12

  // Tool list
  for (const [name, desc] of AI_TOOLS) {
    page.drawText('•', { x: marginX, y, size: 12, font: helvBold, color: ACCENT })
    page.drawText(name, { x: marginX + 16, y, size: 12.5, font: helvBold, color: INK })
    y -= 17
    for (const l of wrap(desc, helv, 10.5, contentW - 16)) {
      page.drawText(l, { x: marginX + 16, y, size: 10.5, font: helv, color: MUTED })
      y -= 14.5
    }
    y -= 12
  }
}

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function main() {
  const merged = await PDFDocument.create()

  let mergedAny = false
  for (const src of SOURCES) {
    if (!(await exists(src))) {
      console.warn(`⚠  Skipping missing source PDF: ${src}`)
      continue
    }
    const bytes = await readFile(src)
    const doc = await PDFDocument.load(bytes)
    const pages = await merged.copyPages(doc, doc.getPageIndices())
    pages.forEach((page) => merged.addPage(page))
    mergedAny = true
    console.log(`✓ Added ${doc.getPageCount()} page(s) from ${src}`)
  }

  if (!mergedAny) {
    console.error(
      '✗ No source PDFs were found. Expected files in your Downloads folder:\n' +
        SOURCES.map((s) => `   - ${s}`).join('\n'),
    )
    process.exit(1)
  }

  // Append the AI tools addendum page.
  await addAiToolsPage(merged)
  console.log('✓ Added AI Tools & Assistants page')

  // Metadata for a polished download experience.
  merged.setTitle('Ruel Ybanez Resume')
  merged.setAuthor('Ruel Ybanez')
  merged.setSubject('Resume — Web and Mobile Developer')
  merged.setKeywords([
    'Ruel Ybanez',
    'Web Developer',
    'Mobile Developer',
    'Flutter',
    'React',
    'Resume',
  ])
  merged.setProducer('pdf-lib')
  merged.setCreator('Ruel Ybanez Portfolio — build:resume')

  const out = await merged.save()
  await mkdir(OUTPUT_DIR, { recursive: true })
  await writeFile(OUTPUT_FILE, out)

  console.log(
    `\n✓ Wrote merged resume (${merged.getPageCount()} pages) → ${OUTPUT_FILE}`,
  )
}

main().catch((err) => {
  console.error('✗ Failed to build resume:', err)
  process.exit(1)
})
