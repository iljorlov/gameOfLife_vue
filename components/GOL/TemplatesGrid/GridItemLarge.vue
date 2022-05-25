<template>
  <div
    :class="`mx-auto h-full flex flex-col justify-between bg-gray-200 dark:bg-gray-700 shadow w-full p-6 rounded-lg overflow-hidden`"
  >
    <div class="">
      <div
        class="mx-auto cursor-pointer shadow w-fit rounded-lg overflow-hidden"
        @click="handleTemplateSelect()"
      >
        <GridCanvasWrapper
          :canvas-identifier="`${pattern.details.name}-large`"
          :template="pattern.pattern"
        />
      </div>
      <div class="mt-4 px-2 h-auto w-full">
        <h3
          class="w-full text-center text-base break-words text-gray-900 dark:text-gray-50"
        >
          {{ patternName }}
        </h3>
      </div>
    </div>
    <div class="mt-3">
      <div
        v-if="hasAnyInfo"
        class="w-full space-y-2 text-sm px-6 mt-4 text-gray-100 rounded-lg"
      >
        <div
          v-for="entry in patternInfoFormatted"
          :key="`${pattern.details.name}-${entry.fieldName}`"
          class="w-full flex justify-between"
        >
          <div class="text-gray-700 w-1/4 text-left dark:text-gray-400">
            {{ entry.fieldName }}
          </div>
          <div class="text-gray-900 text-right w-3/4 dark:text-gray-50">
            {{ entry.fieldValue || 'unknown' }}
          </div>
        </div>
      </div>
      <div
        v-else
        class="h-full w-full rounded-lg bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-gray-50 py-4 flex items-center justify-center"
      >
        No info yet, sorry 🤔
      </div>
    </div>

    <div :class="`flex mt-6 items-center justify-end w-full`">
      <button
        v-if="!isSelected"
        class="bg-gray-300 text-gray-900 dark:text-white transition-colors dark:bg-gray-800 dark:hover:text-gray-900 hover:bg-yellow-500 dark:hover:bg-orange-400 w-fit font-medium px-4 py-2 text-sm rounded-full"
        @click="handleSelectButton"
      >
        Show me
      </button>
      <button
        v-else
        class="text-white transition-colors bg-sky-600 ml-auto w-fit font-medium px-4 py-2 text-sm rounded-full"
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

    patternInfoFormatted(): { fieldName: string; fieldValue: string }[] {
      const data: { fieldName: string; fieldValue: string }[] = []
      const details = this.pattern.details
      if (details.author) {
        data.push({ fieldName: 'Author', fieldValue: details.author })
      }
      if (details.year) {
        data.push({ fieldName: 'Year', fieldValue: details.year })
      }
      if (details.period) {
        data.push({
          fieldName: 'Period',
          fieldValue: details.period.toString(),
        })
      }
      if (details.description) {
        data.push({ fieldName: 'Description', fieldValue: details.description })
      }
      return data
    },
    patternName(): string {
      return this.pattern.details.name
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
