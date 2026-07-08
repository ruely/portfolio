# Ruel Ybanez — Portfolio

A modern, responsive portfolio website for **Ruel Ybanez**, Web & Mobile Developer.
Built with **Vite + React + Tailwind CSS**, animated with **Framer Motion**, and
iconography from **lucide-react**.

## Features

- Sticky navbar with active-section highlighting and an animated mobile menu
- Animated hero with portrait, stats, and resume download CTA
- Featured projects grid with an animated screenshot gallery modal
- Experience timeline, grouped skills, education & awards, and a contact section
- Downloadable, modern resume PDF served at `/resume/Ruel-Ybanez-Resume.pdf`
- Fully responsive (mobile / tablet / desktop) and respects `prefers-reduced-motion`

## Getting started

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
```

## Scripts

| Script                 | What it does                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server with hot reload                           |
| `npm run build`        | Production build into `dist/`                                       |
| `npm run preview`      | Preview the production build locally                                |
| `npm run build:resume` | Merge the source PDFs into `public/resume/Ruel-Ybanez-Resume.pdf`   |

## Resume PDF

The downloadable resume is Ruel's own résumé — [`scripts/build-resume.mjs`](scripts/build-resume.mjs)
merges two source PDFs with [`pdf-lib`](https://pdf-lib.js.org/): the clean
single-page version first, then the detailed three-page version (4 pages total),
and sets PDF metadata (`title: "Ruel Ybanez Resume"`, `author: "Ruel Ybanez"`).

The source PDFs live in the author's `~/Downloads` folder (local only), so the
merged result is committed to `public/resume/Ruel-Ybanez-Resume.pdf` and served
at `/resume/Ruel-Ybanez-Resume.pdf`. The hero, navbar, and contact download
buttons link there with the `download` attribute.

Regenerate it locally (after updating the source PDFs) with:

```bash
npm run build:resume
```

> CI does **not** run `build:resume` (the source PDFs aren't on the runner) — it
> ships the committed merged PDF.

## Project structure

```
├─ public/
│  ├─ assets/images/        # project screenshots, logos, portrait
│  └─ resume/               # generated modern resume PDF
├─ scripts/
│  └─ build-resume.mjs      # pdf-lib resume generator (npm run build:resume)
├─ src/
│  ├─ components/           # Navbar, Hero, Projects, Experience, Skills, …
│  ├─ data/portfolio.js     # all site content (single source of truth)
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css             # Tailwind layers + theme
├─ index.html
├─ tailwind.config.js
└─ vite.config.js
```

## Editing content

All copy — profile, projects, experience, skills, education, awards — lives in
[`src/data/portfolio.js`](src/data/portfolio.js). Update that one file to change
what the site displays. Add or swap project screenshots in
`public/assets/images/` and reference them from the `projects` array.

## Deployment (GitHub Pages — `/docs` folder)

This site deploys via GitHub Pages **"Deploy from a branch → `/docs`"**. The
built static site is committed to the [`docs/`](docs/) folder and served as-is.

Build the site into `docs/`:

```bash
npm run build:docs
```

This runs Vite with a **relative base** (`VITE_BASE=./`), so the output works at
any project subpath (e.g. `https://<username>.github.io/portfolio/`) without
hard-coding the repo name. It also includes a `.nojekyll` file so Pages serves
Vite's `assets/` folder untouched.

One-time setup on GitHub:

1. Push this project to your repo (replacing the old site — see below).
2. Go to **Settings → Pages → Build and deployment**, set **Source** to
   **Deploy from a branch**, **Branch: `main`**, **Folder: `/docs`**, then Save.

Whenever you change the site, re-run `npm run build:docs`, commit the updated
`docs/`, and push — Pages redeploys automatically.

> The résumé (`public/resume/…`) is copied into `docs/` by the build. Update it
> with `npm run build:resume` first, then `npm run build:docs`.

### Replace your existing repo

```bash
git remote add origin https://github.com/<username>/portfolio.git
# or, if a remote already exists:
# git remote set-url origin https://github.com/<username>/portfolio.git

git push -u origin main --force   # replaces the old Flutter site
```

## Tech

React 18 · Vite 5 · Tailwind CSS 3 · Framer Motion 11 · lucide-react · pdf-lib
