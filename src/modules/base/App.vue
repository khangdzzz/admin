<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { computed } from "vue";
import { useRoute } from "vue-router";
import NotifyModal from "./components/NotifyModal.vue";
document.title = import.meta.env.VITE_APP_NAME;
const $route = useRoute();
const layout = computed(() => $route.meta.layout || undefined);
</script>

<template>
  <div class="app-layout-base" v-if="layout">
    <a-config-provider :auto-insert-space-in-button="false">
      <suspense>
        <component :is="layout" v0>
          <router-view :key="$route.path" />
        </component>
      </suspense>
      <notify-modal></notify-modal>
    </a-config-provider>
  </div>
</template>

<style scoped lang="scss">
.app-layout-base {
  width: 100vw;
  height: 100vh;
}
</style>
