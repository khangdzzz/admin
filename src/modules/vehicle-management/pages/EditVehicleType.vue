<template>
  <div class="create-new-vehicle-type-form">
    <a-spin :tip="$t('common_loading')" :spinning="isLoadingInfo">
      <a-card :bordered="false">
        <h3 class="create-new-vehicle-type-form__title">
          {{ $t("edit_vehicle_type_lbl_page_title") }}
        </h3>
        <a-form
          :model="dynamicValidateForm"
          name="basic"
          autocomplete="off"
          @finish="handleFinish"
        >
          <CustomForm
            :formData="dynamicValidateForm.formData"
            @change="handleOnChange"
            @onBlur="handleOnBlur"
            @onFocus="handleOnFocus"
          >
          </CustomForm>
          <div class="create-new-vehicle-type-form__error" v-if="isExist">
            {{ $t("error_unique_constraint", { fieldName: $t("name") }) }}
          </div>
          <div class="create-new-vehicle-type-form__action">
            <a-button
              class="create-new-vehicle-type-form__action--cancel"
              :disabled="isLoading"
              @click="redirectToVehicleType"
            >
              {{ $t("btn_cancel") }}
            </a-button>
            <a-button
              type="primary"
              class="create-new-vehicle-type-form__action--save"
              html-type="save"
              :disabled="!isValidated"
              :loading="isLoading"
            >
              {{ $t("btn_save") }}
            </a-button>
          </div>
        </a-form>
      </a-card>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import CustomForm from "../../base/components/CustomForm.vue";
import { inject, onMounted, reactive, ref } from "vue";
import { routeNames } from "@/routes/route-names";
import { router } from "@/routes";
import { i18n } from "@/i18n";
import { service } from "@/services";
import { commonStore } from "@/stores";
import { useRoute } from "vue-router";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { VehicleTypeModel } from "../models";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";

//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
const isValidated = ref<boolean>(true);
const isLoading = ref<boolean>(false);
const isLoadingInfo = ref<boolean>(false);
const route = useRoute();
const userStore = commonStore();
const vehicleTypeId = ref<string | string[]>("");
const vehicleTypeDetail = ref<VehicleTypeModel>();
const isExist = ref(false);
const messenger: (
  param: MessengerParamModel
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
) => void = inject("messenger")!;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicValidateForm = reactive<{ formData: any[] }>({
  formData: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "name",
      label: "name",
      name: "name",
      disabled: isLoading,
      required: true,
      key: 1,
      isFocus: false,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("name_lowercase")
          })
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 })
        }
      ]
    }
  ]
});

const handleOnChange = (value: string, index: number): void => {
  isValidated.value =
    dynamicValidateForm.formData[index].value.trim().length > 0 &&
    dynamicValidateForm.formData[index].value.trim().length < 51;
};

const handleOnBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  isExist.value = false;
  index = Number(index);
  dynamicValidateForm.formData[index].isFocus = false;
};

const handleOnFocus = (index: number | boolean | Event): void => {
  index = Number(index);
  dynamicValidateForm.formData[index].isFocus = true;
};

const redirectToVehicleType = (): void => {
  router.push({ name: routeNames.vehicleType });
};

const getVehicleTypeDetail = async (): Promise<void> => {
  isLoadingInfo.value = true;
  const response = await service.vehicleType.getVehicleTypeById(
    vehicleTypeId.value
  );
  isLoadingInfo.value = false;
  if (response) {
    vehicleTypeDetail.value = response;
    dynamicValidateForm.formData[0].value = response.name.trim();
  }
};

const handleFinish = async (): Promise<void> => {
  const ternantId = userStore.user?.tenantId;
  const name = dynamicValidateForm.formData[0].value.trim();
  isLoading.value = true;
  const { error } = await service.vehicleType.editVehicleTypeById(
    vehicleTypeId.value,
    ternantId,
    name.replace(/\s+/g, " ").trim()
  );
  isLoading.value = false;
  if (!error) {
    messenger({
      title: "edit_vehicle_type_successfully",
      message: "",
      type: MessengerType.Success,
      callback: (isConfirm: boolean) => {
        isConfirm;
        redirectToVehicleType();
      }
    });
  } else {
    if (error === "error_unique_constraint") {
      isExist.value = true;
      return;
    }
    messenger({
      title: "edit_vehicle_type_successfully",
      message: "",
      type: MessengerType.Error,
      callback: (isConfirm: boolean) => {
        isConfirm;
        redirectToVehicleType();
      }
    });
  }
};
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
onMounted(() => {
  vehicleTypeId.value = route.params?.id;
  getVehicleTypeDetail();
});
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
//#endregion===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊

//#===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏Computed
//#endregion===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏

//#===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
//#endregion===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍

//===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀Watchers
//#endregion===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀
</script>

<style lang="scss" scoped>
.create-new-vehicle-type-form {
  font-family: "Roboto" !important;
  font-style: normal;
  width: 660px;
  height: auto;
  margin: auto;
  background-color: $neutral-0;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 10px;
  padding: 10px;
  &__error {
    margin-top: -18px;
    padding-bottom: 8px;
    font-size: 12px;
    color: $red-1;
  }
  &__title {
    font-size: 22px;
    font-weight: 600;
    height: 28px;
    color: $neutral-600;
    line-height: 28px;
    text-align: center;
    margin-bottom: 30px;
  }

  &__action {
    display: flex;
    flex-direction: row;
    text-align: center;
    font-weight: 600;
    font-size: 18px;
    line-height: 100%;
    justify-content: center;
    margin-top: 6px;

    &--cancel,
    &--save {
      width: 175px !important;
      height: 48px !important;
      height: 18px;
      font-family: "Roboto";
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 100%;
      padding: 15px;
    }

    &--cancel {
      color: $primary-400;
      border-color: $primary-400;
      margin-right: 20px;
    }
  }
}

.create-new-vehicle-type-form__action--save.active {
  background: $primary;
  color: $neutral-0;
}
.create-new-vehicle-type-form .ant-card-body {
  padding: 20px 10px !important;
}
:deep() {
  .ant-card-body {
    padding: 20px 10px !important;
  }
  .ant-form-item-explain {
    margin-top: 8px;
  }
  .ant-form-item {
    margin-bottom: 25px;
  }
}
</style>
