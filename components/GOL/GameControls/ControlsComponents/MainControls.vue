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
      id="canvas-preview-wrapper"
      class="bg-white dark:bg-gray-800 cursor-pointer h-[84px] w-[84px] hidden sm:block rounded-sm"
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
import { mapState } from 'vuex'
import PlayIcon from '../../../UI/Icons/PlayIcon.vue'
import PauseIcon from '~/components/UI/Icons/PauseIcon.vue'
import CanvasComponent from '~/components/GOL/CanvasComponent.vue'
import { RootState } from '~/store'
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
    ...mapState({
      selectedTemplateName: (state) =>
        (state as RootState).canvasState.selectedPattern.details.name,
      canvasState: (state) => (state as RootState).canvasState,
      defaultPatternWidth: (state) =>
        (state as RootState).canvasState.selectedPattern.pattern[0].length,
      defaultPatternHeight: (state) =>
        (state as RootState).canvasState.selectedPattern.pattern.length,
    }),

    cellSize(): number {
      const width = this.defaultPatternWidth
      const height = this.defaultPatternHeight
      const largestDimension = width > height ? width : height
      const padding = 10
      return (this.canvasSize - padding) / (largestDimension + padding)
    },
  },
  watch: {
    selectedTemplateName: {
      handler() {
        this.resetToggle = !this.resetToggle
      },
    },
  },
  mounted() {
    const wrapper = document.getElementById('canvas-preview-wrapper')
    if (wrapper?.getBoundingClientRect().width) {
      this.canvasSize = wrapper?.getBoundingClientRect().width
    }
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
      window.scroll({ top: 0, behavior: 'smooth' })
      this.$store.commit('canvasState/toggleReset')
      this.$store.commit('canvasState/startCanvas')
    },
  },
})
</script>
