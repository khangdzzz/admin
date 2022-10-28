import { FormDataCreateCollectionRoute } from "@/modules/collection-route-management/models/collection-route.model";
import { i18n } from "@/i18n";

export const formData: FormDataCreateCollectionRoute = {
  duoInputs: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "collection_route_route_name",
      label: "collection_route_route_name",
      name: "routeName",
      disabled: false,
      required: true,
      key: 1,
      isFocus: false,
      parent: "duoInputs",
      rules: [
        {
          required: true,
          trigger: ["blur", "change"],
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("collection_route_workplace").toLowerCase()
          })
        },
        {
          max: 50,
          trigger: ["blur", "change"],
          message: i18n.global.t("max_length_input", { maxLength: 50 })
        }
      ]
    }
  ],
  duoInputs2: [
    {
      inputType: "ASelect",
      value: "",
      placeHolder: "collection_route_workplace",
      label: "collection_route_workplace",
      name: "workplace",
      disabled: false,
      required: true,
      options: [{ value: "", label: "" }],
      key: 2,
      isFocus: false,
      rules: [
        {
          required: true,
          trigger: ["blur", "change"],
          message: i18n.global.t("please_enter_input", {
            fieldName: i18n.global.t("collection_route_workplace").toLowerCase()
          })
        }
      ],
      parent: "duoInputs2"
    }
  ]
};
