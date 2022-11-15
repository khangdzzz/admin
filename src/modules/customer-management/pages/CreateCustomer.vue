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
      <div class="d-flex justify-center gap-20 mt-10">
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
          :disabled="isSubmitDisable || existFields.length"
          @click="handleClickSubmit"
          >{{ $t("btn_submit") }}</a-button
        >
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
//#region import
import { i18n } from "@/i18n";
import CustomForm from "@/modules/base/components/CustomForm.vue";
import validator from "@/modules/base/components/validator/validator";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
import { routeNames, router } from "@/routes";
import { service } from "@/services";
import { makeUniqueName } from "@/utils/string.helper";
import { Rule } from "ant-design-vue/lib/form";
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch
} from "vue";
import { formData as reactiveFormData } from "../models/create-customer-base-form";
//#endregion

//#region props
//#endregion

//#region variables
const messenger: (
  param: MessengerParamModel
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
) => void = inject("messenger")!;
const formData = reactive<FormData>(reactiveFormData());
const { singleInput, duoInputs } = formData;
const isSubmitting = ref<boolean>(false);
const createCustomerForm = ref();
const existFields = ref<string[]>([]);
const isPostalCodeHasError = ref<boolean>(false);

//#endregion

//#region hooks
onMounted(() => {
  singleInput[0].rules?.push({
    validator: (): Promise<void> => {
      if (existFields.value.includes("name")) {
        return Promise.reject(
          i18n.global.t("error_unique_constraint", {
            fieldName: i18n.global.t("name")
          })
        );
      }
      return Promise.resolve();
    },
    trigger: ["blur", "change"]
  });

  singleInput[1].rules?.push({
    validator: (): Promise<void> => {
      if (existFields.value.includes("short_name")) {
        return Promise.reject(
          i18n.global.t("error_unique_constraint", {
            fieldName: i18n.global.t("short_name")
          })
        );
      }
      return Promise.resolve();
    },
    trigger: ["blur", "change"]
  });

  singleInput[3].rules?.push({
    validator: (rule: Rule, value: string): Promise<void> => {
      if (!value) {
        return Promise.resolve();
      }
      if (isPostalCodeHasError.value) {
        return Promise.reject(
          i18n.global.t("cannot_find_address_from_field_name", {
            fieldName: i18n.global.t("common_postal_code_label").toLowerCase()
          })
        );
      }
      return validator.validatePostalCodePromise(rule, value);
    },
    trigger: ["blur", "change"]
  });

  if (singleInput[3].actionBtn) {
    singleInput[3].actionBtn.name = "search_address";
    singleInput[3].actionBtn.click = handleSearchAddress;
    singleInput[3].actionBtn.disabled = isEnableSearchAddress();
    singleInput[3].class = "input-with-action-btn";
  }
});

onBeforeUnmount(() => {
  clearInputs();
});
//#endregion

//#region function
const handleOnSingleInputFocus = (index: number | boolean | Event): void => {
  formData.singleInput[Number(index)].isFocus = true;
  if (typeof index === "number") clearExistError(index);
};

const handleOnSingleInputBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  formData.singleInput[Number(index)].isFocus = false;
  if (typeof index === "number") clearExistError(index);
};

const clearExistError = (index: number): void => {
  if (index === 0 && existFields.value.length) {
    const errorIndex = existFields.value.indexOf("name");
    if (errorIndex >= 0) {
      existFields.value.splice(errorIndex, 1);
    }
  }

  if (index === 1 && existFields.value.length) {
    const errorIndex = existFields.value.indexOf("short_name");
    if (errorIndex >= 0) {
      existFields.value.splice(errorIndex, 1);
    }
  }
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

const setBtnActionDisableState = (state: boolean): void => {
  if (singleInput[3].actionBtn) {
    singleInput[3].actionBtn.disabled = state;
  }
};

const handleSearchAddress = async (): Promise<void> => {
  setBtnActionDisableState(true);
  singleInput[4].loading = true;
  const { res } = await service.location.isPostalAddressExists(
    makeUniqueName(singleInput[3].value.toString()) || ""
  );
  singleInput[4].loading = false;
  setBtnActionDisableState(false);
  if (!res) {
    isPostalCodeHasError.value = true;
    singleInput[3].class = "input-with-action-btn postal-code__uniq-warning";
  } else {
    singleInput[4].value = res?.full_address;
    isPostalCodeHasError.value = !res?.full_address;
    setTimeout(() => {
      document.getElementById("create-customer_address")?.focus();
      document.getElementById("create-customer_address")?.blur();
    }, 100);
  }
  singleInput[3].loading = false;
  document.getElementById("create-customer_postal-code")?.focus();
  document.getElementById("create-customer_postal-code")?.blur();
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
  const { error, errorParams, res } = await service.customer.createCustomer(
    data
  );
  isSubmitting.value = false;
  if (!error && res) {
    messenger({
      title: "common_msg_create_successfully",
      message: "",
      type: MessengerType.Success,
      callback: (isConfirm: boolean) => {
        isConfirm;
        router.push({
          name: routeNames.customerDetail,
          params: { id: res.id }
        });
        clearInputs();
      }
    });
  } else {
    if ((error as string).includes("error_workplace_unique")) {
      if (errorParams) {
        existFields.value = errorParams;
      }
      createCustomerForm.value.validate();
    } else {
      messenger({
        title: "popup_create_fail_title",
        message: "",
        type: MessengerType.Error
      });
    }
  }
};
//#endregion

//#region computed
const isNotValidToSubmit = computed(() => {
  const isNotValidName = singleInput[0].value.toString().length > 50;
  const isNotValidPostalCode =
    (singleInput[3].value && isNaN(+singleInput[3].value)) ||
    singleInput[3].value.toString().length > 8;
  const isNotValidPhoneNumber =
    (singleInput[5].value.toString().length &&
      !/^[+]?[0-9]{8,15}$/.test(singleInput[5].value.toString())) ||
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

const isEnableSearchAddress = (): boolean => {
  if (singleInput[3]?.actionBtn) {
    if (
      !singleInput[3].value ||
      (singleInput[3].value && isNaN(+singleInput[3].value)) ||
      singleInput[3].value.toString().length > 8
    ) {
      singleInput[3].actionBtn.disabled = true;
      return true;
    }

    singleInput[3].actionBtn.disabled = false;
  }

  return false;
};
//#endregion

//#region reactive
watch(
  () => singleInput[3].value,
  () => {
    isPostalCodeHasError.value = false;
    singleInput[3].class = "input-with-action-btn";
    isEnableSearchAddress();
  }
);
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

  .ant-form-item-explain .ant-form-item-explain-error {
    color: $red-500 !important;
    margin-bottom: 0px !important;
  }
  .ant-form-item {
    margin-bottom: 20px !important;
  }
}
</style>
