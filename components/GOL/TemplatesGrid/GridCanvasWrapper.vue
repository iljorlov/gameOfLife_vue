<template>
  <div @mousemove="(e) => handleMousemove(e)" @mouseleave="handleMouseLeave">
    <CanvasComponent
      :canvas-width="width"
      :canvas-height="height"
      :canvas-identifier="canvasIdentifier"
      :template="template"
      :cell-size="cellSize"
      :is-running="isRunning"
      :border-enabled="false"
      :reset-toggle="resetToggle"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
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
  computed: {
    ...mapState({
      gridCompact: (state) => state.gridCompact,
    }),
    width(): number {
      return this.gridCompact ? 140 : 200
    },
    height(): number {
      return this.gridCompact ? 140 : 200
    },
    cellSize(): number {
      const largestSide =
        this.template.length > this.template[0].length
          ? this.template.length
          : this.template[0].length
      const padding = 16
      return this.width / (largestSide + padding)
    },
  },
  data() {
    return {
      isRunning: false,
      resetToggle: false,
    }
  },
  methods: {
    handleMousemove(e: MouseEvent) {
      if (!(e instanceof window.MouseEvent)) {
        return
      }
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
