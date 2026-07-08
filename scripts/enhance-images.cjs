// Upscales the low-resolution ZPay promo screenshots with a good bicubic
// resample + a gentle sharpen, so they render much less soft in the cards/modal
// than the browser's naive upscaling of the tiny originals.
//
// NOTE: this cannot invent detail that isn't in the source — for a truly crisp
// result, replace the originals with higher-resolution exports.
//
// Usage: node scripts/enhance-images.cjs

const Jimp = require('jimp')
const path = require('path')

const TARGETS = ['ZPB2.png', 'ZPB3.png']
const SCALE = 3
const DIRS = [
  path.resolve(__dirname, '..', 'public', 'assets', 'images'),
  path.resolve(__dirname, '..', 'assets', 'images'),
]

// Gentle sharpen kernel (sums to 1 so brightness is preserved).
const SHARPEN = [
  [0, -0.2, 0],
  [-0.2, 1.8, -0.2],
  [0, -0.2, 0],
]

async function main() {
  for (const name of TARGETS) {
    const src = path.join(DIRS[0], name)
    const img = await Jimp.read(src)
    const w = img.bitmap.width
    const h = img.bitmap.height

    img
      .resize(w * SCALE, h * SCALE, Jimp.RESIZE_BICUBIC)
      .convolute(SHARPEN)

    for (const dir of DIRS) {
      await img.clone().writeAsync(path.join(dir, name))
    }
    console.log(`✓ ${name}: ${w}x${h} → ${w * SCALE}x${h * SCALE} (bicubic + sharpen)`)
  }
  console.log('✓ done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
