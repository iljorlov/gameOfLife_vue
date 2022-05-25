import { ActionTree, MutationTree } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { RootState } from '.'

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

export const MutationType = {
  ADD_NOTIFICATION: 'addNotification',
  SET_NOTIFICATIONS: 'setNotifications',
}
export const mutations: MutationTree<NotificationsStateType> = {
  [MutationType.ADD_NOTIFICATION]: (state, notification: NotificationType) =>
    state.notificationsList.push(notification),
  [MutationType.SET_NOTIFICATIONS]: (
    state,
    notifications: NotificationType[]
  ) => (state.notificationsList = notifications),
}

export const actionType = {
  ADD_NOTIFICATION: 'addNotification',
  REMOVE_NOTIFICATION: 'removeNotification',
}

export const actions: ActionTree<NotificationsStateType, RootState> = {
  [actionType.ADD_NOTIFICATION]({ commit }, notification: NotificationType) {
    const newUUID = uuidv4()
    notification.uuid = newUUID
    commit(MutationType.ADD_NOTIFICATION, notification)
  },
  [actionType.REMOVE_NOTIFICATION]({ commit, state }, uuid: string) {
    const notifications = state.notificationsList.filter(
      (item) => item.uuid !== uuid
    )
    commit(MutationType.SET_NOTIFICATIONS, notifications)
  },
}
