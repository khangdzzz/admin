<script setup lang="ts">
//#region import
import { i18n } from "@/i18n";
import { service } from "@/services";
import { message, SelectProps } from "ant-design-vue";
import { reactive, ref, watch } from "vue";
import CustomForm from "@/modules/base/components/CustomForm.vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import validator from "@/modules/base/components/validator/validator";

//#endregion

//#region props
//#endregion

//#region variables
const currentLanguage = ref("en");
const inputNumber = ref<string>("");

const options = ref<SelectProps["options"]>([
  {
    value: "jack",
    label: "Jack (100)"
  },
  {
    value: "lucy1",
    label: "Lucy (101)"
  },
  {
    value: "lucy2",
    label: "Lucy (101)"
  },
  {
    value: "lucy3",
    label: "Lucy (101)"
  },
  {
    value: "lucy4",
    label: "Lucy (101)"
  },
  {
    value: "lucy5",
    label: "Lucy (101)"
  }
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicValidateForm = reactive<{ formData: any[] }>({
  formData: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Enter Email address",
      label: "Enter Email address",
      icon: UserOutlined,
      name: "email",
      disabled: false,
      required: true,
      key: 1,
      isFocus: false,
      rules: [
        { required: true, message: "Please input your email!" },
        { validator: validator.validateEmail, trigger: ["change", "blur"] }
      ]
    },

    {
      inputType: "AInputPassword",
      value: "",
      placeHolder: "Enter password",
      label: "Enter password",
      name: "password",
      icon: LockOutlined,
      required: true,
      isFocus: false,
      key: 2
    },
    {
      inputType: "AInput",
      value: inputNumber,
      placeHolder: "Number Plate",
      label: "Number Plate",
      name: "age",
      required: true,
      isFocus: false,
      key: 3,
      rules: [
        { required: true, message: "Please input your age!" },
        { validator: validator.checkAge, trigger: "change" }
      ]
    },
    {
      inputType: "ASelect",
      value: undefined,
      placeHolder: "Vehicle type",
      label: "Vehicle type",
      name: "vehicletype",
      required: true,
      isFocus: false,
      options: options,
      dropdownClassName: "form-option-content",
      style: {
        padding: "0px"
      },
      key: 4
    },
    {
      inputType: "AAutoComplete",
      value: "",
      placeHolder: "Maximum loading weight (Ton)",
      label: "Maximum loading weight (Ton)",
      name: "autoComplete",
      required: true,
      isFocus: false,
      options: options,
      dropdownClassName: "form-option-content",
      style: {
        padding: "0px"
      },
      key: 5
    }
  ]
});

//AAutoComplete

//#endregion

//#region hooks
//#endregion

//#region function
const changeLanguage = (): void => {
  const newLang = currentLanguage.value === "ja" ? "en" : "ja";
  currentLanguage.value = newLang;
  i18n.global.locale = newLang;
};

const test = async (): Promise<void> => {
  const rs = await service.auth.test();
  if (rs) message.success(rs);
};

const format = (val: string, preVal: string): void => {
  const reg = /^-?\d*(\.\d*)?$/;
  if ((!isNaN(+val) && reg.test(val)) || val === "" || val === "-") {
    inputNumber.value = val;
  } else {
    inputNumber.value = preVal;
  }
};

const handleOnChange = (value: string | Event): void => {
  message.info(`Success: ${value}`);
};

const handleOnSelect = (values: string | Event): void => {
  message.info(`Success: ${values}`);
};

const handleOnBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  index = Number(index);
  if (!value) dynamicValidateForm.formData[index].isFocus = false;
};

const handleOnPressEnter = (): void => {
  message.info("event enter");
};

const handleOnFocus = (index: number | boolean | Event): void => {
  index = Number(index);
  dynamicValidateForm.formData[index].isFocus = true;
};
//#endregion

//#region computed
//#endregion

//#region reactive

watch(inputNumber, (val, preVal): void => {
  format(val, preVal);
});
//#endregion
</script>

<template>
  <h1>{{ $t("hello") }}</h1>

  <div class="card">
    <a-button type="primary" @click="changeLanguage">{{
      $t("hello_btn_change_language")
    }}</a-button>

    <a-button type="primary" @click="test">{{ $t("test") }}</a-button>
  </div>

  <a-form
    ref="formRef"
    name="dynamic_form_item"
    :model="dynamicValidateForm"
    style="max-width: 300px; margin: auto"
  >
    <CustomForm
      :formData="dynamicValidateForm.formData"
      @change="handleOnChange"
      @select="handleOnSelect"
      @onBlur="handleOnBlur"
      @pressEnter="handleOnPressEnter"
      @onFocus="handleOnFocus"
    ></CustomForm>
  </a-form>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
