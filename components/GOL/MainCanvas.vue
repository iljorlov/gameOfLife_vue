// todo: canvas is not being redrawn after resize
<template>
  <div class="p-2 2xl:px-0">
    <div
      id="canvas-wrapper"
      :class="`border rounded-sm ${
        borderEnabled
          ? 'border-2 border-slate-500'
          : 'border-2 border-transparent'
      } cursor-pointer cursor w-full h-full`"
    >
      <canvas
        :id="`canvas-main`"
        :style="{ transform: `scale(${ctx ? '1' : '0'})` }"
        :class="`${
          ctx ? 'block' : 'hidden'
        } transition-all delay-700 duration-1000`"
        :height="canvasHeight"
        :width="canvasWidth"
        @mousemove="handleHover"
        @mouseleave="handleMouseLeave"
        @mousedown="handleMouseDown"
      />
      <div
        :class="`${
          ctx ? 'hidden' : 'h-[80vh]  flex items-center justify-center'
        }`"
      >
        <div class="h-16 w-16 relative animate-spin">
          <div
            class="bg-slate-800/40 h-6 w-6 absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
          ></div>
          <div
            class="bg-slate-800/40 h-6 w-6 absolute bottom-0 -left-1 rounded-full"
          ></div>
          <div
            class="bg-slate-800/40 h-6 w-6 absolute bottom-0 -right-1 rounded-full"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import TemplateCanvas from './TemplateCanvas.vue'
import generateEmptyGrid from '../../utils/generateEmptyGrid'
import countNeighborsSeamless from '../../utils/countNeighborsSeamless'
import countNeighborsBorder from '../../utils/countNeighborsBorder'
import sleep from '../../utils/sleep'

export default Vue.extend({
  name: 'MainCanvas',
  // components: { TemplateCanvas },
  data() {
    return {
      canvasHeight: 0,
      canvasWidth: 0,
      ctx: null as CanvasRenderingContext2D | null,
      skipSizeCheck: 2, //  2 since we need to ckeck both numRows and numCols: after every check we decrement the value.   //  0 means there is no need to skip
      grid: [] as number[][],
      hoveredCell: {
        x: -1,
        y: -1,
        changed: false,
      },
    }
  },

  computed: {
    cellSize(): number {
      return this.$store.state.canvasState.cellSize
    },
    selectedPattern(): number[][] {
      return this.$store.state.canvasState.selectedPattern.pattern
    },
    showGrid(): boolean {
      return this.$store.state.canvasState.showGrid
    },
    borderEnabled(): boolean {
      return this.$store.state.canvasState.border
    },
    speed(): number {
      return this.$store.state.canvasState.speed
    },
    selectedPatternName(): string {
      return this.$store.state.canvasState.selectedPattern.details.name
    },
    isRunning(): boolean {
      return this.$store.state.canvasState.isRunning
    },
    currentGeneration(): number {
      return this.$store.state.canvasState.currentGeneration
    },
    numRows(): number {
      return Math.floor(this.canvasHeight / this.cellSize)
    },
    numCols(): number {
      return Math.floor(this.canvasWidth / this.cellSize)
    },
    clearToggle(): boolean {
      return this.$store.state.canvasState.clearToggle
    },
    resetToggle(): boolean {
      return this.$store.state.canvasState.resetToggle
    },
    randomToggle(): boolean {
      return this.$store.state.canvasState.randomToggle
    },
  },

  watch: {
    showGrid: {
      handler() {
        this.drawGrid()
      },
    },
    numRows: {
      handler(stringNext: string, stringPrev: string) {
        if (this.skipSizeCheck) {
          this.skipSizeCheck--
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
      // immediate: true,
    },
    numCols: {
      handler(stringNext: string, stringPrev: string) {
        if (this.skipSizeCheck) {
          this.skipSizeCheck--
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
      // immediate: true,
    },
    canvasWidth: {
      handler() {
        const ratio = 1280 / 720
        this.canvasHeight = this.canvasWidth / ratio
      },
    },
    canvasHeigth: {
      handler() {
        // this.handleHover(null)
      },
    },
    hoveredCell: {
      handler(): void {
        this.drawGrid()
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
        // this.grid = this.selectedPattern
        this.resetGeneration()
        this.setGridPattern(this.selectedPattern)
      },
    },
    clearToggle: {
      handler() {
        this.setGridPattern([[0]])
        this.resetGeneration()
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
    window.addEventListener('resize', () => {
      const canvasWrapper = document.getElementById('canvas-wrapper')
      if (canvasWrapper) {
        this.canvasWidth = canvasWrapper.getBoundingClientRect().width
      }
    })
    const canvasWrapper = document.getElementById('canvas-wrapper')
    if (canvasWrapper) {
      this.canvasWidth = canvasWrapper.getBoundingClientRect().width
    }

    const canvas = document!.getElementById(`canvas-main`)! as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    ctx.translate(0.5, 0.5)
    this.ctx = ctx
    this.initGrid(this.selectedPattern)
  },
  destroyed() {
    window.removeEventListener('resize', () => {
      const canvasWrapper = document.getElementById('canvas-wrapper')
      if (canvasWrapper) {
        this.canvasWidth = canvasWrapper.getBoundingClientRect().width
      }
    })
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
      this.drawGrid()
    },
    handleMouseLeave() {
      this.hoveredCell.x = -1
      this.hoveredCell.y = -1
    },
    handleMouseDown() {
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
        this.drawGrid()
      }
    },
    handleHover(e: MouseEvent) {
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
            this.drawGrid()
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
      // console.log('ok')
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
      this.drawGrid()
      this.incrementGeneration()

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

      this.resetGeneration()
      this.grid = grid
      this.$store.commit('canvasState/pauseCanvas')
      this.drawGrid()
    },
    setGridPattern(pattern: number[][]) {
      this.resetGeneration()
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
    incrementGeneration() {
      this.$store.commit('canvasState/incrementCurrentGeneration')
    },
    resetGeneration() {
      this.$store.commit('canvasState/resetCurrentGeneration')
    },
  },
})
</script>

<style scoped>
.animateCanvasIn {
  animation-duration: 0.4s;
  animation-name: slidein;
}
@keyframes fadeInZoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
