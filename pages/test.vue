<template>
  <div>
    <div v-if="process.env.NODE_ENV === 'dev'">
      <button @click="toggleGreet">click</button>
    </div>
    <WipPage v-else />
  </div>
</template>

<script lang="ts">
import WipPage from '~/components/WipPage/WipPage.vue'
export default {
  name: 'TestPage',
  components: {
    WipPage,
  },
  data() {
    return {
      grid: [],
    }
  },
  methods: {
    toggleGreet() {
      // import('../src/pkg/gol_wasm').then(({ Game }) => {
      //   const game = new Game()
      //   console.log(game.get_board())
      // })
    },
  },
}
</script>

<style lang="scss" scoped></style>
