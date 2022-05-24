<template>
  <div
    class="px-2 2xl:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 mt-12 pb-80"
  >
    <div
      v-for="pattern in patternList"
      :key="pattern.details.name"
      class="overflow-hidden"
    >
      <GridItem :pattern="pattern" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { patternList } from '~/patterns/patterns'
import GridItem from '~/components/GOL/TemplatesGrid/GridItem.vue'
export default Vue.extend({
  components: {
    GridItem,
  },
  data() {
    return {
      patternList,
    }
  },
})
</script>

<style lang="scss" scoped></style>
