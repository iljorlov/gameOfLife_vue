import { ActionTree, MutationTree } from 'vuex'
import { patternList, PatternType } from '../patterns/patterns'

export const state = () => ({
  isRunning: false,
  currentGeneration: 0,
  cellSize: 10,
  speed: 100,
  showGrid: true,
  border: false,
  selectedPattern: patternList[0] as PatternType,
  clearToggle: false,
  resetToggle: false,
  randomToggle: false,
})

type CanvasStateType = ReturnType<typeof state>

export const mutations: MutationTree<CanvasStateType, CanvasStateType> = {
  toggleClear: (state: CanvasStateType) => {
    state.clearToggle = !state.clearToggle
  },
  toggleReset: (state: CanvasStateType) => {
    state.resetToggle = !state.resetToggle
  },
  toggleRandom: (state: CanvasStateType) => {
    state.randomToggle = !state.randomToggle
  },
  togglePlayMode: (state: CanvasStateType) => {
    state.isRunning = !state.isRunning
  },
  startCanvas: (state: CanvasStateType) => {
    state.isRunning = true
  },
  pauseCanvas: (state: CanvasStateType) => {
    state.isRunning = false
  },
  toggleGrid: (state: CanvasStateType) => {
    state.showGrid = !state.showGrid
  },
  toggleBorder: (state: CanvasStateType) => {
    state.border = !state.border
  },
  setCanvasSpeed: (state: CanvasStateType, newSpeed: number) => {
    state.speed = newSpeed
  },
  setCellSize: (state: CanvasStateType, newSize: number) => {
    state.cellSize = newSize
  },
  incrementCurrentGeneration: (state: CanvasStateType) => {
    state.currentGeneration += 1
  },
  resetCurrentGeneration: (state: CanvasStateType) => {
    state.currentGeneration = 0
  },
  setTemplate: (state: CanvasStateType, newTemplate: PatternType) => {
    state.selectedPattern = newTemplate
  },
}
