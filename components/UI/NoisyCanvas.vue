<template>
  <div
    :id="`noisy-canvas-${identifier}-wrapper`"
    class="h-full w-full bg-blue-100/40 overflow-hidden"
  >
    <canvas
      :id="`noisy-canvas-${identifier}`"
      class="border filter blur-sm"
      :height="height"
      :width="width"
    ></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { random } from '~/utils/perlin/random'
// import CanvasComponent from '~/components/GOL/CanvasComponent.vue'
import generateRandomGrid from '~/utils/generateRandomGrid'
import sleep from '~/utils/sleep'
const noise = random.noise
noise.setSeed(Math.random() * 1000)
const normalizeAlpha = (a: number) => {
  if (a < 0.25) {
    return 0.0
  }
  if (a < 0.5) {
    return 0.15
  }
  if (a < 0.75) {
    return 0.5
  }
  return 0.75
}
export default Vue.extend({
  // components: { CanvasComponent },
  data() {
    return {
      identifier: 'noisy',
      ctx: null as CanvasRenderingContext2D | null,
      height: 0,
      width: 0,
      currentTick: 0,
      isRunning: false,
    }
  },
  computed: {
    cellSize(): number {
      return this.width / 6
    },
  },
  watch: {
    width: {
      handler() {
        this.height = this.width / (1 / 1)
      },
    },
  },
  mounted() {
    const wrapper = document.getElementById(
      `noisy-canvas-${this.identifier}-wrapper`
    )

    this.width = wrapper!.getBoundingClientRect().width

    const canvas = document.getElementById(
      `noisy-canvas-${this.identifier}`
    )! as HTMLCanvasElement
    const ctx = canvas?.getContext('2d')
    this.ctx = ctx

    window.addEventListener('resize', () => {
      const wrapper = document.getElementById(
        `noisy-canvas-${this.identifier}-wrapper`
      )
      this.width = wrapper!.getBoundingClientRect().width
    })

    if (ctx) {
      this.drawNext()
    }
  },
  destroyed() {
    window.removeEventListener('resize', () => {
      const wrapper = document.getElementById(
        `noisy-canvas-${this.identifier}-wrapper`
      )
      this.width = wrapper!.getBoundingClientRect().width
    })
  },

  methods: {
    drawNext() {
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

        const numCols = Math.floor(this.width / this.cellSize)
        const numRows = Math.floor(this.height / this.cellSize)
        // const grid = generateRandomGrid(numCols, numRows)
        // const date = Number(new Date())

        const speedDamping = 450
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            const xOffset = row * this.cellSize
            const yOffset = col * this.cellSize
            const a = noise.perlin(
              (xOffset / this.width) * 10 - this.currentTick / speedDamping,
              (yOffset / this.height) * 10 - this.currentTick / speedDamping
            )
            // const a = grid[row][col]
            // if (Math.random() > 0.5) {
            //   this.ctx.fillRect(xOffset, yOffset, this.cellSize, this.cellSize)
            // }
            this.ctx.fillStyle = `rgba(0,0,0,${a})`
            this.ctx.fillRect(xOffset, yOffset, this.cellSize, this.cellSize)
          }
        }
      }
      this.currentTick++
      window.requestAnimationFrame(this.drawNext)
    },
  },
})
</script>

<style lang="scss" scoped></style>
