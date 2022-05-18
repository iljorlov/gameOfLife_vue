<template>
  <div class="w-full fixed left-0 bottom-0">
    <div class="w-full relative flex justify-end">
      <div
        :style="{ width: 'calc(100% - 32px)' }"
        class="w-full max-w-[400px] pr-4 pb-4"
      >
        <div
          v-for="notification in notifications"
          :key="notification.uuid"
          class="min-h-[64px] py-2 px-6 h-auto w-full mt-2 relative bg-white rounded shadow-md before:absolute before:content-[''] before:h-[calc(100%-20px)] before:left-2 before:w-[6px] before:bg-blue-500 before:top-1/2 before:-translate-y-1/2 before:rounded-md"
        >
          <SingleNotification
            ><div>
              <div class="w-full h-full">
                <div v-if="notification.title" class="font-medium">
                  {{ notification.title }}
                </div>
                <div v-if="notification.text" class="text-slate-500">
                  {{ notification.text }} Lorem ipsum dolor, sit amet
                  consectetur adipisicing elit. Accusantium nesciunt in,
                  voluptatibus similique consequatur libero?
                </div>
              </div>
              <div
                class="bg-black h-4 w-4 absolute top-[10px] right-2 cursor-pointer"
                @click="removeNotification(notification.uuid)"
              ></div>
            </div>
            ></SingleNotification
          >
        </div>
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

  methods: {
    removeNotification(uuid: string) {
      this.$store.commit('removeNotification', uuid)
    },
  },
})
</script>

<style lang="scss" scoped></style>
