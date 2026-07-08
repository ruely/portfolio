// Builds the downloadable resume by merging Ruel's two source PDFs into one
// file: the clean single-page version first, then the detailed three-page
// version. Output lands in public/resume so Vite serves it at
// /resume/Ruel-Ybanez-Resume.pdf.
//
// The source PDFs live in the user's Downloads folder (local only), so the
// merged result is committed to the repo and CI ships it as-is — CI does NOT
// run this script. Regenerate locally with:  npm run build:resume
//
// Run with: npm run build:resume

import { PDFDocument } from 'pdf-lib'
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

const HOME = process.env.HOME || process.env.USERPROFILE || ''
const SOURCES = [
  // First: the clean single-page version (with photo).
  join(HOME, 'Downloads', 'RY Resume.pdf'),
  // Then: the detailed three-page version.
  join(HOME, 'Downloads', 'RUEL_YBANEZ_resume (2).docx.pdf'),
]

const OUTPUT_DIR = join(projectRoot, 'public', 'resume')
const OUTPUT_FILE = join(OUTPUT_DIR, 'Ruel-Ybanez-Resume.pdf')

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
      '✗ No source PDFs found. Expected these files in your Downloads folder:\n' +
        SOURCES.map((s) => `   - ${s}`).join('\n') +
        '\n(The committed public/resume/Ruel-Ybanez-Resume.pdf is left untouched.)',
    )
    process.exit(1)
  }

  merged.setTitle('Ruel Ybanez Resume')
  merged.setAuthor('Ruel Ybanez')
  merged.setSubject('Resume — Web and Mobile Developer')
  merged.setKeywords(['Ruel Ybanez', 'Web Developer', 'Mobile Developer', 'Flutter', 'React', 'Resume'])
  merged.setProducer('pdf-lib')
  merged.setCreator('Ruel Ybanez Portfolio - build:resume')

  const out = await merged.save()
  await mkdir(OUTPUT_DIR, { recursive: true })
  await writeFile(OUTPUT_FILE, out)

  console.log(`\n✓ Wrote merged resume (${merged.getPageCount()} pages) -> ${OUTPUT_FILE}`)
}

main().catch((err) => {
  console.error('Failed to build resume:', err)
  process.exit(1)
})
