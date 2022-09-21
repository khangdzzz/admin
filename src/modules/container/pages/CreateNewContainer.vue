<template>
  <div
    class="create-container fill-height fill-width d-flex justify-center align-center">
    <a-card class="create-container__card px-20 py-30">
      <div class="create-container__title d-flex justify-center align-center">
        Add new container
      </div>
      <div class="d-flex align-center gap-24 pt-30 pb-20">
        <div class="create-container__type-selector-title">
          Owner type <span class="create-container__require-mark">*</span>
        </div>
        <div class="d-flex gap-24">
          <a-radio-group v-model:value="ownerType">
            <a-radio
              value="collectionBase"
              class="create-container__radio-title"
              >Collection base</a-radio
            >
            <a-radio value="partner" class="create-container__radio-title"
              >Partner</a-radio
            >
          </a-radio-group>
        </div>
      </div>
      <div>
        <CustomForm
          :form-data="formData"
          @on-focus="handleOnFocus"
          @on-blur="handleOnBlur"></CustomForm>
      </div>
      <div class="d-flex justify-center align-center gap-20">
        <a-button
          class="create-container__btn-style create-container__cancel-btn"
          type="secondary"
          @click="handleCancel">
          {{ $t("btn_cancel") }}
        </a-button>
        <a-button
          class="create-container__btn-style create-container__submit-btn"
          type="primary">
          {{ $t("btn_submit") }}
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
//#region import
import { ref } from "vue";

import CustomForm from "@/modules/base/components/CustomForm.vue";
import { routeNames, router } from "@/routes";
//#endregion

//#region props
//#endregion

//#region variables
const ownerType = ref<string>("collectionBase");
const formData = ref([
  {
    inputType: "ASelect",
    value: "",
    label: "owner",
    name: "owner",
    disabled: false,
    required: true,
    key: 1,
    isFocus: false,
    style: {
      padding: "0px",
      width: "620px",
      border: "none"
    }
  },
  {
    inputType: "AInput",
    value: "",
    label: "container_container_name",
    name: "containerName",
    disabled: false,
    required: true,
    key: 2,
    isFocus: false
  },
  {
    inputType: "ASelect",
    value: "",
    label: "container_container_type",
    name: "containerType",
    disabled: false,
    required: true,
    key: 1,
    isFocus: false,
    style: {
      padding: "0px",
      width: "620px",
      border: "none"
    }
  }
]);
//#endregion

//#region hooks
//#endregion

//#region function
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
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.create-container {
  &__card {
    width: 100%;
    max-width: 660px;
    height: 460px;
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
}
</style>
