<template>
  <div class="edit-customer d-flex align-center justify-center fill-height">
    <a-spin :tip="$t('common_loading')" :spinning="isLoading">
      <a-card class="edit-customer__card">
        <div
          class="edit-customer__title d-flex justify-center align-center mb-30"
        >
          {{ $t("edit_contaienr") }}
        </div>
        <div>
          <a-form :model="formData" ref="formRef">
            <div>
              <CustomForm
                :form-data="formData.singleInput"
                @on-focus="handleOnSingleInputFocus"
                @on-blur="handleOnSingleInputBlur"
              />
            </div>
            <div
              class="edit-customer__duo-inputs-wrapper d-flex justify-space-between gap-20"
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
            :disabled="isLoading"
            type="secondary"
            class="edit-customer__btn-style edit-customer__cancel-btn"
            @click="handleClickCancel"
            >{{ $t("btn_cancel") }}</a-button
          >
          <a-button
            :disabled="isSubmitDisable"
            type="primary"
            class="edit-customer__btn-style"
            @click="handleClickSave"
          >
            {{ $t("btn_save") }}</a-button
          >
        </div>
      </a-card>
    </a-spin>
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
import { useRoute } from "vue-router";
//#endregion

//#region props
//#endregion

//#region variables
const route = useRoute();

const isPostalCodeHasError = ref<boolean>(false);

let validateName = (value: string): string => {
  if (!value) {
    return i18n.global.t("please_enter_input", {
      fieldName: i18n.global.t("human_name").toLowerCase()
    });
  }

  if (value.length > 50) {
    return i18n.global.t("max_length_input", { maxLength: 50 });
  }

  if (existFields.value.includes("name")) {
    return i18n.global.t("error_unique_constraint", {
      fieldName: i18n.global.t("human_name")
    });
  }
  return "";
};

let validateShortName = (value: string): string => {
  if (!value) {
    return i18n.global.t("please_enter_input", {
      fieldName: i18n.global.t("short_name").toLowerCase()
    });
  }

  if (value.length > 50) {
    return i18n.global.t("max_length_input", { maxLength: 50 });
  }

  if (existFields.value.includes("short_name")) {
    return i18n.global.t("error_unique_constraint", {
      fieldName: i18n.global.t("short_name")
    });
  }
  return "";
};

let validatePostalCode = (value: string, ignoreNotExist: boolean): string => {
  if (!value) {
    return "";
  }

  if (isPostalCodeHasError.value && !ignoreNotExist) {
    return i18n.global.t("cannot_find_address_from_field_name", {
      fieldName: i18n.global.t("common_postal_code_label").toLowerCase()
    });
  }

  const regex = /^[0-9]*$/;
  if (value && !regex.test(value)) {
    return i18n.global.t("field_allow_number_only");
  }

  if (value.length > 8) {
    return i18n.global.t("max_length_input", { maxLength: 8 });
  }

  return "";
};

const validateMaxLength = (value: string, maxLength): string => {
  if (value?.length > 255) {
    return i18n.global.t("max_length_input", { maxLength });
  }
  return "";
};

const formData = reactive<FormData>({
  singleInput: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "human_name",
      label: "human_name",
      name: "name",
      disabled: false,
      required: true,
      key: 1,
      isFocus: false,
      rules: [
        {
          validator: (rule: Rule, value: string): Promise<void> => {
            const error = validateName(value);
            if (error) return Promise.reject(error);
            return Promise.resolve();
          },
          trigger: ["blur", "change"]
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "short_name",
      label: "short_name",
      name: "shortName",
      disabled: false,
      required: true,
      key: 2,
      isFocus: false,
      rules: [
        {
          validator: (rule: Rule, value: string): Promise<void> => {
            const error = validateShortName(value);
            if (error) return Promise.reject(error);
            return Promise.resolve();
          },
          trigger: ["blur", "change"]
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "human_name_kana",
      label: "human_name_kana",
      name: "kana",
      disabled: false,
      required: false,
      key: 3,
      isFocus: false,
      parent: "singleInput"
    },
    {
      id: "edit-customer_postal-code",
      inputType: "AInput",
      value: "",
      placeHolder: "common_postal_code_label",
      label: "common_postal_code_label",
      name: "postalCode",
      disabled: false,
      required: false,
      key: 4,
      isFocus: false,
      rules: [
        {
          validator: (rule: Rule, value: string): Promise<void> => {
            const error = validatePostalCode(value, false);
            if (error) {
              return Promise.reject(error);
            }
            return Promise.resolve();
          },
          trigger: ["change", "blur"]
        }
      ],
      actionBtn: {
        name: "search_address",
        click: undefined
      },
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "address",
      label: "address",
      name: "address",
      disabled: false,
      required: false,
      key: 5,
      isFocus: false,
      rules: [
        {
          validator: (rule: Rule, value: string): Promise<void> => {
            const maxAddressLength = 255;
            const error = validateMaxLength(value, maxAddressLength);
            if (error) {
              return Promise.reject(error);
            }
            return Promise.resolve();
          },
          trigger: ["change", "blur"]
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "customer_phone_number",
      label: "customer_phone_number",
      name: "phoneNumber",
      disabled: false,
      required: false,
      key: 6,
      isFocus: false,
      rules: [
        {
          validator: validator.validatePhone,
          trigger: ["change", "blur"]
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "collection_email",
      label: "collection_email",
      name: "email",
      disabled: false,
      required: false,
      key: 7,
      isFocus: false,
      rules: [
        {
          validator: validator.validateEmail,
          trigger: "change"
        }
      ],
      parent: "singleInput"
    }
  ],
  duoInputs: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "representative",
      label: "representative",
      name: "representative",
      disabled: false,
      required: false,
      key: 8,
      isFocus: false,
      rules: [
        {
          validator: (rule: Rule, value: string): Promise<void> => {
            const maxRepresentativeLength = 50;
            const error = validateMaxLength(value, maxRepresentativeLength);
            if (error) {
              return Promise.reject(error);
            }
            return Promise.resolve();
          },
          trigger: ["change", "blur"]
        }
      ],
      parent: "duoInputs"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "external_code",
      label: "external_code",
      name: "externalCode",
      disabled: false,
      required: false,
      key: 9,
      isFocus: false,
      rules: [
        {
          validator: (rule: Rule, value: string): Promise<void> => {
            const maxExternalCodeLength = 50;
            const error = validateMaxLength(value, maxExternalCodeLength);
            if (error) {
              return Promise.reject(error);
            }
            return Promise.resolve();
          },
          trigger: ["change", "blur"]
        }
      ],
      parent: "duoInputs"
    }
  ]
});

const { id } = route.params;

const isLoading = ref<boolean>(false);

const isExist = ref<boolean>(false);

const isValid = ref<boolean>(false);

const formRef = ref();

const messenger: (
  param: MessengerParamModel
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
) => void = inject("messenger")!;

const { singleInput, duoInputs } = formData;
const [name, shortName, kana, postalCode, address, phoneNumber, email] =
  singleInput;
const [representative, externalCode] = duoInputs;

const existFields = ref<string[]>([]);
//#endregion

//#region hooks

onBeforeUnmount(() => {
  formRef.value.resetFields();
});

onMounted(async () => {
  await init();

  if (singleInput[3].actionBtn) {
    singleInput[3].actionBtn.name = "search_address";
    singleInput[3].actionBtn.click = handleSearchAddress;
    singleInput[3].actionBtn.disabled = isEnableSearchAddress();
    singleInput[3].class = "input-with-action-btn";
  }
  onCheckValidFields();
});
//#endregion

//#region function

const init = async (): Promise<void> => {
  isLoading.value = true;
  if (!id) {
    router.push({ name: routeNames.customerList });
    return;
  }

  const { error, res } = await service.customerManagement.getCustomerById(+id);
  if (error || !res) {
    router.push({ name: routeNames.customerList });
    return;
  }

  if (res) {
    name.value = res.name;
    shortName.value = res.short_name;
    kana.value = res.name_kana;
    postalCode.value = res.postal_code;
    address.value = res.address;
    phoneNumber.value = res.telephone;
    email.value = res.mail;
    representative.value = res.representative;
    externalCode.value = res.external_code ?? "";
  }
  isLoading.value = false;
};

const handleOnSingleInputFocus = (index: number | boolean | Event): void => {
  isExist.value = false;
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
  }
  singleInput[3].loading = false;

  document.getElementById("edit-customer_postal-code")?.focus();
  document.getElementById("edit-customer_postal-code")?.blur();
};

const handleClickCancel = (): void => {
  router.go(-1);
};

const handleClickSave = async (): Promise<void> => {
  const payload = {
    name: makeUniqueName(name.value?.toString()) as string,
    short_name: makeUniqueName(shortName.value?.toString()) as string,
    ...(kana.value && { name_kana: kana.value as string }),
    ...(postalCode.value && { postal_code: postalCode.value as string }),
    ...(address.value && { address: address.value as string }),
    ...(phoneNumber.value && { telephone: phoneNumber.value as string }),
    ...(email.value && { mail: email.value as string }),
    ...(representative.value && {
      representative: representative.value as string
    }),
    ...(externalCode.value && { external_code: externalCode.value as string })
  };
  isLoading.value = true;
  const { error, errorParams } =
    await service.customerManagement.editCustomerById(+id, payload);
  isLoading.value = false;

  if (!error) {
    messenger({
      title: "common_msg_edit_successfully",
      message: "",
      type: MessengerType.Success,
      callback: (isConfirm: boolean) => {
        isConfirm;
        router.push({ name: routeNames.customerList });
      }
    });
  } else {
    if ((error as string).includes("error_workplace_unique")) {
      if (errorParams) {
        existFields.value = errorParams;
      }
      formRef.value.validate();
    } else {
      messenger({
        title: "popup_edit_fail_title",
        message: "",
        type: MessengerType.Error
      });
    }
  }
};
//#endregion

//#region computed
const onCheckValidFields = async (): Promise<void> => {
  try {
    const nameError = validateName(singleInput[0].value?.toString());
    const shortNameError = validateShortName(singleInput[1].value?.toString());
    const postalCodeError = validatePostalCode(
      singleInput[3].value?.toString(),
      true
    );
    const addressError = validateMaxLength(
      singleInput[4].value?.toString(),
      255
    );
    if (singleInput[5].value)
      await validator.validatePhone({}, singleInput[5].value?.toString());
    if (singleInput[6].value)
      await validator.validateEmail({}, singleInput[6].value?.toString());
    const representativeError = validateMaxLength(
      duoInputs[1].value?.toString(),
      50
    );
    const externalCodeError = validateMaxLength(
      duoInputs[1].value?.toString(),
      16
    );
    isValid.value = !(
      nameError ||
      shortNameError ||
      postalCodeError ||
      addressError ||
      representativeError ||
      externalCodeError
    );
  } catch {
    isValid.value = false;
  }
};

const isSubmitDisable = computed(() => {
  return !isValid.value || !name.value || !shortName.value;
});
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

watch(
  () => formData,
  () => {
    onCheckValidFields();
  },
  { deep: true }
);
//#endregion
</script>

<style lang="scss" scoped>
.edit-customer {
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
  .edit-customer {
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
