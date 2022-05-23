<template>
  <div
    class="px-2 2xl:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 mt-12 pb-48"
  >
    <div
      v-for="pattern in patternList"
      :key="pattern.details.name"
      class="overflow-hidden bg-gray-800/60 p-4 rounded-lg"
    >
      <div
        class="mx-auto w-fit rounded-lg overflow-hidden"
        @click="handleTemplateSelect(pattern)"
      >
        <GridCanvasWrapper
          :canvas-identifier="pattern.details.name"
          :template="pattern.pattern"
        />
      </div>
      <div class="mt-2 p-2 h-auto w-full">
        <h4 class="w-full text-center text-lg text-gray-200">
          {{ pattern.details.name }}
        </h4>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { patternList, PatternType } from '~/patterns/patterns'
import GridCanvasWrapper from '~/components/GOL/TemplatesGrid/GridCanvasWrapper.vue'
export default Vue.extend({
  components: {
    GridCanvasWrapper,
  },

  data() {
    return {
      patternList,
      isRunning: false,
      resetToggle: false,
    }
  },
  computed: {
    cellSize() {
      return 2
    },
  },

  methods: {
    handleTemplateSelect(newPattern: PatternType) {
      // window.scrollTo({ top: 0, behavior: 'smooth' })
      this.$store.commit('canvasState/setTemplate', newPattern)
      this.$store.commit('canvasState/toggleReset')
    },
  },
})
</script>

<style lang="scss" scoped></style>
