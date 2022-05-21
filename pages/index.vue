<template>
  <div class="w-full">
    <MainCanvasWrapper /> <TemplatesGrid /> <ControlsContainer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MainCanvas from '../components/GOL/MainCanvas.vue'
import MainCanvasWrapper from '../components/GOL/MainCanvasWrapper.vue'
import TemplatesGrid from '../components/GOL/TemplatesGrid.vue'
import ControlsContainer from '../components/GOL/GameControls/ControlsWrapper.vue'
import { NotificationType } from '~/store/notifications'

export default Vue.extend({
  name: 'IndexPage',
  components: {
    MainCanvas,
    TemplatesGrid,
    ControlsContainer,
    MainCanvasWrapper,
  },
  head() {
    return {
      title: 'Game Of Life',
    }
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
      this.$store.commit('notifications/addNotification', notification)
    },
  },
})
</script>
