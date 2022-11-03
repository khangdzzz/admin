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

export const validateWeight = (
  fieldName: string,
  isRequire: boolean,
  value: string
): string => {
  if (!isRequire && !value) return "";

  if (!value) {
    return i18n.global.t("please_enter_input", {
      fieldName: i18n.global.t(fieldName).toLowerCase()
    });
  }
  if (!/^[0-9.-]*$/.test(value)) {
    return i18n.global.t("field_allow_number_only");
  }
  if (value.length > 8) {
    return i18n.global.t("max_length_input", { maxLength: 8 });
  }
  if (!/(^0|^[1-9][0-9]{0,5})\.([0-9]{1,2}$)|(^[1-9][0-9]{0,7}$)/.test(value)) {
    return i18n.global.t("invalid_field_name", {
      fieldName: i18n.global.t(fieldName).toLowerCase()
    });
  }
  return "";
};

export const validateContainerCapacity = (value: string): string => {
  if (!value) return "";
  if (!/^[0-9.-]*$/.test(value)) {
    return i18n.global.t("field_allow_number_only");
  }
  if (value.length > 8) {
    return i18n.global.t("max_length_input", { maxLength: 8 });
  }
  if (!/(^0|^[1-9][0-9]{0,5})\.([0-9]{1,2}$)|(^[1-9][0-9]{0,7}$)/.test(value)) {
    return i18n.global.t("invalid_field_name", {
      fieldName: i18n.global.t("container_capacity").toLowerCase()
    });
  }
  return "";
};
