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
                @change="handleOnChange"
              />
            </div>
            <div
              class="edit-customer__duo-inputs-wrapper d-flex justify-space-between gap-20"
            >
              <CustomForm
                :form-data="formData.duoInputs"
                @on-focus="handleOnDuoInputsFocus"
                @on-blur="handleOnDuoInputsBlur"
                @change="handleOnChange"
              />
            </div>
          </a-form>
        </div>
        <div class="d-flex justify-center gap-20 mt-12">
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
import CustomForm from "@/modules/base/components/CustomForm.vue";
import { inject, onMounted, reactive, ref, computed } from "vue";
// import { formData as reactiveFormData } from "../models/create-customer-base-form";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
import { routeNames, router } from "@/routes";
import { service } from "@/services";
import { useRoute } from "vue-router";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { i18n } from "@/i18n";
import validator from "@/modules/base/components/validator/validator";
import { makeUniqueName } from "@/utils/string.helper";
import { Rule } from "ant-design-vue/lib/form";
import { localStorageKeys } from "@/services/local-storage-keys";
//#endregion

//#region props
//#endregion

//#region variables
const route = useRoute();

let isExistName = async (): Promise<void> => {
  if (isExist.value) {
    return Promise.reject(
      i18n.global.t("error_unique_constraint", {
        fieldName: i18n.global.t("human_name")
      })
    );
  }
  return Promise.resolve();
};

const currentLanguage =
  localStorage.getItem(localStorageKeys.currentLanguage) || "en";

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
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("human_name").toLowerCase()
          }),
          trigger: ["blur", "change"]
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: ["blur", "change"]
        },
        {
          validator: isExistName,
          trigger: ["change"]
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
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("short_name").toLowerCase()
          }),
          trigger: ["blur", "change"]
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: ["blur", "change"]
        },
        {
          validator: isExistName,
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
          validator: validator.validateNumber,
          trigger: "change"
        }
      ],
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
          max: 255,
          message: i18n.global.t("max_length_input", { maxLength: 255 }),
          trigger: "change"
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "common_phone_field_label",
      label: "common_phone_field_label",
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
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: "change"
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
          max: 16,
          message: i18n.global.t("max_length_input", { maxLength: 16 }),
          trigger: "change"
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

const isExitsField = ref<string[]>([]);
//#endregion

//#region hooks
onMounted(async () => {
  await init();
  singleInput[0].rules?.push({
    validator: (rule: Rule, value: string): Promise<void> => {
      if (isExitsField.value.includes("name")) {
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
    validator: (rule: Rule, value: string): Promise<void> => {
      if (isExitsField.value.includes("short_name")) {
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

const handleOnChange = (): void => {
  onCheckValidFields();
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
    if ((error as string) === "error_unique_constraint") {
      if (errorParams) {
        isExitsField.value = errorParams;
      }
      formRef.value.validate();
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
const onCheckValidFields = async (): Promise<void> => {
  try {
    await formRef.value.validateFields();
    isValid.value = true;
  } catch {
    isValid.value = false;
  }
};

const isSubmitDisable = computed(() => {
  return !isValid.value || !name.value || !shortName.value;
});
//#endregion

//#region reactive

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
  .ant-form-item-explain-error {
    color: $red-500 !important;
  }
}
</style>
