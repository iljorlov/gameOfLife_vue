<template>
  <div
    :class="`mt-6 w-full border cursor-crosshair ${
      borderEnabled ? 'border-black' : 'border-transparent'
    }`"
    id="main-canvas-wrapper"
  >
    <GolCanvas
      :canvasWidth="canvasWidth"
      :canvasHeight="canvasHeigth"
      canvasIdentifier="main-test"
      :template="selectedPattern"
      :resetToggle="resetToggle"
      :clearToggle="clearToggle"
      :randomToggle="randomToggle"
      :cellSize="cellSize"
      :isRunning="isRunning"
      :borderEnabled="borderEnabled"
      :gridEnabled="showGrid"
      :isMainCanvas="true"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Canvas from './Canvas.vue'
export default Vue.extend({
  components: {
    GolCanvas: Canvas,
  },
  mounted() {
    window.addEventListener('resize', () => {
      const wrapper = document.getElementById('main-canvas-wrapper')
      this.canvasWidth = wrapper!.getBoundingClientRect().width
    })
    const wrapper = document.getElementById('main-canvas-wrapper')
    this.canvasWidth = wrapper!.getBoundingClientRect().width
  },
  destroyed() {
    window.removeEventListener('resize', () => {
      const wrapper = document.getElementById('main-canvas-wrapper')
      this.canvasWidth = wrapper!.getBoundingClientRect().width
    })
  },
  data() {
    return {
      canvasWidth: 0,
    }
  },
  computed: {
    canvasHeigth() {
      const ratio = 1280 / 720
      return this.canvasWidth / ratio
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
})
</script>

<style lang="scss" scoped></style>
