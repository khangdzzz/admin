<template>
  <div class="create-customer d-flex align-center justify-center fill-height">
    <a-card class="create-customer__card">
      <div
        class="create-customer__title d-flex justify-center align-center mb-30"
      >
        {{ $t("customer_registration_lbl_page_title") }}
      </div>
      <div>
        <a-form :model="formData" ref="createCustomerForm">
          <div>
            <CustomForm
              :form-data="formData.singleInput"
              @on-focus="handleOnSingleInputFocus"
              @on-blur="handleOnSingleInputBlur"
            />
          </div>
          <div
            class="create-customer__duo-inputs-wrapper d-flex justify-space-between gap-20"
          >
            <CustomForm
              :form-data="formData.duoInputs"
              @on-focus="handleOnDuoInputsFocus"
              @on-blur="handleOnDuoInputsBlur"
            />
          </div>
        </a-form>
      </div>
      <div class="d-flex justify-center gap-20 mt-12">
        <a-button
          type="secondary"
          class="create-customer__btn-style create-customer__cancel-btn"
          :disabled="isSubmitting"
          @click="handleClickCancel"
          >{{ $t("btn_cancel") }}</a-button
        >
        <a-button
          type="primary"
          class="create-customer__btn-style"
          :loading="isSubmitting"
          :disabled="isSubmitDisable"
          @click="handleClickSubmit"
          >{{ $t("btn_submit") }}</a-button
        >
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
//#region import
import CustomForm from "@/modules/base/components/CustomForm.vue";
import { computed, inject, onBeforeUnmount, reactive, ref } from "vue";
import { formData as reactiveFormData } from "../models/create-customer-base-form";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
import { routeNames, router } from "@/routes";
import { service } from "@/services";
import { makeUniqueName } from "@/utils/string.helper";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
//#endregion

//#region props
//#endregion

//#region variables
const messenger: (
  param: MessengerParamModel
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
) => void = inject("messenger")!;
const formData = reactive<FormData>(reactiveFormData);
const { singleInput, duoInputs } = formData;
const isSubmitting = ref<boolean>(false);
const createCustomerForm = ref();
//#endregion

//#region hooks
onBeforeUnmount(() => {
  clearInputs();
});
//#endregion

//#region function
const handleOnSingleInputFocus = (index: number | boolean | Event): void => {
  formData.singleInput[Number(index)].isFocus = true;
};

const handleOnSingleInputBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  formData.singleInput[Number(index)].isFocus = false;
};

const handleOnDuoInputsFocus = (index: number | boolean | Event): void => {
  formData.duoInputs[Number(index)].isFocus = true;
};

const handleOnDuoInputsBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  formData.duoInputs[Number(index)].isFocus = false;
};

const handleClickCancel = (): void => {
  router.push({ name: routeNames.customerList });
};

const clearInputs = (): void => {
  singleInput[0].value = "";
  singleInput[1].value = "";
  singleInput[2].value = "";
  singleInput[3].value = "";
  singleInput[4].value = "";
  singleInput[5].value = "";
  singleInput[6].value = "";
  duoInputs[0].value = "";
  duoInputs[1].value = "";
};

const handleClickSubmit = async (): Promise<void> => {
  const { singleInput, duoInputs } = formData;

  const data = {
    name: makeUniqueName(singleInput[0].value.toString()),
    short_name: makeUniqueName(singleInput[1].value.toString()),
    name_kana: makeUniqueName(singleInput[2].value.toString()),
    postal_code: singleInput[3].value ? +singleInput[3].value : null,
    address: makeUniqueName(singleInput[4].value.toString()),
    telephone: makeUniqueName(singleInput[5].value.toString()),
    mail: makeUniqueName(singleInput[6].value.toString()),
    representative: makeUniqueName(duoInputs[0].value.toString()),
    external_code: makeUniqueName(duoInputs[1].value.toString())
  };

  isSubmitting.value = true;
  const { error, res } = await service.customer.createCustomer(data);
  isSubmitting.value = false;
  if (!error && res) {
    messenger({
      title: "customer_created_successfully",
      message: "",
      type: MessengerType.Success,
      callback: (isConfirm: boolean) => {
        isConfirm;
        router.push({
          name: routeNames.customerList
        });
        clearInputs();
      }
    });
  } else {
    messenger({
      title: "customer_create_failed",
      message: "",
      type: MessengerType.Error
    });
  }
};
//#endregion

//#region computed
const isNotValidToSubmit = computed(() => {
  const isNotValidName = singleInput[0].value.toString().length > 50;
  const isNotValidPostalCode =
    singleInput[3].value.toString().length && isNaN(+singleInput[3].value);
  const isNotValidPhoneNumber =
    (singleInput[5].value.toString().length &&
      !/\+[0-9]{6,12}/.test(singleInput[5].value.toString())) ||
    singleInput[5].value.toString().length > 15;
  const isNotValidEmail =
    singleInput[6].value.toString().length &&
    // eslint-disable-next-line no-control-regex, no-useless-escape
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@([a-z]{1})((?=.*[a-z|_])(?=.*[.])(?!.*\.\.)(?!.*\_\_)(?!.*\.\_)(?!.*\_\.)(?!.*\s).{1,61})([a-z]{1})$/.test(
      singleInput[6].value.toString()
    );
  const isNotValidAddress = singleInput[4].value.toString().length > 255;
  const isNotValidExternalCode = duoInputs[1].value.toString().length > 16;
  const isNotValidRepresentative = duoInputs[0].value.toString().length > 50;

  return (
    isNotValidName ||
    isNotValidPostalCode ||
    isNotValidPhoneNumber ||
    isNotValidEmail ||
    isNotValidAddress ||
    isNotValidExternalCode ||
    isNotValidRepresentative
  );
});

const isSubmitDisable = computed(() => {
  return (
    isNotValidToSubmit.value || !singleInput[0].value || !singleInput[1].value
  );
});
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.create-customer {
  &__card {
    width: 660px;
    border-radius: 10px;
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
    background-color: $white;
    border: none;
  }

  &__title {
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    line-height: 28px;
    color: $neutral-600;
  }

  &__btn-style {
    width: 180px;
    height: 48px;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 18px;
  }

  &__cancel-btn {
    background: $white;
    border: 1px solid $primary;
    color: $primary;
  }
}

:deep() {
  .ant-card {
    .ant-card-body {
      padding: 30px 20px !important;
    }
  }
  .create-customer {
    &__duo-inputs-wrapper {
      .ant-form-item {
        width: 100%;
      }
    }
  }

  .ant-form-item-explain-error {
    color: $red-500 !important;
    margin-bottom: 20px;
  }
}
</style>
