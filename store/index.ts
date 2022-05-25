import { MutationTree } from 'vuex'
import {
  CanvasStateType,
  namespace as CanvasStateNamespace,
} from './canvasState'
import {
  NotificationsStateType,
  namespace as NotificationsNamespace,
} from './notifications'

export const state = () => ({
  darkMode: false,
  gridCompact: false,
})

export type RootState = ReturnType<typeof state> & {
  [CanvasStateNamespace]: CanvasStateType
  [NotificationsNamespace]: NotificationsStateType
}

export const mutations: MutationTree<RootState> = {
  setDarkModeOn(state) {
    state.darkMode = true
  },
  setDarkModeOff(state) {
    state.darkMode = false
  },
  setGridCompactOn(state) {
    state.gridCompact = true
  },
  setGridCompactOff(state) {
    state.gridCompact = false
  },
}
