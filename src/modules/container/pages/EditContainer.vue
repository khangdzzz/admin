<template>
  <a-row type="flex" justify="center" align="middle" class="edit-container">
    <div class="edit-container-content">
      <h2 class="title">{{ $t("container_edit_container") }}</h2>
      <div class="edit-form-container">
        <a-form
          :model="dynamicValidateForm"
          name="editContainer"
          autocomplete="off"
        >
          <a-form-item name="formDatavalue" :validateFirst="false">
            <a-radio-group
              disabled
              v-model:value="ownerType"
              class="radio-group"
            >
              <label class="label-radio disabled-color"
                >{{ $t("container_owner_type") }}<span> *</span></label
              >
              <a-radio value="collectionBase">{{
                $t("collection_base")
              }}</a-radio>
              <a-radio value="partner">{{ $t("partner") }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <CustomForm
            :formData="dynamicValidateForm.formData"
            @onBlur="handleOnBlur"
            @onFocus="handleOnFocus"
          ></CustomForm>
        </a-form>
      </div>
      <a-row type="flex" justify="center" align="middle" gutter="20">
        <a-col :span="12">
          <a-button type="primary" @click="onCancel" ghost class="btn">{{
            $t("btn_cancel")
          }}</a-button>
        </a-col>
        <a-col :span="12">
          <a-button
            type="primary"
            class="btn"
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
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { message } from "ant-design-vue";
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ContainerSelection } from "../models/container.model";

const route = useRoute();

//#endregion

//#region props
//#endregion

//#region variables
const { id } = route.params;
const containerTypes = ref<ContainerSelection[]>([]);
const isValidated = ref<boolean>(false);
const ownerType = ref<string>("collectionBase");
const mockPartner = ref<ContainerSelection[]>([{ value: "", label: "" }]);
const mockCollectionBase = ref<ContainerSelection[]>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicValidateForm = reactive<{ formData: any[] }>({
  formData: [
    {
      inputType: "ASelect",
      value: undefined,
      placeHolder: "owner",
      label: "owner",
      name: "owner",
      disabled: true,
      required: true,
      isFocus: false,
      options: mockCollectionBase,
      class: "disabled-color",
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
      inputType: "AInput",
      value: "",
      placeHolder: "container_container_name",
      label: "container_container_name",
      name: "containerName",
      disabled: false,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("container_container_name")
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
            fieldName: i18n.global.t("container_container_type")
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
    }
  ]
});
//#endregion

//#region hooks
onMounted(() => {
  Promise.all([fetchContainerType(), fetchMockData(), fetchContainerById()]);
});
//#endregion

//#region function
const fetchContainerType = (): void => {
  const res = service.container.getContainerTypes();
  containerTypes.value = res.map((item) => ({
    value: item.id || "",
    label: item.name
  }));
};

const fetchMockData = (): void => {
  mockCollectionBase.value = service.container.getMockCollectionBase();
  mockPartner.value = service.vehicle.getMockPartner();
};
const fetchContainerById = (): void => {
  const res = service.container.getContainerById(id.toString());
  if (res) {
    const toArrayRes = Object.values(res);
    dynamicValidateForm.formData.forEach((item, index) => {
      dynamicValidateForm.formData[index].value = toArrayRes[index];
    });
  }
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
  router.push({ name: routeNames.containerChild });
};
const onCreate = async (): Promise<void> => {
  const containerInfo = {
    id: id.toString(),
    containerType: dynamicValidateForm.formData[0].value,
    containerName: dynamicValidateForm.formData[1].value
  };
  const res = await service.container.updateContainer(containerInfo);
  if (res) {
    message.success("updated");
  } else {
    message.error("error");
  }
};
//#endregion

//#region computed
//#endregion

//#region reactive

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
watch(
  ownerType,
  (oldVal) => {
    if (oldVal === "partner") {
      dynamicValidateForm.formData[0].options = mockPartner;
    } else {
      dynamicValidateForm.formData[0].options = mockCollectionBase;
    }
  },
  { deep: true }
);
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
