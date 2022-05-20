<template>
  <CustomSlider
    :label-text="`Cell Size`"
    :max="20"
    :min="2"
    :initial-value="cellSize"
    @newValue="(e) => handleCellSizeChange(e)"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import CustomSlider from '~/components/UI/CustomSlider.vue'

export default Vue.extend({
  components: {
    CustomSlider,
  },
  computed: {
    cellSize(): number {
      return this.$store.state.canvasState.cellSize
    },
  },
  methods: {
    handleCellSizeChange(e: number) {
      this.$store.commit('canvasState/setCellSize', e)
    },
  },
})
</script>
