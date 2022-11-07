import { i18n } from "@/i18n";

export const validateContainerName = (
  value: string,
  isExist: boolean
): string => {
  if (!value) {
    return i18n.global.t("please_enter_input", {
      fieldName: i18n.global.t("container_container_name").toLowerCase()
    });
  }
  if (value.length > 50) {
    return i18n.global.t("max_length_input", { maxLength: 50 });
  }
  if (isExist) {
    return i18n.global.t("error_unique_constraint", {
      fieldName: i18n.global.t("container_container_name")
    });
  }
  return "";
};
