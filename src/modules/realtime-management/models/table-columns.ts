import { i18n } from "@/i18n";

export const listOfUserColumns = [
  {
    title: i18n.global.t("username"),
    dataIndex: "userName",
    key: "userName",
    width: "180px"
  },
  {
    title: i18n.global.t("last_active_time"),
    dataIndex: "lastUpdateTime",
    key: "lastUpdateTime",
    width: "190px"
  },
  {
    key: "action",
    dataIndex: "action",
    width: "80px"
  }
];

export const listOfCollectionPointColumns = [
  {
    title: i18n.global.t("name"),
    dataIndex: "name",
    key: "name"
  }
];
