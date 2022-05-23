<template>
  <div class="w-full h-full overflow-hidden">
    <div
      v-if="isMainCanvas"
      :class="`${ctx ? 'hidden' : 'flex h-[80vh] items-center justify-center'}`"
    >
      <div class="h-16 w-16 relative animate-spin">
        <div
          class="bg-slate-800/70 animate-pulse h-6 w-6 absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
        ></div>
        <div
          class="bg-slate-800/70 delay-500 animate-pulse h-6 w-6 absolute bottom-0 -left-1 rounded-full"
        ></div>
        <div
          class="bg-slate-800/70 delay-1000 animate-pulse h-6 w-6 absolute bottom-0 -right-1 rounded-full"
        ></div>
      </div>
    </div>
    <canvas
      :id="`canvas-${canvasIdentifier}`"
      :class="`transition-all`"
      :height="canvasHeight"
      :width="canvasWidth"
      @mousemove="handleHover"
      @mouseleave="handleMouseLeave"
      @mousedown="handleMouseDown"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import generateEmptyGrid from '~/utils/generateEmptyGrid'
import generateRandomGrid from '~/utils/generateRandomGrid'
import sleep from '~/utils/sleep'
import countNeighborsSeamless from '~/utils/countNeighborsSeamless'
import countNeighborsBorder from '~/utils/countNeighborsBorder'
import mergeTwoGrids from '~/utils/mergeTwoGrids'
import { NotificationType } from '~/store/notifications'

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
  computed: {
    darkMode(): boolean {
      return this.$store.state.darkMode
    },
    mobileDrawModeOn(): boolean {
      return this.$store.state.canvasState.mobileDrawModeOn
    },
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
  watch: {
    borderEnabled: {
      handler() {
        this.drawGame()
      },
    },
    darkMode: {
      handler() {
        this.drawGame()
      },
    },
    canvasWidth: {
      handler() {
        this.setGridPattern(this.grid)
      },
    },
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
    isRunning: {
      handler() {
        if (this.isRunning) {
          this.getNextGeneration()
        }
      },
    },
    resetToggle: {
      async handler() {
        if (this.isMainCanvas) {
          this.resetGeneration()
          const paddingCells = 20
          const minCellSize = Math.ceil(
            this.canvasWidth / (this.template[0].length + paddingCells)
          )
          if (this.cellSize > minCellSize) {
            this.$store.commit('canvasState/setCellSize', minCellSize)
          }
          await this.$nextTick()
          this.setGridPattern(this.selectedPattern)
        } else {
          this.setGridPattern(this.template)
        }
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
    this.ctx = ctx
    this.initGrid(this.template)

    canvas.addEventListener('touchmove', (e) => this.handleHover(e))
  },
  destroyed() {
    const canvas = document!.getElementById(
      `canvas-${this.canvasIdentifier}`
    )! as HTMLCanvasElement
    canvas.removeEventListener('touchmove', (e) => this.handleHover(e))
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
    },
    handleMouseLeave() {
      if (this.isMainCanvas) {
        this.hoveredCell.x = -1
        this.hoveredCell.y = -1
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
    handleHover(e: MouseEvent | TouchEvent) {
      if (this.isMainCanvas && e) {
        if (
          window.TouchEvent &&
          e instanceof TouchEvent &&
          !this.mobileDrawModeOn
        ) {
          return
        }
        if (this.mobileDrawModeOn) {
          e.preventDefault()
        }
        // handles mouse hover and down
        try {
          const clientX =
            e instanceof MouseEvent
              ? e.clientX
              : window.TouchEvent && e instanceof TouchEvent
              ? e.touches[0].clientX
              : 0
          const clientY =
            e instanceof MouseEvent
              ? e.clientY
              : window.TouchEvent && e instanceof TouchEvent
              ? e.touches[0].clientY
              : 0
          const rect = this.ctx!.canvas.getBoundingClientRect()
          const x = clientX - rect.x
          const y = clientY - rect.y
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

          if (
            (e instanceof MouseEvent && e.buttons === 1) ||
            (window.TouchEvent && e instanceof TouchEvent)
          ) {
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
          const notification: NotificationType = {
            lifeDurationSeconds: 2,
            text: 'Error',
            title: 'Hover fail',
            type: 'ERROR',
            uuid: '',
          }
          this.$store.commit('notifications/addNotification', notification)
          console.log(error)
        }
      }
    },
    // handleTouchStart(e: TouchEvent) {
    //   console.log(e.touches[0].clientX)
    // },
    drawGrid() {
      if (this.ctx) {
        const lineWidth = 0.5
        let strokeStyle = this.getColor('GRID')
        const straddle = 0.5 // lines in canvas need to have an offset offset of 0.5px
        for (let i = 0; i <= this.numCols; i++) {
          this.ctx?.beginPath()
          this.ctx!.lineWidth = lineWidth
          this.ctx!.strokeStyle = strokeStyle
          this.ctx?.moveTo(this.cellSize * i + straddle, 0 + straddle)
          this.ctx?.lineTo(
            this.cellSize * i + straddle,
            this.cellSize * this.numRows + straddle
          )
          this.ctx?.stroke()
        }
        for (let i = 0; i <= this.numRows; i++) {
          this.ctx?.beginPath()
          this.ctx!.lineWidth = lineWidth
          this.ctx!.strokeStyle = strokeStyle
          this.ctx?.moveTo(0 + straddle, this.cellSize * i + straddle)
          this.ctx?.lineTo(
            this.cellSize * this.numCols + straddle,
            this.cellSize * i + straddle
          )
          this.ctx?.stroke()
        }

        if (this.borderEnabled) {
          strokeStyle = this.getColor('BORDER')
          this.ctx.strokeStyle = strokeStyle
          this.ctx.lineWidth = 1
          this.ctx.moveTo(0 + straddle, 0 + straddle)
          this.ctx.lineTo(this.numCols * this.cellSize + straddle, 0 + straddle)
          this.ctx.stroke()
          this.ctx.closePath()
          this.ctx.moveTo(0 + straddle, 0 + straddle)
          this.ctx.lineTo(0 + straddle, this.numRows * this.cellSize + straddle)
          this.ctx.stroke()
          this.ctx.moveTo(this.numCols * this.cellSize + straddle, 0 + straddle)
          this.ctx.lineTo(
            this.numCols * this.cellSize + straddle,
            this.numRows * this.cellSize + straddle
          )
          this.ctx.stroke()
        }
      }
    },
    async drawGame() {
      const straddle = 0.5
      await this.$nextTick()
      if (this.ctx) {
        this.clearCanvas()
        const size = this.cellSize
        const grid = this.grid

        const width = grid[0].length
        const height = grid.length

        // first color the background
        this.ctx.fillStyle = this.getColor('DEAD_CELL')
        this.ctx.fillRect(
          0,
          0,
          this.numCols * this.cellSize + straddle,
          this.numRows * this.cellSize + straddle
        )

        for (let i = 0; i < width; i++) {
          for (let j = 0; j < height; j++) {
            const xOffset = size * i
            const yOffset = size * j
            if (grid[j][i] === 0) {
              continue
            }
            this.ctx.fillStyle = this.getColor('ALIVE_CELL')
            this.ctx.fillRect(xOffset, yOffset, size, size)
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
        }
        if (this.gridEnabled) {
          this.drawGrid()
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
      let aliveCount = 0
      const gridCopy = JSON.parse(JSON.stringify(this.grid))
      for (let y = 0; y < this.grid.length; y++) {
        for (let x = 0; x < this.grid[0].length; x++) {
          aliveCount += this.grid[y][x]
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
      if (this.isMainCanvas) {
        this.incrementGeneration()
      }

      if (aliveCount === 0) {
        this.handleEmptyCanvas()
        return
      }
      this.drawGame()

      window.requestAnimationFrame(this.getNextGeneration)
    },
    clearCanvas() {
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
    handleEmptyCanvas() {
      const notification: NotificationType = {
        lifeDurationSeconds: 4,
        title: 'Canvas paused',
        text: 'It appears there is no more life on canvas',
        type: 'INFO',
        uuid: '',
      }
      this.$store.commit('canvasState/pauseCanvas')

      this.$store.commit('notifications/addNotification', notification)
    },

    getColor(item: 'DEAD_CELL' | 'ALIVE_CELL' | 'GRID' | 'BORDER'): string {
      switch (item) {
        case 'ALIVE_CELL':
          return this.darkMode ? '#E1E2E4' : '#1F2937'
        case 'DEAD_CELL':
          return this.darkMode ? '#1F2937' : '#fefefe'
        case 'GRID':
          return this.darkMode ? '#8a8787' : '#dedede'
        case 'BORDER':
          return this.darkMode ? '#fefefe' : '#1F2937'
      }
    },
  },
})
</script>

<style lang="scss" scoped></style>
