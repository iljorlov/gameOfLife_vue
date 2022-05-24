<template>
  <div
    class="mx-auto min-h-[100vh] h-full flex flex-col justify-between bg-gray-50 dark:bg-gray-900"
  >
    <div class="relative">
      <NotificationsContainer />
      <HeaderLayout />
      <div class="max-w-[1280px] h-full w-full mx-auto px-4"><Nuxt /></div>
    </div>
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
