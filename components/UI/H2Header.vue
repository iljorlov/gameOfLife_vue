<template>
  <h2
    class="w-full text-gray-800 dark:text-gray-100 text-3xl font-medium mt-12"
  >
    {{ title }}
  </h2>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped></style>
