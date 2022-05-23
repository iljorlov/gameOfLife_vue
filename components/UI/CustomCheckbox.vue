<template>
  <div class="cursor-pointer flex space-x-2 items-center" @click="handleClick">
    <label
      class="form-check-label inline-block text-white cursor-pointer"
      for="flexCheckDefault"
    >
      {{ title }}
    </label>
    <div class="h-4 w-4 relative">
      <input
        :class="`form-check-input absolute top-0 left-0 appearance-none h-full w-full  rounded-sm bg-white checked:bg-teal-600 checked:border-teal-600 focus:outline-none transition duration-200 cursor-pointer`"
        type="checkbox"
        :checked="checked"
      />
      <CheckIcon
        v-if="checked"
        class="text-white h-4 w-4 absolute top-0 left-0"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import CheckIcon from '~/components/UI/Icons/CheckIcon.vue'
export default Vue.extend({
  components: {
    CheckIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    checkedByDefault: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checked: this.checkedByDefault,
    }
  },
  watch: {
    checked() {
      this.$emit('isChecked', this.checked)
    },
  },
  methods: {
    handleClick() {
      this.checked = !this.checked
    },
  },
})
</script>

<style lang="scss" scoped></style>
