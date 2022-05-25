<template>
  <div
    :class="`mx-auto h-full flex flex-col justify-between bg-gray-200 dark:bg-gray-800 shadow  w-full p-3 rounded-lg overflow-hidden`"
  >
    <div class="">
      <div
        class="mx-auto cursor-pointer w-fit rounded-lg overflow-hidden"
        @click="handleTemplateSelect()"
      >
        <GridCanvasWrapper
          :canvas-identifier="`${pattern.details.name}-small`"
          :template="pattern.pattern"
        />
      </div>
      <div class="mt-4 px-2 h-auto w-full">
        <h3
          class="w-full break-words text-center text-sm text-gray-900 dark:text-gray-50"
        >
          {{ patternName }}
        </h3>
      </div>
    </div>

    <div :class="`flex mt-5 items-center justify-end w-full`">
      <button
        v-if="!isSelected"
        class="bg-gray-300 text-gray-900 dark:text-white transition-colors dark:bg-gray-700 dark:hover:text-gray-900 hover:bg-yellow-500 dark:hover:bg-orange-400 w-fit font-medium px-[10px] py-[6px] text-sm rounded-full"
        @click="handleSelectButton"
      >
        Show me
      </button>
      <button
        v-else
        class="text-white transition-colors bg-sky-600 ml-auto w-fit font-medium px-[10px] py-[6px] text-sm rounded-full"
        @click="handleSelectButton"
      >
        Selected
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import GridCanvasWrapper from '~/components/GOL/TemplatesGrid/GridCanvasWrapper.vue'
import { PatternType } from '~/patterns/patterns'
import { RootState } from '~/store'

export default Vue.extend({
  components: { GridCanvasWrapper },
  props: {
    pattern: {
      type: Object as () => PatternType,
      required: true,
    },
    compactMode: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      currentTemplateName: (state) =>
        (state as RootState).canvasState.selectedPattern.details.name,
    }),
    patternName(): string {
      return this.pattern.details.name
    },
    isSelected(): boolean {
      return this.currentTemplateName === this.pattern.details.name
    },
  },

  methods: {
    handleTemplateSelect(): void {
      this.$store.commit('canvasState/setTemplate', this.pattern)
      this.$store.commit('canvasState/toggleReset')
      this.$store.commit('canvasState/pauseCanvas')
    },
    handleSelectButton(): void {
      this.handleTemplateSelect()
      window.scroll({ top: 0, behavior: 'smooth' })
      this.$store.commit('canvasState/startCanvas')
    },
  },
})
</script>

<style lang="scss" scoped></style>
