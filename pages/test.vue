<template>
  <div>
    <canvas id="wasm-gol-context" width="800" height="800" class="border" />
    <div>
      <div v-if="isDev">
        <button @click="toggleGreet">click</button>
        <button @click="tick">tick</button>
        <button @click="drawGame">draw</button>

        <!-- <pre>{{ string }}</pre> -->
      </div>
      <WipPage v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { Universe } from '../src/pkg/wasm_game_of_life'

import WipPage from '~/components/WipPage/WipPage.vue'
export default {
  name: 'TestPage',
  components: {
    WipPage,
  },
  data() {
    return {
      isDev: true,
      numCols: 400,
      numRows: 400,
      // isDev: process.env.NODE_END === 'dev',
      universe: undefined as unknown as Universe,
      grid: [] as unknown as Uint8Array,
      ctx: null as CanvasRenderingContext2D | null,
    }
  },
  mounted() {
    const canvas = document.getElementById(
      'wasm-gol-context'
    ) as HTMLCanvasElement
    if (canvas) {
      this.ctx = canvas.getContext('2d')
    }
  },
  methods: {
    toggleGreet() {
      import('../src/pkg/wasm_game_of_life').then(({ Universe }) => {
        // greet('Ilya')
        const a = Universe.new(this.numCols, this.numRows)
        this.universe = a
        this.grid = a.render()
        // console.log(a.render())
      })
    },
    tick() {
      if (this.universe) {
        this.universe.tick()
        this.grid = this.universe.render()
      }
    },

    drawGame() {
      if (this.ctx) {
        this.tick()

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        const cellSize = 800 / this.numCols

        for (let col = 0; col < this.numCols; col++) {
          for (let row = 0; row < this.numRows; row++) {
            const xOffset = row * cellSize
            const yOffset = col * cellSize
            if (this.grid[col + this.numCols * row]) {
              this.ctx.fillRect(xOffset, yOffset, cellSize, cellSize)
            }
          }
        }

        window.requestAnimationFrame(this.drawGame)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
