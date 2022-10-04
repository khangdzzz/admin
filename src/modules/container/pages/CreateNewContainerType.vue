<template>
  <div class="create-new-container-type-form">
    <a-card :bordered="false">
      <h3 class="create-new-container-type-form__title">
        {{ $t("add_new_container_type") }}
      </h3>
      <a-form :model="dynamicValidateForm" name="basic" autocomplete="off">
        <CustomForm
          :formData="dynamicValidateForm.formData"
          @change="handleOnChange"
          @onBlur="handleOnBlur"
          @onFocus="handleOnFocus"
        >
        </CustomForm>
        <div class="create-new-container-type-form__action">
          <a-button
            class="create-new-container-type-form__action--cancel"
            :disabled="isLoading"
            @click="redirectToContainerType"
          >
            {{ $t("btn_cancel") }}
          </a-button>
          <a-button
            type="primary"
            class="create-new-container-type-form__action--submit"
            html-type="submit"
            :disabled="!isDisabled"
            :loading="isLoading"
            @click="createContainerType"
          >
            {{ $t("btn_submit") }}
          </a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import { i18n } from "@/i18n";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { commonStore } from "@/stores";
import { inject, reactive, ref } from "vue";
import CustomForm from "../../base/components/CustomForm.vue";

//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
const userStore = commonStore();
const messenger: (
  param: MessengerParamModel
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
) => void = inject("messenger")!;

const isDisabled = ref<boolean>(false);
const isLoading = ref<boolean>(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicValidateForm = reactive<{ formData: any[] }>({
  formData: [
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
          trigger: ["blur", "change"],
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("container_type")
          })
        },
        {
          max: 50,
          trigger: ["blur", "change"],
          message: i18n.global.t("max_length_input", { maxLength: 50 })
        }
      ]
    }
  ]
});
const handleOnChange = (value: string, index: number): void => {
  isDisabled.value =
    dynamicValidateForm.formData[index].value.length > 0 &&
    dynamicValidateForm.formData[index].value.length < 51;
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
const redirectToContainerType = (): void => {
  router.push({ name: routeNames.containerType });
};
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
const createContainerType = async (): Promise<void> => {
  const newContainerTypeName = dynamicValidateForm.formData[0].value;
  if (!userStore.user || !newContainerTypeName?.length) return;
  isLoading.value = true;
  const newContainerType = await service.container.createContainerType(
    userStore.user?.tenantId,
    newContainerTypeName
  );
  isLoading.value = false;
  if (newContainerType) {
    messenger({
      title: "create_container_type_msg_create_successfully",
      message: "",
      type: MessengerType.Success,
      callback: (isConfirm: boolean) => {
        isConfirm;
        goToContainerTypeListPage();
      }
    });
  } else {
    messenger({
      title: "create_vehicle_type_msg_create_fail_title",
      message: "create_vehicle_type_msg_create_fail_message",
      type: MessengerType.Error
    });
  }
};

const goToContainerTypeListPage = (): void => {
  router.push({ name: routeNames.containerType });
};
//#endregion===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊

//#===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏Computed
//#endregion===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏

//#===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
//#endregion===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍

//===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀Watchers
//#endregion===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀
</script>

<style lang="scss" scoped>
.create-new-container-type-form {
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
      width: 180px !important;
      height: 48px !important;
      height: 18px;
      font-family: "Roboto";
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 100%;
      padding: 15px;
    }

    &--submit {
      background-color: $neutral-200;
      color: $neutral-0;
    }

    &--cancel {
      color: $primary-400;
      border-color: $primary-400;
      margin-right: 20px;
    }
  }
}

.create-new-container-type-form__action--save.active {
  background: $primary;
  color: $neutral-0;
}

:deep() {
  .ant-form-item-explain.ant-form-item-explain-connected {
    .ant-form-item-explain-error {
      margin-top: 8px;
      font-size: 12px;
      color: $red-500;
    }
  }

  .ant-form-item-control {
    &-input {
      &-content {
        .input-item {
          width: 620px !important;
        }
      }
    }
  }

}
</style>
