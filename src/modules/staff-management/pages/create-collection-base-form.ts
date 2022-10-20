import { i18n } from "@/i18n";
import validator from "@/modules/base/components/validator/validator";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
import { localStorageKeys } from "@/services/local-storage-keys";

export const formData = (): FormData => {
  const currentLanguage =
    localStorage.getItem(localStorageKeys.currentLanguage) || "en";
  return {
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
            message: i18n.global.t("please_enter_input", currentLanguage, {
              fieldName: i18n.global.t("name", currentLanguage)
            }),
            trigger: "blur"
          },
          {
            max: 50,
            message: i18n.global.t("max_length_input_text", currentLanguage, {
              maxLength: 50
            }),
            trigger: "change"
          }
        ],
        parent: "name"
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
            message: i18n.global.t("please_enter_input", currentLanguage, {
              fieldName: i18n.global.t("short_name", currentLanguage)
            }),
            trigger: "blur"
          },
          {
            max: 50,
            message: i18n.global.t("max_length_input_text", currentLanguage, {
              maxLength: 50
            }),
            trigger: "change"
          }
        ],
        parent: "name"
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
        parent: "name"
      }
    ],
    contact: [
      {
        inputType: "AInput",
        value: "",
        placeHolder: "postal_code",
        label: "postal_code",
        name: "postalCode",
        disabled: false,
        required: true,
        key: 4,
        isFocus: false,
        parent: "contact",
        rules: [
          {
            required: true,
            message: i18n.global.t("please_enter_input", currentLanguage, {
              fieldName: i18n.global.t("postal_code", currentLanguage)
            }),
            trigger: "blur"
          },
          {
            validator: validator.validateNumber,
            trigger: "change"
          }
        ]
      },
      {
        inputType: "AInput",
        value: "",
        placeHolder: "address",
        label: "address",
        name: "address",
        disabled: false,
        required: true,
        key: 9,
        isFocus: false,
        rules: [
          {
            required: true,
            message: i18n.global.t("please_enter_input", currentLanguage, {
              fieldName: i18n.global.t("address", currentLanguage)
            }),
            trigger: "blur"
          },
          {
            max: 255,
            message: i18n.global.t("max_length_input_text", currentLanguage, {
              maxLength: 255
            }),
            trigger: "change"
          }
        ],
        parent: "contact"
      },
      {
        inputType: "AInput",
        value: "",
        placeHolder: "collection_phone_number",
        label: "collection_phone_number",
        name: "telephone",
        disabled: false,
        required: false,
        key: 10,
        isFocus: false,
        parent: "contact",
        rules: [
          {
            max: 15,
            message: i18n.global.t("max_length_input_text", currentLanguage, {
              maxLength: 15
            }),
            trigger: "change"
          },
          {
            pattern: /\+[0-9]{6,12}/,
            message: i18n.global.t("invalid_field_name", currentLanguage, {
              fieldName: i18n.global.t(
                "collection_phone_number",
                currentLanguage
              )
            }),
            trigger: "change"
          }
        ]
      },
      {
        inputType: "AInput",
        value: "",
        placeHolder: "collection_email",
        label: "collection_email",
        name: "email",
        disabled: false,
        required: false,
        key: 5,
        isFocus: false,
        rules: [
          {
            validator: validator.validateEmail,
            trigger: "change"
          }
        ],
        parent: "contact"
      },
      {
        inputType: "AInput",
        value: "",
        placeHolder: "representative",
        label: "representative",
        name: "representative",
        disabled: false,
        required: false,
        key: 6,
        isFocus: false,
        rules: [
          {
            max: 50,
            message: i18n.global.t("max_length_input_text", currentLanguage, {
              maxLength: 50
            }),
            trigger: "change"
          }
        ],
        parent: "contact"
      }
    ]
  };
};
