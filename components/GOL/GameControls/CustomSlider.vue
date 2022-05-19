<template>
  <div
    :id="id"
    class="flex flex-col w-40 m-auto items-center h-fit justify-center"
  >
    <div class="w-full text-left mb-2">
      <label
        class="form-check-label inline-block text-white cursor-pointer"
        for="flexCheckDefault"
      >
        {{ labelText }}
      </label>
    </div>
    <div class="py-1 relative min-w-full">
      <div class="h-2 bg-gray-200 rounded-full">
        <div
          class="absolute h-2 rounded-full bg-teal-600 w-0"
          :style="`width: ${percentage}%`"
        ></div>
        <div
          class="absolute h-4 flex items-center justify-center w-4 rounded-full bg-white shadow border border-gray-300 -ml-2 top-0 cursor-pointer"
          :style="`left: ${percentage}%`"
          unselectable="on"
          onselectstart="return false;"
          @mousedown="handleMouseDown"
        >
          <div class="relative -mt-2 w-1">
            <div
              class="absolute z-40 opacity-100 bottom-100 mb-2 left-0 min-w-full"
              style="margin-left: -20.5px"
            >
              <div v-if="isDragging" class="relative shadow-md">
                <div
                  class="bg-black -mt-8 text-white truncate text-xs rounded py-1 px-4"
                >
                  {{ value + min }}
                </div>
                <svg
                  class="absolute text-black w-full h-2 left-0 top-100"
                  x="0px"
                  y="0px"
                  viewBox="0 0 255 255"
                  xml:space="preserve"
                >
                  <polygon
                    class="fill-current"
                    points="0,0 127.5,127.5 255,0"
                  ></polygon>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute text-white text-sm -ml-1 bottom-0 left-0 -mb-6">
          {{ min }}
        </div>
        <div class="absolute text-white text-sm -mr-1 bottom-0 right-0 -mb-6">
          {{ max }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import Vue from 'vue'
export default {
  props: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    labelText: {
      type: String,
      required: true,
    },
    initialValue: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      id: null,
      value: 0,
      isDragging: false,
      percentage: 0,
    }
  },

  watch: {
    isDragging() {
      if (this.isDragging) {
        document.addEventListener('mousemove', this.handleMouseMove)
      } else {
        document.removeEventListener('mousemove', this.handleMouseMove)
      }
    },
    percentage() {
      const newVal = Math.floor(((this.max - this.min) / 100) * this.percentage)
      this.value = newVal
      this.$emit('newValue', newVal + this.min)
    },
  },
  mounted() {
    this.id = this._uid
    this.value = this.initialValue
    this.percentage = ((this.min + this.max) / 100) * this.initialValue
    document.addEventListener('mouseup', this.handleMouseUp)
  },
  destroyed() {
    document.removeEventListener('mouseup', this.handleMouseUp)
  },
  methods: {
    handleMouseDown() {
      this.isDragging = true
    },
    handleMouseUp() {
      this.isDragging = false
    },
    handleMouseMove(e: MouseEvent) {
      const slider = document.getElementById(this.id)

      if (slider) {
        const xPos = e.x - slider.getBoundingClientRect().left
        const val = (xPos / slider.getBoundingClientRect().width) * 100
        if (val <= 0) {
          this.percentage = 0
        } else if (val >= 100) {
          this.percentage = 100
        } else {
          this.percentage = parseFloat(val.toFixed(1))
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
