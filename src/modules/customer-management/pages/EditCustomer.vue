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
          <a-form :model="formData">
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
        <div class="d-flex justify-center gap-20 mt-12">
          <a-button
            :disabled="isLoading"
            type="secondary"
            class="edit-customer__btn-style edit-customer__cancel-btn"
            @click="handleClickCancel"
            >{{ $t("btn_cancel") }}</a-button
          >
          <a-button
            :disabled="isDisabledAction"
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

//#endregion

//#region props
//#endregion

//#region variables
const route = useRoute();

let isExistName = async (): Promise<void> => {
  if (isExist.value) {
    return Promise.reject(
      i18n.global.t("error_unique_constraint", {
        fieldName: i18n.global.t("name")
      })
    );
  }
  return Promise.resolve();
};

const formData = reactive<FormData>({
  singleInput: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "name",
      label: "name",
      name: "name",
      disabled: false,
      required: true,
      key: 1,
      isFocus: false,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("name")
          }),
          trigger: ["blur", "change"]
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: "change"
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
            fieldName: i18n.global.t("short_name")
          }),
          trigger: ["blur", "change"]
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: "blur"
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
      placeHolder: "name_kana",
      label: "name_kana",
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
      placeHolder: "postal_code",
      label: "postal_code",
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
      placeHolder: "phone_number",
      label: "phone_number",
      name: "phoneNumber",
      disabled: false,
      required: false,
      key: 6,
      isFocus: false,
      rules: [
        {
          max: 15,
          message: i18n.global.t("max_length_input", { maxLength: 15 }),
          trigger: "change"
        },
        {
          pattern: /\+[0-9]{6,12}/,
          message: i18n.global.t("invalid_field_name", {
            fieldName: i18n.global.t("collection_phone_number")
          }),
          trigger: "change"
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

const messenger: (
  param: MessengerParamModel
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
) => void = inject("messenger")!;

const { singleInput, duoInputs } = formData;
const [name, shortName, kana, postalCode, address, phoneNumber, email] =
  singleInput;
const [representative, externalCode] = duoInputs;
//#endregion

//#region hooks
onMounted(async () => {
  init();
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
    externalCode.value = res.external_code;
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

const handleClickCancel = (): void => {
  router.push({ name: routeNames.customerList });
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
    ...(externalCode.value && { external_code: externalCode.value as number })
  };
  isLoading.value = true;
  const error = await service.customerManagement.editCustomerById(+id, payload);
  isLoading.value = false;

  if (error) {
    messenger({
      title: "edit_customer_successfully",
      message: "",
      type: MessengerType.Success,
      callback: (isConfirm: boolean) => {
        isConfirm;
        handleClickCancel();
      }
    });
  } else {
    if (error === "error_unique_constraint") {
      isExist.value = true;
      return;
    }
    messenger({
      title: "create_failed",
      message: "please_try_again",
      type: MessengerType.Error
    });
  }
};
//#endregion

//#region computed
const isDisabledAction = computed(
  () => isLoading.value || !name.value || !shortName.value
);
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.edit-customer {
  &__card {
    width: 660px;
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
  .edit-customer {
    .ant-card {
      &-body {
        padding: 30px 20px;
      }
    }

    &__duo-inputs-wrapper {
      .ant-form-item {
        width: 100%;
      }
    }
  }
}
</style>
