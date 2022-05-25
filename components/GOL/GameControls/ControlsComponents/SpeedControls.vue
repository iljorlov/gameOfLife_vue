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
import { mapState } from 'vuex'
import CustomSlider from '~/components/UI/CustomSlider.vue'
import { RootState } from '~/store'
export default Vue.extend({
  components: {
    CustomSlider,
  },
  computed: {
    ...mapState({
      speed: (state) => (state as RootState).canvasState.speed,
    }),
  },
  methods: {
    handleSpeedChange(e: number) {
      this.$store.commit('canvasState/setCanvasSpeed', e)
    },
  },
})
</script>
