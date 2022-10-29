import { i18n } from "@/i18n";
import validator from "@/modules/base/components/validator/validator";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
import { localStorageKeys } from "@/services/local-storage-keys";
import { Rule } from "ant-design-vue/lib/form";

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
              fieldName: i18n.global.t("name", currentLanguage).toLowerCase()
            }),
            trigger: "blur"
          },
          {
            max: 50,
            message: i18n.global.t("max_length_input", currentLanguage, {
              maxLength: 50
            }),
            trigger: ["blur", "change"]
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
              fieldName: i18n.global
                .t("postal_code", currentLanguage)
                .toLowerCase()
            }),
            trigger: ["blur", "change"]
          },
          {
            validator: validator.validateNumber,
            trigger: ["blur", "change"]
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
              fieldName: i18n.global.t("address", currentLanguage).toLowerCase()
            }),
            trigger: "blur"
          },
          {
            max: 255,
            message: i18n.global.t("max_length_input", currentLanguage, {
              maxLength: 255
            }),
            trigger: ["blur", "change"]
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
            validator: (_rule: Rule, value: string): Promise<void> => {
              if (!value) return Promise.resolve();
              if (value.length > 15) {
                return Promise.reject(
                  i18n.global.t("max_length_input", currentLanguage, {
                    maxLength: 15
                  })
                );
              }
              if (!/^[+][0-9]{5,14}$/.test(value)) {
                return Promise.reject(
                  i18n.global.t("invalid_field_name", currentLanguage, {
                    fieldName: i18n.global
                      .t("collection_phone_number", currentLanguage)
                      .toLowerCase()
                  })
                );
              }
              return Promise.resolve();
            },
            trigger: ["blur", "change"]
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
            trigger: ["blur", "change"]
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
            message: i18n.global.t("max_length_input", currentLanguage, {
              maxLength: 50
            }),
            trigger: ["blur", "change"]
          }
        ],
        parent: "contact"
      }
    ]
  };
};
