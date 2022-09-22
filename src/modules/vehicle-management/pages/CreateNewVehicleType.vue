<template>
  <div class="create-new-vehicle-type-form">
    <a-card :bordered="false">
      <h3 class="create-new-vehicle-type-form__title">
        {{ $t("create_vehicle_type_lbl_page_title") }}
      </h3>
      <a-form :model="dynamicValidateForm" name="basic" autocomplete="off">
        <CustomForm
          :formData="dynamicValidateForm.formData"
          @change="handleOnChange"
          @onBlur="handleOnBlur"
          @onFocus="handleOnFocus">
        </CustomForm>
        <div class="create-new-vehicle-type-form__action">
          <a-button
            class="create-new-vehicle-type-form__action--cancel"
            :disabled="isLoading"
            @click="redirectToVehicleType">
            {{ $t("btn_cancel") }}
          </a-button>
          <a-button
            type="primary"
            class="create-new-vehicle-type-form__action--submit"
            html-type="submit"
            :disabled="!isValidated"
            :loading="isLoading"
            @click="createVehicleType">
            {{ $t("btn_submit") }}
          </a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import CustomForm from "../../base/components/CustomForm.vue";
import { inject, reactive, ref } from "vue";
import { routeNames } from "@/routes/route-names";
import { router } from "@/routes";
import { i18n } from "@/i18n";
import { service } from "@/services";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { commonStore } from "@/stores";

//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
const userStore = commonStore();
const messenger: (
  title: string,
  message: string,
  type: MessengerType,
  callback: (() => void) | undefined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
) => void = inject("messenger")!;

const isValidated = ref<boolean>(false);
const isLoading = ref<boolean>(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicValidateForm = reactive<{ formData: any[] }>({
  formData: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "create_vehicle_type_edt_vehicle_name",
      label: "create_vehicle_type_edt_vehicle_name",
      name: "name",
      disabled: false,
      required: true,
      key: 1,
      isFocus: false,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("create_vehicle_type_edt_vehicle_name")
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
  if (dynamicValidateForm.formData[index].value.length > 0) {
    isValidated.value = true;
  } else {
    isValidated.value = false;
  }
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
const redirectToVehicleType = (): void => {
  router.push({ name: routeNames.vehicleType });
};
const createVehicleType = async (): Promise<void> => {
  const newVehicleTypeName = dynamicValidateForm.formData[0].value;
  if (!userStore.user || !newVehicleTypeName?.length) return;
  isLoading.value = true;
  const newVehicleType = await service.vehicleType.createVehicleType(
    userStore.user?.tenantId,
    "Motobike"
  );
  isLoading.value = false;
  if (newVehicleType) {
    messenger(
      "create_vehicle_type_msg_create_successfully",
      "",
      MessengerType.Success,
      () => {
        goToVehicleTypeListPage();
      }
    );
  } else {
    messenger(
      "create_vehicle_type_msg_create_fail_title",
      "create_vehicle_type_msg_create_fail_message",
      MessengerType.Error,
      undefined
    );
  }
};
const goToVehicleTypeListPage = (): void => {
  router.push({ name: routeNames.vehicleType });
};
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
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
  border-radius: 20px;
  padding: 6px 0;

  &__title {
    font-size: 22px;
    font-weight: 600;
    line-height: 18px;
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
    &--submit {
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
</style>
