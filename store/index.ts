import { v4 as uuidv4 } from 'uuid'
import { patternList } from '../patterns/patterns'

export type NotificationType = {
  lifeDurationSeconds: number
  title: string
  text: string
  type: 'ERROR' | 'SUCCESS' | 'INFO'
  uuid: string
}

export const state = () => {
  return {
    isRunning: false,
    templateName: 'main',
    selectedTemplate: patternList.alternatepentadecathlononsnacker,
    notifications: [] as NotificationType[],
  }
}

export type StateType = ReturnType<typeof state>

export const mutations = {
  startCanvas: (state: StateType) => {
    state.isRunning = true
  },
  pauseCanvas: (state: StateType) => {
    state.isRunning = false
  },
  setTemplate: (
    state: StateType,
    newTemplate: {
      grid: number[][]
      name: string
    }
  ) => {
    state.selectedTemplate = newTemplate.grid
    state.templateName = newTemplate.name
  },
  addNotification: (state: StateType, notification: NotificationType) => {
    notification.uuid = uuidv4()
    state.notifications.push(notification)
  },
  removeNotification: (state: StateType, uuid: string) => {
    state.notifications = state.notifications.filter(
      (item) => item.uuid !== uuid
    )
  },

  // updateFoodData: (state, data) => {
  //   state.fooddata = data
  // },
  // addToCart: (state, formOutput) => {
  //   formOutput.id = uuidv4()
  //   state.cart.push(formOutput)
  // },
}

export const actions = {
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

// export const getters = {
//   getterValue: (state) => {
//     return state.value
//   },
// }
