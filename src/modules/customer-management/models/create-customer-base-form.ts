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
          trigger: ["blur", "change"]
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input_text", { maxLength: 50 }),
          trigger: "change"
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "short_name",
      label: "short_name",
      name: "shortName",
      disabled: false,
      required: true,
      key: 2,
      isFocus: false,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("short_name")
          }),
          trigger: ["blur", "change"]
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input_text", { maxLength: 50 }),
          trigger: "blur"
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "name_kana",
      label: "name_kana",
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
      placeHolder: "postal_code",
      label: "postal_code",
      name: "postalCode",
      disabled: false,
      required: false,
      key: 4,
      isFocus: false,
      rules: [
        {
          validator: validator.validateNumber,
          trigger: "change"
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "address",
      label: "address",
      name: "address",
      disabled: false,
      required: false,
      key: 5,
      isFocus: false,
      rules: [
        {
          max: 255,
          message: i18n.global.t("max_length_input_text", { maxLength: 255 }),
          trigger: "change"
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "phone_number",
      label: "phone_number",
      name: "phoneNumber",
      disabled: false,
      required: false,
      key: 6,
      isFocus: false,
      rules: [
        {
          max: 15,
          message: i18n.global.t("max_length_input_text", { maxLength: 15 }),
          trigger: "change"
        },
        {
          pattern: /\+[0-9]{6,12}/,
          message: i18n.global.t("invalid_field_name", {
            fieldName: i18n.global.t("collection_phone_number")
          }),
          trigger: "change"
        }
      ],
      parent: "singleInput"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "collection_email",
      label: "collection_email",
      name: "email",
      disabled: false,
      required: false,
      key: 7,
      isFocus: false,
      rules: [
        {
          validator: validator.validateEmail,
          trigger: "change"
        }
      ],
      parent: "singleInput"
    }
  ],
  duoInputs: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "representative",
      label: "representative",
      name: "representative",
      disabled: false,
      required: false,
      key: 8,
      isFocus: false,
      rules: [
        {
          max: 50,
          message: i18n.global.t("max_length_input_text", { maxLength: 50 }),
          trigger: "change"
        }
      ],
      parent: "duoInputs"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "external_code",
      label: "external_code",
      name: "externalCode",
      disabled: false,
      required: false,
      key: 9,
      isFocus: false,
      rules: [
        {
          max: 16,
          message: i18n.global.t("max_length_input_text", { maxLength: 16 }),
          trigger: "change"
        }
      ],
      parent: "duoInputs"
    }
  ]
};
