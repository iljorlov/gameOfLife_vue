import { ActionTree, MutationTree } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { patternList, PatternType } from '../patterns/patterns'
// import { canvasState } from './canvasState'

export type NotificationType = {
  lifeDurationSeconds: number
  title: string
  text: string
  type: 'ERROR' | 'SUCCESS' | 'INFO'
  uuid: string
}
export type CanvasStateType = {
  isRunning: boolean
  currentGeneration: number
  speed: number
  cellSize: number
  showGrid: boolean
  border: boolean
}
type StateType = {
  canvasState: CanvasStateType
  selectedPattern: PatternType
  notifications: NotificationType[]
}

export const state = (): StateType => ({
  canvasState: {
    isRunning: false,
    currentGeneration: 0,
    cellSize: 10,
    speed: 100,
    showGrid: true,
    border: false,
  },
  selectedPattern: patternList[0] as PatternType,
  notifications: [] as NotificationType[],
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  startCanvas: (state) => {
    state.canvasState.isRunning = true
  },
  pauseCanvas: (state) => {
    state.canvasState.isRunning = false
  },
  toggleGrid: (state) => {
    state.canvasState.showGrid = !state.canvasState.showGrid
  },
  toggleBorder: (state) => {
    state.canvasState.border = !state.canvasState.border
  },
  setCanvasSpeed: (state, newSpeed: number) => {
    state.canvasState.speed = newSpeed
  },
  setCellSize: (state, newSize: number) => {
    state.canvasState.cellSize = newSize
  },
  incrementCurrentGeneration: (state) => {
    state.canvasState.currentGeneration++
  },
  resetCurrentGeneration: (state) => {
    state.canvasState.currentGeneration = 0
  },
  setTemplate: (state, newTemplate: PatternType) => {
    state.selectedPattern = newTemplate
  },
  addNotification: (state, notification: NotificationType) => {
    notification.uuid = uuidv4()
    state.notifications.push(notification)
  },
  removeNotification: (state: RootState, uuid: string) => {
    state.notifications = state.notifications.filter(
      (item) => item.uuid !== uuid
    )
  },
}

export const actions: ActionTree<RootState, RootState> = {
  // async getFoodData({ state, commit }) {
  //   if (state.fooddata.length) return
  //   try {
  //     await fetch(
  //       `https://dva9vm8f1h.execute-api.us-east-2.amazonaws.com/production/restaurants`,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'x-api-key': `${process.env.AWS_API_KEY}`,
  //         },
  //       }
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         commit('updateFoodData', data)
  //       })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // },
}

export const getters = {
  // getterValue: (state) => {
  //   return state.value
  // },
}
