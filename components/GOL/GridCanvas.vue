<template>
  <div>
    <div class="w-[400px] h-auto bg-pink-100 mx-auto mb-6">
      <div>
        <div>NumCols: {{ numCols }}</div>
        <input
          type="range"
          max="300"
          min="2"
          value="numCols"
          v-model="numCols"
          step="2"
        />
      </div>
      <div>
        <div>NumRows: {{ numRows }}</div>
        <input
          type="range"
          max="300"
          min="2"
          value="numRows"
          v-model="numRows"
          step="2"
        />
      </div>
      <div>
        <span>cellSize: {{ cellSize }}</span
        ><button class="p-2 font-medium" @click="addCellSize(-1)">-</button
        ><button class="p-2 font-medium" @click="addCellSize(1)">+</button>
      </div>

      <button
        class="px-5 py-2 bg-blue-500 text-white rounded-sm"
        @click="
          () => {
            generateRandomGrid()
            drawGrid()
          }
        "
      >
        new
      </button>
      <button
        class="px-5 py-2 bg-blue-500 text-white rounded-sm"
        @click="
          () => {
            clearCanvas()
          }
        "
      >
        clear
      </button>
      <button
        class="px-5 py-2 bg-blue-500 text-white rounded-sm"
        @click="toggleMode()"
      >
        {{ isRunning ? 'Stop' : 'Start' }}
      </button>
      <button
        class="px-5 py-2 bg-blue-500 text-white rounded-sm"
        @click="
          () => {
            setGridPattern()
            drawGrid()
          }
        "
      >
        ship
      </button>
    </div>
    <pre>{{ hoveredCell }}</pre>
    <div class="border cursor-pointer cursor w-fit p-1 h-fit mx-auto">
      <canvas
        @mousemove="handleHover"
        @mousedown="handleMouseDown"
        @mouseleave="handleMouseLeave"
        id="canvas"
        :height="cellSize * numRows"
        :width="cellSize * numCols"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import watchEffect from 'vue'
import { patternList } from '../../patterns/patterns'
import generateEmptyGrid from '../../utils/generateEmptyGrid'
import countNeighborsSeamless from '../../utils/countNeighborsSeamless'
import sleep from '../../utils/sleep'

export default Vue.extend({
  name: 'GridCanvas',
  data() {
    return {
      ctx: null as CanvasRenderingContext2D | null,
      numRows: 50,
      numCols: 50,
      cellSize: 10,
      grid: [] as number[][],
      isRunning: true,
      showGrid: true,
      hoveredCell: {
        x: -1,
        y: -1,
      },
    }
  },
  watch: {
    numRows: {
      handler() {
        this.generateRandomGrid()
        this.drawGrid()
      },
      immediate: true,
    },
    numCols: {
      handler() {
        this.generateRandomGrid()
        this.drawGrid()
      },
      immediate: true,
    },
    hoveredCell: {
      handler() {
        this.drawGrid()
      },
      deep: true,
    },
  },

  mounted() {
    const canvas = document!.getElementById('canvas')! as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    ctx.translate(0.5, 0.5)

    this.ctx = ctx
    this.initGrid()
    this.drawGrid()
  },
  methods: {
    toggleMode() {
      this.isRunning = !this.isRunning
      if (this.isRunning) {
        this.getNextGeneration()
      }
    },
    initGrid() {
      const grid = this.grid
      if (grid.length === 0) {
        this.setGridPattern(patternList.barge2spaceship)
        this.drawGrid()
      }
      this.getNextGeneration()
    },
    handleMouseLeave() {
      this.hoveredCell.x = -1
      this.hoveredCell.y = -1
    },
    handleMouseDown(e: MouseEvent) {
      if (this.hoveredCell.x >= 0 && this.hoveredCell.y >= 0) {
        this.grid[this.hoveredCell.y][this.hoveredCell.x] =
          this.grid[this.hoveredCell.y][this.hoveredCell.x] === 0 ? 1 : 0
        this.drawGrid()
      }
    },
    handleHover(e: MouseEvent) {
      const x = e.offsetX + 0
      const y = e.offsetY + 0
      const xPos = Math.floor(x / this.cellSize)
      const yPos = Math.floor(y / this.cellSize)
      this.hoveredCell.x = xPos
      this.hoveredCell.y = yPos
    },
    drawGrid() {
      if (!this.ctx) {
        return
      }

      this.clearCanvas()
      this.ctx!.fillStyle = 'black'
      const size = this.cellSize
      const grid = this.grid
      if (grid.length === 0) {
        this.initGrid()
      }
      if (this.showGrid) {
        for (let i = 0; i <= this.numCols; i++) {
          this.ctx?.beginPath()
          this.ctx!.lineWidth = 0.5
          this.ctx!.strokeStyle = '#bdbdbd'
          this.ctx?.moveTo(this.cellSize * i, 0)
          this.ctx?.lineTo(this.cellSize * i, this.ctx.canvas.height)
          this.ctx?.stroke()
        }
        for (let i = 0; i <= this.numRows; i++) {
          this.ctx?.beginPath()
          this.ctx!.lineWidth = 0.5
          this.ctx!.strokeStyle = '#bdbdbd'
          this.ctx?.moveTo(0, this.cellSize * i)
          this.ctx?.lineTo(this.ctx.canvas.width, this.cellSize * i)
          this.ctx?.stroke()
        }
      }

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
      if (this.hoveredCell.x >= 0 && this.hoveredCell.y >= 0) {
        this.ctx.fillStyle =
          this.grid[this.hoveredCell.y][this.hoveredCell.x] === 0
            ? 'coral'
            : 'gray'
        this.ctx?.fillRect(
          size * this.hoveredCell.x,
          size * this.hoveredCell.y,
          size,
          size
        )
        this.ctx!.fillStyle = 'black'
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
      await sleep(10)
      this.drawGrid()
      this.getNextGeneration()
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
    addNumCols(n: number) {
      this.numCols += n
    },
    addNumRows(n: number) {
      this.numRows += n
    },
    addCellSize(n: number) {
      if (this.cellSize <= 1 && n < 0) {
        return
      }
      this.cellSize += n
    },
    clearGrid() {
      this.grid = generateEmptyGrid(this.numRows, this.numCols)
    },
    generateRandomGrid() {
      const h = this.numRows
      const w = this.numCols
      const grid: number[][] = []
      for (let i = 0; i < h; i++) {
        const row = []
        for (let j = 0; j < w; j++) {
          const flag = Math.random()
          row.push(flag > 0.75 ? 1 : 0)
        }
        grid.push(row)
      }
      this.grid = grid
    },
    setGridPattern(pattern: number[][] = patternList.barge2spaceship) {
      let grid: number[][] = []
      if (pattern.length <= this.numRows || pattern[0].length <= this.numCols) {
        grid = generateEmptyGrid(this.numRows, this.numCols)
      } else {
        grid = generateEmptyGrid(pattern.length + 5, pattern[0].length + 5)
        this.numRows = pattern.length + 5
        this.numCols = pattern[0].length + 5
      }
      const offsetX = Math.floor((grid[0].length - pattern[0].length) / 2)
      const offsetY = Math.floor((grid.length - pattern.length) / 2)

      for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[0].length; j++) {
          grid[i + offsetY][j + offsetX] = pattern[i][j]
        }
      }
      this.grid = grid
    },
  },
})
</script>

<style lang="scss" scoped></style>
