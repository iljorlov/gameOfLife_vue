<template>
  <div @mousemove="handleMousemove" @mouseleave="handleMouseLeave">
    <CanvasComponent
      :canvas-width="200"
      :canvas-height="200"
      :canvas-identifier="canvasIdentifier"
      :template="template"
      :cell-size="5"
      :is-running="isRunning"
      :border-enabled="false"
      :reset-toggle="resetToggle"
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
  props: {
    canvasIdentifier: {
      type: String,
      required: true,
    },
    template: {
      type: Array as () => number[][],
      required: true,
    },
  },
  data() {
    return {
      isRunning: false,
      resetToggle: false,
    }
  },
  methods: {
    handleMousemove() {
      this.isRunning = true
    },
    handleMouseLeave() {
      this.isRunning = false
      this.resetToggle = !this.resetToggle
    },
  },
})
</script>

<style lang="scss" scoped></style>
