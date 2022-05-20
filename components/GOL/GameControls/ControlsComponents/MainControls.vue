<template>
  <div
    class="w-96 px-6 bg-gray-700 rounded-lg h-full flex justify-between items-center"
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
    <div @click="resetCanvas">
      <TemplateCanvas
        class="border-none bg-white rounded-sm"
        :canvas-identifier="`${canvasState.selectedPattern.details.name}-menu`"
        :pattern="canvasState.selectedPattern"
        :height="84"
        :width="84"
        :only-canvas="true"
      />
    </div>

    <div class="h-full py-2 w-fit flex flex-col justify-between items-end">
      <button @click="clearCanvas">Clear</button>
      <button @click="randomizeCanvas">Random</button>
      <!-- <button @click="resetCanvas">Reload</button> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PlayIcon from '../../../UI/Icons/PlayIcon.vue'
import PauseIcon from '~/components/UI/Icons/PauseIcon.vue'
import TemplateCanvas from '~/components/GOL/TemplateCanvas.vue'

export default Vue.extend({
  components: {
    PlayIcon,
    PauseIcon,
    TemplateCanvas,
  },
  computed: {
    canvasState(): number {
      return this.$store.state.canvasState
    },
  },
  methods: {
    togglePlayMode(e: number) {
      this.$store.commit('canvasState/togglePlayMode', e)
    },
    clearCanvas() {
      this.$store.commit('canvasState/toggleClear')
    },
    resetCanvas() {
      this.$store.commit('canvasState/toggleReset')
    },
    randomizeCanvas() {
      this.$store.commit('canvasState/toggleRandom')
    },
  },
})
</script>
