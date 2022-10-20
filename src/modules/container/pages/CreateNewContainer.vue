<template>
  <div
    class="create-container fill-height fill-width d-flex justify-center align-center"
  >
    <a-card class="create-container__card px-20 py-30">
      <div
        class="create-container__title d-flex justify-center align-center mb-30"
      >
        {{ $t("container_add_new_container") }}
      </div>
      <a-form
        :model="{ formData }"
        layout="inline"
        class="form-create-container"
      >
        <CustomForm
          :form-data="formData"
          @on-focus="handleOnFocus"
          @on-blur="handleOnBlur"
        ></CustomForm>
      </a-form>
      <div class="d-flex justify-center align-center gap-20">
        <a-button
          class="create-container__btn-style create-container__cancel-btn"
          type="secondary"
          @click="handleCancel"
        >
          {{ $t("btn_cancel") }}
        </a-button>
        <a-button
          class="create-container__btn-style create-container__submit-btn"
          type="primary"
          :disabled="!isAllowSubmit"
          @click="handleSubmit"
        >
          {{ $t("btn_submit") }}
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
//#region import
import { computed, inject, onMounted, ref } from "vue";

import CustomForm from "@/modules/base/components/CustomForm.vue";
import { routeNames, router } from "@/routes";
import { i18n } from "@/i18n";
import { service } from "@/services";
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

const formData = ref([
  {
    inputType: "AInput",
    value: "",
    label: "container_container_name",
    name: "containerName",
    disabled: false,
    required: true,
    key: 1,
    isFocus: false,
    rules: [
      {
        required: true,
        message: i18n.global.t("please_enter_input", {
          fieldName: i18n.global.t("container_container_name").toLowerCase()
        }),
        trigger: "blur"
      },
      {
        max: 50,
        message: i18n.global.t("max_length_input_text", { maxLength: 50 }),
        trigger: "blur"
      }
    ]
  },
  {
    inputType: "ASelect",
    value: "",
    label: "container_container_type",
    name: "containerType",
    disabled: false,
    required: true,
    key: 2,
    isFocus: false,
    style: {
      padding: "0px",
      width: "620px",
      border: "none"
    },
    options: [{ value: "", label: "" }],
    rules: [
      {
        required: true,
        message: i18n.global.t("please_enter_input", {
          fieldName: i18n.global.t("container_container_type").toLowerCase()
        }),
        trigger: "blur"
      }
    ]
  },
  {
    inputType: "AInput",
    value: "",
    placeHolder: "container_weight",
    label: "container_weight",
    name: "weight",
    inline: true,
    disabled: false,
    spaceStyle: {
      display: "inline-block",
      width: "16px"
    },
    rules: [
      {
        max: 10,
        message: i18n.global.t("max_length_input_number", { maxLength: 10 }),
        trigger: "blur"
      },

      {
        pattern: /(?<=^| )\d+(\.\d+)?(?=$| )/g,
        message: i18n.global.t("invalid_field_name", {
          fieldName: i18n.global.t("container_weight").toLowerCase()
        }),
        trigger: "blur"
      },
      {
        required: true,
        message: i18n.global.t("please_enter_input", {
          fieldName: i18n.global.t("container_weight").toLowerCase()
        }),
        trigger: "blur"
      }
    ],
    required: true,
    key: 3,
    isFocus: false
  },
  {
    inputType: "AInput",
    value: "",
    placeHolder: "container_capacity",
    label: "container_capacity",
    name: "capacity",
    inline: true,
    disabled: false,
    rules: [
      {
        max: 50,
        message: i18n.global.t("max_length_input_number", { maxLength: 50 }),
        trigger: "blur"
      },
      {
        pattern: /(?<=^| )\d+(\.\d+)?(?=$| )/g,
        message: i18n.global.t("invalid_field_name", {
          fieldName: i18n.global.t("container_capacity").toLowerCase()
        }),
        trigger: "blur"
      }
    ],
    required: false,
    key: 4,
    isFocus: false
  }
]);
//#endregion

//#region hooks
onMounted(async () => {
  await initialize();
});

//#endregion

//#region function
const initialize = async (): Promise<void> => {
  const res = await service.container.getListContainerType(
    0,
    "full",
    undefined,
    ""
  );
  if (res && res.results) {
    const options = res.results.map((ct) => {
      return {
        value: ct.id.toString(),
        label: ct.name
      };
    });
    formData.value[1].options = options;
  }
};

const handleOnFocus = (index: number | boolean | Event): void => {
  formData.value[Number(index)].isFocus = true;
};

const handleOnBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  formData.value[Number(index)].isFocus = false;
};

const handleCancel = (): void => {
  router.push({ name: routeNames.containerChild });
};

const clearInputs = (): void => {
  formData.value[0].value = "";
  formData.value[1].value = "";
  formData.value[2].value = "";
  formData.value[3].value = "";
};

const handleSubmit = async (): Promise<void> => {
  const name = formData.value[0].value;
  const containerType = +formData.value[1].value;
  const weight = +formData.value[2].value;
  let capacity = null;
  if (formData.value[3].value !== "") {
    capacity = +formData.value[3].value;
  }
  const { error, res } = await service.container.createContainer(
    name,
    containerType,
    "",
    "",
    weight,
    capacity
  );

  if (res && !error) {
    messenger({
      title: "container_successfully_created",
      message: "",
      type: MessengerType.Success,
      callback: () => {
        router.push({ name: routeNames.containerChild });
      }
    });
  } else if (error) {
    messenger({
      title: error,
      message: "",
      type: MessengerType.Error,
      callback: () => {
        clearInputs();
      }
    });
  }
};
//#endregion

//#region computed
const isAllowSubmit = computed(() => {
  return (
    formData.value[0].value &&
    formData.value[1].value &&
    formData.value[2].value
  );
});
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.create-container {
  &__card {
    width: 100%;
    max-width: 660px;
    border-radius: 10px;
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
    background-color: $white;
  }

  &__title {
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    line-height: 28px;
    color: $neutral-600;
  }

  &__require-mark {
    color: $red-1;
  }

  &__type-selector-title {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: $neutral-600;
  }

  &__radio-title {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 100%;
    color: $neutral-600;
  }

  &__btn-style {
    width: 180px;
    height: 48px;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 100%;
  }

  &__cancel-btn {
    background-color: $white;
    color: $primary;
    border: 1px solid $primary;
  }
}

:deep() {
  .create-container {
    &__card {
      .ant-card-body {
        padding: 0;
      }
    }
  }
  .form-create-container {
    .ant-form-item {
      margin-right: 0px;
      margin-bottom: 20px;
      .ant-form-item-control {
        .ant-form-item-control-input {
          .ant-form-item-control-input-content {
            .input-item {
              width: 620px;
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
