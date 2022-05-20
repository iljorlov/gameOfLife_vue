<template>
  <CustomSlider
    :label-text="`Speed`"
    :max="100"
    :min="1"
    :initial-value="speed"
    @newValue="(e) => handleSpeedChange(e)"
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
    speed(): number {
      return this.$store.state.canvasState.speed
    },
  },
  methods: {
    handleSpeedChange(e: number) {
      this.$store.commit('canvasState/setCanvasSpeed', e)
    },
  },
})
</script>
