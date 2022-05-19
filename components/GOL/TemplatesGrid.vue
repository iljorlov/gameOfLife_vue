<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 mt-12 pb-48"
  >
    <div
      v-for="pattern in patternList"
      :key="pattern.details.name"
      class="overflow-hidden border-2"
    >
      <TemplateCanvas
        :canvas-identifier="pattern.details.name"
        :pattern="pattern"
      />
    </div>
  </div>
</template>

<script>
import { patternList } from '../../patterns/patterns'
import TemplateCanvas from './TemplateCanvas.vue'
export default {
  components: {
    TemplateCanvas,
  },

  data() {
    return {
      patternList,
    }
  },
  methods: {
    provideCanvasContext() {},
  },
}
</script>

<style lang="scss" scoped></style>
