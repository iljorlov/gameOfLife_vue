<template>
  <div>
    <H2Header :title="`Templates`"><GridModeSelector /></H2Header>

    <Transition name="fade" mode="out-in" appear="true">
      <div
        v-if="gridCompact"
        key="grid-compact"
        :class="`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-6 gap-x-4 mt-12 pb-80`"
      >
        <GridItemSmall
          v-for="pattern in patternList"
          :key="`${pattern.details.name}-grid-item-small`"
          :pattern="pattern"
        />
      </div>

      <div
        v-if="!gridCompact"
        key="grid-large"
        :class="`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 mt-12 pb-80`"
      >
        <GridItemLarge
          v-for="pattern in patternList"
          :key="`${pattern.details.name}-grid-item-large`"
          :pattern="pattern"
        />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { patternList } from '~/patterns/patterns'
import GridItemLarge from '~/components/GOL/TemplatesGrid/GridItemLarge.vue'
import GridItemSmall from '~/components/GOL/TemplatesGrid/GridItemSmall.vue'
import GridModeSelector from '~/components/GOL/TemplatesGrid/GridModeSelector.vue'
import H2Header from '~/components/UI/H2Header.vue'
import { RootState } from '~/store'
export default Vue.extend({
  components: {
    GridItemLarge,
    GridItemSmall,
    GridModeSelector,
    H2Header,
  },
  data() {
    return {
      patternList,
    }
  },
  computed: {
    ...mapState({
      gridCompact: (state) => (state as RootState).gridCompact,
    }),
  },

  methods: {},
})
</script>

<style lang="scss" scoped>
.fade-enter-active {
  opacity: 1;

  transition: all 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
.fade-enter {
  opacity: 0 !important;
  transform: scale(0.99) translateY(10px) !important;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.99) translateY(10px);
}
</style>
