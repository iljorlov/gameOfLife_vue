<template>
  <div
    class="w-96 px-4 lg:px-6 bg-gray-700 rounded-lg h-full flex justify-between items-center"
  >
    <div
      class="h-10 cursor-pointer shrink-0 w-10 rounded-full group hover:bg-gray-800 transition-colors bg-slate-50 flex items-center justify-center"
      @click="togglePlayMode"
    >
      <PlayIcon
        v-if="!canvasState.isRunning"
        class="translate-x-[1.5px] group-hover:text-slate-50 text-gray-800 p-[3px] transition-colors"
      />
      <PauseIcon
        v-if="canvasState.isRunning"
        class="text-gray-800 group-hover:text-slate-50 transition-colors"
      />
    </div>
    <div
      class="bg-white cursor-pointer hidden sm:block rounded-sm overflow-hidden"
      @mousemove="handleMousemove"
      @mouseleave="handleMouseLeave"
      @click="resetCanvas"
    >
      <CanvasComponent
        :canvas-width="canvasSize"
        :canvas-height="canvasSize"
        :canvas-identifier="`${canvasState.selectedPattern.details.name}-menu`"
        :template="canvasState.selectedPattern.pattern"
        :cell-size="cellSize"
        :is-running="previewRunning"
        :reset-toggle="resetToggle"
        :border-enabled="false"
      />
    </div>

    <div class="h-full py-2 w-fit flex flex-col justify-between items-end">
      <button @click="clearCanvas">Clear</button>
      <button @click="randomizeCanvas">Random</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PlayIcon from '../../../UI/Icons/PlayIcon.vue'
import PauseIcon from '~/components/UI/Icons/PauseIcon.vue'
import CanvasComponent from '~/components/GOL/CanvasComponent.vue'
import { CanvasStateType } from '~/store/canvasState'
export default Vue.extend({
  components: {
    PlayIcon,
    PauseIcon,
    CanvasComponent,
  },
  data() {
    return {
      resetToggle: false,
      previewRunning: false,
      canvasSize: 84,
    }
  },

  computed: {
    selectedTemplateName(): string {
      return this.$store.state.canvasState.selectedPattern.details.name
    },
    canvasState(): CanvasStateType {
      return this.$store.state.canvasState
    },
    cellSize(): number {
      const width =
        this.$store.state.canvasState.selectedPattern.pattern[0].length
      const height =
        this.$store.state.canvasState.selectedPattern.pattern.length
      const largestDimension = width > height ? width : height
      const padding = 16
      return (this.canvasSize - padding) / largestDimension
    },
  },
  watch: {
    selectedTemplateName: {
      handler() {
        this.resetToggle = !this.resetToggle
      },
    },
  },
  methods: {
    togglePlayMode(e: number) {
      this.$store.commit('canvasState/togglePlayMode', e)
    },
    clearCanvas() {
      this.$store.commit('canvasState/toggleClear')
    },

    randomizeCanvas() {
      this.$store.commit('canvasState/toggleRandom')
    },
    handleMousemove() {
      this.previewRunning = true
    },
    handleMouseLeave() {
      this.previewRunning = false
      this.resetToggle = !this.resetToggle
    },
    resetCanvas() {
      if (this.canvasState && this.canvasState.isRunning) {
        this.$store.commit('canvasState/pauseCanvas')
      } else {
        window.scroll({ top: 0, behavior: 'smooth' })
        this.$store.commit('canvasState/toggleReset')
        this.$store.commit('canvasState/startCanvas')
      }
    },
  },
})
</script>
