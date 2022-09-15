<template>
  <ForgotPasswordForm
    v-if="activeForgotPasswordForm"
    @handle-confirm="onHandleConfirm"
  />
  <SetNewPasswordForm v-else :email="email" />
</template>

<script setup lang="ts">
import ForgotPasswordForm from "@/modules/auth/components/ForgotPasswordForm.vue";
import SetNewPasswordForm from "../components/SetNewPasswordForm.vue";
//#region import
import { ref } from "vue";
//#endregion

//#region props
//#endregion

//#region variables
const activeForgotPasswordForm = ref<boolean>(true);
const email = ref<string>("");
//#endregion

//#region hooks
//#endregion

//#region function
const onHandleConfirm = (value: string): void => {
  email.value = value;
  activeForgotPasswordForm.value = false;
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped></style>
