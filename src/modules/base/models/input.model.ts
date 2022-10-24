import { Rule } from "ant-design-vue/lib/form";

export interface InputType {
  inputType: string;
  value: string | number | boolean | null;
  placeHolder: string;
  label: string;
  name: string;
  disabled: boolean;
  required: boolean;
  key: number;
  isFocus: boolean;
  rules?: Rule[];
  parent?: string;
}
