import Vue from 'vue'
import Vuex from 'vuex'
import { ActionTree, MutationTree } from 'vuex'

Vue.use(Vuex)

export const state = () => ({
  // notifications: [] as NotificationType[],
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  // addNotification: (state, notification: NotificationType) => {
  //   notification.uuid = uuidv4()
  //   state.notifications.push(notification)
  // },
  // removeNotification: (state: RootState, uuid: string) => {
  //   state.notifications = state.notifications.filter(
  //     (item) => item.uuid !== uuid
  //   )
  // },
}

// export const actions: ActionTree<RootState, RootState> = {
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
// }

// export const getters = {
// getterValue: (state) => {
//   return state.value
// },
// }
