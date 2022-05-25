<template>
  <div class="w-full h-full text-white p-4 flex items-center justify-between">
    <div class="lg:flex justify-between items-start space-x-8 h-full hidden">
      <div class="w-32"><SpeedControls /></div>
      <div class="w-32"><CellSizeControls /></div>
    </div>
    <MainControls />
    <AdditionalData />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SpeedControls from './ControlsComponents/SpeedControls.vue'
import CellSizeControls from './ControlsComponents/CellSizeControls.vue'
import AdditionalData from './ControlsComponents/AdditionalData.vue'
import MainControls from './ControlsComponents/MainControls.vue'

export default Vue.extend({
  components: {
    SpeedControls,
    CellSizeControls,
    AdditionalData,
    MainControls,
  },
})
</script>

<style lang="scss" scoped></style>
