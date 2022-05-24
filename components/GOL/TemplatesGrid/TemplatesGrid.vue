<template>
  <div>
    <H2Header :title="`Templates`">
      <div
        @click="toggleGridMode"
        class="h-full overflow-clip relative w-24 shrink-0 cursor-pointer bg-gray-200 rounded-lg flex justify-between"
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
    </H2Header>
    <div
      :class="`grid ${
        gridCompact
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-6 gap-x-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8'
      } mt-12 pb-80`"
    >
      <GridItem
        v-for="pattern in patternList"
        :key="pattern.details.name"
        :pattern="pattern"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { patternList } from '~/patterns/patterns'
import GridItem from '~/components/GOL/TemplatesGrid/GridItem.vue'
import H2Header from '~/components/UI/H2Header.vue'
import GridIcon from '~/components/UI/Icons/GridIcon.vue'
export default Vue.extend({
  components: {
    GridItem,
    H2Header,
    GridIcon,
  },
  computed: {
    ...mapState({
      gridCompact: (state) => state.gridCompact,
    }),
  },
  data() {
    return {
      patternList,
    }
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
