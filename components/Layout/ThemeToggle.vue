<template>
  <div>
    <CustomToggle
      :class="`bg-gray-700 relative transition-all`"
      :value="lightTheme"
      @isChecked="(e) => toggleTheme(e)"
      ><MoonIcon
        :style="{
          transform: `translateX(${lightTheme ? '2' : '26'}px)`,
          opacity: `${lightTheme ? '0' : '1'}`,
        }"
        class="h-4 w-4 absolute -translate-y-1/2 left-0 transition-all text-yellow-400"
      />
      <SunIcon
        :style="{
          transform: `translateX(${lightTheme ? '2' : '22'}px)`,
          opacity: `${lightTheme ? '1' : '0'}`,
        }"
        class="h-4 w-4 absolute -translate-y-1/2 left-0 transition-all text-yellow-400"
      />
    </CustomToggle>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MoonIcon from '~/components/UI/Icons/MoonIcon.vue'
import SunIcon from '~/components/UI/Icons/SunIcon.vue'
import CustomToggle from '~/components/UI/CustomToggle.vue'
export default Vue.extend({
  components: {
    MoonIcon,
    SunIcon,
    CustomToggle,
  },
  data() {
    return {
      lightTheme: null as unknown,
    }
  },
  watch: {
    lightTheme: {
      handler() {
        if (this.lightTheme === null) {
          return
        }
        if (this.lightTheme) {
          document.documentElement.classList.remove('dark')
        } else {
          document.documentElement.classList.add('dark')
        }
      },
    },
  },
  mounted() {
    try {
      const theme = localStorage.getItem('theme')

      if (
        (typeof theme === 'string' && theme === 'dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        this.lightTheme = false
      } else if (typeof theme === 'string' && theme === 'light') {
        this.lightTheme = true
      }
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    toggleTheme(e: boolean) {
      this.lightTheme = e
      if (e) {
        localStorage.setItem('theme', 'light')
      } else {
        localStorage.setItem('theme', 'dark')
      }
    },
  },
})
</script>

<style lang="scss" scoped></style>
