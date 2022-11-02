import { i18n } from "@/i18n";
import validator from "@/modules/base/components/validator/validator";
import {
  TypeOptions,
  UserRoleOptions
} from "@/modules/staff-management/models/create-new-staff.model";

const radioOptions = {
  typeOptions: [
    {
      text: "tenant_collection_base",
      value: TypeOptions.TENANT
    },
    {
      text: "partner",
      value: TypeOptions.PARTNER
    },
    {
      text: "customer",
      value: TypeOptions.CUSTOMER
    },
    {
      text: "destination",
      value: TypeOptions.DESTINATION
    }
  ],
  userRoleByTenantAdmim: [
    {
      text: "tenant_admin",
      value: UserRoleOptions.TENANT_ADMIN,
      baseType: []
    },
    {
      text: "lbl_admin",
      value: UserRoleOptions.COLLECTION_BASE_ADMIN,
      workPlaceType: [1, 2],
      baseType: []
    },
    {
      text: "lbl_driver",
      value: UserRoleOptions.DRIVER,
      workPlaceType: [1],
      baseType: [1, 3]
    },
    {
      text: "manufacture_staff",
      value: UserRoleOptions.MANUFACTURING_STAFF,
      workPlaceType: [1],
      baseType: [2, 3]
    },
    {
      text: "drive_manufacture_staff",
      value: UserRoleOptions.DRIVER_MANUFACTURING_STAFF,
      workPlaceType: [1],
      baseType: [3]
    }
  ],
  userRoleByPartner: [
    {
      text: "lbl_admin",
      value: UserRoleOptions.PARTNER_ADMIN,
      workPlaceType: [2],
      baseType: []
    },
    {
      text: "lbl_driver",
      value: UserRoleOptions.DRIVER,
      workPlaceType: [2],
      baseType: []
    }
  ],
  userRoleByCustomer: [
    {
      text: "discharger",
      value: UserRoleOptions.DISCHARGER,
      workPlaceType: [3],
      baseType: []
    },
    {
      text: "dashboard_viewer",
      value: UserRoleOptions.DASHBOARD_USER,
      workPlaceType: [3],
      baseType: []
    }
  ],
  userRoleByDestination: [
    {
      text: "consignee",
      value: UserRoleOptions.CONSIGNEE,
      workPlaceType: [4],
      baseType: []
    }
  ],
  formData: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "employee_code",
      label: "employee_code",
      name: "employeeCode",
      key: 1,
      isFocus: false,
      rules: [
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 })
        }
      ]
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "name",
      label: "name",
      name: "name",
      inline: true,
      disabled: false,
      spaceStyle: {
        display: "inline-block",
        width: "16px"
      },
      rules: [
        {
          required: true,
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("name")
          })
        },
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 })
        }
      ],
      required: true,
      key: 2,
      isFocus: false
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "name_kana",
      label: "name_kana",
      name: "nameKana",
      inline: true,
      disabled: false,
      rules: [
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 })
        }
      ],
      required: false,
      key: 3,
      isFocus: false
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "email",
      label: "email",
      name: "email",
      disabled: false,
      required: true,
      key: 4,
      isFocus: false,
      rules: [
        { required: true, message: "Please input your email!" },
        {
          max: 128,
          message: i18n.global.t("max_length_input", { maxLength: 128 })
        },
        { validator: validator.validateEmail, trigger: "change" }
      ]
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "telephone",
      label: "telephone",
      name: "telephone",
      key: 5,
      isFocus: false,
      rules: [
        {
          max: 15,
          message: i18n.global.t("max_length_input", { maxLength: 15 })
        },
        {
          pattern: /^[+][0-9]{5,14}$/,
          message: i18n.global.t("allow_input_number")
        }
      ]
    },
    {
      inputType: "ARadioGroup",
      name: "radio",
      key: 6,
      isFocus: false
    },
    {
      inputType: "ASelect",
      value: undefined,
      placeHolder: "work_place",
      label: "work_place",
      name: "workPlace",
      required: true,
      isFocus: false,
      mode: "multiple",
      hidden: false,

      dropdownClassName: "form-option-content",
      style: {
        padding: "0px"
      },
      key: 7
    },
    {
      inputType: "ASelect",
      value: [],
      placeHolder: "work_place",
      label: "work_place",
      name: "workPlace",
      required: true,
      isFocus: false,
      hidden: false,

      dropdownClassName: "form-option-content",
      style: {
        padding: "0px"
      },
      key: 8
    }
  ]
};

export default radioOptions;
