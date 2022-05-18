<template>
  <div class="mx-auto min-h-[100vh] h-full flex flex-col justify-between">
    <HeaderLayout />
    <div class="max-w-[1280px] mx-auto"><Nuxt /></div>
    <NotificationsContainer />
    <FooterLayout />
  </div>
</template>

<script>
import HeaderLayout from '../components/Layout/HeaderLayout'
import FooterLayout from '../components/Layout/FooterLayout'
import NotificationsContainer from '../components/Layout/Notifications/NotificationsContainer.vue'
export default {
  components: {
    HeaderLayout,
    FooterLayout,
    NotificationsContainer,
  },
}
</script>

<style>
html {
  background: #eeeeee;
}
</style>
