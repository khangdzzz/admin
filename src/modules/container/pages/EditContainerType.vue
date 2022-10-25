<template>
  <div class="edit-container-type-form">
    <a-spin :tip="$t('common_loading')" :spinning="isLoadingInfo">
      <a-card :bordered="false">
        <h3 class="edit-container-type-form__title">
          {{ $t("edit_container_type") }}
        </h3>
        <a-form :model="dynamicValidateForm" name="basic" autocomplete="off">
          <CustomForm
            :formData="dynamicValidateForm.formData"
            @change="handleOnChange"
            @onBlur="handleOnBlur"
            @onFocus="handleOnFocus"
          >
          </CustomForm>
          <div class="edit-container-type-form__error" v-if="isExist">
            {{ $t("error_unique_constraint", { fieldName: $t("name") }) }}
          </div>
          <div class="edit-container-type-form__action">
            <a-button
              class="edit-container-type-form__action--cancel"
              :disabled="isLoading"
              @click="redirectToContainerType"
            >
              {{ $t("btn_cancel") }}
            </a-button>
            <a-button
              type="primary"
              class="edit-container-type-form__action--submit"
              :disabled="!isDisabled"
              :loading="isLoading"
              @click="handleSubmit"
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
import { i18n } from "@/i18n";
import CustomForm from "@/modules/base/components/CustomForm.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { commonStore } from "@/stores";
import { inject, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import ContainerTypeModel from "../models/container-type.models";

//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
const userStore = commonStore();
const messenger: (
  param: MessengerParamModel
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
) => void = inject("messenger")!;

const route = useRoute();

const { id } = route.params;
const containerTypeDetail = ref<ContainerTypeModel>();
const isDisabled = ref<boolean>(true);
const isLoadingInfo = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const isExist = ref(false);
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
            fieldName: i18n.global.t("name_lowercase")
          })
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: ["blur", "change"]
        }
      ]
    }
  ]
});
const handleOnChange = (value: string, index: number): void => {
  isDisabled.value =
    dynamicValidateForm.formData[index].value.trim().length > 0 &&
    dynamicValidateForm.formData[index].value.trim().length < 51;
};

const handleOnBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  index = Number(index);
  dynamicValidateForm.formData[index].isFocus = false;
};
const handleOnFocus = (index: number | boolean | Event): void => {
  isExist.value = false;
  index = Number(index);
  dynamicValidateForm.formData[index].isFocus = true;
};
const redirectToContainerType = (): void => {
  router.push({ name: routeNames.containerType });
};
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
onMounted(() => {
  fetchContainerTypeById();
});
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
const fetchContainerTypeById = async (): Promise<void> => {
  isLoadingInfo.value = true;
  const data = await service.container.getContainerTypeById(id.toString());
  isLoadingInfo.value = false;
  if (data.res) {
    const { name } = data.res;
    containerTypeDetail.value = data.res;
    dynamicValidateForm.formData[0].value = name;
    isDisabled.value = true;
  }
};

const handleSubmit = async (): Promise<void> => {
  const currentContainerType = dynamicValidateForm.formData[0].value;
  if (!userStore.user || !currentContainerType?.length) return;
  isLoading.value = true;
  const { error } = await service.container.editContainerTypeById(
    id,
    userStore.user?.tenantId,
    currentContainerType.replace(/\s+/g, " ").trim()
  );
  isLoading.value = false;
  if (!error) {
    messenger({
      title: "container_type_eidt_successfully",
      message: "",
      type: MessengerType.Success,
      callback: (isConfirm: boolean) => {
        isConfirm;
        goToContainerTypeListPage();
      }
    });
  } else {
    if (error === "error_unique_constraint") {
      isExist.value = true;
      return;
    }
    messenger({
      title: "edit_failed",
      message: "",
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
.edit-container-type-form {
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
  &__error {
    margin-top: -18px;
    padding-bottom: 8px;
    font-size: 12px;
    color: $red-1;
  }
  &__title {
    font-size: 22px;
    font-weight: 600;
    line-height: 18px;
    text-align: center;
    margin-bottom: 30px;
    color: $neutral-600;
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

    &--cancel {
      color: $primary-400;
      border-color: $primary-400;
      margin-right: 20px;
    }
  }
}

.edit-container-type-form__action--save.active {
  background: $primary;
  color: $neutral-0;
}
.edit-container-type-form {
  .ant-card {
    border-radius: 10px;
  }
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
