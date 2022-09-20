<template>
  <ForgotPasswordForm
    v-if="activeForgotPasswordForm"
    @handle-confirm="onHandleConfirm"
    :is-loading="isLoading"
  />
  <SetNewPasswordForm
    v-else
    :email="email"
    :is-loading="isLoading"
    @submit="onSetNewPassword"
    @resend="onHandleConfirm(email)"
  />
</template>

<script setup lang="ts">
//#region import
import ForgotPasswordForm from "@/modules/auth/components/ForgotPasswordForm.vue";
import { inject, ref } from "vue";
import SetNewPasswordForm from "../components/SetNewPasswordForm.vue";

import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { routeNames, router } from "@/routes";
import {
  CognitoUser, CognitoUserPool
} from "amazon-cognito-identity-js";
//#endregion

//#region props
//#endregion

//#region variables
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const messenger: (title: string, message: string, type: MessengerType, callback: (() => void) | undefined) => void = inject("messenger")!;
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

const onSetNewPassword = (data: { code: string; password: string }): void => {
  isLoading.value = true;
  const { code, password } = data;
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
      messenger("forgot_password_reset_successfully_lbl_title", "forgot_password_reset_successfully_lbl_message", MessengerType.Success, () => {
        router.push({ name: routeNames.routeNames.login })
      })
    },
    onFailure: (err): void => {
      err;
      isLoading.value = false;
      messenger("forgot_password_error_popup_lbl_title", "forgot_password_error_popup_lbl_message", MessengerType.Error, undefined)
    },
  })
}
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped></style>
