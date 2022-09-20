<template>
  <div class="set-password-form flex-column">
    <h3 class="set-password-form__title">
      {{ $t("forgot_password_text_set_new_password") }}
    </h3>

    <a-form :model="formState" class="new-password-form">
      <a-form-item class="field-code" name="code" :rules="[
        {
          required: true,
          message: $t('forgot_password_msg_err_code_required'),
          trigger: ['change', 'blur']
        },
        {
          validator: validator.validateCode,
          trigger: ['change', 'blur']
        }
      ]">
        <p class="set-password-form__input-code-description">
          {{ $t("forgot_password_text_input_code_description") }}
        </p>
        <a-input :maxlength="6" class="set-password-form__input-code" v-model:value="formState.code"
          :placeholder="$t('forgot_password_text_enter_code')">
        </a-input>
      </a-form-item>
      <a-button type="text" :disabled="!activeResendCode" class="wrap-countdown" @click="resendCode"
        :class="activeResendCode" href="#">
        <a-row>
          <span class="set-password-form__input-code-resend-code">{{ $t("forgot_password_resend_code") }} (
          </span>
          <a-statistic-countdown class="set-password-form__input-code-countdown" :value="deadline.time" format="mm:ss"
            @finish="onFinishCountdown" />
          <span class="set-password-form__input-code-resend-code">)</span>
        </a-row>
      </a-button>
      <a-form-item name="password" :rules="[
        {
          required: true,
          message: $t('forgot_password_msg_err_password_required'),
          trigger: ['change', 'blur']
        },
        {
          validator: validator.validatePassword,
          trigger: ['change', 'blur']
        }
      ]">
        <a-input-password v-model:value="formState.password" class="set-password-form__input-password"
          :class="setColorIconInputPassword" @focus="onFocusInputPassword" @blur="onBlurInputPassword"><template
            #prefix>
            <IcPass class="form-icon form-icon-prefix" :color="setColorIconInputPassword ? '#07A0B8' : '#999999'">
            </IcPass>
          </template>
        </a-input-password>
        <label :class="['label', isFocusPassword && 'as-label', 'has-icon']">{{
        isFocusPassword
        ? $t("forgot_password_new_password")
        : $t("forgot_password_enter_new_pass")
        }}
        </label>
      </a-form-item>
      <a-form-item name="confirmPassword" :rules="[
        {
          required: true,
          message: $t('forgot_password_msg_err_confirm_password_required'),
          trigger: ['change', 'blur']
        },
        {
          validator: validator.validatePassword,
          trigger: ['change', 'blur']
        },
        {
          validator: validateConfirmPass,
          trigger: ['blur']
        }
      ]">
        <a-input-password v-model:value="formState.confirmPassword" class="set-password-form__input-confirm-password"
          :class="setColorIconInputConfirmPassword" @focus="onFocusInputConfirmPassword"
          @blur="onBlurInputConfirmPassword"><template #prefix>
            <IcPass class="form-icon form-icon-prefix"
              :color="setColorIconInputConfirmPassword ? '#07A0B8' : '#999999'"></IcPass>
          </template>
        </a-input-password>
        <label :class="['label', isFocusConfirmPassword && 'as-label', , 'has-icon']">{{
        isFocusConfirmPassword
        ? $t("forgot_password_confirm_new_password")
        : $t("forgot_password_enter_new_confirm_pass")
        }}
        </label>
      </a-form-item>
      <div class="set-password-form__action-wrap">
        <a-button class="set-password-form__action-wrap--cancel" :disabled="isLoading" @click="redirectToLogin">{{
        $t("forgot_password_btn_cancel") }}</a-button>
        <a-button :disabled="!activeSaveButtonStyle" :class="[
          'set-password-form__action-wrap--save',
          activeSaveButtonStyle
        ]" :loading="isLoading" @click="
          $emit('submit', {
            code: formState.code,
            password: formState.password
          })
        ">{{ $t("forgot_password_btn_save") }}</a-button>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
//#region import
import IcPass from "@/assets/icons/IcPass.vue";
import { i18n } from "@/i18n";
import validator from "@/modules/base/components/validator/validator";
import { routeNames } from "@/routes/route-names";
import { Rule } from "ant-design-vue/lib/form";
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

interface FormState {
  code: string;
  password: string;
  confirmPassword: string;
}
//#endregion

//#region props
defineProps({
  email: String,
  isLoading: {
    type: Boolean,
    default: false
  }
});
//#endregion
//#region emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "resend"): void;
  (e: "submit", data: { code: string; password: string }): void;
}>();
//#endregion

//#region variables
const formState: FormState = reactive({
  code: "",
  password: "",
  confirmPassword: ""
});
const deadline = reactive({
  time: Date.now() + 1000 * import.meta.env.VITE_TIME_RESEND_CODE
});
const router = useRouter();
const activeResendCode = ref<string>("");
const activeSaveButtonStyle = ref<string>("");
const isFocusPassword = ref<boolean>(false);
const isFocusConfirmPassword = ref<boolean>(false);

//#endregion

//#region hooks
//#endregion
//#region function
const validateConfirmPass = async (_rule: Rule, value: string): void => {
  if (value !== formState.password) {
    return Promise.reject(
      i18n.global.t("forgot_password_msg_err_password_not_match")
    );
  } else {
    return Promise.resolve();
  }
};
const onFocusInputPassword = (): void => {
  isFocusPassword.value = true;
};
const onFocusInputConfirmPassword = (): void => {
  isFocusConfirmPassword.value = true;
};
const onBlurInputPassword = (): void => {
  if (formState.password) {
    isFocusPassword.value = true;
  } else {
    isFocusPassword.value = false;
  }
};
const onBlurInputConfirmPassword = (): void => {
  if (formState.confirmPassword) {
    isFocusConfirmPassword.value = true;
  } else {
    isFocusConfirmPassword.value = false;
  }
};
const redirectToLogin = (): void => {
  router.push({ name: routeNames.login });
};
const onFinishCountdown = (): void => {
  activeResendCode.value = "active";
};
const resendCode = (): void => {
  emit("resend");
  activeResendCode.value = "";
  deadline.time = Date.now() + 1000 * import.meta.env.VITE_TIME_RESEND_CODE;
};
const activeSaveButton = (): void => {
  const regexCode = /^[\S]{6,32}$/i;
  if (
    regexCode.test(formState.code) &&
    formState.password == formState.confirmPassword &&
    formState.password
  ) {
    activeSaveButtonStyle.value = "active";
  } else {
    activeSaveButtonStyle.value = "";
  }
};
//#endregion
watch(formState, () => {
  activeSaveButton();
});
//#region computed
const setColorIconInputPassword = computed((): string => {
  return formState.password ? "active" : "";
});
const setColorIconInputConfirmPassword = computed((): string => {
  return formState.confirmPassword ? "active" : "";
});
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.set-password-form {
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
    margin-bottom: 25px;
    color: $neutral-600;
  }

  &__input-code-description {
    padding: 0 24px;
    font-family: "Roboto";
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    color: $neutral-400;
    margin-bottom: 10px;
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
    &--save {
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

  &__input-password,
  &__input-confirm-password,
  &__input-code {
    display: flex;
    align-items: center;
    padding: 22px 12px;
    height: 60px;
    background: $neutral-50;
    border: 1px solid $neutral-100;
    border-radius: 10px;
    font-family: "Roboto";
  }

  &__input-code {
    margin-bottom: 10px;
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
    font-size: 16px !important;
  }

  .as-label {
    top: 10px;
    font-size: 14px !important;
  }

  .has-icon {
    left: 44px !important;
  }

  .field-code {
    margin-bottom: 10px;
  }

  .wrap-countdown {
    display: flex;
    justify-content: center;
    height: 19px;
    line-height: 19px;
    padding: 0px;
    margin-bottom: 25px;
  }

  .ant-form-item-has-error.field-code .ant-input:hover,
  .ant-form-item-has-error.field-code .ant-input:focus {
    border: 1px solid $red-500 !important;
  }
}

:deep() {
  .ant-input {
    background: transparent;
    font-size: 16px;
    height: 16px;
    line-height: 100%;
    font-weight: 400;
    color: $neutral-800;
  }

  .ant-form-item {
    margin-bottom: 25px;
  }

  .form-icon-prefix {
    margin-right: 12px;
  }

  .ant-input-prefix {
    margin-right: 0;
  }

  .ant-btn[disabled] {
    color: $neutral-0;
    background-color: $neutral-200;
  }

  .set-password-form__action-wrap--save.active {
    background: $primary;
    color: $neutral-0;
  }

  .ant-input:focus,
  .ant-input:hover,
  .ant-input-focused {
    border-color: #2b9aab !important;
  }

  .ant-input.set-password-form__input-code {
    padding: 0px 8px 0px 12px;
    width: 360px;
    height: 60px;
    background: $neutral-50;
    border: 1px solid $neutral-100;
    border-radius: 10px;
    margin-bottom: 8px;
  }

  .ant-statistic-content,
  .set-password-form__input-code-resend-code {
    height: 19px;
    font-family: "Roboto";
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: $neutral-400;
  }

  .wrap-countdown.active .ant-statistic-content,
  .wrap-countdown.active .set-password-form__input-code-resend-code {
    height: 19px;
    font-family: "Roboto";
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: $primary-400;
  }

  .wrap-countdown.ant-btn-text:active,
  .wrap-countdown.ant-btn-text:hover,
  .wrap-countdown.ant-btn-text:focus {
    background: transparent;
  }

  .wrap-countdown.ant-btn[disabled] {
    background-color: transparent;
  }

  .set-password-form__input-password.active .ant-input-password-icon,
  .set-password-form__input-confirm-password.active .ant-input-password-icon {
    color: $primary-400;
  }

  .ant-input-affix-wrapper>input.ant-input {
    top: 8px;
  }

  .field-code.ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input,
  .ant-form-item-has-error :not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper {
    border: 1px solid $red-500;
  }

  .ant-input-affix-wrapper {
    margin-bottom: 8px;
  }

  .ant-form-item-explain.ant-form-item-explain-connected {
    min-height: 14px;
  }

  .ant-form-item-explain.ant-form-item-explain-connected .ant-form-item-explain-error {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: $red-500;
  }

  .ant-form-item-explain-error:not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
