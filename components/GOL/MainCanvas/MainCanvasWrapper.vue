<template>
  <div
    id="main-canvas-wrapper"
    :class="`mt-6 w-full border cursor-crosshair ${
      borderEnabled ? 'border-black' : 'border-transparent'
    }`"
  >
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
import CanvasComponent from '~/components/GOL/CanvasComponent.vue'
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
    canvasHeigth() {
      const tabletPlusRatio = 1280 / 720
      const phoneRatio = 3 / 4
      if (this.canvasWidth > 768) {
        return this.canvasWidth / tabletPlusRatio
      } else {
        return this.canvasWidth / phoneRatio
      }
    },
    cellSize(): number {
      return this.$store.state.canvasState.cellSize
    },
    selectedPattern(): number[][] {
      return this.$store.state.canvasState.selectedPattern.pattern
    },
    showGrid(): boolean {
      return this.$store.state.canvasState.showGrid
    },
    borderEnabled(): boolean {
      return this.$store.state.canvasState.border
    },
    speed(): number {
      return this.$store.state.canvasState.speed
    },
    selectedPatternName(): string {
      return this.$store.state.canvasState.selectedPattern.details.name
    },
    isRunning(): boolean {
      return this.$store.state.canvasState.isRunning
    },
    clearToggle(): boolean {
      return this.$store.state.canvasState.clearToggle
    },
    resetToggle(): boolean {
      return this.$store.state.canvasState.resetToggle
    },
    randomToggle(): boolean {
      return this.$store.state.canvasState.randomToggle
    },
  },
  mounted() {
    window.addEventListener('resize', () => {
      const wrapper = document.getElementById('main-canvas-wrapper')
      if (wrapper) {
        this.canvasWidth = wrapper.getBoundingClientRect().width
      }
    })
    const wrapper = document.getElementById('main-canvas-wrapper')
    this.canvasWidth = wrapper!.getBoundingClientRect().width
  },
  destroyed() {
    window.removeEventListener('resize', () => {
      const wrapper = document.getElementById('main-canvas-wrapper')
      if (wrapper) {
        this.canvasWidth = wrapper.getBoundingClientRect().width
      }
    })
  },
})
</script>

<style lang="scss" scoped></style>
