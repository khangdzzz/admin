import { i18n } from "@/i18n";
import { TableColumnsType } from "ant-design-vue";
import { ref } from "vue";

export const columns = ref<TableColumnsType>([
  {
    title: i18n.global.t("collection_history_collection_date"),
    dataIndex: "collectDate",
    key: "collectDate",
    fixed: true,
    width: 150,
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_username"),
    dataIndex: "userName",
    key: "userName",
    fixed: true,
    width: 150,
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_collection_point"),
    dataIndex: "collectPointId",
    key: "collectPointId",
    fixed: true,
    width: 160,
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_collection_item"),
    dataIndex: "collectItemName",
    key: "collectItemName",
    fixed: true,
    width: 160,
    resizable: true
  },

  {
    title: i18n.global.t("collection_history_vehicle"),
    dataIndex: "vehicleName",
    key: "vehicleName",
    width: 140,
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_customer"),
    dataIndex: "customerName",
    width: 160,
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_measure_method"),
    dataIndex: "measureMethod",
    width: 160,
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_apportionment"),
    dataIndex: "apportionment",
    width: 160,
    align: "right",
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_weight"),
    dataIndex: "weight",
    width: 140,
    align: "right"
  },
  {
    title: i18n.global.t("collection_history_quantity"),
    dataIndex: "quantity",
    width: 120,
    align: "right",
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_package_weight"),
    dataIndex: "packingWeight",
    width: 160,
    align: "right"
  },
  {
    title: i18n.global.t("collection_history_unit"),
    dataIndex: "unit",
    width: 120,
    align: "right",
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_buy_or_sell"),
    dataIndex: "buyOrSell",
    width: 120,
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_price"),
    dataIndex: "price",
    width: 160,
    align: "right",
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_transportation_price"),
    dataIndex: "transportationPrice",
    width: 180,
    align: "right",
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_disposal_price"),
    dataIndex: "disposalPrice",
    width: 160,
    align: "right",
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_commission_price"),
    dataIndex: "commissionPrice",
    width: 160,
    align: "right",
    resizable: true
  },
  {
    title: i18n.global.t("collection_history_other_price"),
    dataIndex: "otherPrice",
    width: 160,
    align: "right",
    resizable: true
  },
  {
    title: "",
    dataIndex: "action",
    width: 80
  }
]);
