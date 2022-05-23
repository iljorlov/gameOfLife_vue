<template>
  <div
    class="flex flex-col text-sm lg:text-base justify-between h-full items-end min-w-[170px]"
  >
    <div class="w-full text-right">
      <span class="hidden lg:inline-block">Current Generation:</span
      ><span class="inline-block lg:hidden">Gen:</span>
      {{ canvasState.currentGeneration }}
    </div>
    <CustomCheckbox
      :title="`Border`"
      :checked-by-default="canvasState.border"
      @isChecked="(e) => handleBorder(e)"
    />
    <CustomCheckbox
      :title="`Grid`"
      :checked-by-default="canvasState.showGrid"
      @isChecked="(e) => handleGrid(e)"
    />
    <CustomCheckbox
      class="xl:hidden"
      :title="`Draw Mode`"
      :checked-by-default="canvasState.mobileDrawModeOn"
      @isChecked="(e) => handleMobileDrawMode(e)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomCheckbox from '~/components/UI/CustomCheckbox.vue'
export default Vue.extend({
  components: {
    CustomCheckbox,
  },
  computed: {
    canvasState(): number {
      return this.$store.state.canvasState
    },
  },
  methods: {
    handleBorder(e: boolean) {
      if (e) {
        this.$store.commit('canvasState/toggleBorderOn')
      } else {
        this.$store.commit('canvasState/toggleBorderOff')
      }
    },

    handleGrid(e: boolean) {
      if (e) {
        this.$store.commit('canvasState/toggleGridOn')
      } else {
        this.$store.commit('canvasState/toggleGridOff')
      }
    },
    handleMobileDrawMode(e: boolean) {
      if (e) {
        this.$store.commit('canvasState/toggleMobileDrawModeOn')
      } else {
        this.$store.commit('canvasState/toggleMobileDrawModeOff')
      }
    },
  },
})
</script>
