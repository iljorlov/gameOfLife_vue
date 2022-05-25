import { MutationTree } from 'vuex'
import { patternList, PatternType } from '../patterns/patterns'

export const state = () => ({
  isRunning: true,
  mobileDrawModeOn: false,
  currentGeneration: 0,
  cellSize: 6,
  speed: 100,
  showGrid: false,
  border: false,
  selectedPattern: patternList[0] as PatternType,
  clearToggle: false,
  resetToggle: false,
  randomToggle: false,
})

export type CanvasStateType = ReturnType<typeof state>

export const mutations: MutationTree<CanvasStateType> = {
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
  toggleGridOn: (state: CanvasStateType) => {
    state.showGrid = true
  },
  toggleGridOff: (state: CanvasStateType) => {
    state.showGrid = false
  },
  toggleMobileDrawModeOn: (state: CanvasStateType) => {
    state.mobileDrawModeOn = true
  },
  toggleMobileDrawModeOff: (state: CanvasStateType) => {
    state.mobileDrawModeOn = false
  },
  toggleBorderOn: (state: CanvasStateType) => {
    state.border = true
  },
  toggleBorderOff: (state: CanvasStateType) => {
    state.border = false
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
