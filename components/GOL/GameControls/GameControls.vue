<template>
  <div class="w-full h-full text-white p-4 flex justify-between space-x-8">
    <div class="flex flex-col justify-between h-full">
      <div class="cursor-pointer flex items-col space-x-6">
        <CustomSlider
          :label-text="`Speed`"
          :max="100"
          :min="1"
          :initial-value="canvasState.speed"
          @newValue="(e) => handleSpeedChange(e)"
        />
        <CustomSlider
          :label-text="`Cell Size`"
          :max="20"
          :min="2"
          :initial-value="20"
          @newValue="(e) => handleCellSizeChange(e)"
        />
      </div>
    </div>
    <div class="flex flex-col justify-between h-full items-end">
      <div>Current Generation: {{ canvasState.currentGeneration }}</div>
      <div>Cell Size: {{ canvasState.cellSize }}</div>
      <div class="cursor-pointer" @click="toggleBorder">
        <input
          :class="`form-check-input appearance-none h-4 relative after:content-['✔'] after:absolute after:top-1/2 after:left-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:text-white w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer`"
          type="checkbox"
          :checked="canvasState.border"
        />
        <label
          class="form-check-label inline-block text-white cursor-pointer"
          for="flexCheckDefault"
        >
          Border
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomSlider from './CustomSlider.vue'

import { CanvasStateType } from '~/store/index'
import { PatternType } from '~/patterns/patterns'

export default Vue.extend({
  components: {
    CustomSlider,
  },
  computed: {
    canvasState(): CanvasStateType {
      return this.$store.state.canvasState
    },
    selectedPattern(): PatternType {
      return this.$store.state.selectedPattern
    },
  },
  methods: {
    toggleBorder() {
      this.$store.commit('toggleBorder')
    },
    handleSpeedChange(e: number) {
      this.$store.commit('setCanvasSpeed', e)
    },
    handleCellSizeChange(e: number) {
      this.$store.commit('setCellSize', e)
    },
  },
})
</script>

<style lang="scss" scoped></style>
