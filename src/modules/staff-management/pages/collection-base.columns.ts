import { TableColumnsType } from "ant-design-vue";

export const collectionBaseColumns = (): TableColumnsType => {
  return [
    {
      title: "collection_base_lbl_name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "common_postal_code_label",
      dataIndex: "postalCode",
      key: "postal_code"
    },
    {
      title: "collection_address",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "common_phone_field_name",
      dataIndex: "telephone",
      key: "telephone"
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      width: "200px"
    }
  ];
};
