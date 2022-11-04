<template>
  <a-form-item :name="controlName" :rules="rules" :class="className">
    <FloatingLabel
      class="floating-label-select"
      :is-focused="isFocused || !!value"
      :label="!noLabel ? $t(isFocused || !!value ? label : placeHolder) : ''"
      :placeholder="!value ? placeholder : ''"
      :control-name="controlName"
      :required="required"
      @click="focus(`${label}-input`)"
      :prefix="prefix"
      :style="size === 'small' ? 'height: 40px' : 'height: 60px'"
    >
      <a-select
        :id="`${label}-input`"
        :class="[
          'floating-label-select__input',
          size === 'small' ? 'floating-label-select__input-small' : ''
        ]"
        @focusin="isFocused = true"
        @focusout="isFocused = false"
        :bordered="false"
        :value="value"
        :options="options"
        show-search
        :open="isFocused"
        @change="dataChange"
        :filter-option="filterOption"
      >
        <template #suffixIcon>
          <div></div>
        </template>
        <template #option="{ label, content }">
          <div class="d-flex flex-column justify-center gap-6">
            <div v-if="content" class="floating-label-select__input-label">
              {{ content }}
            </div>
            <div class="floating-label-select__input-value">{{ label }}</div>
          </div>
        </template>
      </a-select>
      <img
        class="floating-label-select__dropdown"
        src="@/assets/icons/ic_dropdown.svg"
        width="20"
        height="20"
        style="padding: 4px"
      />
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
  noLabel: {
    type: Boolean,
    default: false
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
    type: [String, Array<string>],
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
  options: {
    type: Array,
    default: () => []
  },
  className: {
    type: String
  },
  size: {
    type: String,
    default: "medium"
  },
  placeholder: {
    type: String,
    default: ""
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
const filterOption = (input: string, option: any): boolean => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const dataChange = (value: string): void => {
  emit("update:value", value || "");
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.floating-label-select {
  position: relative;
  cursor: text;

  &__dropdown {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translate(0, -50%);
  }

  &__input {
    position: absolute;
    top: 20px;
    height: 40px;
    bottom: 0;
    width: 100%;
    left: 0px;
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

  &__input-small {
    top: 0px !important;
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

  &__input-label {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: $neutral-400;
  }

  &__input-value {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: $neutral-600;
  }
}

.ant-select-item-option-selected {
  .ant-select-item-option-content {
    .floating-label-select__input-value {
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      color: $neutral-600;
    }
  }
}

:deep() {
  .ant-form-item-explain-error {
    color: $red-500 !important;
    margin-bottom: 20px;
    margin-top: 8px;
  }
}
</style>
<style lang="scss">
.ant-select-dropdown {
  &:has(div
      > .rc-virtual-list-holder
      > div
      > .rc-virtual-list-holder-inner
      > .ant-select-item-option
      > .ant-select-item-option-content
      > div
      > .floating-label-select__input-value) {
    padding: 0px !important;
  }
}

.ant-select-item-option {
  &:has(.ant-select-item-option-content
      > div
      > .floating-label-select__input-value) {
    height: 64px !important;
  }
}

.ant-select-item-option-active {
  &:has(.ant-select-item-option-content
      > div
      > .floating-label-select__input-value) {
    height: 64px !important;
  }
}
</style>
