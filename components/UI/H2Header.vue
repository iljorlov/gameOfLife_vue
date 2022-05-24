<template>
  <div class="flex h-10 justify-between items-center w-full mt-12">
    <h2 class="w-full text-gray-800 dark:text-gray-100 text-3xl font-medium">
      {{ title }}
    </h2>
    <slot></slot>
  </div>
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
