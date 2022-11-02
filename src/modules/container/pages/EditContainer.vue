<template>
  <a-row type="flex" justify="center" align="middle" class="edit-container">
    <a-spin :tip="$t('common_loading')" :spinning="isLoadingInfo">
      <div class="edit-container-content">
        <h2 class="title">{{ $t("container_edit_container") }}</h2>
        <div>
          <a-form
            ref="formRef"
            :model="dynamicValidateForm"
            name="editContainer"
            layout="inline"
            class="edit-form-container"
          >
            <CustomForm
              :formData="dynamicValidateForm.formData"
              @onBlur="handleOnBlur"
              @onFocus="handleOnFocus"
            >
            </CustomForm>
          </a-form>
        </div>
        <a-row type="flex" justify="center" align="middle" gutter="20">
          <a-col :span="12">
            <a-button
              type="primary"
              @click="onCancel"
              ghost
              class="btn"
              :disabled="isSubmitting"
              >{{ $t("btn_cancel") }}</a-button
            >
          </a-col>
          <a-col :span="12">
            <a-button
              type="primary"
              class="btn"
              :disabled="!isAllowSubmit"
              :loading="isSubmitting"
              @click="updateContainer"
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
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { makeUniqueName } from "@/utils/string.helper";
import { Rule } from "ant-design-vue/lib/form";
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Container, ContainerSelection } from "../models/container.model";
import {
  validateContainerName,
  validateWeight,
  validateContainerCapacity
} from "../validators/container.validator";

const route = useRoute();

//#endregion

//#region props
//#endregion

//#region variables
const { id } = route.params;
const containerTypes = ref<ContainerSelection[]>([]);
const isValidated = ref<boolean>(true);
const isExist = ref<boolean>(false);
const isLoadingInfo = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicValidateForm = reactive<{ formData: any[] }>({
  formData: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "container_container_name",
      label: "container_container_name",
      name: "containerName",
      disabled: false,
      rules: [
        {
          validator: (_rule: Rule, value: string): Promise<void> => {
            const error = validateContainerName(value, isExist.value);
            if (error) return Promise.reject(error);
            return Promise.resolve();
          },
          trigger: ["blur", "change"]
        }
      ],
      required: true,
      key: 1,
      isFocus: false
    },
    {
      inputType: "ASelect",
      value: undefined,
      placeHolder: "container_container_type",
      label: "container_container_type",
      name: "containerType",
      required: true,
      isFocus: false,
      options: containerTypes,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("container_container_type").toLowerCase()
          })
        }
      ],
      dropdownClassName: "form-option-content",
      style: {
        padding: "0px",
        width: "620px",
        border: "none"
      },
      key: 2
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "container_weight",
      label: "container_weight",
      name: "weight",
      inline: true,
      disabled: false,
      spaceStyle: {
        display: "inline-block",
        width: "16px"
      },
      rules: [
        {
          validator: (_rule: Rule, value: string): Promise<void> => {
            const error = validateWeight("container_weight", true, value);
            if (error) return Promise.reject(error);
            return Promise.resolve();
          },
          trigger: ["change", "blur"]
        }
      ],
      required: true,
      key: 3,
      isFocus: false
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "container_capacity",
      label: "container_capacity",
      name: "capacity",
      inline: true,
      disabled: false,
      rules: [
        {
          validator: (_rule: Rule, value: string): Promise<void> => {
            const error = validateContainerCapacity(value);
            if (error) return Promise.reject(error);
            return Promise.resolve();
          },
          trigger: ["change", "blur"]
        }
      ],
      required: false,
      key: 4,
      isFocus: false
    }
  ]
});

const fieldName: Record<string, number> = {
  containerName: 0,
  containerTypeId: 1,
  weight: 2,
  capacity: 3
};

const formRef = ref();

const messenger: (
  param: MessengerParamModel
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
) => void = inject("messenger")!;
//#endregion

//#region hooks
onMounted(() => {
  Promise.all([fetchContainerType(), fetchContainerById()]);
});
//#endregion

//#region function
const fetchContainerType = async (): Promise<void> => {
  const res = await service.container.getListContainerType(1, "full");
  if (res && res.results) {
    containerTypes.value = res?.results.map(
      ({ id, name }: { id: number; name: string }) => ({
        value: id || "",
        label: name
      })
    );
  }
};

const fetchContainerById = async (): Promise<void> => {
  isLoadingInfo.value = true;
  const res = await service.container.getContainerById(+id);
  if (res) {
    for (const key of Object.keys(fieldName)) {
      dynamicValidateForm.formData[fieldName[key]].value =
        res[key as keyof Container];
    }
  }
  isLoadingInfo.value = false;
};

const handleValidateFields = (
  value: string,
  maxLength: number,
  isRequire: boolean
): boolean => {
  const valueLength = value.toString()?.length || 0;
  if (valueLength > maxLength) {
    return false;
  }
  return isRequire ? valueLength > 0 : true;
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

const onCancel = (): void => {
  router.push({ name: routeNames.container });
};

const updateContainer = async (): Promise<void> => {
  const [name, container_type___name, weight, capacity] =
    dynamicValidateForm.formData;
  isSubmitting.value = true;
  const { error } = await service.container.editContainer({
    id: Number(id),
    name: makeUniqueName(name.value.toString()) || "",
    container_type_id: Number(container_type___name.value),
    weight: Number(weight.value),
    capacity: capacity.value || null
  });
  isSubmitting.value = false;
  if (!error) {
    messenger({
      title: "common_msg_edit_successfully",
      message: "",
      type: MessengerType.Success,
      callback: (isConfirm: boolean) => {
        isConfirm;
        onCancel();
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

//#endregion

//#region computed
//#endregion

//#region reactive
const isAllowSubmit = computed(() => {
  if (validateContainerName(dynamicValidateForm.formData[0].value, false)) {
    return false;
  }
  if (
    validateWeight(
      "container_weight",
      true,
      dynamicValidateForm.formData[2].value
    )
  ) {
    return false;
  }
  if (validateContainerCapacity(dynamicValidateForm.formData[3].value)) {
    return false;
  }
  return dynamicValidateForm.formData[1].value;
});

watch(dynamicValidateForm, () => {
  if (
    dynamicValidateForm.formData[0].value &&
    handleValidateFields(dynamicValidateForm.formData[1].value, 50, true) &&
    dynamicValidateForm.formData[2].value
  ) {
    isValidated.value = true;
  } else {
    isValidated.value = false;
  }
});

watch(isExist, () => {
  formRef.value.validate();
});

//#endregion
</script>

<style lang="scss" scoped>
.edit-container {
  height: 100%;
}

.edit-container-content {
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
    position: relative;
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

  .disabled-color {
    color: $neutral-400;
  }

  .disabled-color span {
    color: $neutral-400 !important;
  }
}

:deep() {
  .ant-select {
    font-size: 16px;
    color: $neutral-800;
    font-weight: 400;
  }

  .disabled-color ~ label span {
    color: $neutral-400 !important;
  }

  .disabled-color .ant-select-selector {
    color: $neutral-400 !important;
  }

  .edit-form-container {
    .ant-form-item {
      margin-right: 0px;
      margin-bottom: 20px;

      .ant-form-item-control {
        .ant-form-item-control-input {
          .ant-form-item-control-input-content {
            .input-item {
              padding: 0px;
              width: 620px;
            }
            .not-has-icon {
              padding-left: 12px;
            }
            .inline {
              width: 300px !important;
            }
          }
        }
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
    }
  }
}
</style>
