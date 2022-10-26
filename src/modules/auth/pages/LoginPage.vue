<template>
  <a-row type="flex" justify="center" align="middle" class="login-container">
    <a-col class="login-form">
      <a-row type="flex" justify="center" align="middle" class="login-logo">
        <img src="@/assets/images/im_ecomit_logo.svg" />
      </a-row>
      <a-row class="login-input" type="flex" justify="center" align="middle">
        <a-col>
          <a-form
            :model="dynamicValidateForm"
            name="basic"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
          >
            <CustomForm
              :formData="dynamicValidateForm.formData"
              @change="handleOnChange"
              @onBlur="handleOnBlur"
              @onFocus="handleOnFocus"
            >
            </CustomForm>
            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                class="btn-login"
                :disabled="!isValidated"
                :loading="isLoading"
              >
                {{ $t("login_btn_submit") }}
              </a-button>
            </a-form-item>
          </a-form>
        </a-col>
        <span @click="redirectToForgotPasswordPage" class="forgot-password">{{
          $t("login_forgot_password")
        }}</span>
      </a-row>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
//#region import

import Ic_pass from "@/assets/icons/IcPass.vue";
import Ic_user from "@/assets/icons/IcUser.vue";
import { i18n } from "@/i18n";
import validator from "@/modules/base/components/validator/validator";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { localStorageKeys } from "@/services/local-storage-keys";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool
} from "amazon-cognito-identity-js";
import { message } from "ant-design-vue";
import { inject, reactive, ref, watch } from "vue";
import Ic_view from "../../../assets/icons/IcView.vue";
import CustomForm from "../../base/components/CustomForm.vue";

//#endregion

//#region props
//#endregion

//#region variables
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
const isValidated = ref<boolean>(false);
const isLoading = ref<boolean>(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicValidateForm = reactive<{ formData: any[] }>({
  formData: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "login_enter_email",
      label: "login_email_address",
      icon: Ic_user,
      iconColor: "#999999",
      name: "email",
      disabled: false,
      required: false,
      key: 1,
      isFocus: false,
      rules: [
        {
          trigger: ["blur", "change"],
          message: i18n.global.t("forgot_password_msg_err_email_required")
        },
        { validator: validator.validateEmail, trigger: ["blur", "change"] }
      ]
    },
    {
      inputType: "AInputPassword",
      value: "",
      placeHolder: "login_enter_password",
      label: "login_password",
      icon: Ic_pass,
      iconColor: "#999999",
      suffixIcon: Ic_view,
      name: "password",
      disabled: false,
      required: false,
      key: 2,
      isFocus: false
    }
  ]
});
//#endregion

//#region hooks
//#endregion

//#region function
const onFinish = (): void => {
  handleLogin();
};

const handleOnChange = (value: string, index: number): void => {
  if ((value || "").length) {
    dynamicValidateForm.formData[index].iconColor = "#07a0b8";
  } else {
    dynamicValidateForm.formData[index].iconColor = "#999999";
  }
};
const handleOnBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  index = Number(index);
  dynamicValidateForm.formData[index].isFocus = false;
  if (!dynamicValidateForm.formData[index].value) {
    dynamicValidateForm.formData[index].iconColor = "#999999";
  }
};

const handleOnFocus = (index: number | boolean | Event): void => {
  index = Number(index);
  dynamicValidateForm.formData[index].isFocus = true;
  if (dynamicValidateForm.formData[index].value) {
    dynamicValidateForm.formData[index].iconColor = "#07a0b8";
  }
};
const onFinishFailed = (): void => {
  message.error("Error");
};

const handleLogin = async (): Promise<void> => {
  const poolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID
  };

  const userPool = new CognitoUserPool(poolData);

  const authenticationDetails = new AuthenticationDetails({
    Username: dynamicValidateForm.formData[0]?.value,
    Password: dynamicValidateForm.formData[1]?.value
  });

  const cognitoUser = new CognitoUser({
    Username: dynamicValidateForm.formData[0]?.value,
    Pool: userPool
  });

  isLoading.value = true;
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (rs) => {
      isLoading.value = false;
      service.localStorage.setAccessToken(rs.getIdToken().getJwtToken());
      service.localStorage.setItem(
        localStorageKeys.refreshToken,
        rs.getRefreshToken().getToken()
      );
      onLoginSuccessfully();
    },
    onFailure: (_err) => {
      isLoading.value = false;
      messenger({
        title: "login_fail_to_login",
        message: "",
        type: MessengerType.Error
      });
    }
  });
};
const redirectToForgotPasswordPage = (): void => {
  router.push({ name: routeNames.forgotPassword });
};
const onLoginSuccessfully = async (): Promise<void> => {
  const userInfo = await service.auth.getCurrentUserInformation();
  if (userInfo) {
    router.push({ name: routeNames.collectionBusiness });
  }
};

const isValidateEmail = (): boolean => {
  const regExpEmail =
    // eslint-disable-next-line no-control-regex, no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@([a-z]{1})((?=.*[a-z|_])(?=.*[.])(?!.*\.\.)(?!.*\_\_)(?!.*\.\_)(?!.*\_\.)(?!.*\s).{1,61})([a-z]{1})$/;
  return regExpEmail.test(dynamicValidateForm.formData[0].value);
};
//#endregion

//#region computed
//#endregion

//#region reactive
watch(
  dynamicValidateForm,
  () => {
    if (
      dynamicValidateForm.formData[0].value &&
      dynamicValidateForm.formData[1].value &&
      isValidateEmail()
    ) {
      isValidated.value = true;
    } else {
      isValidated.value = false;
    }
  },
  { deep: true }
);
//#endregion
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;

  .login-form {
    width: 420px;

    background-color: $white;
    border-radius: 20px;
  }

  .login-logo {
    margin: 30px 0;
  }

  .input-item {
    width: 360px;
    height: 60px;
    border: 1px solid $grey-1;
    outline: none;
    border-radius: 10px;
    padding: 0px 12px 0px 12px;
    background: $grey-2;
  }

  .btn-login {
    width: 360px;
    height: 48px;
    font-family: "Roboto" !important;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 100%;
  }

  .btn-login:disabled {
    background-color: $neutral-200;
    color: $white;
  }

  .forgot-password {
    margin-bottom: 30px;
    font-family: "Roboto";
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    color: $primary;
    cursor: pointer;
  }

  .forgot-password:hover {
    text-decoration: underline;
  }

  .form-icon {
    width: 20px;
    height: 20px;
  }
}

:deep() {
  .ant-input {
    background: transparent;
  }

  .ant-input:placeholder-shown {
    margin-left: 10px;
  }

  .ant-form-item-explain-error {
    margin-top: 8px;
  }
  .ant-form-item {
    margin-bottom: 25px;
  }

  .ant-btn span {
    font-family: "Roboto";
  }
}
</style>
<style lang="scss">
.login-container {
  .ant-input-prefix {
    margin-right: 12px;
  }
}
</style>
