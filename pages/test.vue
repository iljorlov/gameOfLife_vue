<template>
  <div><button @click="toggleGreet">click</button></div>
</template>

<script>
export default {
  data() {
    return {
      grid: [],
    }
  },
  methods: {
    toggleGreet() {
      import('../src/pkg/gol_wasm').then(({ Game }) => {
        const game = new Game()
        console.log(game.get_board())
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
