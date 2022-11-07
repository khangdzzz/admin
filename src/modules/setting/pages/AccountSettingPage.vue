<template>
  <div class="account-setting-page">
    <h1>Account Setting Screen</h1>
    <ChangeLanguage></ChangeLanguage>
  </div>
</template>

<script setup lang="ts">
//#region import
//#endregion

import { UserType } from "@/modules/base/models/user-type.enum";
import { service } from "@/services";
import { ref } from "vue";
import ChangeLanguage from "@/modules/base/components/ChangeLanguage.vue";
import { localStorageKeys } from "@/services/local-storage-keys";

//#region props
//#endregion

//#region variables
const currentRole = ref<UserType>(UserType.TenantAdmin);
//#endregion

//#region hooks
currentRole.value = (service.localStorage.getItem(localStorageKeys.userType) ||
  UserType.TenantAdmin) as UserType;
//#endregion

//#region function
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.account-setting__select-role {
  width: 200px;
}
</style>
