import { noise, noiseSeed } from './perlin'

export const random = {
  noise: {
    perlin: noise,
    setSeed: noiseSeed,
  },
  between(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
  },
  montecarlo() {
    while (true) {
      const R1 = random.between(0, 100) / 100
      const probability = R1
      const R2 = random.between(0, 100) / 100

      if (R2 < probability) {
        return R1
      }
    }
  },
  randn_bm(min: number, max: number, skew: number) {
    let u = 0
    let v = 0
    while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) num = this.randn_bm(min, max, skew)
    // resample between 0 and 1 if out of range
    else {
      num = Math.pow(num, skew) // Skew
      num *= max - min // Stretch to fill range
      num += min // offset to min
    }
    return num
  },
  color() {
    const chars = '1234567890abcdef'
    return `#${Array.from(Array(6))
      .map(() => {
        return '1234567890abcdef'[random.between(0, chars.length)]
      })
      .join('')}`
  },
}
