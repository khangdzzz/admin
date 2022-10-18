<template>
  <div
    class="create-staff fill-height fill-width d-flex justify-center align-center"
  >
    <a-card class="create-staff__card px-20 py-30">
      <div class="create-staff__title d-flex mb-30 justify-center align-center">
        {{ $t("add_new_staff") }}
      </div>
      <a-form
        :model="dynamicValidateForm"
        layout="inline"
        class="form-create-staff"
      >
        <CustomForm
          :form-data="getFormData"
          @on-focus="handleOnFocus"
          @on-blur="handleOnBlur"
          @change="handleOnChange"
          @close="handleOnClose"
        >
          <template #radio>
            <div
              class="d-flex align-center gap-24 pt-10 align-flex-start radio"
            >
              <div class="create-staff__type-selector-title">
                {{ $t("type") }}
                <span class="create-staff__require-mark">*</span>
              </div>
              <div class="d-flex gap-24">
                <a-radio-group v-model:value="formState.type">
                  <a-radio
                    class="create-staff__radio-title"
                    v-for="item in formState.typeOptions"
                    :value="item.value"
                    :key="item.value"
                    >{{ $t(item.text) }}</a-radio
                  >
                </a-radio-group>
              </div>
            </div>

            <div
              class="d-flex align-center gap-24 align-flex-start radio mb-6"
              v-if="formState.userRoleOptions?.length"
            >
              <div class="create-staff__type-selector-title">
                {{ $t("user_role") }}
                <span class="create-staff__require-mark">*</span>
              </div>
              <div class="d-flex gap-24">
                <a-radio-group
                  v-model:value="formState.userRole"
                  :disabled="formState.type === TypeOptions.DESTINATION"
                >
                  <a-radio
                    class="create-staff__radio-title"
                    v-for="item in formState.userRoleOptions"
                    :value="item.value"
                    :key="item.value"
                    >{{ $t(item.text) }}</a-radio
                  >
                </a-radio-group>
              </div>
            </div>
          </template>
        </CustomForm>
      </a-form>
      <div class="d-flex justify-center align-center gap-20 mt-10 mb-30">
        <a-button
          class="create-staff__btn-style create-staff__cancel-btn"
          type="secondary"
          @click="handleCancel"
        >
          {{ $t("btn_cancel") }}
        </a-button>
        <a-button
          class="create-staff__btn-style create-staff__submit-btn"
          type="primary"
        >
          {{ $t("btn_submit") }}
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
//#region import
import { onMounted, reactive, watch, computed } from "vue";

import CustomForm from "@/modules/base/components/CustomForm.vue";
import { UserType } from "@/modules/base/models/user-type.enum";
import {
  TypeOptions,
  UserRoleOptions
} from "@/modules/staff-management/models/create-new-staff.model";
import { routeNames, router } from "@/routes";
import { commonStore } from "@/stores";
import radioOptions from "./create-new-staff-variables";
//#endregion

//#region props
//#endregion

interface options {
  text: string;
  value: string;
}

//#region variables
const userStore = commonStore();

const formState = reactive<{
  type: string;
  userRole: UserRoleOptions | undefined;
  workPlace: string;
  typeOptions: options[];
  userRoleOptions: options[];
  userType: string | undefined;
}>({
  type: "",
  userRole: undefined,
  workPlace: "",
  typeOptions: radioOptions.typeOptions,
  userRoleOptions: [],
  userType: ""
});

const dynamicValidateForm = reactive<{ formData: any[] }>({
  formData: radioOptions.formData
});
//#endregion

//#region hooks
onMounted(() => {
  if (userStore.user?.userType === UserType.CollectionBaseAdmin) {
    formState.typeOptions = radioOptions.typeOptions.filter(
      (item) => item.value === TypeOptions.TENANT
    );
  }
});

//#endregion

//#region function
const handleOnFocus = (index: number | boolean | Event): void => {
  dynamicValidateForm.formData[Number(index)].isFocus = true;
};

const handleOnClose = (index: number, value: string): void => {
  dynamicValidateForm.formData[index].value = dynamicValidateForm.formData[
    index
  ].value.filter((item: string) => item !== value);
};

const handleOnChange = (value: string, index: number): void => {
  dynamicValidateForm.formData[index].value = value;
};

const handleOnBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  dynamicValidateForm.formData[Number(index)].isFocus = false;
};

const handleCancel = (): void => {
  router.push({ name: routeNames.containerChild });
};

const setUserRoleOptions = (): void => {
  if (userStore.user?.userType === UserType.TenantAdmin) {
    switch (formState.type) {
      case TypeOptions.TENANT:
        formState.userRoleOptions = radioOptions.userRoleByTenantAdmim;
        break;
      case TypeOptions.PARTNER:
        formState.userRoleOptions = radioOptions.userRoleByPartner;
        break;
      case TypeOptions.CUSTOMER:
        formState.userRoleOptions = radioOptions.userRoleByCustomer;
        break;
      case TypeOptions.DESTINATION:
        formState.userRoleOptions = radioOptions.userRoleByDestination;
        break;
      default:
        formState.userRoleOptions = [];
    }
  } else if (userStore.user?.userType === UserType.CollectionBaseAdmin) {
    if (formState.type) {
      formState.userRoleOptions = radioOptions.userRoleByTenantAdmim.filter(
        (item) => item.value !== UserRoleOptions.TENANT_ADMIN
      );
    } else {
      formState.userRoleOptions = [];
    }
  }
};
//#endregion

//#region computed
const getFormData = computed(() => {
  const hideWorkPlaceField =
    !formState.type ||
    !formState.userRole ||
    (formState.type === TypeOptions.TENANT &&
      formState.userRole === UserRoleOptions.TENANT_ADMIN);

  const showSelectMultiple =
    formState.type === TypeOptions.TENANT &&
    formState.userRole &&
    [
      UserRoleOptions.COLLECTIONS_BASE_ADMIN,
      UserRoleOptions.COLLECTIONS_BASE_DRIVE,
      UserRoleOptions.DRIVE_MANUFACTURE_STAFF,
      UserRoleOptions.MANUFACTURE_STAFF
    ].includes(formState.userRole);

  if (hideWorkPlaceField) {
    return dynamicValidateForm.formData.filter(
      ({ inputType }: { inputType: string }) => inputType !== "ASelect"
    );
  } else if (showSelectMultiple) {
    return dynamicValidateForm.formData.filter(
      ({ key }: { key: number }) => key !== 8
    );
  } else {
    return dynamicValidateForm.formData.filter(
      ({ key }: { key: number }) => key !== 7
    );
  }
});

//#endregion

//#region reactive
watch(
  () => formState.type,
  () => {
    if (formState.type === TypeOptions.DESTINATION) {
      formState.userRole = UserRoleOptions.CONSIGNEE;
    }

    setUserRoleOptions();
  },
  { deep: true, immediate: true }
);

//
//#endregion
</script>

<style lang="scss" scoped>
.radio {
  width: 660px;
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
              padding: 0px;
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
