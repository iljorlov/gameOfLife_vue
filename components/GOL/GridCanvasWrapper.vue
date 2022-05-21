<template>
  <div @mousemove="handleMousemove" @mouseleave="handleMouseLeave">
    <GolCanvas
      :canvasWidth="200"
      :canvasHeight="200"
      :canvasIdentifier="canvasIdentifier"
      :template="template"
      :cellSize="5"
      :isRunning="isRunning"
      :borderEnabled="false"
      :resetToggle="resetToggle"
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
    },
  },
})
</script>

<style lang="scss" scoped></style>
