<template>
  <div id="main-canvas-wrapper" :class="`mt-3 md:mt-6 w-full`">
    <CanvasComponent
      :canvas-width="canvasWidth"
      :canvas-height="canvasHeigth"
      canvas-identifier="main-test"
      :template="selectedPattern"
      :reset-toggle="resetToggle"
      :clear-toggle="clearToggle"
      :random-toggle="randomToggle"
      :cell-size="cellSize"
      :is-running="isRunning"
      :border-enabled="borderEnabled"
      :grid-enabled="showGrid"
      :is-main-canvas="true"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import CanvasComponent from '~/components/GOL/CanvasComponent.vue'
import { RootState } from '~/store'
export default Vue.extend({
  components: {
    CanvasComponent,
  },
  data() {
    return {
      canvasWidth: 0,
    }
  },
  computed: {
    canvasHeigth(): number {
      const tabletPlusRatio = 1280 / 720
      const phoneRatio = 3 / 4
      if (this.canvasWidth && this.canvasWidth > 768) {
        return this.canvasWidth / tabletPlusRatio
      } else {
        return this.canvasWidth / phoneRatio
      }
    },
    ...mapState({
      cellSize: (state) => (state as RootState).canvasState.cellSize,
      selectedPattern: (state) =>
        (state as RootState).canvasState.selectedPattern.pattern,
      showGrid: (state) => (state as RootState).canvasState.showGrid,
      borderEnabled: (state) => (state as RootState).canvasState.border,
      speed: (state) => (state as RootState).canvasState.speed,
      selectedPatternName: (state) =>
        (state as RootState).canvasState.selectedPattern.details.name,
      isRunning: (state) => (state as RootState).canvasState.isRunning,
      clearToggle: (state) => (state as RootState).canvasState.clearToggle,
      resetToggle: (state) => (state as RootState).canvasState.resetToggle,
      randomToggle: (state) => (state as RootState).canvasState.randomToggle,
    }),
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    const wrapper = document.getElementById('main-canvas-wrapper')
    this.canvasWidth = wrapper!.getBoundingClientRect().width
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      const wrapper = document.getElementById('main-canvas-wrapper')
      if (wrapper) {
        this.canvasWidth = wrapper.getBoundingClientRect().width
      }
    },
  },
})
</script>

<style lang="scss" scoped></style>
