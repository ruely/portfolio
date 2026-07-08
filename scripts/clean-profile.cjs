// Cleans the profile.png cutout so it blends on any background:
//   1. Erode the alpha matte 1px (kills the softest partial-alpha fringe).
//   2. Edge color-erosion: the light gray "halo" baked along the silhouette is
//      recolored with the adjacent darker hair/clothing so no bright rim shows.
//   3. Remove green/cyan spill on remaining edge pixels.
//   4. Despeckle isolated floating dots.
//   5. Feather any leftover light, semi-transparent edge pixels.
//
// Interior detail (eyes, necklace, teeth, skin) is preserved: the halo pass
// only touches LIGHT, LOW-SATURATION pixels near the alpha edge, so warm skin
// and the opaque interior are left alone.
//
// Usage: node scripts/clean-profile.cjs

const Jimp = require('jimp')
const path = require('path')

const SRC = path.resolve(__dirname, '..', 'assets', 'images', 'profile-original.backup.png')
const OUTS = [
  path.resolve(__dirname, '..', 'public', 'assets', 'images', 'profile.png'),
  path.resolve(__dirname, '..', 'assets', 'images', 'profile.png'),
]

const ERODE_ITERS = 3 // px of alpha matte to shave (removes soft AA fringe)
const HALO_BAND = 7 // max halo thickness (px) to recolor
const CLEAR_BELOW = 55

const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b
const isHalo = (r, g, b) => {
  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)
  return luma(r, g, b) >= 150 && max - min <= 45 // light + low-saturation (grey/white)
}

async function main() {
  const img = await Jimp.read(SRC)
  const { width, height, data } = img.bitmap
  const N = width * height
  const A = (x, y) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : data[(y * width + x) * 4 + 3])

  // 1) Alpha erosion (a few px) — removes the soft anti-aliased fringe ring.
  for (let it = 0; it < ERODE_ITERS; it++) {
    const snap = new Uint8ClampedArray(N)
    for (let p = 0; p < N; p++) snap[p] = data[p * 4 + 3]
    const at = (x, y) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : snap[y * width + x])
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        if (snap[y * width + x] === 0) continue
        let m = 255
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) m = Math.min(m, at(x + dx, y + dy))
        data[(y * width + x) * 4 + 3] = Math.min(data[(y * width + x) * 4 + 3], m)
      }
  }

  // 2a) Distance-to-transparent map (capped), so the halo recolour stays close
  //     to the silhouette edge and never touches interior detail (necklace).
  const dist = new Int16Array(N)
  dist.fill(HALO_BAND + 2)
  for (let p = 0; p < N; p++) if (data[p * 4 + 3] < 40) dist[p] = 0
  for (let it = 0; it < HALO_BAND + 1; it++) {
    const snap = Int16Array.from(dist)
    const dat = (x, y) =>
      x < 0 || y < 0 || x >= width || y >= height ? 0 : snap[y * width + x]
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const p = y * width + x
        if (snap[p] === 0) continue
        let m = snap[p]
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) m = Math.min(m, dat(x + dx, y + dy) + 1)
        dist[p] = m
      }
  }

  // 2b) Edge color-erosion: replace light halo pixels inside the edge band with
  //     the darkest adjacent colour. A "dark front" advances across the band.
  for (let it = 0; it < HALO_BAND; it++) {
    const snap = Buffer.from(data)
    let changed = 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const p = y * width + x
        if (snap[p * 4 + 3] < 40) continue
        if (dist[p] < 1 || dist[p] > HALO_BAND) continue // edge band only
        const i = p * 4
        if (!isHalo(snap[i], snap[i + 1], snap[i + 2])) continue

        let bestL = luma(snap[i], snap[i + 1], snap[i + 2]) - 8
        let br = -1, bg = -1, bb = -1
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            const j = ((y + dy) * width + (x + dx)) * 4
            if (A(x + dx, y + dy) < 180) continue
            const l = luma(snap[j], snap[j + 1], snap[j + 2])
            if (l < bestL) {
              bestL = l
              br = snap[j]
              bg = snap[j + 1]
              bb = snap[j + 2]
            }
          }
        if (br >= 0) {
          data[i] = br
          data[i + 1] = bg
          data[i + 2] = bb
          changed++
        }
      }
    }
    if (changed === 0) break
  }

  // 3) Remove green/cyan spill on edge pixels.
  for (let p = 0; p < N; p++) {
    const i = p * 4
    const a = data[i + 3]
    if (a > 8 && a < 252) {
      const cap = Math.max(data[i], data[i + 2])
      if (data[i + 1] > cap) data[i + 1] = cap
    }
  }

  // 4) Despeckle + drop very transparent pixels.
  {
    const snap = new Uint8ClampedArray(N)
    for (let p = 0; p < N; p++) snap[p] = data[p * 4 + 3]
    const at = (x, y) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : snap[y * width + x])
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const p = y * width + x
        if (snap[p] === 0) continue
        if (snap[p] < CLEAR_BELOW) {
          data[p * 4 + 3] = 0
          continue
        }
        let solid = 0
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            if (at(x + dx, y + dy) >= 140) solid++
          }
        if (solid < 3) data[p * 4 + 3] = 0
      }
  }

  // 5) Cut any remaining light edge pixels: on a dark site these anti-aliased
  //    light pixels read as a grey rim, so drop / darken them decisively.
  {
    const snap = new Uint8ClampedArray(N)
    for (let p = 0; p < N; p++) snap[p] = data[p * 4 + 3]
    const at = (x, y) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : snap[y * width + x])
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4
        const a = snap[y * width + x]
        if (a === 0 || a >= 250) continue // only touch anti-aliased edge pixels

        // Is this a light/grey pixel? (halo colour, not warm skin)
        const r = data[i], g = data[i + 1], b = data[i + 2]
        const min = Math.min(r, g, b)
        const max = Math.max(r, g, b)
        const lightish = min >= 120 && max - min <= 55
        if (!lightish) continue

        // Near the silhouette edge?
        let nearEdge = false
        for (let dy = -1; dy <= 1 && !nearEdge; dy++)
          for (let dx = -1; dx <= 1; dx++)
            if (at(x + dx, y + dy) < 30) {
              nearEdge = true
              break
            }
        if (nearEdge) {
          data[i + 3] = 0 // remove the grey rim entirely
        } else {
          // Just inside: darken so it can't glow.
          data[i] = Math.round(r * 0.3)
          data[i + 1] = Math.round(g * 0.3)
          data[i + 2] = Math.round(b * 0.3)
        }
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
