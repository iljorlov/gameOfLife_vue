<template>
  <div>
    <div class="w-[400px] h-auto bg-pink-100 mx-auto mb-6">
      <div>
        <span>NumCols: {{ numCols }}</span>
        <button class="p-2 font-medium" @click="addNumCols(-5)">-</button
        ><button class="p-2 font-medium" @click="addNumCols(5)">+</button>
      </div>
      <div>
        <span>NumRows: {{ numRows }}</span
        ><button class="p-2 font-medium" @click="addNumRows(-5)">-</button
        ><button class="p-2 font-medium" @click="addNumRows(5)">+</button>
      </div>
      <div>
        <span>cellSize: {{ cellSize }}</span
        ><button class="p-2 font-medium" @click="addCellSize(-1)">-</button
        ><button class="p-2 font-medium" @click="addCellSize(1)">+</button>
      </div>
      <button
        class="px-5 py-2 bg-blue-500 text-white rounded-sm"
        @click="drawGrid()"
      >
        redraw
      </button>
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
        @click="
          () => {
            getNextGeneration()
          }
        "
      >
        next
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
    <canvas
      id="canvas"
      :height="cellSize * numRows"
      :width="cellSize * numCols"
      class="mx-auto m-2"
    />
  </div>
</template>

<script lang="ts">
import { patternList } from '../../patterns/patterns'
import generateEmptyGrid from '../../utils/generateEmptyGrid'
import countNeighborsSeamless from '../../utils/countNeighborsSeamless'
import sleep from '../../utils/sleep'

export default {
  data() {
    return {
      ctx: null as CanvasRenderingContext2D | null,
      numRows: 100,
      numCols: 100,
      cellSize: 5,
      grid: [] as number[][],
    }
  },

  mounted() {
    const canvas = document!.getElementById('canvas')! as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    this.ctx = ctx
    this.initGrid()
    this.drawGrid()
  },
  methods: {
    initGrid() {
      const grid = this.grid
      if (grid.length === 0) {
        this.setGridPattern(patternList.barge2spaceship)
        this.drawGrid()
      }
    },
    drawGrid() {
      this.clearCanvas()
      this.ctx!.fillStyle = 'black'
      const size = this.cellSize
      const grid = this.grid
      if (grid.length === 0) {
        this.initGrid()
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
    },
    async getNextGeneration() {
      const gridCopy = JSON.parse(JSON.stringify(this.grid))
      // const gridCopy = Array.from(this.grid)
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
      await sleep(1)
      this.drawGrid()
      this.getNextGeneration()
    },
    clearCanvas() {
      this.ctx?.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    },
    addNumCols(n: number) {
      this.numCols += n
    },
    addNumRows(n: number) {
      this.numRows += n
    },
    addCellSize(n: number) {
      if (this.cellSize <= 5 && n < 0) {
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
}
</script>

<style lang="scss" scoped></style>
