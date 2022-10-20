import { i18n } from "@/i18n";
import validator from "@/modules/base/components/validator/validator";
import {
  TypeOptions,
  UserRoleOptions
} from "@/modules/staff-management/models/create-new-staff.model";
import { SelectProps } from "ant-design-vue";

const options: SelectProps["options"] = [
  {
    value: "collection_base_1",
    label: "Collection base",
    content: "Collection base 1"
  },
  {
    value: "collection_base_2",
    label: "Collection base",
    content: "Collection base 2"
  },
  {
    value: "partner1",
    label: "Partner",
    content: "Partner 1"
  }
];

const radioOptions = {
  typeOptions: [
    {
      text: i18n.global.t("tenant_collection_base"),
      value: TypeOptions.TENANT
    },
    {
      text: i18n.global.t("partner"),
      value: TypeOptions.PARTNER
    },
    {
      text: i18n.global.t("customer"),
      value: TypeOptions.CUSTOMER
    },
    {
      text: i18n.global.t("destination"),
      value: TypeOptions.DESTINATION
    }
  ],
  userRoleByTenantAdmim: [
    {
      text: i18n.global.t("tenant_admin"),
      value: UserRoleOptions.TENANT_ADMIN
    },
    {
      text: i18n.global.t("collection_base_admin"),
      value: UserRoleOptions.COLLECTIONS_BASE_ADMIN
    },
    {
      text: i18n.global.t("collection_base_driver"),
      value: UserRoleOptions.COLLECTIONS_BASE_DRIVE
    },
    {
      text: i18n.global.t("manufacture_staff"),
      value: UserRoleOptions.MANUFACTURE_STAFF
    },
    {
      text: i18n.global.t("drive_manufacture_staff"),
      value: UserRoleOptions.DRIVE_MANUFACTURE_STAFF
    }
  ],
  userRoleByPartner: [
    {
      text: i18n.global.t("partner_admin"),
      value: UserRoleOptions.PARTNER_ADMIN
    },
    {
      text: i18n.global.t("partner_driver"),
      value: UserRoleOptions.PARTNER_DRIVER
    }
  ],
  userRoleByCustomer: [
    {
      text: i18n.global.t("discharger"),
      value: UserRoleOptions.DISCHARGER
    },
    {
      text: i18n.global.t("dashboard_viewer"),
      value: UserRoleOptions.DASHBOARD_VIEWER
    }
  ],
  userRoleByDestination: [
    {
      text: i18n.global.t("consignee"),
      value: UserRoleOptions.CONSIGNEE
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
          message: i18n.global.t("max_length_input_text", { maxLength: 50 })
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
          message: i18n.global.t("max_length_input_text", { maxLength: 50 })
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
          message: i18n.global.t("max_length_input_text", { maxLength: 50 })
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
      label: "email_address",
      name: "email",
      disabled: false,
      required: true,
      key: 4,
      isFocus: false,
      rules: [
        { required: true, message: "Please input your email!" },
        {
          max: 128,
          message: i18n.global.t("max_length_input_text", { maxLength: 128 })
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
          message: i18n.global.t("max_length_input_text", { maxLength: 15 })
        },
        {
          pattern: /([0-9|\+]{1})([0-9])/g,
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
      options: options,
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
      options: options,
      dropdownClassName: "form-option-content",
      style: {
        padding: "0px"
      },
      key: 8
    }
  ]
};

export default radioOptions;
