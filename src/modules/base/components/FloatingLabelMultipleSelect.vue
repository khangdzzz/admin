<template>
  <a-form-item :name="controlName" :rules="rules" :class="className">
    <FloatingLabel
      class="floating-label-select"
      :style="`height: ${hasValue ? 80 : 64}px`"
      :is-focused="isFocused || hasValue"
      :label="$t(isFocused || !!value ? label : placeHolder)"
      :control-name="controlName"
      :required="required"
      @click="focus(`${label}-input`)"
      :prefix="prefix"
    >
      <a-select
        :id="`${label}-input`"
        :class="[
          'floating-label-select__input',
          hasValue && 'floating-label-select__input-selected'
        ]"
        dropdownClassName="floating-label-select__dropdown"
        :bordered="false"
        :value="value"
        :options="options"
        :open="isFocused"
        mode="multiple"
        :max-tag-count="2"
        :max-tag-text-length="10"
        @focusin="isFocused = true"
        @focusout="isFocused = false"
        @change="dataChange"
      >
        <template #option="{ value: optionValue, content, label }">
          <div class="d-flex align-center gap-10">
            <div>
              <a-checkbox
                class="floating-label-select__checkbox"
                :checked="
                  value && value.indexOf(optionValue) !== -1 && value.length > 0
                "
              ></a-checkbox>
            </div>
            <div class="d-flex flex-column justify-center gap-6">
              <div v-if="content" class="floating-label-select__input-label">
                {{ content }}
              </div>
              <div class="floating-label-select__input-value">
                {{ label }}
              </div>
            </div>
          </div>
        </template>
        <template #removeIcon>
          <CloseIcon
            color="#ffffff"
            backgroundColor="#999999"
            class="floating-label-select__close-icon"
          />
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
import CloseIcon from "@/assets/icons/IcCloseIcon.vue";
import { computed, PropType, ref } from "vue";
//#endregion

//#region props
const props = defineProps({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: [Array<string>, String]
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
  }
});
//#endregion

//#region variables
const isFocused = ref(false);
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "update:value", data: any[]): void;
}>();
//#endregion

//#region hooks
//#endregion

//#region function
const focus = (id: string): void => {
  document.getElementById(id)?.focus();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataChange = (value: any[]): void => {
  emit("update:value", value || []);
};
//#endregion

//#region computed
const hasValue = computed((): boolean => {
  return !!props.value && props.value.length > 0;
});
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

  .ant-select-selection-item {
    border: 1px solid $primary-400;
    border-radius: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    padding: 0px 10px 0px 20px;
    gap: 10px;
  }

  .ant-select-selection-item-content {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    color: $neutral-600;
  }

  .ant-select-selection-item-remove {
    display: flex;
    align-items: center;
  }

  .floating-label-select__checkbox {
    .ant-checkbox {
      .ant-checkbox-inner {
        border-radius: 4px !important;
        border: 1px solid $neutral-200;
      }
    }
  }

  .ant-select-selection-overflow-item {
    &:last-child {
      flex-grow: 1;
      .ant-select-selection-search {
        max-width: max-content;
      }
    }
  }
}
</style>
<style lang="scss">
.floating-label-select {
  &__dropdown {
    .ant-select-item-option {
      height: 64px;
    }

    .ant-select-item-option-active {
      height: 64px;
    }

    .ant-select-dropdown {
      padding: 0px;
    }

    .ant-select-item-option {
      &:not(:last-child) {
        border-bottom: 1px solid $neutral-100;
      }
    }

    .ant-select-item-option-state {
      display: none;
    }
  }

  &__close-icon {
    &:hover {
      circle {
        fill: $neutral-200 !important;
      }
    }
  }

  &__input-selected {
    .ant-select-selector {
      .ant-select-selection-overflow {
        .ant-select-selection-overflow-item {
          padding-top: 8px;
          padding-bottom: 10px;
        }
      }
    }
  }
}
</style>
