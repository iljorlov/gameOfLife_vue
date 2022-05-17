<template>
  <div><GridCanvas /></div>
</template>

<script lang="ts">
import Vue from 'vue'
import GridCanvas from '../components/GOL/GridCanvas.vue'

export default Vue.extend({
  name: 'IndexPage',
  components: {
    GridCanvas,
  },
})
</script>
