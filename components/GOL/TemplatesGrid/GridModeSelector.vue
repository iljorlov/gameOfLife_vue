<template>
  <div
    class="h-full overflow-clip relative w-24 shrink-0 cursor-pointer bg-gray-200 rounded-lg flex justify-between"
    @click="toggleGridMode"
  >
    <div :class="`h-10 w-12  flex justify-center items-center`">
      <div
        :class="`h-6  w-6 ${
          gridCompact ? 'bg-gray-300' : 'bg-gray-400'
        } rounded-md`"
      />
    </div>
    <div
      :style="{ transform: `translateX(${gridCompact ? '48' : '0'}px) ` }"
      class="absolute transition-all ease-in-out h-10 w-12 bg-slate-400/30"
    />
    <div
      :class="`h-10 w-12 flex  ${
        gridCompact ? 'text-gray-400' : 'text-gray-300'
      } justify-center items-center`"
    >
      <GridIcon class="h-8 w-8" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/store/index'
import GridIcon from '~/components/UI/Icons/GridIcon.vue'
export default Vue.extend({
  components: {
    GridIcon,
  },
  computed: {
    ...mapState({
      gridCompact: (state) => (state as RootState).gridCompact,
    }),
  },

  methods: {
    toggleGridMode() {
      if (this.gridCompact) {
        this.$store.commit('setGridCompactOff')
      } else {
        this.$store.commit('setGridCompactOn')
      }
    },
  },
})
</script>

<style lang="scss" scoped></style>
