<template>
  <div class="w-full">
    <div><button @click="addNotification">add notif</button></div>
    <MainCanvas /> <TemplatesGrid /> <ControlsContainer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import MainCanvas from '../components/GOL/MainCanvas.vue'
import TemplatesGrid from '../components/GOL/TemplatesGrid.vue'
import ControlsContainer from '../components/GOL/GameControls/ControlsWrapper.vue'
import { NotificationType } from '~/store/index'
export default Vue.extend({
  name: 'IndexPage',
  components: {
    MainCanvas,
    TemplatesGrid,
    ControlsContainer,
  },
  computed: {
    ...mapState({
      notifications: 'notifications',
    }),
  },
  methods: {
    addNotification() {
      const notification: NotificationType = {
        lifeDurationSeconds: 1000,
        text: Math.random() > 0.6 ? '' : 'hello there',
        title: Math.random() > 0.6 ? '' : 'title',
        type: Math.random() > 0.6 ? 'INFO' : 'ERROR',
        uuid: '',
      }
      this.$store.commit('addNotification', notification)
    },
  },
})
</script>
