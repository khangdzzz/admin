<template>
  <a-row type="flex" justify="center" align="middle" class="login-container">
    <a-col class="login-form">
      <a-row type="flex" justify="center" align="middle" class="login-logo">
        <img src="@/assets/images/im_ecomit_logo.svg" />
      </a-row>
      <a-row class="login-input" type="flex" justify="center" align="middle">
        <a-col>
          <a-form
            :model="formState"
            name="basic"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
          >
            <a-form-item>
              <a-input
                v-model:value="formState.username"
                :placeholder="$t('login_enter_email')"
                class="input-item"
              >
                <template #prefix>
                  <img src="@/assets/icons/ic_user.png" class="form-icon" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input-password
                v-model:value="formState.password"
                :placeholder="$t('login_enter_password')"
                class="input-item"
                ><template #prefix>
                  <img src="@/assets/icons/ic_password.png" class="form-icon" />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" class="btn-login" @click="login">{{
                $t("login_btn_submit")
              }}</a-button>
            </a-form-item>
          </a-form>
        </a-col>
        <span class="forgot-password">{{ $t("login_forgot_password") }}</span>
      </a-row>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
//#region import
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { reactive } from "vue";
//#endregion

//#region props
//#endregion

//#region variables
const formState = reactive({
  username: "",
  password: ""
});
//#endregion

//#region hooks

//#endregion

//#region function
const onFinish = (): void => {};

const onFinishFailed = (): void => {};
const login = (): void => {
  service.localStorage.setAccessToken("Nghia");
  router.push({ name: routeNames.home });
};
//#endregion

//#region computed
//#endregion

//#region reactive
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
  }
  .forgot-password {
    margin-bottom: 30px;
    color: $primary;
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
  .ant-form-item {
    margin-bottom: 25px;
  }
}
</style>
