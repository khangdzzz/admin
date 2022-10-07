<template>
  <div class="create-customer d-flex align-center justify-center fill-height">
    <a-card class="create-customer__card">
      <div
        class="create-customer__title d-flex justify-center align-center mb-30"
      >
        Add new Customer
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
          >Cancel</a-button
        >
        <a-button type="primary" class="create-customer__btn-style" disabled
          >Submit</a-button
        >
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
//#region import
import CustomForm from "@/modules/base/components/CustomForm.vue";
import { reactive } from "vue";
import { formData as reactiveFormData } from "../models/create-customer-base-form";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
//#endregion

//#region props
//#endregion

//#region variables
const formData = reactive<FormData>(reactiveFormData);
//#endregion

//#region hooks
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
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.create-customer {
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
  .create-customer {
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
