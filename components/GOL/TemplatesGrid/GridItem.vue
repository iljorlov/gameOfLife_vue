<template>
  <div
    class="mx-auto h-full flex flex-col justify-between bg-gray-200 dark:bg-gray-700 shadow p-6 w-full rounded-lg overflow-hidden"
  >
    <div class="">
      <div
        class="mx-auto cursor-pointer shadow w-fit rounded-lg overflow-hidden"
        @click="handleTemplateSelect()"
      >
        <GridCanvasWrapper
          :canvas-identifier="pattern.details.name"
          :template="pattern.pattern"
        />
      </div>
      <div class="my-4 px-2 h-auto w-full">
        <h3 class="w-full text-center text-lg text-gray-900 dark:text-gray-50">
          {{ pattern.details.name }}
        </h3>
      </div>
    </div>
    <div
      v-if="hasAnyInfo"
      class="w-full space-y-2 text-sm px-6 mt-4 text-gray-100 rounded-lg"
    >
      <div v-if="pattern.details.year" class="w-full flex justify-between">
        <div class="text-gray-700 dark:text-gray-400">Year of discovery</div>
        <div class="text-gray-900 dark:text-gray-50">
          {{ pattern.details.year || 'unknown' }}
        </div>
      </div>
      <div v-if="pattern.details.author" class="w-full flex justify-between">
        <div class="text-gray-700 dark:text-gray-400">Author</div>
        <div class="text-gray-900 dark:text-gray-50">
          {{ pattern.details.author || 'unknown' }}
        </div>
      </div>
      <div v-if="pattern.details.period" class="w-full flex justify-between">
        <div class="text-gray-700 dark:text-gray-400">Period</div>
        <div class="text-gray-900 dark:text-gray-50">
          {{ pattern.details.period || 'unknown' }}
        </div>
      </div>
      <div
        v-if="pattern.details.description"
        class="w-full flex justify-between"
      >
        <div class="text-gray-700 dark:text-gray-400">Description</div>
        <div class="text-gray-900 dark:text-gray-50">
          {{ pattern.details.description || 'unknown' }}
        </div>
      </div>
    </div>
    <div
      v-else
      class="h-full w-full rounded-lg bg-gray-600 text-gray-50 py-4 flex items-center justify-center"
    >
      No info yet, sorry 🤔
    </div>

    <div class="flex mt-6 items-center justify-end w-full">
      <button
        v-if="!isSelected"
        class="bg-gray-300 text-gray-900 dark:text-white transition-colors dark:bg-gray-800 dark:hover:text-gray-900 hover:bg-yellow-500 dark:hover:bg-orange-400 w-fit font-medium px-4 py-2 text-sm rounded-full"
        @click="handleSelectButton"
      >
        Show me
      </button>
      <button
        v-else
        class="text-white transition-colors bg-sky-600 mt-3 ml-auto w-fit font-medium px-4 py-2 text-sm rounded-full"
        @click="handleSelectButton"
      >
        Selected
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GridCanvasWrapper from '~/components/GOL/TemplatesGrid/GridCanvasWrapper.vue'
import { PatternType } from '~/patterns/patterns'
export default Vue.extend({
  components: { GridCanvasWrapper },
  props: {
    pattern: {
      type: Object as () => PatternType,
      required: true,
    },
  },
  computed: {
    currentTemplateName(): string {
      // return 'this.$store.selectedPattern.details.name'
      return this.$store.state.canvasState.selectedPattern.details.name
    },
    isSelected(): boolean {
      return this.currentTemplateName === this.pattern.details.name
    },
    hasAnyInfo(): boolean {
      const details = this.pattern.details
      return !!(
        details.year ||
        details.author ||
        details.period ||
        details.description
      )
    },
  },

  methods: {
    handleTemplateSelect() {
      this.$store.commit('canvasState/setTemplate', this.pattern)
      this.$store.commit('canvasState/toggleReset')
      this.$store.commit('canvasState/pauseCanvas')
    },
    handleSelectButton() {
      this.handleTemplateSelect()
      window.scroll({ top: 0, behavior: 'smooth' })
      this.$store.commit('canvasState/startCanvas')
    },
  },
})
</script>

<style lang="scss" scoped></style>
