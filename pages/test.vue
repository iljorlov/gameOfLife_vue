<template>
  <div><button @click="handleClick">click</button></div>
</template>

<script>
import mergeTwoGrids from '~/utils/mergeTwoGrids'
export default {
  methods: {
    handleClick() {
      const myGrid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]
      mergeTwoGrids(myGrid, 16, 5)
    },
  },
}
</script>

<style lang="scss" scoped></style>
