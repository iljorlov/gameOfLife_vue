<template>
  <div class="absolute inset-0 overflow-clip pointer-events-none">
    <div
      class="h-[calc(100vh)] px-2 xl:px-0 w-full sticky top-0 flex items-end"
    >
      <div class="md:scale-[0.8] 2xl:scale-[0.9] transition-transform w-full">
        <div
          id="controls-container"
          class="h-32 transition-transform w-full md:px-8 bg-gray-800 rounded-lg mb-4 shadow-lg pointer-events-auto"
        >
          <GameControls />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GameControls from './GameControls.vue'
export default Vue.extend({
  components: {
    GameControls,
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.handleScroll()
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    handleScroll() {
      const header = document.getElementsByTagName('header')[0]
      const controlsContainer = document.getElementById('controls-container')
      const headerOffsetY = Math.abs(header.getBoundingClientRect().y)
      if (headerOffsetY < 58) {
        controlsContainer!.classList.add('translate58')
        // controlsContainer!.style.transform = 'translateY(-58px)'
      } else {
        controlsContainer!.classList.remove('translate58')
        // console.log(controlsContainer?.style.transform)
        // controlsContainer!.style.transform = 'translateY(0)'
      }
    },
  },
})
</script>

<style scoped>
.translate58 {
  transform: translateY(-58px);
}
</style>
