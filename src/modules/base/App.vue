<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ScreenLayout } from "@/routes/screen-layouts";
import { computed } from "vue";
import { useRoute } from "vue-router";
import NotifyModal from "./components/NotifyModal.vue";
document.title = import.meta.env.VITE_APP_NAME;
const $route = useRoute();
const layout = computed(
  () => $route.meta.layout || ScreenLayout.DEFAULT_LAYOUT
);
</script>

<template>
  <div class="app-layout-base">
    <component :is="layout">
      <router-view :key="$route.path" />
    </component>
    <notify-modal></notify-modal>
  </div>
</template>

<style scoped lang="scss">
.app-layout-base {
  width: 100vw;
  height: 100vh;
}
</style>
