<template>
  <div>
    <div>
      <div class="w-[400px] h-auto bg-pink-100 mx-auto mb-6">
        <div>
          <div>Current Gen: {{ currentGeneration }}</div>
          <div>NumCols: {{ numCols }}</div>
          <!-- <input
            v-model="numCols"
            type="range"
            :max="150"
            :min="1"
            value="numCols"
            step="1"
          /> -->
        </div>
        <div>
          <div>NumRows: {{ numRows }}</div>
          <!-- <input
            v-model="numRows"
            type="range"
            :max="150"
            :min="1"
            value="numRows"
            step="1"
          /> -->
        </div>
        <div>
          <span>cellSize: {{ cellSize }}</span
          ><button class="p-2 font-medium" @click="addCellSize(-1)">-</button
          ><button class="p-2 font-medium" @click="addCellSize(1)">+</button>
        </div>

        <button
          class="px-5 py-2 bg-blue-500 text-white rounded-sm"
          @click="startNewEmptyGrid"
        >
          new
        </button>
        <button
          class="px-5 py-2 bg-blue-500 text-white rounded-sm"
          @click="generateRandomGrid"
        >
          random
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
              setGridPattern(selectedTemplate)
              drawGrid()
            }
          "
        >
          ship
        </button>
      </div>
    </div>
    <!-- :height="cellSize * numRows"
        :width="cellSize * numCols" -->
    <div class="border cursor-pointer cursor w-fit p-1 h-fit mx-auto">
      <canvas
        :id="`canvas-main`"
        :height="600"
        :width="800"
        @mousemove="handleHover"
        @mouseleave="handleMouseLeave"
        @mousedown="handleMouseDown"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { patternList } from '../../patterns/patterns'
import generateEmptyGrid from '../../utils/generateEmptyGrid'
import countNeighborsSeamless from '../../utils/countNeighborsSeamless'
import sleep from '../../utils/sleep'

export default Vue.extend({
  name: 'MainCanvas',
  data() {
    return {
      ctx: null as CanvasRenderingContext2D | null,
      cellSize: 10,
      skipSizeCheck: 2, //  2 since we need to ckeck both numRows and numCols: after every check we decrement the value.
      //  0 means there is no need to skip
      currentGeneration: 0,
      grid: [] as number[][],
      defaultGrid: patternList.average,
      showGrid: true,
      hoveredCell: {
        x: -1,
        y: -1,
        changed: false,
      },
    }
  },
  computed: {
    ...mapState({
      isRunning: 'isRunning',
      selectedTemplate: 'selectedTemplate',
      templateName: 'templateName',
    }),
    numRows(): number {
      return Math.floor(600 / this.cellSize)
    },
    numCols(): number {
      return Math.floor(800 / this.cellSize)
    },
  },
  watch: {
    numRows: {
      handler(stringNext, stringPrev) {
        if (this.skipSizeCheck) {
          this.skipSizeCheck--
          // this.drawGrid()
          return
        }
        const next = parseInt(stringNext)
        const prev = parseInt(stringPrev)

        if (!this.grid.length || !this.ctx) {
          return
        }
        if (next > prev) {
          this.setGridPattern(JSON.parse(JSON.stringify(this.grid)))
        } else {
          this.startNewEmptyGrid()
        }
        this.drawGrid()
      },
      immediate: true,
    },
    numCols: {
      handler(stringNext, stringPrev) {
        if (this.skipSizeCheck) {
          this.skipSizeCheck--
          // this.drawGrid()
          return
        }
        const next = parseInt(stringNext)
        const prev = parseInt(stringPrev)
        if (!this.grid.length || !this.ctx) {
          return
        }

        if (next > prev) {
          this.setGridPattern(JSON.parse(JSON.stringify(this.grid)))
        } else {
          this.startNewEmptyGrid()
        }
        this.drawGrid()
      },
      immediate: true,
    },
    hoveredCell: {
      handler(): void {
        this.drawGrid()
      },
      deep: true,
    },
    templateName: {
      handler() {
        this.setGridPattern(this.selectedTemplate)
      },
    },
  },

  mounted() {
    const canvas = document!.getElementById(`canvas-main`)! as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    ctx.translate(0.5, 0.5)
    this.ctx = ctx
    this.initGrid(this.selectedTemplate)
  },
  methods: {
    toggleMode() {
      if (this.isRunning) {
        this.$store.commit('pauseCanvas')
      } else {
        this.$store.commit('startCanvas')
      }
      if (this.isRunning) {
        this.getNextGeneration()
      }
    },
    initGrid(newGrid = patternList.barge2spaceship) {
      this.setGridPattern(newGrid)
      this.getNextGeneration()
      this.drawGrid()
    },
    handleMouseLeave() {
      this.hoveredCell.x = -1
      this.hoveredCell.y = -1
    },
    handleMouseDown() {
      // handles mouse click
      if (this.hoveredCell.x >= 0 && this.hoveredCell.y >= 0) {
        this.grid[this.hoveredCell.y][this.hoveredCell.x] =
          this.grid[this.hoveredCell.y][this.hoveredCell.x] === 0 ? 1 : 0
        this.hoveredCell.changed = true
        this.drawGrid()
      }
    },
    handleHover(e: MouseEvent) {
      // handles mouse hover and down
      const x = e.offsetX + 0
      const y = e.offsetY + 0
      const xPos = Math.floor(x / this.cellSize)
      const yPos = Math.floor(y / this.cellSize)

      if (
        this.hoveredCell.x === xPos &&
        this.hoveredCell.y === yPos &&
        this.hoveredCell.changed
      ) {
        return
      }
      this.hoveredCell.changed = false
      this.hoveredCell.x = xPos
      this.hoveredCell.y = yPos

      if (e.buttons === 1) {
        if (
          this.hoveredCell.x >= 0 &&
          this.hoveredCell.y >= 0 &&
          !this.hoveredCell.changed
        ) {
          this.grid[this.hoveredCell.y][this.hoveredCell.x] =
            this.grid[this.hoveredCell.y][this.hoveredCell.x] === 0 ? 1 : 0
          this.hoveredCell.changed = true
          this.drawGrid()
        }
      }
    },
    drawGrid() {
      if (!this.ctx) {
        return
      }

      this.clearCanvas()
      this.ctx!.fillStyle = 'black'
      const size = this.cellSize
      const grid = this.grid

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

      if (
        this.hoveredCell.x >= 0 &&
        this.hoveredCell.x < this.grid[0].length &&
        this.hoveredCell.y >= 0 &&
        this.hoveredCell.y < this.grid.length
      ) {
        this.ctx.fillStyle =
          this.grid[this.hoveredCell.y][this.hoveredCell.x] === 0
            ? 'pink'
            : 'gray'
        this.ctx?.fillRect(
          size * this.hoveredCell.x,
          size * this.hoveredCell.y,
          size,
          size
        )
        this.ctx!.fillStyle = 'black'
      }
      // console.log('draw success')
    },
    async getNextGeneration() {
      if (!this.ctx) {
        return
      }
      if (!this.isRunning) {
        return
      }
      // console.log('nextgen')

      this.currentGeneration++
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
      await sleep(1)
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
      this.drawGrid()
    },
    startNewEmptyGrid() {
      const grid: number[][] = generateEmptyGrid(this.numRows, this.numCols)
      this.currentGeneration = 0
      this.grid = grid
      this.$store.commit('pauseCanvas')
      this.drawGrid()
    },
    setGridPattern(pattern: number[][]) {
      this.currentGeneration = 0
      // this.isRunning = false
      if (!this.ctx) {
        return []
      }

      let grid: number[][] = []

      if (pattern.length < this.numRows && pattern[0].length < this.numCols) {
        grid = generateEmptyGrid(this.numRows, this.numCols)
      } else {
        const extraSpace = 0
        grid = generateEmptyGrid(
          pattern.length + extraSpace,
          pattern[0].length + extraSpace
        )
        this.numRows = pattern.length + extraSpace
        this.numCols = pattern[0].length + extraSpace
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

<style lang="scss" scoped></style>
