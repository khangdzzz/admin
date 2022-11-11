import { Rule } from "ant-design-vue/lib/form";
import { i18n } from "@/i18n";
import { localStorageKeys } from "@/services/local-storage-keys";
import { SupportedLanguage } from "../../models";

const validator = {
  validateEmail: (rule: Rule, value: string): Promise<void> => {
    const regExpEmail =
      // eslint-disable-next-line no-control-regex, no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@([a-z]{1})((?=.*[a-z|_])(?=.*[.])(?!.*\.\.)(?!.*\_\_)(?!.*\.\_)(?!.*\_\.)(?!.*\s).{1,61})([a-z]{1})$/;

    if (value && !regExpEmail.test(value)) {
      const currentLanguage = (localStorage.getItem(
        localStorageKeys.currentLanguage
      ) || SupportedLanguage.Japanese) as SupportedLanguage;
      return Promise.reject(
        i18n.global.t("forgot_password_msg_err_email_invalid", currentLanguage)
      );
    } else {
      return Promise.resolve();
    }
  },
  checkAge: async (rule: Rule, value: number): Promise<void> => {
    value = Number(value);
    if (!Number.isInteger(value)) {
      return Promise.reject("Please input digits");
    } else {
      if (value < 18) {
        return Promise.reject("Age must be greater than 18");
      } else {
        return Promise.resolve();
      }
    }
  },
  checkEmailFormat: (email: string, isRequire: boolean): boolean => {
    const regExpEmail =
      // eslint-disable-next-line no-control-regex, no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@([a-z]{1})((?=.*[a-z|_])(?=.*[.])(?!.*\.\.)(?!.*\_\_)(?!.*\.\_)(?!.*\_\.)(?!.*\s).{1,61})([a-z]{1})$/;
    return isRequire
      ? regExpEmail.test(email)
      : regExpEmail.test(email) || email.length === 0;
  },
  checkPhoneFormat: (phone: string, isRequire: boolean): boolean => {
    const regExpPhone =
      // eslint-disable-next-line no-control-regex, no-useless-escape
      /^[+]?[0-9]{8,15}$/;
    return isRequire
      ? regExpPhone.test(phone)
      : regExpPhone.test(phone) || phone.length === 0;
  },
  validatePassword: (rule: Rule, value: string): Promise<void> => {
    const passwordRegex = /^[\S]{6,32}$/i;

    if (value && !passwordRegex.test(value)) {
      return Promise.reject(
        i18n.global.t("forgot_password_msg_err_password_invalid")
      );
    } else {
      return Promise.resolve();
    }
  },
  validateCode: (rule: Rule, value: string): Promise<void> => {
    const codeRegex = /^[0-9]{6}$/i;

    if (value && !codeRegex.test(value)) {
      return Promise.reject(
        i18n.global.t("forgot_password_msg_err_code_invalid")
      );
    } else {
      return Promise.resolve();
    }
  },
  validateNumber: (rule: Rule, value: number): Promise<void> => {
    if (value && isNaN(value)) {
      return Promise.reject(i18n.global.t("allow_input_number"));
    }

    return Promise.resolve();
  },
  validatePhone: (_rule: Rule, value: string): Promise<void> => {
    if (!value) {
      return Promise.resolve();
    }
    if (value.length > 15) {
      return Promise.reject(
        i18n.global.t("max_length_input", { maxLength: 15 })
      );
    }
    if (!/^[+]?[0-9]{8,15}$/.test(value)) {
      return Promise.reject(
        i18n.global.t("invalid_field_name", {
          fieldName: i18n.global.t("common_phone_field_name").toLowerCase()
        })
      );
    }
    return Promise.resolve();
  },

  validateDecimal: (
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
    if (!/^(?:\d{0,6}\.\d{1,2})$|^\d{0,6}$/.test(value) || +value === 0) {
      return i18n.global.t("common_invalid_decimal", {
        fieldName: i18n.global.t(fieldName)
      });
    }
    return "";
  },
  validatePostalCode: (_rule: Rule, value: string): Promise<void> => {
    const regex = /^[0-9]*$/;
    if (value && !regex.test(value)) {
      return Promise.reject(i18n.global.t("field_allow_number_only"));
    }

    if (value.length > 8) {
      return Promise.reject(
        i18n.global.t("max_length_input", { maxLength: 8 })
      );
    }
    return Promise.resolve();
  }
};

export default validator;
