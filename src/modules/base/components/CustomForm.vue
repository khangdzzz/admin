<template>
  <a-form-item
    v-for="(item, index) in formData"
    :key="item.key"
    :name="['formData', index, 'value']"
    :rules="item.rules"
  >
    <component
      :is="item.inputType"
      v-model:value="item.value"
      :disabled="item.disabled"
      :options="item.options"
      :style="item.style"
      :dropdownClassName="item.dropdownClassName"
      @change="handleChange"
      @select="onSelect"
      @pressEnter="onPressEnter"
      @focus="onFocus(index)"
      @blur="onBlur(item.value, index)"
      class="input-item float-label"
      :class="[!item.icon ? 'not-has-icon' : 'has-icon-input']"
    >
      <!-- //region slot input  -->
      <template #prefix v-if="item.icon">
        <component :is="item.icon" />
      </template>
      <template #suffix>
        <a-tooltip title="Extra information">
          <component :is="item.icon" />
        </a-tooltip>
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
          style="padding: 4px"
        />
      </template>
      <!-- endregion -->
    </component>

    <label
      :class="['label', item.isFocus && 'as-label', item.icon && 'has-icon']"
      >{{ item.label }}
    </label>
  </a-form-item>
</template>

<script setup lang="ts">
//#region import
//#endregion
//*===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
const emit = defineEmits<{
  (e: "change", value: string | Event): void;
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
const handleChange = (value: string | Event) : void => emit("change", value);

const onSelect = (value: string | Event) : void => emit("select", value);

const onPressEnter = () : void => emit("pressEnter");

const onBlur = (value: number | boolean | Event, index: number) : void => {
  emit("onBlur", value, index);
};

const onFocus = (index: number) : void => {
  emit("onFocus", index);
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

:deep() {
  .input-item {
    min-width: 360px;
    height: 60px;
    border: 1px solid #eaeaea;
    outline: none;
    border-radius: 10px;
    padding: 0px 12px 0px 12px;
    background: #f7f7f7;

    .ant-input {
      background: transparent;
    }

    .ant-input-number {
      background: transparent;
    }

    .ant-select-selector {
      height: 100%;
      background-color: transparent;
      border-radius: 10px !important;
      .ant-select-selection-item {
        top: 18px;
      }
      .ant-select-selection-search {
        top: 18px;
      }
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
  }
}

.has-icon-input {
  .ant-input {
    padding-left: 12px !important;
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
  top: 20px;
  transition: 0.2s ease all;
  z-index: 1000;
  color: #999999;
}
.as-label {
  top: 4px;
  font-size: 12px !important;
}

.has-icon {
  left: 44px !important;
}

.rc-virtual-list-scrollbar-thumb {
  background-color: #d7d7d7 !important;
}
</style>
