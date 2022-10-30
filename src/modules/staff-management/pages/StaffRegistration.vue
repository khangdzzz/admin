<template>
  <div
    class="create-staff fill-height fill-width d-flex justify-center align-center"
  >
    <a-card class="create-staff__card px-20 py-30">
      <div class="create-staff__title d-flex mb-30 justify-center align-center">
        {{ $t("add_new_staff") }}
      </div>
      <a-form :model="formState">
        <FloatingLabelInput
          place-holder="staff_employee_code"
          label="staff_employee_code"
          control-name="employeeCode"
          v-model:value="formState.employeeCode"
        ></FloatingLabelInput>
        <FloatingLabelInput
          place-holder="name"
          label="name"
          control-name="name"
          v-model:value="formState.name"
          :required="true"
          :rules="[
            {
              required: true,
              message: $t('forgot_password_msg_err_code_required'),
              trigger: ['change', 'blur']
            }
          ]"
        ></FloatingLabelInput>
        <FloatingLabelInput
          place-holder="name_kana"
          label="name_kana"
          control-name="nameKana"
          v-model:value="formState.nameKana"
        ></FloatingLabelInput>
        <FloatingLabelInput
          place-holder="email"
          label="email"
          control-name="email"
          v-model:value="formState.email"
          :required="true"
          :rules="[
            {
              required: true,
              message: $t('forgot_password_msg_err_code_required'),
              trigger: ['change', 'blur']
            }
          ]"
        ></FloatingLabelInput>
        <FloatingLabelInput
          place-holder="telephone"
          label="telephone"
          control-name="telephone"
          v-model:value="formState.telephone"
        ></FloatingLabelInput>
        <FloatingLabelSelect
          place-holder="Select"
          label="Select"
          control-name="telephone"
          v-model:value="formState.telephone"
        ></FloatingLabelSelect>
      </a-form>
      <div class="d-flex justify-center align-center gap-20 mt-10 mb-30">
        <a-button
          class="create-staff__btn-style create-staff__cancel-btn"
          type="secondary"
          :disabled="isLoading"
        >
          {{ $t("btn_cancel") }}
        </a-button>
        <a-button
          class="create-staff__btn-style create-staff__submit-btn"
          type="primary"
          :loading="isLoading"
          :disabled="!isValidated"
        >
          {{ $t("btn_submit") }}
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
//#region import
import FloatingLabelInput from "@/modules/base/components/FloatingLabelInput.vue";
import FloatingLabelSelect from "@/modules/base/components/FloatingLabelSelect.vue";
import { reactive, ref } from "vue";

interface FormState {
  employeeCode: string;
  name: string;
  nameKana: string;
  email: string;
  telephone: string;
}
//#endregion

//#region props
//#endregion

//#region variables
const isValidated = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const formState = reactive<FormState>({
  employeeCode: "",
  name: "",
  nameKana: "",
  email: "",
  telephone: ""
});
//#endregion

//#region hooks
//#endregion

//#region function
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.radio {
  width: 660px;
}
.ic-clipboard {
  margin-left: 17px;
  cursor: pointer;
}
.create-staff {
  &__card {
    width: 100%;
    max-width: 660px;
    border-radius: 10px;
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
    background-color: $white;
  }

  &__title {
    font-style: normal;
    color: $neutral-600;
    @include text(600, 22px, 28px);
  }

  &__require-mark {
    color: $red-1;
  }

  &__type-selector-title {
    font-style: normal;
    color: $neutral-600;
    min-width: 123px;
    @include text(600, 16px, 20px);
  }

  &__radio-title {
    font-style: normal;
    color: $neutral-600;
    min-width: 233px;
    margin-bottom: 26px;
    @include text(400, 18px, 100%);
  }

  &__btn-style {
    width: 180px;
    height: 48px;
    font-style: normal;
    @include text(600, 18px, 100%);
  }

  &__cancel-btn {
    background-color: $white;
    color: $primary;
    border: 1px solid $primary;
  }
}

:deep() {
  .create-staff {
    &__card {
      .ant-card-body {
        padding: 0;
      }
    }
  }
  .create-staff__radio-title {
    align-items: center;
  }
  .form-create-staff {
    .ant-form-item {
      margin-right: 0px;
      margin-bottom: 20px;
      .ant-form-item-control {
        .ant-form-item-control-input {
          .ant-form-item-control-input-content {
            .multiple {
              height: 80px !important;
            }
            .input-item {
              padding: 0px 12px;
              width: 620px;
            }
            .ant-select-multiple {
              .ant-select-selector {
                .ant-select-selection-item {
                  top: 10px;
                  padding: 0px 10px 0px 20px;
                  border: 1px solid #07a0b8;
                  border-radius: 38px;
                }
              }
            }
            .inline {
              width: 300px !important;
            }
          }
        }
      }
    }
  }
}
</style>
