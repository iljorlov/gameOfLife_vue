import { MutationTree, ActionTree } from 'vuex'
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

export const MutationType = {
  SET_DARK_MODE: 'setDarkMode',
  SET_GRID_COMPACT: 'setGridCompact',
}

export const mutations: MutationTree<RootState> = {
  [MutationType.SET_DARK_MODE]: (state, newMode: boolean) => {
    state.darkMode = newMode
  },
  [MutationType.SET_GRID_COMPACT]: (state, newMode: boolean) => {
    state.gridCompact = newMode
  },
}

export const actionType = {
  SET_DARK_MODE_ON: 'setDarkModeOn',
  SET_DARK_MODE_OFF: 'setDarkModeOff',
  SET_GRID_COMPACT_ON: 'setGridCompactOn',
  SET_GRID_COMPACT_OFF: 'setGridCompactOff',
}

export const actions: ActionTree<RootState, RootState> = {
  [actionType.SET_DARK_MODE_OFF]({ commit }) {
    commit(MutationType.SET_DARK_MODE, false)
  },
  [actionType.SET_DARK_MODE_ON]({ commit }) {
    commit(MutationType.SET_DARK_MODE, true)
  },
  [actionType.SET_GRID_COMPACT_OFF]({ commit }) {
    commit(MutationType.SET_GRID_COMPACT, false)
  },
  [actionType.SET_GRID_COMPACT_ON]({ commit }) {
    commit(MutationType.SET_GRID_COMPACT, true)
  },
}
