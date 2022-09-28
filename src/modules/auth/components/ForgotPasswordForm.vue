<template>
  <div class="fgpw-form flex-column">
    <h3 class="fgpw-form__title">
      {{ $t("forgot_password_text_forgot_password") }}
    </h3>
    <ImMainForgotPassword class="fgpw-form__main-img" />
    <a-form
      :model="formState"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off">
      <a-form-item
        class="field-email"
        name="email"
        :rules="[
          {
            required: true,
            message: $t('forgot_password_msg_err_email_required'),
            trigger: ['change', 'blur']
          },
          {
            validator: validator.validateEmail,
            trigger: ['change', 'blur']
          }
        ]">
        <a-input
          class="fgpw-form__input-email"
          v-model:value.trim="formState.email"
          @focus="onFocusInputEmail"
          @blur="onBlurInputEmail">
          <template #prefix>
            <IcUser class="mr-3 fgpw-icon-input" :color="getIconUserColor" />
          </template>
        </a-input>
        <label :class="['label', isFocus && 'as-label', 'has-icon']"
          >{{
            isFocus
              ? $t("forgot_password_email_address")
              : $t("forgot_password_text_enter_email_address")
          }}
        </label>
      </a-form-item>
      <div class="fgpw-form__action-wrap">
        <a-button
          class="fgpw-form__action-wrap--cancel"
          @click="redirectToLogin"
          :disabled="isLoading">
          {{ $t("forgot_password_btn_cancel") }}
        </a-button>
        <a-button
          :disabled="!emailIsValid || isLoading"
          :class="[
            'fgpw-form__action-wrap--confirm',
            emailIsValid ? 'active-btn' : ''
          ]"
          @click="$emit('handleConfirm', formState.email)"
          :loading="isLoading">
          {{ $t("forgot_password_btn_confirm") }}
        </a-button>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
//#region import
import IcUser from "@/assets/icons/IcUser.vue";
import ImMainForgotPassword from "@/assets/images/ImMainForgotPassword.vue";
import validator from "@/modules/base/components/validator/validator";
import { routeNames } from "@/routes/route-names";
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

//#endregion

//#region props
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
});
//#endregion
interface FormState {
  email: string;
}
//#region variables
const formState = reactive<FormState>({
  email: ""
});
// const email = ref<string>("");
const emailIsChange = ref<boolean>(false);
const emailIsValid = ref<boolean>(false);
const router = useRouter();
const isFocus = ref<boolean>(false);
watch(formState, () => {
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
  if (formState.email) {
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
    // eslint-disable-next-line no-control-regex, no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@([a-z]{1})((?=.*[a-z|_])(?=.*[.])(?!.*\.\.)(?!.*\_\_)(?!.*\.\_)(?!.*\_\.)(?!.*\s).{1,61})([a-z]{1})$/;
  emailIsChange.value = true;
  if (regExpEmail.test(formState.email)) {
    emailIsValid.value = true;
  } else {
    emailIsValid.value = false;
  }
};
//#endregion

//#region computed
const getIconUserColor = computed((): string => {
  return formState.email ? "#07A0B8" : "#999999";
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
    color: $neutral-600;
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
    margin-bottom: 10px;
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
    left: 12px;
    top: 22px;
    transition: 0.2s ease all;
    z-index: 1000;
    color: #999999;
    font-weight: 400;
    font-size: 16px !important;
    line-height: 100%;
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
    padding: 20px 0px 0px 0px !important;
    height: 50px;
    position: relative !important;
    top: 0px !important;
  }

  .fgpw-icon-input {
    margin-right: 12px;
  }

  .ant-input-prefix {
    margin-right: 0;
  }

  .ant-input-affix-wrapper {
    margin-bottom: 8px;
  }

  .ant-input-affix-wrapper > input.ant-input {
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

  .field-email .ant-form-item-control-input {
    width: 360px !important;
  }

  .ant-form-item-explain.ant-form-item-explain-connected {
    min-height: 14px;
  }

  .ant-form-item-explain.ant-form-item-explain-connected
    .ant-form-item-explain-error {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: $red-500;
  }

  .ant-form-item-has-error
    :not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper {
    border: 1px solid $red-500;
  }
}
</style>
