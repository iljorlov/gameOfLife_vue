<template>
  <div class="border cursor-pointer cursor w-fit p-1 h-fit mx-auto">
    <div class="w-full h-full shrink-0 flex items-center justify-center">
      <canvas
        :id="`canvas${canvasIdentifier}`"
        :height="height"
        :width="width"
        @mousemove="handleHover"
        @mouseleave="handleMouseLeave"
        @click="handleSelectTemplate"
      />
    </div>
    <div
      v-if="!onlyCanvas"
      class="w-full h-auto min-h-[48px] flex items-center justify-center bg-orange-100"
    >
      <div>{{ canvasIdentifier }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import generateEmptyGrid from '../../utils/generateEmptyGrid'
import countNeighborsSeamless from '../../utils/countNeighborsSeamless'
import sleep from '../../utils/sleep'

import { PatternType } from '~/patterns/patterns'

const findMaxSide = (grid: number[][]) => {
  return grid[0].length > grid.length ? grid[0].length : grid.length
}
const findCellSizePx = (canvasWidth: number, numCols: number) => {
  return canvasWidth / numCols
}

const padding = 20

export default Vue.extend({
  props: {
    canvasIdentifier: {
      type: String,
      required: true,
      default: 'default',
    },
    pattern: {
      type: Object as () => PatternType,
      required: true,
    },
    height: {
      type: Number,
      default: 200,
    },
    width: {
      type: Number,
      default: 200,
    },
    onlyCanvas: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ctx: null as CanvasRenderingContext2D | null,
      cellSize: findCellSizePx(
        this.width,
        findMaxSide(this.pattern.pattern) + padding
      ),
      numRows: findMaxSide(this.pattern.pattern),
      numCols: findMaxSide(this.pattern.pattern),
      skipSizeCheck: 2,
      isRunning: false,
      grid: JSON.parse(JSON.stringify(this.pattern.pattern)),
    }
  },
  computed: {
    ...mapState({
      selectedTemplate: 'selectedTemplate',
    }),
  },
  watch: {
    canvasIdentifier: {
      handler() {
        this.setGridPattern(this.pattern.pattern)
      },
    },
  },
  mounted() {
    const canvas = document!.getElementById(
      `canvas${this.canvasIdentifier}`
    )! as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    ctx.translate(0.5, 0.5)
    this.ctx = ctx
    this.initGrid()
  },

  methods: {
    handleSelectTemplate() {
      this.$store.commit('canvasState/setTemplate', this.pattern)
    },
    handleHover() {
      if (!this.isRunning) {
        this.isRunning = true
        this.getNextGeneration()
      }
    },
    handleMouseLeave() {
      this.isRunning = false
      this.setGridPattern(this.pattern.pattern)
    },
    initGrid() {
      this.setGridPattern(this.pattern.pattern)
      this.getNextGeneration()
      this.drawGrid()
    },
    drawGrid() {
      if (!this.ctx) {
        return
      }

      this.clearCanvas()
      this.ctx!.fillStyle = 'black'
      const size = this.cellSize
      const grid = this.grid

      // if (this.showGrid) {
      //   for (let i = 0; i <= this.numCols; i++) {
      //     this.ctx?.beginPath()
      //     this.ctx!.lineWidth = 0.5
      //     this.ctx!.strokeStyle = '#bdbdbd'
      //     this.ctx?.moveTo(this.cellSize * i, 0)
      //     this.ctx?.lineTo(this.cellSize * i, this.ctx.canvas.height)
      //     this.ctx?.stroke()
      //   }
      //   for (let i = 0; i <= this.numRows; i++) {
      //     this.ctx?.beginPath()
      //     this.ctx!.lineWidth = 0.5
      //     this.ctx!.strokeStyle = '#bdbdbd'
      //     this.ctx?.moveTo(0, this.cellSize * i)
      //     this.ctx?.lineTo(this.ctx.canvas.width, this.cellSize * i)
      //     this.ctx?.stroke()
      //   }
      // }

      const width = grid[0].length
      const height = grid.length

      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          const xOffset = size * i
          const yOffset = size * j
          if (grid[j][i] === 0) {
            continue
          }
          this.ctx?.fillRect(xOffset, yOffset, size, size)
        }
      }
    },
    async getNextGeneration() {
      if (!this.ctx) {
        return
      }
      if (!this.isRunning) {
        return
      }

      const gridCopy = JSON.parse(JSON.stringify(this.grid))
      for (let y = 0; y < this.grid.length; y++) {
        for (let x = 0; x < this.grid[0].length; x++) {
          const neighbors = countNeighborsSeamless(this.grid, x, y)

          if (neighbors > 3 || neighbors < 2) {
            gridCopy[y][x] = 0
          } else if (this.grid[y][x] === 0 && neighbors === 3) {
            gridCopy[y][x] = 1
          }
        }
      }
      this.grid = gridCopy
      await sleep(24)
      this.drawGrid()
      window.requestAnimationFrame(this.getNextGeneration)
      // this.getNextGeneration()
    },
    clearCanvas() {
      if (!this.ctx) {
        return
      }
      this.ctx?.clearRect(
        -0.5,
        -0.5,
        this.ctx.canvas.width + 0.5,
        this.ctx.canvas.height + 0.5
      )
    },
    setGridPattern(pattern: number[][]) {
      if (!this.ctx) {
        return []
      }
      let grid: number[][] = []
      if (pattern.length < this.numRows && pattern[0].length < this.numCols) {
        grid = generateEmptyGrid(this.numRows, this.numCols)
      } else {
        grid = generateEmptyGrid(
          pattern.length + padding,
          pattern[0].length + padding
        )
        this.numRows = pattern.length + padding
        this.numCols = pattern[0].length + padding
        this.skipSizeCheck = 2
      }
      const offsetX = Math.floor((grid[0].length - pattern[0].length) / 2)
      const offsetY = Math.floor((grid.length - pattern.length) / 2)

      for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[0].length; j++) {
          grid[i + offsetY][j + offsetX] = pattern[i][j]
        }
      }
      this.grid = grid
      this.drawGrid()
    },
  },
})
</script>
