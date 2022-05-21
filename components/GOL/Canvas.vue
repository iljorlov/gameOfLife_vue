<template>
  <canvas
    :id="`canvas-${canvasIdentifier}`"
    :class="`transition-all delay-700 duration-1000`"
    :height="canvasHeight"
    :width="canvasWidth"
    @mousemove="handleHover"
    @mouseleave="handleMouseLeave"
    @mousedown="handleMouseDown"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import generateEmptyGrid from '../../utils/generateEmptyGrid'
import generateRandomGrid from '../../utils/generateRandomGrid'

import countNeighborsSeamless from '../../utils/countNeighborsSeamless'
import countNeighborsBorder from '../../utils/countNeighborsBorder'
import mergeTwoGrids from '~/utils/mergeTwoGrids'
import sleep from '../../utils/sleep'
export default Vue.extend({
  props: {
    canvasIdentifier: {
      type: String,
      required: true,
    },
    isMainCanvas: {
      type: Boolean,
      default: false,
    },
    canvasHeight: {
      type: Number,
      required: true,
    },
    canvasWidth: {
      type: Number,
      required: true,
    },
    template: {
      type: Array as () => number[][],
      required: true,
    },
    isRunning: {
      type: Boolean,
      default: false,
    },
    clearToggle: {
      type: Boolean,
      default: false,
    },
    resetToggle: {
      type: Boolean,
      default: false,
    },
    randomToggle: {
      type: Boolean,
      default: false,
    },
    borderEnabled: {
      type: Boolean,
      default: true,
    },
    gridEnabled: {
      type: Boolean,
      default: false,
    },
    cellSize: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      ctx: null as CanvasRenderingContext2D | null,
      hoveredCell: {
        x: -1,
        y: -1,
        changed: false,
      },
      grid: [] as number[][],
    }
  },
  watch: {
    gridEnabled: {
      handler() {
        this.drawGame()
      },
    },
    cellSize: {
      handler() {
        this.setGridPattern(JSON.parse(JSON.stringify(this.grid)))
      },
    },
    hoveredCell: {
      handler(): void {
        this.drawGame()
      },
      deep: true,
    },
    selectedPatternName: {
      handler() {
        this.setGridPattern(this.selectedPattern)
      },
    },
    isRunning: {
      handler() {
        if (this.isRunning) {
          this.getNextGeneration()
        }
      },
    },
    resetToggle: {
      handler() {
        if (this.isMainCanvas) {
          this.resetGeneration()
        }
        this.setGridPattern(this.selectedPattern)
      },
    },
    clearToggle: {
      handler() {
        this.setGridPattern([[0]])
        if (this.isMainCanvas) {
          this.resetGeneration()
        }
        this.$store.commit('canvasState/pauseCanvas')
      },
    },
    randomToggle: {
      handler() {
        this.generateRandomGrid()
        this.resetGeneration()
      },
    },
  },
  mounted() {
    const canvas = document!.getElementById(
      `canvas-${this.canvasIdentifier}`
    )! as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    // ctx.translate(0.5 * this.cellSize, 0.5 * this.cellSize)
    this.ctx = ctx
    this.initGrid(this.template)
  },

  computed: {
    selectedPattern(): number[][] {
      return this.$store.state.canvasState.selectedPattern.pattern
    },
    speed(): number {
      return this.$store.state.canvasState.speed
    },
    selectedPatternName(): string {
      return this.$store.state.canvasState.selectedPattern.details.name
    },
    numRows(): number {
      return Math.floor(this.canvasHeight / this.cellSize)
    },
    numCols(): number {
      return Math.floor(this.canvasWidth / this.cellSize)
    },
  },
  methods: {
    toggleMode() {
      if (this.isRunning) {
        this.$store.commit('canvasState/pauseCanvas')
      } else {
        this.$store.commit('canvasState/startCanvas')
      }
      if (this.isRunning) {
        this.getNextGeneration()
      }
    },
    initGrid(newGrid: number[][]) {
      if (!newGrid) {
        newGrid = this.selectedPattern
      }
      this.setGridPattern(newGrid)
      this.getNextGeneration()
      this.drawGame()
    },
    handleMouseLeave() {
      if (this.isMainCanvas) {
        this.hoveredCell.x = -1
        this.hoveredCell.y = -1
      } else {
        this.setGridPattern(this.template)
      }
    },
    handleMouseDown() {
      if (this.isMainCanvas) {
        // handles mouse click
        const gridRows = this.grid.length
        const gridCols = this.grid[0].length
        if (
          this.hoveredCell.x >= 0 &&
          this.hoveredCell.y >= 0 &&
          this.hoveredCell.y < gridRows &&
          this.hoveredCell.x < gridCols
        ) {
          this.grid[this.hoveredCell.y][this.hoveredCell.x] =
            this.grid[this.hoveredCell.y][this.hoveredCell.x] === 0 ? 1 : 0
          this.hoveredCell.changed = true
          this.drawGame()
        }
      }
    },
    handleHover(e: MouseEvent) {
      if (this.isMainCanvas) {
        // handles mouse hover and down
        try {
          const rect = this.ctx!.canvas.getBoundingClientRect()
          const x = e.clientX - rect.x
          const y = e.clientY - rect.y
          const xPos = Math.floor(x / this.cellSize)
          const yPos = Math.floor(y / this.cellSize)
          const gridRows = this.grid.length
          const gridCols = this.grid[0].length

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
              yPos < gridRows &&
              xPos < gridCols &&
              !this.hoveredCell.changed
            ) {
              this.grid[this.hoveredCell.y][this.hoveredCell.x] =
                this.grid[this.hoveredCell.y][this.hoveredCell.x] === 0 ? 1 : 0
              this.hoveredCell.changed = true
              this.drawGame()
            }
          }
        } catch (error) {
          const notification = {
            lifeDurationSeconds: 6,
            text: 'Error',
            title: 'Hover fail',
            type: 'ERROR',
            uuid: '',
          }
          this.$store.commit('notifications/addNotification', notification)
        }
      }
    },
    drawGrid() {
      for (let i = 0; i <= this.numCols; i++) {
        this.ctx?.beginPath()
        this.ctx!.lineWidth = 0.5
        this.ctx!.strokeStyle = '#bdbdbd'
        this.ctx?.moveTo(this.cellSize * i, 0)
        this.ctx?.lineTo(this.cellSize * i, this.cellSize * this.numRows)
        this.ctx?.stroke()
      }
      for (let i = 0; i <= this.numRows; i++) {
        this.ctx?.beginPath()
        this.ctx!.lineWidth = 0.5
        this.ctx!.strokeStyle = '#bdbdbd'
        this.ctx?.moveTo(0, this.cellSize * i)
        this.ctx?.lineTo(this.cellSize * this.numCols, this.cellSize * i)
        this.ctx?.stroke()
      }
    },
    drawGame() {
      if (!this.ctx) {
        return
      }
      this.clearCanvas()
      this.ctx!.fillStyle = 'black'
      const size = this.cellSize
      const grid = this.grid

      if (this.gridEnabled) {
        this.drawGrid()
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

      // drawing hovered cell
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
          let neighbors
          if (this.borderEnabled) {
            neighbors = countNeighborsBorder(this.grid, x, y)
          } else {
            neighbors = countNeighborsSeamless(this.grid, x, y)
          }

          if (neighbors > 3 || neighbors < 2) {
            gridCopy[y][x] = 0
          } else if (this.grid[y][x] === 0 && neighbors === 3) {
            gridCopy[y][x] = 1
          }
        }
      }
      this.grid = gridCopy
      if (this.speed !== 100) {
        await sleep(100 - this.speed)
      }
      this.drawGame()
      if (this.isMainCanvas) {
        this.incrementGeneration()
      }

      window.requestAnimationFrame(this.getNextGeneration)
    },
    clearCanvas() {
      // if (!this.ctx) {
      //   return
      // }
      // this.ctx?.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      this.ctx?.clearRect(
        -0.5 * this.cellSize,
        -0.5 * this.cellSize,
        this.ctx.canvas.width + 0.5 * this.cellSize,
        this.ctx.canvas.height + 0.5 * this.cellSize
      )
    },
    generateRandomGrid() {
      this.grid = generateRandomGrid(this.numCols, this.numRows)
      this.drawGame()
    },
    setGridPattern(pattern: number[][]) {
      if (this.isMainCanvas) {
        this.resetGeneration()
      }
      this.grid = mergeTwoGrids(pattern, this.numCols, this.numRows)
      this.drawGame()
    },
    incrementGeneration() {
      this.$store.commit('canvasState/incrementCurrentGeneration')
    },
    resetGeneration() {
      this.$store.commit('canvasState/resetCurrentGeneration')
    },
  },
})
</script>

<style lang="scss" scoped></style>
