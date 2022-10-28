import { i18n } from "@/i18n";
import validator from "@/modules/base/components/validator/validator";
import { FormData } from "@/modules/collection-point-management/models/collection-point.model";
import { localStorageKeys } from "@/services/local-storage-keys";

export const formData = (): FormData => {
  const currentLanguage =
    localStorage.getItem(localStorageKeys.currentLanguage) || "en";

  return {
    data: [
      {
        inputType: "ASelect",
        value: "",
        placeHolder: "customer",
        label: "customer",
        name: "customer",
        disabled: false,
        required: true,
        key: 1,
        isFocus: false,
        rules: [
          {
            required: true,
            message: i18n.global.t("please_enter_input", currentLanguage, {
              fieldName: i18n.global
                .t("customer", currentLanguage)
                .toLowerCase()
            }),
            trigger: ["blur", "change"]
          }
        ],
        loading: false,
        parent: "data"
      },
      {
        inputType: "AInput",
        value: "",
        placeHolder: "name",
        label: "name",
        name: "name",
        disabled: false,
        required: true,
        key: 2,
        isFocus: false,
        rules: [
          {
            required: true,
            message: i18n.global.t("please_enter_input", currentLanguage, {
              fieldName: i18n.global.t("name", currentLanguage).toLowerCase()
            }),
            trigger: ["blur", "change"]
          },
          {
            max: 50,
            message: i18n.global.t("max_length_input", currentLanguage, {
              maxLength: 50
            }),
            trigger: ["blur", "change"]
          }
        ],
        parent: "data"
      },
      {
        inputType: "AInput",
        value: "",
        placeHolder: "short_name",
        label: "short_name",
        name: "shortName",
        disabled: false,
        required: true,
        key: 3,
        isFocus: false,
        rules: [
          {
            required: true,
            message: i18n.global.t("please_enter_input", currentLanguage, {
              fieldName: i18n.global
                .t("short_name", currentLanguage)
                .toLowerCase()
            }),
            trigger: ["blur", "change"]
          },
          {
            max: 50,
            message: i18n.global.t("max_length_input", currentLanguage, {
              maxLength: 50
            }),
            trigger: ["blur", "change"]
          }
        ],
        parent: "data"
      },
      {
        inputType: "AInput",
        value: "",
        placeHolder: "name_kana",
        label: "name_kana",
        name: "name_kana",
        disabled: false,
        required: false,
        key: 4,
        isFocus: false,
        parent: "data"
      },
      {
        inputType: "AInput",
        value: "",
        placeHolder: "postal_code",
        label: "postal_code",
        name: "postalCode",
        disabled: false,
        required: true,
        key: 5,
        isFocus: false,
        actionBtn: {
          name: "",
          click: undefined
        },
        class: "",
        rules: [],
        parent: "data"
      },
      {
        inputType: "AInput",
        value: "",
        placeHolder: "address",
        label: "address",
        name: "address",
        disabled: false,
        required: true,
        key: 6,
        isFocus: false,
        rules: [
          {
            required: true,
            message: i18n.global.t("please_enter_input", currentLanguage, {
              fieldName: i18n.global.t("address", currentLanguage).toLowerCase()
            }),
            trigger: ["blur", "change"]
          },
          {
            max: 255,
            message: i18n.global.t("max_length_input", currentLanguage, {
              maxLength: 255
            }),
            trigger: ["blur", "change"]
          }
        ],
        parent: "data"
      },
      {
        inputType: "AInput",
        value: "",
        placeHolder: "phone_number",
        label: "phone_number",
        name: "phone_number",
        disabled: false,
        required: false,
        key: 7,
        isFocus: false,
        rules: [
          {
            max: 15,
            message: i18n.global.t("max_length_input", currentLanguage, {
              maxLength: 15
            }),
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[+][0-9]{6,15}$/,
            message: i18n.global.t("invalid_field_name", currentLanguage, {
              fieldName: i18n.global
                .t("collection_phone_number", currentLanguage)
                .toLowerCase()
            }),
            trigger: ["blur", "change"]
          }
        ],
        parent: "data"
      },
      {
        inputType: "AInput",
        value: "",
        placeHolder: "collection_base_lbl_email",
        label: "collection_base_lbl_email",
        name: "email",
        disabled: false,
        required: false,
        key: 8,
        isFocus: false,
        rules: [
          {
            validator: validator.validateEmail,
            trigger: ["blur", "change"]
          }
        ],
        parent: "data"
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
            message: i18n.global.t("max_length_input", currentLanguage, {
              maxLength: 16
            }),
            trigger: ["blur", "change"]
          }
        ],
        parent: "data"
      }
    ]
  };
};
