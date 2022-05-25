<template>
  <div class="h-full w-full px-8">
    <NoisyCanvas v-if="env === 'true'" />

    <WipPage v-else />
  </div>
</template>

<script tang="ts">
import Vue from 'vue'
import WipPage from '~/components/WipPage/WipPage.vue'
import NoisyCanvas from '~/components/UI/NoisyCanvas.vue'
export default Vue.extend({
  name: 'CataloguePage',

  components: {
    WipPage,
    NoisyCanvas,
  },
  data() {
    return {
      env: process.env.development,
    }
  },
})
</script>

<style lang="scss" scoped></style>
