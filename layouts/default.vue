<template>
  <div
    class="max-w-[1280px] mx-auto min-h-[100vh] h-full flex flex-col justify-between"
  >
    <HeaderLayout />
    <Nuxt />
    <FooterLayout />
  </div>
</template>

<script>
import HeaderLayout from '../components/Layout/HeaderLayout'
import FooterLayout from '../components/Layout/FooterLayout'
export default {
  components: {
    HeaderLayout,
    FooterLayout,
  },
}
</script>
