// adapted to use with typescript from the p5.js library
// https://github.com/processing/p5.js/blob/main/src/math/noise.js

const PERLIN_YWRAPB = 4
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB
const PERLIN_ZWRAPB = 8
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB
const PERLIN_SIZE = 4095

let perlinOctaves = 4 // default to medium smooth
let perlinAmpFalloff = 0.5 // 50% reduction/octave

const scaledCosine = (i: number) => 0.5 * (1.0 - Math.cos(i * Math.PI))

let perlin: number[] // will be initialized lazily by noise() or noiseSeed()

export const noise = (x: number, y = 0, z = 0) => {
  if (perlin == null) {
    perlin = new Array(PERLIN_SIZE + 1)
    for (let i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = Math.random()
    }
  }

  if (x < 0) {
    x = -x
  }
  if (y < 0) {
    y = -y
  }
  if (z < 0) {
    z = -z
  }

  let xi = Math.floor(x)
  let yi = Math.floor(y)
  let zi = Math.floor(z)
  let xf = x - xi
  let yf = y - yi
  let zf = z - zi
  let rxf, ryf

  let r = 0
  let ampl = 0.5

  let n1, n2, n3

  for (let o = 0; o < perlinOctaves; o++) {
    let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB)

    rxf = scaledCosine(xf)
    ryf = scaledCosine(yf)

    n1 = perlin[of & PERLIN_SIZE]
    n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1)
    n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE]
    n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2)
    n1 += ryf * (n2 - n1)

    of += PERLIN_ZWRAP
    n2 = perlin[of & PERLIN_SIZE]
    n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2)
    n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE]
    n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3)
    n2 += ryf * (n3 - n2)

    n1 += scaledCosine(zf) * (n2 - n1)

    r += n1 * ampl
    ampl *= perlinAmpFalloff
    xi <<= 1
    xf *= 2
    yi <<= 1
    yf *= 2
    zi <<= 1
    zf *= 2

    if (xf >= 1.0) {
      xi++
      xf--
    }
    if (yf >= 1.0) {
      yi++
      yf--
    }
    if (zf >= 1.0) {
      zi++
      zf--
    }
  }
  return r
}

const noiseDetail = (lod: number, falloff: number) => {
  if (lod > 0) {
    perlinOctaves = lod
  }
  if (falloff > 0) {
    perlinAmpFalloff = falloff
  }
}

export const noiseSeed = (seed: number) => {
  const lcg = (() => {
    // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
    // m is basically chosen to be large (as it is the max period)
    // and for its relationships to a and c
    const m = 4294967296
    // a - 1 should be divisible by m's prime factors
    const a = 1664525
    // c and m should be co-prime
    const c = 1013904223
    let seed: number, z: number
    return {
      setSeed(val: number) {
        // pick a random seed if val is undefined or null
        // the >>> 0 casts the seed to an unsigned 32-bit integer
        z = seed = (val == null ? Math.random() * m : val) >>> 0
      },
      getSeed() {
        return seed
      },
      rand() {
        // define the recurrence relationship
        z = (a * z + c) % m
        // return a float in [0, 1)
        // if z = m then z / m = 0 therefore (z % m) / m < 1 always
        return z / m
      },
    }
  })()

  lcg.setSeed(seed)
  perlin = new Array(PERLIN_SIZE + 1)
  for (let i = 0; i < PERLIN_SIZE + 1; i++) {
    perlin[i] = lcg.rand()
  }
}
