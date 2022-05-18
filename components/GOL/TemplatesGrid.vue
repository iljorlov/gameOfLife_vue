<template>
  <div class="grid grid-cols-3 gap-y-6 gap-x-8 my-12">
    <div
      v-for="pattern in patterns"
      :key="pattern[0]"
      class="overflow-hidden border-2"
    >
      <TemplateCanvas
        :canvas-identifier="pattern[0]"
        :provided-grid="pattern[1]"
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
      patterns: Object.entries(patternList),
    }
  },
  methods: {
    provideCanvasContext() {},
  },
}
</script>

<style lang="scss" scoped></style>
