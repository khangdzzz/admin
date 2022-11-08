import { Rule } from "ant-design-vue/lib/form";

export interface InputType {
  inputType: string;
  value: string | number | boolean;
  placeHolder: string;
  label: string;
  name: string;
  disabled: boolean;
  required: boolean;
  key: number;
  isFocus: boolean;
  rules?: Rule[];
  parent?: string;
  actionBtn?: ActionButton;
  options?: InputOptions[];
  class?: string;
  loading?: boolean;
  id?: string;
}

interface InputOptions {
  value?: string | boolean | number | undefined;
  label: string;
  options?: InputOptions[];
}

interface ActionButton {
  name: string;
  click?: () => void | (() => Promise<void>) | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}
