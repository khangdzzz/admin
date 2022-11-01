<template>
  <a-form-item :name="controlName" :rules="rules" :class="className">
    <FloatingLabel
      class="floating-label-input"
      :is-focused="isFocused || !!value"
      :label="$t(isFocused || !!value ? label : placeHolder)"
      :control-name="controlName"
      :required="required"
      @click="focus(`${label}-input`)"
      :prefix="prefix"
    >
      <a-input
        :id="`${label}-input`"
        class="floating-label-input__input"
        @focusin="isFocused = true"
        @focusout="isFocused = false"
        :bordered="false"
        :value="value"
        @change="dataChange"
      >
      </a-input>
    </FloatingLabel>
  </a-form-item>
</template>

<script setup lang="ts">
//#region import
import FloatingLabel from "@/modules/base/components/FloatingLabel.vue";
import { PropType, ref } from "vue";
//#endregion

//#region props
defineProps({
  label: {
    type: String,
    default: ""
  },
  placeHolder: {
    type: String,
    default: ""
  },
  controlName: {
    type: String,
    default: "",
    require: true
  },
  value: {
    type: String,
    default: ""
  },
  rules: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Object as PropType<any[]> | undefined
  },
  required: {
    type: Boolean,
    default: false
  },
  prefix: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Object as PropType<{ icon: any; action: any }> | undefined
  },
  className: {
    type: String
  }
});
//#endregion

//#region variables
const isFocused = ref(false);
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "update:value", data: string): void;
}>();
//#endregion

//#region hooks
//#endregion

//#region function
const focus = (id: string): void => {
  document.getElementById(id)?.focus();
};
const dataChange = (e: { target: { value: string | undefined } }): void => {
  emit("update:value", e?.target?.value || "");
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.floating-label-input {
  height: 60px;
  position: relative;
  cursor: text;

  &__input {
    position: absolute;
    top: 20px;
    height: 40px;
    bottom: 0;
    width: calc(100% - 24px);
    left: 12px;
    right: 12px;
    background-color: transparent !important;
    padding-left: 0;
    padding-right: 0;

    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 100%;
    color: #222222;
  }

  &__input:focus {
    position: absolute;
    top: 20px;
    height: 40px;
    bottom: 0;
    padding-left: 0;
    padding-right: 0;
    background-color: transparent !important;
  }
}

:deep() {
  .ant-form-item-explain-error {
    color: $red-500 !important;
    margin-top: 8px;
  }
}
</style>
