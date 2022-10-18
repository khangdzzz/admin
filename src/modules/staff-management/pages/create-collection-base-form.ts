import { i18n } from "@/i18n";
import validator from "@/modules/base/components/validator/validator";
import { FormData } from "@/modules/staff-management/models/collection-base.model";

export const formData: FormData = {
  name: [
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
      parent: "name"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Short name",
      label: "Short name",
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
          trigger: "blur"
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: "blur"
        }
      ],
      parent: "name"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Name (Kana)",
      label: "Name (Kana)",
      name: "kana",
      disabled: false,
      required: false,
      key: 3,
      isFocus: false,
      parent: "name"
    }
  ],
  contact: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Postal code",
      label: "Postal code",
      name: "postalCode",
      disabled: false,
      required: true,
      key: 4,
      isFocus: false,
      parent: "contact",
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("postal_code")
          }),
          trigger: "blur"
        },
        {
          validator: validator.validateNumber,
          trigger: "blur"
        }
      ]
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Address",
      label: "Address",
      name: "address",
      disabled: false,
      required: true,
      key: 9,
      isFocus: false,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("address")
          }),
          trigger: "blur"
        }
      ],
      parent: "contact"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Phone number",
      label: "Phone number",
      name: "telephone",
      disabled: false,
      required: false,
      key: 10,
      isFocus: false,
      parent: "contact",
      rules: [
        {
          max: 11,
          message: i18n.global.t("max_length_input", { maxLength: 11 }),
          trigger: "blur"
        }
      ]
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "E-mail",
      label: "E-mail",
      name: "email",
      disabled: false,
      required: false,
      key: 5,
      isFocus: false,
      rules: [
        {
          validator: validator.validateEmail,
          trigger: "blur"
        }
      ],
      parent: "contact"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Representative",
      label: "Representative",
      name: "representative",
      disabled: false,
      required: false,
      key: 6,
      isFocus: false,
      rules: [
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 }),
          trigger: "blur"
        }
      ],
      parent: "contact"
    }
  ],
  coordinate: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Latitude",
      label: "Latitude",
      name: "latitude",
      disabled: false,
      required: true,
      key: 7,
      isFocus: false,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("latitude")
          }),
          trigger: "blur"
        },
        {
          pattern: /(?<=^| )\d+(\.\d+)?(?=$| )/g,
          message: i18n.global.t("invalid_field_name", {
            fieldName: i18n.global.t("latitude")
          }),
          trigger: "blur"
        }
      ],
      parent: "coordinate"
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "Longitude",
      label: "Longitude",
      name: "longitude",
      disabled: false,
      required: true,
      key: 8,
      isFocus: false,
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("longitude")
          }),
          trigger: "blur"
        },
        {
          pattern: /(?<=^| )\d+(\.\d+)?(?=$| )/g,
          message: i18n.global.t("invalid_field_name", {
            fieldName: i18n.global.t("longitude")
          }),
          trigger: "blur"
        }
      ],
      parent: "coordinate"
    }
  ]
};
