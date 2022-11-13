import { computed, WritableComputedRef } from "vue";
//#endregion
export function useVModel(
  props: {
    modelValue: boolean;
  },
  { emit }
): WritableComputedRef<boolean> {
  //#region props
  //#endregion

  //#region variables
  //#endregion

  //#region hooks
  //#endregion

  //#region function
  //#endregion

  //#region computed
  const current = computed<boolean>({
    get(): boolean {
      return props.modelValue;
    },
    set(value: boolean): void {
      emit("update:modelValue", value);
    }
  });
  return current;
}
//#endregion

//#region reactive
//#endregion
