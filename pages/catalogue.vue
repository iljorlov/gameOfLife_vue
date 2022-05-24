<template>
  <div class="h-full w-full px-8">
    <NoisyCanvas />
    <!-- <WipPage /> -->
  </div>
</template>

<script tang="ts">
import Vue from 'vue'
// import WipPage from '~/components/WipPage/WipPage.vue'
import NoisyCanvas from '~/components/UI/NoisyCanvas.vue'
export default Vue.extend({
  name: 'CataloguePage',
  components: {
    // WipPage,
    NoisyCanvas,
  },
})
</script>

<style lang="scss" scoped></style>
