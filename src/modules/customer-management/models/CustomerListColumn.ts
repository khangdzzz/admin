import { i18n } from "@/i18n";

export const columns = [
  {
    title: i18n.global.t("name"),
    dataIndex: "name",
    key: "name"
  },
  {
    title: i18n.global.t("common_postal_code_label"),
    dataIndex: "postalCode",
    key: "postalCode"
  },
  {
    title: i18n.global.t("address"),
    dataIndex: "address",
    key: "address",
    width: "33%"
  },
  {
    title: i18n.global.t("customer_phone_number"),
    dataIndex: "phoneNumber",
    key: "phoneNumber"
  },
  {
    title: i18n.global.t("email"),
    dataIndex: "email",
    key: "email"
  },
  {
    key: "action",
    dataIndex: "action",
    width: "120px"
  }
];
