<template>
  <a-row
    type="flex"
    justify="center"
    align="middle"
    class="edit-vehicle-container"
  >
    <a-spin :tip="$t('common_loading')" :spinning="isLoading">
      <div class="edit-vehicle-content">
        <h2 class="title">{{ $t("vehicle_edit") }}</h2>
        <div class="edit-form">
          <a-form
            :model="dynamicValidateForm"
            name="basic"
            autocomplete="off"
            ref="formRef"
          >
            <a-form-item
              name="formDatavalue"
              :validateFirst="false"
              class="mb-20"
            >
              <label class="label-radio"
                >{{ $t("vehicle_owner_type") }}<span> *</span></label
              >

              <a-radio-group
                class="radio-group"
                v-model:value="ownerType"
                :disabled="true"
              >
                <a-radio class="radio-group__content" value="collectionBase">{{
                  $t("collection_base")
                }}</a-radio>
                <a-radio class="radio-group__content" value="partner">{{
                  $t("partner")
                }}</a-radio>
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
            <a-checkbox v-model:checked="checkPermission">
              <span class="check-permision__label">{{
                $t("vehicle_permission")
              }}</span>
            </a-checkbox>
          </a-col>
        </a-row>
        <a-row type="flex" justify="center" align="middle" gutter="20">
          <a-col :span="12">
            <a-button
              type="primary"
              @click="goToVehicleList"
              ghost
              class="btn"
              :loading="isLoadingBtn"
              >{{ $t("btn_cancel") }}</a-button
            >
          </a-col>
          <a-col :span="12">
            <a-button
              type="primary"
              class="btn"
              :loading="isLoadingBtn"
              :disabled="!isValidated || existFields.length"
              @click="updateVehicle"
              >{{ $t("btn_save") }}</a-button
            >
          </a-col>
        </a-row>
      </div>
    </a-spin>
  </a-row>
</template>

<script setup lang="ts">
//#region import
import { i18n } from "@/i18n";
import CustomForm from "@/modules/base/components/CustomForm.vue";
import validator from "@/modules/base/components/validator/validator";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { sortDropdown } from "@/utils/sortable.helper";
import { Rule } from "ant-design-vue/lib/form";
import { inject, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { VehicleSelection } from "../models/vehicle.model";

//#endregion

//#region props
//#endregion

//#region variables
const vehicleTypes = ref<VehicleSelection[]>();
const isValidated = ref<boolean>(true);
const checkPermission = ref<boolean>(false);
const ownerType = ref<string>("collectionBase");
const mockPartner = ref<VehicleSelection[]>([{ value: "", label: "" }]);
const listCollectionBase = ref<VehicleSelection[]>();
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
const route = useRoute();
const { id } = route.params;
const isLoading = ref<boolean>(false);
const isLoadingBtn = ref<boolean>(false);

const formRef = ref();
const existFields = ref<string[]>([]);

let handleIsExistName = async (): Promise<void> => {
  if (existFields.value.includes("name")) {
    return Promise.reject(
      i18n.global.t("error_unique_constraint", {
        fieldName: i18n.global.t("create_vehicle_lbl_vehicle_name")
      })
    );
  }

  return Promise.resolve();
};

let handleIsExistNumberPlate = async (): Promise<void> => {
  if (existFields.value.includes("plate_number")) {
    return Promise.reject(
      i18n.global.t("error_unique_constraint", {
        fieldName: i18n.global.t("number_plate")
      })
    );
  }

  return Promise.resolve();
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicValidateForm = reactive<{ formData: any[] }>({
  formData: [
    {
      inputType: "ASelect",
      value: undefined,
      placeHolder: "owner",
      label: "owner",
      name: "owner",
      required: true,
      disabled: true,
      isFocus: false,
      options: listCollectionBase,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("owner").toLowerCase()
          }),
          trigger: ["change", "blur"]
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
      options: vehicleTypes,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("vehicle_type").toLowerCase(),
            trigger: ["change", "blur"]
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
      disabled: false,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global
              .t("create_vehicle_lbl_vehicle_name")
              .toLowerCase()
          }),
          trigger: ["change", "blur"]
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: ["change", "blur"]
        },
        {
          validator: handleIsExistName,
          trigger: ["change", "blur"]
        }
      ],
      required: true,
      key: 1,
      isFocus: false
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "number_plate",
      label: "number_plate",
      name: "vehiclePlate",
      disabled: false,
      required: true,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global
              .t("create_vehicle_lbl_vehicle_number_plate")
              .toLowerCase()
          }),
          trigger: ["change", "blur"]
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: ["change", "blur"]
        },
        {
          validator: handleIsExistNumberPlate,
          trigger: ["change", "blur"]
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
      disabled: false,
      rules: [
        {
          validator: (_rule: Rule, value: string): Promise<void> => {
            const error = validator.validateDecimal(
              "vehicle_max_loading_weight",
              false,
              value
            );
            if (error) return Promise.reject(error);
            return Promise.resolve();
          },
          trigger: ["blur", "change"]
        }
      ],
      required: false,
      key: 3,
      isFocus: false
    }
  ]
});

const [owner, vehicleType, name, numberPlate, maxWeight] =
  dynamicValidateForm.formData;
//#endregion

//#region hooks
onMounted(async () => {
  isLoading.value = true;
  fetchMockData();
  await Promise.all([
    fetchVehicleType(),
    fetchCollectionBase(),
    fetchVehicleById()
  ]);
  isLoading.value = false;
});
//#endregion

//#region function
const fetchVehicleById = async (): Promise<void> => {
  const res = await service.vehicle.getVehicleDetail(id.toString());
  if (res) {
    owner.value = res.ownerName;
    vehicleType.value = res.vehicleTypeId;
    name.value = res.vehicleName;
    numberPlate.value = res.vehiclePlate;
    maxWeight.value = res.maxWeight || null;
    checkPermission.value = res.isHasPermission === 1 ? true : false;
  }
  isValidated.value = true;
};

const fetchVehicleType = async (): Promise<void> => {
  const res = await service.vehicleType.getAllVehicleType();
  if (res) {
    vehicleTypes.value = sortDropdown(
      res?.map((item) => ({
        value: item.id,
        label: item.name
      }))
    );
  }
};
const fetchCollectionBase = async (): Promise<void> => {
  const res = await service.vehicle.getCollectionBase(undefined);
  if (res) {
    listCollectionBase.value = sortDropdown(
      res?.map((item) => ({
        value: item.id || 0,
        label: item.name
      }))
    );
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
  //Todo: need to implement for this function
};
const handleOnBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  index = Number(index);
  dynamicValidateForm.formData[index].isFocus = false;
  clearExistError(index);
};

const handleOnFocus = (index: number | boolean | Event): void => {
  index = Number(index);
  dynamicValidateForm.formData[index].isFocus = true;
  clearExistError(index);
};

const clearExistError = (index: number): void => {
  if (index === 2 && existFields.value.length) {
    const errorIndex = existFields.value.indexOf("name");
    if (errorIndex >= 0) {
      existFields.value.splice(errorIndex, 1);
    }
  }

  if (index === 3 && existFields.value.length) {
    const errorIndex = existFields.value.indexOf("plate_number");
    if (errorIndex >= 0) {
      existFields.value.splice(errorIndex, 1);
    }
  }
};

const goToVehicleList = (): void => {
  router.push({ name: routeNames.vehicle });
};
const updateVehicle = async (): Promise<void> => {
  const vehicleInfo = {
    id: +id,
    vehicleType: +dynamicValidateForm.formData[1].value,
    vehicleName: dynamicValidateForm.formData[2].value,
    vehiclePlate: dynamicValidateForm.formData[3].value,
    maxWeight: dynamicValidateForm.formData[4].value,
    isHasPermission: checkPermission.value ? 1 : 0
  };
  isLoadingBtn.value = true;
  const { res, error, errorParams } = await service.vehicle.updateVehicle(
    vehicleInfo
  );
  isLoadingBtn.value = false;
  if (res) {
    messenger({
      title: "common_msg_edit_successfully",
      message: "",
      type: MessengerType.Success
    });
    goToVehicleList();
  } else {
    if ((error as string) === "error_unique_constraint") {
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
//#endregion

//#region reactive

watch(
  dynamicValidateForm,
  () => {
    if (
      dynamicValidateForm.formData[0].value &&
      dynamicValidateForm.formData[1].value &&
      handleValidateFields(dynamicValidateForm.formData[2].value, 50, true) &&
      handleValidateFields(dynamicValidateForm.formData[3].value, 50, true) &&
      !validator.validateDecimal(
        "vehicle_max_loading_weight",
        false,
        dynamicValidateForm.formData[4].value
      )
    ) {
      isValidated.value = true;
    } else {
      isValidated.value = false;
    }
  },
  { deep: true }
);
watch(
  ownerType,
  (oldVal) => {
    if (oldVal === "partner") {
      dynamicValidateForm.formData[0].options = mockPartner.value;
    } else {
      dynamicValidateForm.formData[0].options = listCollectionBase.value;
    }
  },
  { deep: true }
);
//#endregion
</script>

<style lang="scss" scoped>
.edit-vehicle-container {
  height: 100%;
}
.edit-vehicle-content {
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
    margin-top: 11px;

    h3 {
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      margin: 0;
      color: $neutral-600;
    }
    &__label {
      color: $neutral-600;
    }
  }
  .btn {
    padding: 0px 15px;
    margin-top: 31px;
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
  .edit-form {
    .ant-form {
      .ant-form-item {
        margin-bottom: 20px;
        .ant-form-item-control {
          .ant-form-item-explain {
            .ant-form-item-explain-error {
              line-height: 14.06px;
              margin-bottom: 5px !important;
            }
          }
          .ant-form-item-control-input {
            .ant-form-item-control-input-content {
              display: flex;
              align-items: center;
              .input-item {
                .ant-input {
                  color: $neutral-800;
                }
              }
              .ant-select-single {
                .ant-select-selector {
                  .ant-select-selection-item {
                    color: $neutral-800;
                    font-size: 16px;
                  }
                }
              }
              .ant-select-disabled {
                .ant-select-selector {
                  background-color: $grey-2;
                  .ant-select-selection-item {
                    color: $text-1 !important;
                    font-size: 16px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .label-radio {
      font-weight: 600 !important;
      font-size: 16px;
      line-height: 20px;
      margin-right: 20px;
      text-align: left;
      padding-right: 10px;
      color: $text-1;

      span {
        font-weight: 400;
        font-size: 14px;
        line-height: 100%;
      }
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
      border-radius: 4px;
    }
  }
}
</style>
