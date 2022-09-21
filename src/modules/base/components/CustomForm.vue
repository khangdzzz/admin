<template>
  <a-form-item
    v-for="(item, index) in formData"
    :key="item.key"
    :name="['formData', index, 'value']"
    :rules="item.rules">
    <component
      :is="item.inputType"
      v-model:value="item.value"
      :disabled="item.disabled"
      :options="item.options"
      :style="item.style"
      :dropdownClassName="item.dropdownClassName"
      autocomplete="new-password"
      @change="handleChange(item.value, index)"
      @select="onSelect"
      @pressEnter="onPressEnter"
      @focus="onFocus(index)"
      @blur="onBlur(item.value, index)"
      class="input-item float-label"
      :class="[
        !item.icon ? 'not-has-icon' : 'has-icon-input',
        isActivePasswordIcon(item) ? 'password-item' : '',
        !item.label ? 'not-has-label' : 'has-label'
      ]">
      <!-- //region slot input  -->
      <template #prefix v-if="item.icon">
        <component :is="item.icon" :color="item.iconColor" />
      </template>
      <template #suffix>
        <component :is="item.suffixIcon" :color="item.iconColor" />
      </template>
      <!-- endregion -->

      <!-- //region slot select and autocomplete  -->
      <template #option="{ label }">
        <div :style="styleContent">
          <span class="text-content">
            {{ label }}
          </span>
        </div>
      </template>
      <!-- endregion -->

      <!-- //region slot select  -->
      <template #suffixIcon>
        <img
          src="@/assets/icons/ic_dropdown.svg"
          width="20"
          height="20"
          style="padding: 4px" />
      </template>
      <!-- endregion -->
    </component>

    <label
      :class="[
        'label',
        item.isFocus || item.value ? 'as-label' : '',
        item.icon && 'has-icon'
      ]"
      >{{
        item.isFocus || item.value
          ? $t(item.label)
          : item.placeHolder
          ? $t(item.placeHolder)
          : $t(item.label)
      }}
      <span class="require" v-if="item.required">*</span>
    </label>
  </a-form-item>
</template>

<script setup lang="ts">
//#region import
//#endregion

//*===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value: any, index: number): void;
  (e: "select", value: string | Event): void;
  (e: "pressEnter"): void;
  (
    e: "onBlur",
    value: number | boolean | Event,
    index: number | string | Event
  ): void;
  (e: "onFocus", index: number | boolean | Event): void;
}>();
//#endregion

//#region props
defineProps({
  formData: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Array as unknown as any
  }
});

//#endregion

//#region variables
const styleContent = {
  minHeight: "50px",
  padding: "17px 20px 17px 15px"
};

//#region hooks
//#endregion

//#region function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleChange = (value: any, index: number): void =>
  emit("change", value, index);

const onSelect = (value: string | Event): void => emit("select", value);

const onPressEnter = (): void => emit("pressEnter");

const onBlur = (value: number | boolean | Event, index: number): void => {
  emit("onBlur", value, index);
};

const onFocus = (index: number): void => {
  emit("onFocus", index);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isActivePasswordIcon = (item: any): boolean => {
  return item.name === "password" && item?.value?.length;
};

//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.ant-select-item {
  padding: 0px;
}
.require {
  color: $red-1;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
}
:deep() {
  .input-item {
    min-width: 360px;
    height: 60px;
    border: 1px solid $grey-1;
    outline: none;
    border-radius: 10px;
    padding: 0px 12px 0px 12px;
    background: #f7f7f7;

    .ant-input {
      background: transparent;
    }
    .not-has-label {
      input[type="text"] {
        font-size: 16px !important;
      }
    }
    input[type="text"] {
      font-size: 16px !important;
      margin-top: 8px;
    }
    .ant-input-number {
      background: transparent;
    }

    .ant-select-selector {
      height: 100%;
      background-color: transparent;
      border-radius: 10px !important;
      border: 1px solid $grey-1;

      .ant-select-selection-item {
        top: 22px;
      }

      .ant-select-selection-search {
        top: 22px;
      }
    }

    .anticon-eye-invisible {
      color: $text-1 !important;
    }

    .anticon-eye {
      color: $text-1 !important;
    }
  }

  .password-item {
    .anticon-eye-invisible {
      color: $primary !important;
    }

    .anticon-eye {
      color: $primary !important;
    }
  }
}
</style>

<style lang="scss">
.form-option-content {
  .ant-select-item-option {
    padding: 0px !important;

    .text-content {
      color: #3c3c3c;
      font-size: 16px;
      font-weight: 400;
      line-height: 100%;
    }
  }
}

.not-has-icon {
  .ant-input {
    position: relative;
    left: 0px !important;
    padding-top: 8px !important;
  }
}

.has-icon-input {
  .ant-input {
    padding-left: 8px !important;
    padding-top: 10px !important;
  }
}

.float-label {
  position: relative;
}

.label {
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 12px;
  top: 22px;
  transition: 0.2s ease all;
  z-index: 1000;
  color: #999999;
  font-weight: 400;
  font-size: 16px !important;
  line-height: 100%;
}

.as-label {
  top: 10px;
  font-size: 14px !important;
}

.has-icon {
  left: 44px !important;
}

.rc-virtual-list-scrollbar-thumb {
  background-color: #d7d7d7 !important;
}
</style>
