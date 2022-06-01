<template>
  <div>
    <canvas id="wasm-gol-context" width="1280" height="720" class="border" />
    <div>
      <div v-if="isDev">
        <button @click="toggleGreet">click</button>
        <button @click="setPattern">setPattern</button>
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
      cellSize: 1,
      // isDev: process.env.NODE_END === 'dev',
      universe: undefined as unknown as Universe,
      grid: [] as unknown as Uint8Array,
      ctx: null as CanvasRenderingContext2D | null,
    }
  },
  computed: {
    numCols(): number {
      return 720 / this.cellSize
    },
    numRows(): number {
      return 1280 / this.cellSize
    },
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
        const a = Universe.new(this.cellSize, 'wasm-gol-context')
        this.universe = a
        // this.grid = a.render()
        // console.log(a.render())
      })
    },
    tick() {
      if (this.universe) {
        this.universe.tick()
      }
    },
    setPattern() {
      if (this.universe) {
        const a = new Uint8Array()
        this.universe.set(a, 0, 0)
      }
    },
    drawGame() {
      if (this.universe) {
        this.universe.draw_grid()
        this.universe.tick()
        window.requestAnimationFrame(this.drawGame)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
