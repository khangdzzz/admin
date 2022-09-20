import { Rule } from "ant-design-vue/lib/form";
import { i18n } from "@/i18n";


const validator = {
  validateEmail: (rule: Rule, value: string): Promise<void> => {
    const emailRegex = /^([^@]{1,64}|\".{0,62}\")@[^@]{1,255}$/;

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
