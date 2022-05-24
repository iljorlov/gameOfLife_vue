import { MutationTree } from 'vuex'

export const state = () => ({
  darkMode: false,
  gridCompact: false,
})

export type RootState = ReturnType<typeof state>

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
