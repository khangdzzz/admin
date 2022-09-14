<script setup lang="ts">
import ChangeLanguage from "@/modules/base/components/ChangeLanguage.vue";
//#region import
//#endregion

//#region props
//#endregion

//#region variables
//#endregion

//#region computed

//#endregion
</script>
<template>
  <div class="auth-layout">
    <change-language></change-language>
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.auth-layout {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/im_login_background.png");
  background-size: cover;
}
</style>
