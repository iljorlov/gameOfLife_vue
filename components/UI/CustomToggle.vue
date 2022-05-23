<template>
  <div
    class="w-12 h-6 cursor-pointer rounded-full flex items-center justify-start px-[2px]"
    @click="handleClick"
  >
    <div
      :style="{
        transform: `translateX(${checked ? 24 : 0}px)`,
      }"
      class="bg-white z-20 transition-all ease-in-out rounded-full h-5 w-5 shrink-0 overflow-hidden"
    ></div>
    <slot></slot>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    checked: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    handleClick() {
      this.$emit('isChecked', !this.checked)
    },
  },
})
</script>

<style lang="scss" scoped></style>
