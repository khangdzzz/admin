import { i18n } from "@/i18n";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
import validator from "@/modules/base/components/validator/validator";

export const formData: FormData = {
  singleInput: [
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
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("name")
          }),
          trigger: "blur"
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: "blur"
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Short name",
      label: "shortName",
      name: "shortName",
      disabled: false,
      required: true,
      key: 2,
      isFocus: false,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("shortName")
          }),
          trigger: "blur"
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: "blur"
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Name (Kana)",
      label: "kana",
      name: "kana",
      disabled: false,
      required: false,
      key: 3,
      isFocus: false,
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Postal code",
      label: "postalCode",
      name: "postalCode",
      disabled: false,
      required: false,
      key: 4,
      isFocus: false,
      rules: [
        {
          validator: validator.validateNumber,
          trigger: "blur"
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Address",
      label: "address",
      name: "address",
      disabled: false,
      required: false,
      key: 5,
      isFocus: false,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("name")
          }),
          trigger: "blur"
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: "blur"
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Phone number",
      label: "phoneNumber",
      name: "phoneNumber",
      disabled: false,
      required: false,
      key: 6,
      isFocus: false,
      rules: [
        {
          //eslint-disable-next-line
          pattern: /([0-9|\+]{1})([0-9])/g,
          message: i18n.global.t("allow_input_number"),
          trigger: "blur"
        },
        {
          max: 15,
          message: i18n.global.t("max_length_input", { maxLength: 15 }),
          trigger: "blur"
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "E-mail",
      label: "email",
      name: "email",
      disabled: false,
      required: false,
      key: 7,
      isFocus: false,
      rules: [
        {
          validator: validator.validateEmail,
          trigger: "blur"
        }
      ],
      parent: "singleInput"
    }
  ],
  duoInputs: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Representative",
      label: "representative",
      name: "representative",
      disabled: false,
      required: false,
      key: 8,
      isFocus: false,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("representative")
          }),
          trigger: "blur"
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: "blur"
        }
      ],
      parent: "duoInputs"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "External code",
      label: "externalCode",
      name: "externalCode",
      disabled: false,
      required: false,
      key: 9,
      isFocus: false,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("externalCode")
          }),
          trigger: "blur"
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: "blur"
        }
      ],
      parent: "duoInputs"
    }
  ]
};
