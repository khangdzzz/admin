import { i18n } from "@/i18n";
import { FormData } from "@/modules/staff-management/models/collection-base.model";

export const formData: FormData = {
  duoInputs: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "route_name",
      label: "route_name",
      name: "routeName",
      disabled: false,
      required: true,
      key: 1,
      isFocus: false,
      parent: "duoInputs"
    },
    {
      inputType: "ASelect",
      value: "",
      placeHolder: "workplace",
      label: "workplace",
      name: "workplace",
      disabled: false,
      required: true,
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" }
      ],
      key: 2,
      isFocus: false,
      parent: "duoInputs"
    }
  ]
};
