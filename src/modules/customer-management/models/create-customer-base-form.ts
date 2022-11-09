import { i18n } from "@/i18n";
import validator from "@/modules/base/components/validator/validator";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
import { localStorageKeys } from "@/services/local-storage-keys";

export const formData = (): FormData => {
  const currentLanguage =
    localStorage.getItem(localStorageKeys.currentLanguage) || "en";

  return {
    singleInput: [
      {
        inputType: "AInput",
        value: "",
        placeHolder: "human_name",
        label: "human_name",
        name: "name",
        disabled: false,
        required: true,
        key: 1,
        isFocus: false,
        rules: [
          {
            required: true,
            message: i18n.global.t("please_enter_input", currentLanguage, {
              fieldName: i18n.global
                .t("human_name", currentLanguage)
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
        parent: "singleInput"
      },
      {
        inputType: "AInput",
        value: "",
        placeHolder: "human_name_kana",
        label: "human_name_kana",
        name: "kana",
        disabled: false,
        required: false,
        key: 3,
        isFocus: false,
        parent: "singleInput"
      },
      {
        id: "create-customer_postal-code",
        inputType: "AInput",
        value: "",
        placeHolder: "common_postal_code_label",
        label: "common_postal_code_label",
        name: "postalCode",
        disabled: false,
        required: false,
        key: 4,
        isFocus: false,
        rules: [],
        actionBtn: {
          name: "",
          click: undefined
        },
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
            message: i18n.global.t("max_length_input", currentLanguage, {
              maxLength: 255
            }),
            trigger: ["blur", "change"]
          }
        ],
        parent: "singleInput"
      },
      {
        inputType: "AInput",
        value: "",
        placeHolder: "customer_phone_number",
        label: "customer_phone_number",
        name: "phoneNumber",
        disabled: false,
        required: false,
        key: 6,
        isFocus: false,
        rules: [
          {
            validator: validator.validatePhone,
            trigger: ["blur", "change"]
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
            trigger: ["blur", "change"]
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
            message: i18n.global.t("max_length_input", currentLanguage, {
              maxLength: 50
            }),
            trigger: ["blur", "change"]
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
            message: i18n.global.t("max_length_input", currentLanguage, {
              maxLength: 16
            }),
            trigger: ["blur", "change"]
          }
        ],
        parent: "duoInputs"
      }
    ]
  };
};
