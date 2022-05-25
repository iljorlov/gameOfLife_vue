import { ActionTree, MutationTree } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

export const namespace = 'notifications'

export type NotificationType = {
  lifeDurationSeconds: number
  title: string
  text: string
  type: 'ERROR' | 'SUCCESS' | 'INFO'
  uuid: string
}

export const state = () => ({
  notificationsList: [] as NotificationType[],
})

export type NotificationsStateType = ReturnType<typeof state>

export const mutations: MutationTree<NotificationsStateType> = {
  addNotification: (
    state: NotificationsStateType,
    notification: NotificationType
  ) => {
    notification.uuid = uuidv4()
    state.notificationsList.push(notification)
  },
  removeNotification: (state: NotificationsStateType, uuid: string) => {
    state.notificationsList = state.notificationsList.filter(
      (item) => item.uuid !== uuid
    )
  },
}
