<template>
  <div class="account-setting-page">
    <h1>Account Setting Screen</h1>
    <a-select
      class="account-setting__select-role"
      @change="onSelect"
      v-model:value="currentRole"
    >
      <a-select-option :value="UserType.TenantAdmin"
        >Tenant Admin</a-select-option
      >
      <a-select-option :value="UserType.CollectionBaseAdmin"
        >Collection Base Admin</a-select-option
      >
      <a-select-option :value="UserType.PartnerAdmin"
        >Partner Admin</a-select-option
      >
      <a-select-option :value="UserType.SystemAdmin"
        >System Admin</a-select-option
      >
      <a-select-option :value="UserType.DischargerCustomer"
        >Discharger Customer</a-select-option
      >
    </a-select>
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

//#region props
//#endregion

//#region variables
const currentRole = ref<UserType>(UserType.TenantAdmin);
//#endregion

//#region hooks
currentRole.value = (service.localStorage.getItem("USER_TYPE_KEY") ||
  UserType.TenantAdmin) as UserType;
//#endregion

//#region function
const onSelect = (value: string): void => {
  service.localStorage.setItem("USER_TYPE_KEY", value);
  location.replace(import.meta.env.BASE_URL);
};
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
