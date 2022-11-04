export enum FormItems {
  INPUT = "AInput",
  SELECT = "ASelect",
  DIVIDER = "DIVIDER"
}

export type IFormField<T, OptionType> = {
  [key in keyof T]: {
    label?: string;
    component: string;
    value: string | number;
    disabled?: boolean;
    options?: OptionType[];
    fieldNames?: {
      label?: string;
      value?: string;
      options?: string;
    };
    readonly?: boolean;
    noDivider?: boolean;
    change?: (value) => void;
  };
};
