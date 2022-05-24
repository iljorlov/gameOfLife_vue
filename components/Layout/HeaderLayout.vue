<template>
  <header class="shrink-0">
    <nav
      class="px-4 bg-white border-b mx-auto border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
      <div
        class="container min-h-[58px] flex flex-wrap max-w-[1280px] items-center justify-between mx-auto"
      >
        <NuxtLink to="/" class="flex items-center">
          <span
            class="self-center text-xl font-semibold whitespace-nowrap dark:text-gray-200"
            >Game of Life</span
          >
        </NuxtLink>
        <ThemeToggle class="ml-auto mr-4" />

        <button
          data-collapse-toggle="mobile-menu"
          type="button"
          class="inline-flex items-center justify-center ml-3 text-gray-400 rounded-lg md:hidden hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:text-gray-400 dark:hover:text-white dark:focus:ring-gray-500"
          aria-controls="mobile-menu-2"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <svg
            class="hidden w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>

        <div
          id="mobile-menu"
          class="hidden w-full md:flex md:w-auto items-center"
        >
          <ul
            class="flex ml-8 flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium"
          >
            <li v-for="entry in links" :key="entry.title">
              <NuxtLink
                :to="entry.link"
                :class="` ${
                  entry.link === currentUrl
                    ? 'bg-blue-700 text-white md:text-blue-700 dark:bg-blue-600 md:bg-transparent md:dark:bg-transparent md:dark:text-white'
                    : 'text-gray-700 border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:hover:text-blue-700 dark:text-gray-400 dark:hover:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent'
                } py-2 pl-3 pr-4 rounded md:p-0`"
                aria-current="page"
                >{{ entry.title }}</NuxtLink
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import Vue from 'vue'
import ThemeToggle from '~/components/Layout/ThemeToggle.vue'
import NoisyCanvas from '~/components/UI/NoisyCanvas.vue'
export default Vue.extend({
  components: {
    ThemeToggle,
    NoisyCanvas,
  },
  data() {
    return {
      links: [
        { link: '/', title: 'Home' },
        { link: '/catalogue', title: 'Catalogue' },
      ],
    }
  },
  computed: {
    currentUrl() {
      return this.$route.path
    },
  },
})
</script>

<style lang="scss" scoped></style>
