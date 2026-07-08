# Ruel Ybanez — Portfolio

A modern, responsive portfolio website for **Ruel Ybanez**, Web & Mobile Developer.
Built with **Vite + React + Tailwind CSS**, animated with **Framer Motion**, and
iconography from **lucide-react**.

## Features

- Sticky navbar with active-section highlighting and an animated mobile menu
- Animated hero with portrait, stats, and resume download CTA
- Featured projects grid with an animated screenshot gallery modal
- Experience timeline, grouped skills, education & awards, and a contact section
- Downloadable, merged resume PDF served at `/resume/Ruel-Ybanez-Resume.pdf`
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

The downloadable resume is generated from two source PDFs using
[`pdf-lib`](https://pdf-lib.js.org/) in [`scripts/build-resume.mjs`](scripts/build-resume.mjs):

1. `~/Downloads/RY Resume.pdf` — the clean 1-page version (placed first)
2. `~/Downloads/RUEL_YBANEZ_resume (2).docx.pdf` — the detailed 3-page version (appended)

The merged file has PDF metadata set (`title: "Ruel Ybanez Resume"`,
`author: "Ruel Ybanez"`) and is written to `public/resume/`, so Vite serves it at
`/resume/Ruel-Ybanez-Resume.pdf`. The hero and contact download buttons link there
with the `download` attribute.

Regenerate it any time with:

```bash
npm run build:resume
```

> If the source PDFs move, update the `SOURCES` array at the top of
> `scripts/build-resume.mjs`.

## Project structure

```
├─ public/
│  ├─ assets/images/        # project screenshots, logos, portrait
│  └─ resume/               # generated merged resume PDF
├─ scripts/
│  └─ build-resume.mjs      # pdf-lib merge script (npm run build:resume)
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

## Deployment (GitHub Pages)

This repo ships a GitHub Actions workflow at
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) that builds the
site and publishes it to **GitHub Pages** on every push to `main`.

One-time setup:

1. Create a GitHub repo and push this project to it (see below).
2. In the repo, go to **Settings → Pages → Build and deployment → Source** and
   choose **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab). When
   it finishes, your site is live.

The workflow figures out the correct base path automatically:

- Repo named `your-username.github.io` → served at `https://your-username.github.io/`
- Any other repo (e.g. `portfolio`) → served at `https://your-username.github.io/portfolio/`

It does this by setting `VITE_BASE`, which [`vite.config.js`](vite.config.js)
reads, and all asset/resume paths are built from `import.meta.env.BASE_URL`, so
they resolve correctly at either location.

> The merged resume PDF is committed under `public/resume/`, so CI does **not**
> run `build:resume` (the source PDFs live only on your machine). Regenerate it
> locally with `npm run build:resume` whenever your resume changes, then commit.

### First push

```bash
git init
git add .
git commit -m "Initial commit: portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Tech

React 18 · Vite 5 · Tailwind CSS 3 · Framer Motion 11 · lucide-react · pdf-lib
