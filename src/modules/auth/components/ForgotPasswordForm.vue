<template>
  <div class="fgpw-form flex-column">
    <h3 class="fgpw-form__title">
      {{ $t("forgot_password_text_forgot_password") }}
    </h3>
    <ImMainForgotPassword class="fgpw-form__main-img" />
    <a-form-item>
      <a-input class="fgpw-form__input-email" v-model:value="email" @focus="onFocusInputEmail" @blur="onBlurInputEmail">
        <template #prefix>
          <IcUser class="mr-3 fgpw-icon-input" :color="getIconUserColor" />
        </template>
      </a-input>
      <label :class="['label', isFocus && 'as-label', 'has-icon']">{{
      isFocus
      ? $t("forgot_password_email_address")
      : $t("forgot_password_text_enter_email_address")
      }}
      </label>
    </a-form-item>
    <div class="fgpw-form__action-wrap">
      <a-button class="fgpw-form__action-wrap--cancel" @click="redirectToLogin" :disabled="isLoading">
        {{ $t("forgot_password_btn_cancel") }}
      </a-button>
      <a-button :disabled="!emailIsValid || isLoading" :class="[
        'fgpw-form__action-wrap--confirm',
        emailIsValid ? 'active-btn' : ''
      ]" @click="$emit('handleConfirm', email)" :loading="isLoading">
        {{ $t("forgot_password_btn_confirm") }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
//#region import
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/routes/route-names";
import IcUser from "@/assets/icons/IcUser.vue";
import ImMainForgotPassword from "@/assets/images/ImMainForgotPassword.vue";

//#endregion

//#region props
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
});
//#endregion

//#region variables
const email = ref<string>("");
const emailIsChange = ref<boolean>(false);
const emailIsValid = ref<boolean>(false);
const router = useRouter();
const isFocus = ref<boolean>(false);
watch(email, () => {
  onEmailChange();
});
//#endregion

//#region hooks
//#endregion

//#region function
const onFocusInputEmail = (): void => {
  isFocus.value = true;
};
const onBlurInputEmail = (): void => {
  if (email.value) {
    isFocus.value = true;
  } else {
    isFocus.value = false;
  }
};
const redirectToLogin = (): void => {
  router.push({ name: routeNames.login });
};
const onEmailChange = (): void => {
  const regExpEmail =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  emailIsChange.value = true;
  if (regExpEmail.test(email.value)) {
    emailIsValid.value = true;
  } else {
    emailIsValid.value = false;
  }
};
//#endregion

//#region computed
const getIconUserColor = computed((): string => {
  return email.value ? "#07A0B8" : "#999999";
});

//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.fgpw-form {
  font-family: "Roboto" !important;
  font-style: normal;
  width: 420px;
  height: auto;
  margin: auto;
  padding: 30px;
  background-color: $neutral-0;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 20px;

  &__title {
    text-align: center;
    font-weight: 600;
    font-size: 22px;
    line-height: 28px;
    font-family: "Roboto" !important;
  }

  &__action-wrap {
    display: flex;
    flex-direction: row;
    text-align: center;
    font-weight: 600;
    font-size: 18px;
    line-height: 100%;
    justify-content: space-between;

    &--cancel,
    &--confirm {
      width: 175px !important;
      height: 48px !important;
      height: 18px;
      font-family: "Roboto";
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 100%;
      padding: 15px;
    }

    &--cancel {
      color: $primary-400;
      border-color: $primary-400;
    }
  }

  &__input-email {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    padding: 22px 12px;
    height: 60px;
    background: $neutral-50;
    border: 1px solid $neutral-100;
    border-radius: 10px;
    font-family: "Roboto";
  }

  &__main-img {
    display: block;
    margin: auto;
    width: 140px;
    height: 140px;
    margin-top: 25px;
    margin-bottom: 25px;
  }

  .float-label {
    position: relative;
  }

  .label {
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: 46px;
    top: 20px;
    transition: 0.2s ease all;
    z-index: 1000;
    color: #999999;
  }

  .as-label {
    top: 10px;
    font-size: 14px !important;
  }

  .has-icon {
    left: 44px !important;
  }
}

:deep() {
  .ant-input {
    background: transparent;
    font-size: 16px;
    height: 20px;
    line-height: 100%;
    font-weight: 400;
    color: $neutral-800;
  }

  .fgpw-icon-input {
    margin-right: 12px;
  }

  .ant-input-prefix {
    margin-right: 0;
  }

  .ant-input-affix-wrapper>input.ant-input {
    top: 8px;
  }

  .ant-btn[disabled] {
    color: $neutral-0;
    background-color: $neutral-200;
    border-style: none;
    border-color: transparent;
  }

  .fgpw-form__action-wrap {
    margin-top: 25px;
  }

  .fgpw-form__action-wrap--confirm.active-btn {
    background: $primary;
    color: $neutral-0;
  }
}
</style>
