<template>
  <div class="w-full fixed left-0 bottom-0">
    <div class="w-full relative flex justify-end">
      <div
        :style="{ width: 'calc(100% - 32px)' }"
        class="w-full max-w-[400px] pr-4 pb-4"
      >
        <TransitionGroup name="list" tag="div">
          <SingleNotification
            v-for="notification in notifications"
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
import { NotificationType } from '~/store'
export default Vue.extend({
  components: {
    SingleNotification,
  },
  data() {
    return {
      idsToDelete: [] as string[],
    }
  },
  computed: {
    ...mapState({
      notifications: 'notifications',
    }),
  },
  watch: {},
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
