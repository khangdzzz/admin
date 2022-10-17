<template>
  <div class="edit-customer d-flex align-center justify-center fill-height">
    <a-card class="edit-customer__card">
      <div
        class="edit-customer__title d-flex justify-center align-center mb-30"
      >
        Edit customer
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
          type="secondary"
          class="edit-customer__btn-style edit-customer__cancel-btn"
          @click="handleClickCancel"
          >Cancel</a-button
        >
        <a-button
          type="primary"
          class="edit-customer__btn-style"
          @click="handleClickSave"
          >Save</a-button
        >
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
//#region import
import CustomForm from "@/modules/base/components/CustomForm.vue";
import { onMounted, reactive } from "vue";
import { formData as reactiveFormData } from "../models/create-customer-base-form";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
import { routeNames, router } from "@/routes";
import { service } from "@/services";
//#endregion

//#region props
//#endregion

//#region variables
const formData = reactive<FormData>(reactiveFormData);
//#endregion

//#region hooks
onMounted(async () => {
  const res = service.customerManagement.getCustomerDetail();
  const { singleInput, duoInputs } = formData;

  singleInput[0].value = res.name;
  singleInput[1].value = res.shortName;
  singleInput[2].value = res.kana;
  singleInput[3].value = res.postalCode;
  singleInput[4].value = res.address;
  singleInput[5].value = res.phoneNumber;
  singleInput[6].value = res.email;
  duoInputs[0].value = res.representative;
  duoInputs[1].value = res.externalCode;
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

const handleClickSave = (): void => {
  router.push({ name: routeNames.customerList });
};
//#endregion

//#region computed
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
