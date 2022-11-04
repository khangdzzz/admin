/* eslint-disable */
// import { IFormField } from "@/modules/base/components/forms/form-models";

// export function useForm<T extends object>(
//   formField: IFormField<T>,
//   data: T
// ): IFormField<T> {
//   Object.keys(data).forEach((key) => {
//     if (formField[key]) formField[key].value = data[key];
//   });
//   return formField;
// }

export function useForm(formField, data) {
  Object.keys(data).forEach((key) => {
    if (formField[key]) formField[key].value = data[key];
  });
  return formField;
}

export function getFormRequestData(formFields) {
  return Object.keys(formFields).reduce((acc, cur) => {
    acc[cur] = formFields[cur].value || null
    return acc
  }, {})
}