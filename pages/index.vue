<template>
  <div class="w-full">
    <div class="mx-auto relative">
      <div
        class="absolute pointer-events-none w-full h-full opacity-0 text-2xl font-bold dark:text-slate-100 flex items-center justify-center zoomOut"
      >
        Game of Life
      </div>
      <MainCanvasWrapper class="slideFromRightOnInit" />
    </div>
    <TemplatesGrid /> <ControlsContainer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MainCanvasWrapper from '~/components/GOL/MainCanvas/MainCanvasWrapper.vue'
import TemplatesGrid from '~/components/GOL/TemplatesGrid/TemplatesGrid.vue'
import ControlsContainer from '~/components/GOL/GameControls/ControlsWrapper.vue'
import { NotificationType } from '~/store/notifications'
import sleep from '~/utils/sleep'

export default Vue.extend({
  name: 'IndexPage',
  components: {
    TemplatesGrid,
    ControlsContainer,
    MainCanvasWrapper,
  },
  head() {
    return {
      title: '🤖 | Game Of Life',
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

<style scoped>
.slideFromRightOnInit {
  animation-duration: 2s;
  animation-delay: 0;
  animation-name: slideFromTop;
  animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  @keyframes slideFromTop {
    0% {
      transform: translateY(-46px);
      opacity: 0;
    }
    75% {
      transform: translateY(-46px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
.zoomOut {
  animation-duration: 1.5s;
  animation-name: zoomOut;
  @keyframes zoomOut {
    0% {
      transform: scale(1.2);
      opacity: 1;
    }
    8% {
      transform: scale(1);
    }
    92% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0.8);
    }
  }
}
</style>
