import { Rule } from "ant-design-vue/lib/form";
import { i18n } from "@/i18n";


const validator = {
  validateEmail: (rule: Rule, value: string): Promise<void> => {
    // eslint-disable-next-line no-control-regex
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    if (value && !emailRegex.test(value)) {
      return Promise.reject(
        i18n.global.t("forgot_password_msg_err_email_invalid")
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
  }
};
export default validator;
