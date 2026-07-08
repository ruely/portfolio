// Removes the light studio background from the full-body photo and cleans the
// edges, producing a transparent cutout for the hero.
//
//   1. Flag "background-like" pixels (light + neutral/low-saturation).
//   2. Connected-component pass: clear components that touch the border OR are
//      large (enclosed gaps like the armpit/elbow), but KEEP small interior
//      light details (shirt buttons, glasses glare).
//   3. Alpha erosion + edge colour-erosion + despeckle to kill the halo.
//
// Usage: node scripts/cut-image.cjs

const Jimp = require('jimp')
const path = require('path')

const SRC = path.resolve(__dirname, '..', 'assets', 'images', 'image.png')
const OUTS = [
  path.resolve(__dirname, '..', 'public', 'assets', 'images', 'hero-figure.png'),
  path.resolve(__dirname, '..', 'assets', 'images', 'hero-figure.png'),
]

const BG_MIN = 190 // background is light: darkest channel this high
const BG_SAT = 28 // …and neutral: max-min below this
const KEEP_AREA = 800 // interior light blobs smaller than this are kept
const ERODE_ITERS = 3
const HALO_BAND = 8

// Image-specific fix: the left lens has a blown-out white specular glare.
// Bright, neutral pixels inside this box are darkened into a natural tinted
// lens. (Coordinates are in source-image pixels, 1122x1402.)
const GLARE_BOX = { x0: 320, y0: 246, x1: 401, y1: 340 }

// Fringe cut: after cutting the background, remove any lingering light,
// low-saturation pixels within this many px of the silhouette edge — this is
// what clears the grey speckle along the wispy hair.
const FRINGE_BAND = 8
const FRINGE_MIN = 95 // darkest channel above this counts as fringe (grey)

const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b

async function main() {
  const img = await Jimp.read(SRC)
  const { width: W, height: H, data } = img.bitmap
  const N = W * H

  const isBgLike = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    return Math.min(r, g, b) >= BG_MIN && Math.max(r, g, b) - Math.min(r, g, b) <= BG_SAT
  }

  // 1) bg-like mask
  const mask = new Uint8Array(N)
  for (let p = 0; p < N; p++) if (isBgLike(p * 4)) mask[p] = 1

  // 2) connected components (4-neighbour) over the mask
  const label = new Int32Array(N).fill(-1)
  const stack = new Int32Array(N)
  let cleared = 0
  for (let start = 0; start < N; start++) {
    if (mask[start] === 0 || label[start] !== -1) continue
    // BFS/DFS this component
    let sp = 0
    stack[sp++] = start
    label[start] = start
    const members = []
    let touchesBorder = false
    while (sp > 0) {
      const p = stack[--sp]
      members.push(p)
      const x = p % W
      const y = (p / W) | 0
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1) touchesBorder = true
      const nb = [
        x > 0 ? p - 1 : -1,
        x < W - 1 ? p + 1 : -1,
        y > 0 ? p - W : -1,
        y < H - 1 ? p + W : -1,
      ]
      for (const q of nb) {
        if (q >= 0 && mask[q] === 1 && label[q] === -1) {
          label[q] = start
          stack[sp++] = q
        }
      }
    }
    if (touchesBorder || members.length > KEEP_AREA) {
      for (const p of members) data[p * 4 + 3] = 0
      cleared += members.length
    }
  }
  console.log(`✓ removed ${(100 * cleared / N).toFixed(1)}% of pixels as background`)

  // 3a) alpha erosion
  for (let it = 0; it < ERODE_ITERS; it++) {
    const snap = new Uint8ClampedArray(N)
    for (let p = 0; p < N; p++) snap[p] = data[p * 4 + 3]
    const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : snap[y * W + x])
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        if (snap[y * W + x] === 0) continue
        let m = 255
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) m = Math.min(m, at(x + dx, y + dy))
        data[(y * W + x) * 4 + 3] = Math.min(data[(y * W + x) * 4 + 3], m)
      }
  }

  // 3b) distance-to-transparent (capped) for the halo band
  const dist = new Int16Array(N)
  dist.fill(HALO_BAND + 2)
  for (let p = 0; p < N; p++) if (data[p * 4 + 3] < 40) dist[p] = 0
  for (let it = 0; it < HALO_BAND + 1; it++) {
    const snap = Int16Array.from(dist)
    const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : snap[y * W + x])
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const p = y * W + x
        if (snap[p] === 0) continue
        let m = snap[p]
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) m = Math.min(m, at(x + dx, y + dy) + 1)
        dist[p] = m
      }
  }

  // 3c) edge colour-erosion: recolour light halo pixels with darkest neighbour
  const isHalo = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    return luma(r, g, b) >= 150 && Math.max(r, g, b) - Math.min(r, g, b) <= 48
  }
  const A = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : data[(y * W + x) * 4 + 3])
  for (let it = 0; it < HALO_BAND; it++) {
    const snap = Buffer.from(data)
    let changed = 0
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const p = y * W + x
        if (snap[p * 4 + 3] < 40) continue
        if (dist[p] < 1 || dist[p] > HALO_BAND) continue
        const i = p * 4
        if (!isHalo(i)) continue
        let bestL = luma(snap[i], snap[i + 1], snap[i + 2]) - 8
        let br = -1, bg = -1, bb = -1
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            const j = ((y + dy) * W + (x + dx)) * 4
            if (A(x + dx, y + dy) < 180) continue
            const l = luma(snap[j], snap[j + 1], snap[j + 2])
            if (l < bestL) { bestL = l; br = snap[j]; bg = snap[j + 1]; bb = snap[j + 2] }
          }
        if (br >= 0) { data[i] = br; data[i + 1] = bg; data[i + 2] = bb; changed++ }
      }
    if (changed === 0) break
  }

  // 3d) despeckle
  {
    const snap = new Uint8ClampedArray(N)
    for (let p = 0; p < N; p++) snap[p] = data[p * 4 + 3]
    const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : snap[y * W + x])
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const p = y * W + x
        if (snap[p] === 0) continue
        let solid = 0
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            if (at(x + dx, y + dy) >= 140) solid++
          }
        if (solid < 3) data[p * 4 + 3] = 0
      }
  }

  // 3e) Fix the eyeglass glare: inside the lens box, paint everything that is
  //     NOT warm skin (glare, grey fringe, frame, holes) a clean, opaque dark
  //     lens tint. Warm skin (red noticeably above blue) is preserved.
  {
    const { x0, y0, x1, y1 } = GLARE_BOX
    let hit = 0
    for (let y = Math.max(0, y0); y < Math.min(H, y1); y++)
      for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) {
        const i = (y * W + x) * 4
        const r = data[i], g = data[i + 1], b = data[i + 2]
        const warmSkin = r - b > 24 && luma(r, g, b) > 70
        if (warmSkin) continue
        if (data[i + 3] >= 170) {
          // Solid part of the figure (lens/frame) → clean dark lens tint.
          data[i] = Math.round(14 + r * 0.05)
          data[i + 1] = Math.round(17 + g * 0.05)
          data[i + 2] = Math.round(24 + b * 0.06)
          data[i + 3] = 255
        } else {
          // Fringe / background inside the box → fully transparent (no rim,
          // no dark rectangle bleeding over the background).
          data[i + 3] = 0
        }
        hit++
      }
    console.log(`✓ tamed ${hit} glare pixels on the lens`)
  }

  // 3f) Fringe cut: recompute distance-to-transparent, then drop light neutral
  //     pixels inside the edge band — clears the grey speckle on the hair.
  {
    const d2 = new Int16Array(N)
    d2.fill(FRINGE_BAND + 2)
    for (let p = 0; p < N; p++) if (data[p * 4 + 3] < 40) d2[p] = 0
    for (let it = 0; it < FRINGE_BAND + 1; it++) {
      const snap = Int16Array.from(d2)
      const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : snap[y * W + x])
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          const p = y * W + x
          if (snap[p] === 0) continue
          let m = snap[p]
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) m = Math.min(m, at(x + dx, y + dy) + 1)
          d2[p] = m
        }
    }
    for (let p = 0; p < N; p++) {
      if (data[p * 4 + 3] === 0) continue
      if (d2[p] < 1 || d2[p] > FRINGE_BAND) continue
      const i = p * 4
      const min = Math.min(data[i], data[i + 1], data[i + 2])
      const max = Math.max(data[i], data[i + 1], data[i + 2])
      if (min >= FRINGE_MIN && max - min <= 52) data[i + 3] = 0 // light neutral fringe
    }
  }

  for (const out of OUTS) {
    await img.clone().writeAsync(out)
    console.log(`✓ wrote ${out}`)
  }
  console.log('✓ done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
