<template>
  <div
    class="flex flex-col text-sm lg:text-base justify-between h-full items-end min-w-[170px]"
  >
    <div class="w-full text-right">
      Current Generation: {{ canvasState.currentGeneration }}
    </div>
    <div class="w-full text-right">Cell Size: {{ canvasState.cellSize }}</div>
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
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    canvasState(): number {
      return this.$store.state.canvasState
    },
  },
  methods: {
    toggleBorder() {
      this.$store.commit('canvasState/toggleBorder')
    },
  },
})
</script>
