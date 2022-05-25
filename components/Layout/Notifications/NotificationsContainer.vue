<template>
  <div class="z-[400] w-full h-0 fixed left-0 bottom-0">
    <div
      id="deb"
      class="h-screen flex justify-end items-end -translate-y-[100vh] ml-auto pointer-events-none top-0 w-full max-w-[320px] md:max-w-[400px]"
    >
      <div
        :style="{ width: 'calc(100% - 32px)' }"
        class="w-full relative pr-4 pb-4"
      >
        <TransitionGroup name="list" tag="div">
          <SingleNotification
            v-for="notification in notifications.notificationsList"
            :key="notification.uuid"
            :notification="notification"
          />
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import SingleNotification from './SingleNotification.vue'
import { RootState } from '~/store'
export default Vue.extend({
  components: {
    SingleNotification,
  },
  computed: {
    ...mapState({
      notifications: (state) => (state as RootState).notifications,
    }),
  },
})
</script>

<style lang="css" scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translate(30px, 8px) scaleY(0.9);
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
</style>
