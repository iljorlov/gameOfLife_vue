<template>
  <div
    class="absolute max-w-[1280px] mx-auto inset-0 h-full pointer-events-none"
  >
    <div class="relative h-full w-full">
      <div
        :style="{ height: `${height}px` }"
        class="w-full sticky top-0 flex items-end overflow-y-hidden"
      >
        <div
          id="controls-container"
          :class="`h-28 sm:h-32 relative border-2 border-transparent dark:border-gray-600 transition-colors  w-full lg:px-8 bg-gray-800 ${
            showMobileMenu ? '' : 'rounded-t-lg delay-200'
          }  xl:rounded-lg xl:mb-2 shadow-lg pointer-events-auto`"
        >
          <button
            class="bg-gray-800 transition-colors hover:bg-gray-900 text-sm border-2 border-b-transparent border-gray-600 text-white rounded-t-lg h-8 w-12 absolute -top-[34px] left-1 flex items-center justify-center"
            @click="scrollUp"
          >
            Up
          </button>
          <div
            :style="{
              transform: `translateY(-${
                showMobileMenu ? mobileMenuHeightPx : 0
              }px)`,
            }"
            class="h-96 lg:hidden lg:pointer-events-none transition-all duration-500 w-full max-w-[384px] top-0 right-0 -z-50 absolute"
          >
            <div
              class="relative w-full h-full bg-gray-800 border-2 border-transparent dark:border-gray-600 rounded-tl-lg"
            >
              <div
                :class="` h-full transition-opacity w-full p-6 text-white ${
                  showMobileMenu ? 'opacity-100' : 'opacity-0'
                }`"
              >
                <div class="px-5 w-full mb-10"><SpeedControls /></div>
                <div class="px-5 w-full"><CellSizeControls /></div>
              </div>
              <button
                class="bg-gray-800 border-2 border-transparent border-b-transparent dark:border-b-transparent dark:border-gray-600 text-white rounded-t-lg h-8 w-12 absolute -top-[32px] -right-[2px] flex items-center justify-center"
                @click="toggleMobileMenu"
              >
                <CogIcon
                  class="transition-transform"
                  :style="{
                    transform: `rotateZ(${showMobileMenu ? 360 : 0}deg)`,
                  }"
                />
              </button>
            </div>
          </div>

          <GameControls class="z-10" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GameControls from './GameControls.vue'
import SpeedControls from '~/components/GOL/GameControls/ControlsComponents/SpeedControls.vue'
import CellSizeControls from '~/components/GOL/GameControls/ControlsComponents/CellSizeControls.vue'
import CogIcon from '~/components/UI/Icons/CogIcon.vue'
export default Vue.extend({
  components: {
    GameControls,
    CogIcon,
    SpeedControls,
    CellSizeControls,
  },
  data() {
    return {
      height: 0,
      showMobileMenu: false,
      mobileMenuHeightPx: 384,
    }
  },
  mounted() {
    window.addEventListener('resize', (e) => this.handleResize(e))
    this.height = window.innerHeight
  },
  destroyed() {
    window.removeEventListener('resize', (e) => this.handleResize(e))
  },

  methods: {
    handleResize(e: UIEvent) {
      this.height = window.innerHeight
      if (e.view?.innerWidth && e.view?.innerWidth > 768) {
        this.showMobileMenu = false
      }
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu
    },
    scrollUp() {
      window.scroll({ top: 0, behavior: 'smooth' })
    },
  },
})
</script>

<style scoped>
.btn-container {
  display: inline-block;
  position: relative;
  height: 1em;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
