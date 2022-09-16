<template>
  <ForgotPasswordForm v-if="activeForgotPasswordForm" @handle-confirm="onHandleConfirm" :is-loading="isLoading" />
  <SetNewPasswordForm v-else :email="email" :is-loading="isLoading" @submit="onSetNewPassword"
    @resend="onHandleConfirm(email)" />
</template>

<script setup lang="ts">
//#region import
import ForgotPasswordForm from "@/modules/auth/components/ForgotPasswordForm.vue";
import { inject, ref } from "vue";
import SetNewPasswordForm from "../components/SetNewPasswordForm.vue";

import { routeNames, router } from "@/routes";
import {
  CognitoUser, CognitoUserPool
} from "amazon-cognito-identity-js";
import { Emitter, EventType } from "mitt";
import { message } from "ant-design-vue";
import { i18n } from "@/i18n";
//#endregion

//#region props
//#endregion

//#region variables
const emitter: Emitter<Record<EventType, unknown>> | undefined = inject("emitter");
const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID
};
const userPool = new CognitoUserPool(poolData);

const activeForgotPasswordForm = ref<boolean>(true);
const email = ref<string>("");
const isLoading = ref<boolean>(false);
//#endregion

//#region hooks
//#endregion

//#region function
const onHandleConfirm = (value: string): void => {
  isLoading.value = true;
  email.value = value;
  const cognitoUser = new CognitoUser({
    Username: value,
    Pool: userPool
  });
  cognitoUser.forgotPassword({
    onSuccess: (data): void => {
      isLoading.value = false;
      if (!data) {
        return;
      }
      activeForgotPasswordForm.value = false;
    },
    onFailure: (err): void => {
      err;
      isLoading.value = false;
    }
  });
};

const onSetNewPassword = (data: { code: string, password: string }): void => {
  isLoading.value = true;
  const { code, password } = data
  const cognitoUser = new CognitoUser({
    Username: email.value,
    Pool: userPool
  });
  cognitoUser.confirmPassword(code, password, {
    onSuccess: (data): void => {
      if (!data) {
        return;
      }
      isLoading.value = false;
      message.success(i18n.global.t('forgot_password_message_reset_successfully'))
      router.push({ name: routeNames.routeNames.login })
    },
    onFailure: (err): void => {
      err
      isLoading.value = false;
      const error = {
        icon: "../../../assets/icons/ic_error.png",
        title: "forgot_password_error_popup_lbl_title",
        message: "forgot_password_error_popup_lbl_message"
      };
      emitter?.emit('ShowModal', error)
    },
  })
}
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>

</style>
