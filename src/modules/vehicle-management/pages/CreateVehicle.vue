<template>
  <a-row
    type="flex"
    justify="center"
    align="middle"
    class="create-vehicle-container"
  >
    <div class="create-vehicle-content">
      <h2 class="title">{{ $t("vehicle_add_new") }}</h2>
      <div class="create-form">
        <a-form :model="dynamicValidateForm" name="basic" autocomplete="off">
          <a-form-item
            name="formData0value"
            :validateFirst="false"
            v-if="isTenantAdmin()"
          >
            <a-radio-group
              v-model:value="ownerType"
              class="radio-group"
              :disabled="isLoading"
            >
              <label class="label-radio"
                >{{ $t("vehicle_owner_type") }}<span> *</span></label
              >
              <a-radio value="collectionBase">{{
                $t("collection_base")
              }}</a-radio>
              <a-radio value="partner">{{ $t("partner") }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <CustomForm
            :formData="dynamicValidateForm.formData"
            @change="handleOnChange"
            @onBlur="handleOnBlur"
            @onFocus="handleOnFocus"
          ></CustomForm>
        </a-form>
      </div>
      <a-row
        type="flex"
        justify="space-between"
        align="middle"
        class="check-permision"
      >
        <a-col :span="19">
          <h3>{{ $t("vehicle_industrial_waste") }}</h3>
        </a-col>
        <a-col :span="5" class="mr-2">
          <a-checkbox v-model:checked="checkPermission" :disabled="isLoading">
            {{ $t("vehicle_permission") }}
          </a-checkbox>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" align="middle" :gutter="20">
        <a-col :span="12">
          <a-button
            type="primary"
            @click="onCancel"
            :disabled="isLoading"
            ghost
            class="btn"
            >{{ $t("btn_cancel") }}</a-button
          >
        </a-col>
        <a-col :span="12">
          <a-button
            type="primary"
            class="btn"
            :loading="isLoading"
            :disabled="!isValidated"
            @click="onCreate"
            >{{ $t("btn_submit") }}</a-button
          >
        </a-col>
      </a-row>
    </div>
  </a-row>
</template>

<script setup lang="ts">
//#region import
import { i18n } from "@/i18n";
import CustomForm from "@/modules/base/components/CustomForm.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { UserType } from "@/modules/base/models/user-type.enum";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { commonStore } from "@/stores";
import { inject, onMounted, reactive, ref, watch } from "vue";
import { VehicleSelection } from "../models/vehicle.model";
//#endregion

//#region props
//#endregion

//#region variables
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
const vehicleTypes = ref<VehicleSelection[]>();
const isValidated = ref<boolean>(false);
const checkPermission = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const userStore = commonStore();
const ownerType = ref<string>("collectionBase");
const mockPartner = ref<VehicleSelection[]>([{ value: "", label: "" }]);
const listCollectionBase = ref<VehicleSelection[]>();
const defaultOwner = ref();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicValidateForm = reactive<{ formData: any[] }>({
  formData: [
    {
      inputType: "ASelect",
      value: defaultOwner,
      placeHolder: "owner",
      label: "owner",
      name: "owner",
      required: true,
      isFocus: false,
      disabled: isLoading,
      options: listCollectionBase,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("owner")
          })
        }
      ],
      dropdownClassName: "form-option-content",
      style: {
        padding: "0px",
        width: "620px",
        border: "none"
      },
      key: 0
    },
    {
      inputType: "ASelect",
      value: undefined,
      placeHolder: "vehicle_type",
      label: "vehicle_type",
      name: "vehicletype",
      required: true,
      isFocus: false,
      disabled: isLoading,
      options: vehicleTypes,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("vehicle_type")
          })
        }
      ],
      dropdownClassName: "form-option-content",
      style: {
        padding: "0px",
        width: "620px",
        border: "none"
      },
      key: 0
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "vehicle_name",
      label: "vehicle_name",
      name: "vehicleName",
      disabled: isLoading,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("vehicle_name")
          })
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 })
        }
      ],
      required: true,
      key: 1,
      isFocus: false
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "vehicle_number_plate",
      label: "vehicle_number_plate",
      name: "vehiclePlate",
      disabled: isLoading,
      required: true,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("vehicle_number_plate")
          })
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 })
        }
      ],
      key: 2,
      isFocus: false
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "vehicle_max_loading_weight",
      label: "vehicle_max_loading_weight",
      name: "maxWeight",
      disabled: isLoading,
      rules: [
        {
          max: 10,
          message: i18n.global.t("max_length_input", { maxLength: 10 })
        },
        {
          pattern: /^\d*$/,
          message: i18n.global.t("allow_input_number")
        }
      ],
      required: false,
      key: 3,
      isFocus: false
    }
  ]
});
//#endregion

//#region hooks
onMounted(() => {
  fetchVehicleType();
  fetchCollectionBase();
  fetchMockData();
});
//#endregion

//#region function
const fetchVehicleType = async (): Promise<void> => {
  const res = await service.vehicleType.getAllVehicleType();
  if (res) {
    vehicleTypes.value = res?.map((item) => ({
      value: item.id,
      label: item.name
    }));
  }
};

const isTenantAdmin = (): boolean => {
  return userStore.user?.userType === UserType.TenantAdmin;
};

const fetchCollectionBase = async (): Promise<void> => {
  const res = await service.vehicle.getCollectionBase();
  if (res) {
    listCollectionBase.value = res?.map((item) => ({
      value: item.id || 0,
      label: item.name
    }));
    if (!isTenantAdmin() && listCollectionBase.value.length === 1) {
      defaultOwner.value = listCollectionBase.value[0].value;
    }
  }
};

const fetchMockData = (): void => {
  mockPartner.value = service.vehicle.getMockPartner();
};

const handleValidateFields = (
  value: string,
  maxLength: number,
  isRequire: boolean
): boolean => {
  const valueLength = value?.length || 0;
  if (valueLength > maxLength) {
    return false;
  }
  return isRequire ? valueLength > 0 : true;
};

const handleOnChange = (): void => {
  //Todo: Need to implement for this function
};
const handleOnBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  index = Number(index);
  dynamicValidateForm.formData[index].isFocus = false;
};

const handleOnFocus = (index: number | boolean | Event): void => {
  index = Number(index);
  dynamicValidateForm.formData[index].isFocus = true;
};

const onCancel = (): void => {
  router.push({ name: routeNames.vehicle });
};
const onCreate = async (): Promise<void> => {
  isLoading.value = true;
  const vehicleInfo = {
    id: undefined,
    ownerType: ownerType.value || undefined,
    ownerId: dynamicValidateForm.formData[0].value,
    vehicleType: dynamicValidateForm.formData[1].value,
    vehicleName: dynamicValidateForm.formData[2].value,
    vehiclePlate: dynamicValidateForm.formData[3].value,
    maxWeight: dynamicValidateForm.formData[4].value,
    isHasPermission: checkPermission.value ? 1 : 0
  };
  const res = await service.vehicle.createVehicle(vehicleInfo);

  if (res) {
    messenger({
      title: "vehicle_create_success",
      message: "",
      type: MessengerType.Success
    });
    router.push({ name: routeNames.vehicle });
  } else {
    messenger({
      title: "create_failed",
      message: "please_try_again",
      type: MessengerType.Error
    });
  }
  isLoading.value = false;
};
//#endregion

//#region computed
//#endregion

//#region reactive

watch(dynamicValidateForm, () => {
  const regex = /^\d*$/;
  if (
    dynamicValidateForm.formData[0].value &&
    dynamicValidateForm.formData[1].value &&
    handleValidateFields(dynamicValidateForm.formData[2].value, 50, true) &&
    handleValidateFields(dynamicValidateForm.formData[3].value, 50, true) &&
    handleValidateFields(dynamicValidateForm.formData[4].value, 10, false) &&
    regex.test(dynamicValidateForm.formData[4].value)
  ) {
    isValidated.value = true;
  } else {
    isValidated.value = false;
  }
});
watch(
  ownerType,
  (oldVal) => {
    if (oldVal === "partner") {
      dynamicValidateForm.formData[0].options = mockPartner;
    } else {
      dynamicValidateForm.formData[0].options = listCollectionBase;
    }
  },
  { deep: true }
);
//#endregion
</script>

<style lang="scss" scoped>
.create-vehicle-container {
  height: 100%;
}
.create-vehicle-content {
  width: 660px;
  height: auto;
  background-color: $white;
  padding: 30px 20px;
  box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-weight: 600;
    font-size: 22px;
    line-height: 28px;
    color: $neutral-600;
    margin-bottom: 30px;
  }

  .check-permision {
    width: 100%;

    h3 {
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      margin: 0;
    }
  }
  .btn {
    padding: 0px 15px;
    margin-top: 30px;
    width: 180px;
    height: 48px;
    font-weight: 600;
    font-size: 18px;
    line-height: 100%;
  }
  .btn:disabled {
    background-color: $neutral-200;
    color: $white;
  }
}
:deep() {
  .create-form {
    .label-radio {
      font-weight: 600 !important;
      font-size: 16px;
      line-height: 20px;
      margin-right: 20px;
      text-align: left;
      padding-right: 10px;

      span {
        color: $red-1;
        font-weight: 400;
        font-size: 14px;
        line-height: 100%;
      }
    }
    .ant-radio-wrapper {
      margin-right: 24px;
      span {
        font-weight: 400;
        font-size: 18px;
        line-height: 100%;
      }
    }
    .ant-radio-inner {
      width: 24px;
      height: 24px;
    }
  }

  .ant-checkbox-wrapper {
    align-items: center;
    span {
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
    }
    .ant-checkbox {
      margin-bottom: 5px;
    }

    .ant-checkbox-inner {
      width: 22px;
      height: 22px;
    }
  }
}
</style>
