<template>
  <CustomSlider
    :label-text="`Cell Size`"
    :max="25"
    :min="2"
    :initial-value="cellSize"
    @newValue="(e) => handleCellSizeChange(e)"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/store'
import CustomSlider from '~/components/UI/CustomSlider.vue'

export default Vue.extend({
  components: {
    CustomSlider,
  },
  computed: {
    ...mapState({
      cellSize: (state) => (state as RootState).canvasState.cellSize,
    }),
  },
  methods: {
    handleCellSizeChange(e: number) {
      this.$store.commit('canvasState/setCellSize', e)
    },
  },
})
</script>
