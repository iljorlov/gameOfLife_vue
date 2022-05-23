<template>
  <div>
    <CustomToggle
      :class="`bg-gray-700 relative transition-all`"
      :checked="darkMode"
      @isChecked="(e) => toggleTheme(e)"
      ><MoonIcon
        :style="{
          transform: `translateX(${darkMode ? '4' : '24'}px) translateY(-1px)`,
          opacity: `${darkMode ? '1' : '0'}`,
        }"
        class="h-4 w-4 absolute -translate-y-1/2 left-0 transition-all text-yellow-400"
      />
      <SunIcon
        :style="{
          transform: `translateX(${darkMode ? '2' : '24'}px)`,
          opacity: `${darkMode ? '0' : '1'}`,
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

  computed: {
    darkMode(): boolean {
      return this.$store.state.darkMode
    },
  },
  watch: {
    darkMode: {
      handler() {
        // if (this.lightTheme === null) {
        //   return
        // }
        if (this.darkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
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
        this.$store.commit('setDarkModeOn')

        document.documentElement.classList.add('dark')
      } else if (typeof theme === 'string' && theme === 'light') {
        document.documentElement.classList.remove('dark')
      }
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    toggleTheme(e: boolean) {
      console.log(e)

      if (e) {
        this.$store.commit('setDarkModeOn')
        localStorage.setItem('theme', 'dark')
      } else {
        this.$store.commit('setDarkModeOff')
        localStorage.setItem('theme', 'light')
      }
    },
  },
})
</script>

<style lang="scss" scoped></style>
