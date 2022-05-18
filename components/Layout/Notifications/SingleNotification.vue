<template>
  <div
    class="min-h-[64px] py-2 px-6 h-auto w-full mt-2 relative bg-white rounded shadow-md before:absolute before:content-[''] before:h-[calc(100%-20px)] before:left-2 before:w-[6px] before:bg-blue-500 before:top-1/2 before:-translate-y-1/2 before:rounded-md"
  >
    <div class="w-full h-full">
      <div v-if="notification.title" class="font-medium">
        {{ notification.title }}
      </div>
      <div v-if="notification.text" class="text-slate-500">
        {{ notification.text }} Lorem ipsum dolor, sit amet consectetur
        adipisicing elit. Accusantium nesciunt in, voluptatibus similique
        consequatur libero?
      </div>
    </div>
    <div
      class="h-5 w-5 hover:bg-slate-100 rounded transition-colors absolute top-[10px] right-2 cursor-pointer"
      @click="removeNotification(notification.uuid)"
    >
      <XIcon />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { NotificationType } from '~/store'
import XIcon from '~/components/UI/Icons/XIcon.vue'
export default Vue.extend({
  components: {
    XIcon,
  },
  props: {
    notification: {
      type: Object as () => NotificationType,
      required: true,
    },
  },
  mounted() {
    setTimeout(() => {
      this.removeNotification(this.notification.uuid)
    }, this.notification.lifeDurationSeconds * 1000)
  },
  methods: {
    removeNotification(uuid: string) {
      this.$store.commit('removeNotification', uuid)
    },
  },
})
</script>

<style lang="scss" scoped></style>
