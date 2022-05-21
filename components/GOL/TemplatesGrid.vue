<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 mt-12 pb-48"
  >
    <div
      v-for="pattern in patternList"
      :key="pattern.details.name"
      class="overflow-hidden border-2"
    >
      <div class="h-[200px] w-[200px] mx-auto">
        <GridCanvasWrapper
          :canvasIdentifier="pattern.details.name"
          :template="pattern.pattern"
        />
      </div>
    </div>
  </div>
</template>
<!-- :borderEnabled="borderEnabled"
          :gridEnabled="showGrid" -->
<!-- :resetToggle="resetToggle"
          :clearToggle="clearToggle"
          :randomToggle="randomToggle" -->

<script>
import { patternList } from '../../patterns/patterns'
import GridCanvasWrapper from './GridCanvasWrapper.vue'
export default {
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
    handleTemplateSelect() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      this.$store.commit('canvasState/startCanvas')
    },
  },
}
</script>

<style lang="scss" scoped></style>
