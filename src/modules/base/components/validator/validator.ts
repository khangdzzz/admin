import { Rule } from "ant-design-vue/lib/form";

const validator = {
  validateEmail: (rule: Rule, value: string): Promise<void> => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/gm;
    if (value && !emailRegex.test(value)) {
      return Promise.reject("Not a valid email!");
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
  }
};
export default validator;
