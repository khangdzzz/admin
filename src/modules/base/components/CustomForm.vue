<template>
  <a-form-item
    :class="[item.name === 'radio' && 'mb-0']"
    v-for="(item, index) in formData"
    :key="item.key"
    :name="[item.parent || 'formData', index, 'value']"
    :rules="item.rules"
  >
    <component
      :id="item.id"
      v-if="item.name === 'email'"
      :is="item.inputType"
      v-model:value.trim="item.value"
      :disabled="item.disabled || item.loading"
      :options="item.options"
      :style="item.style"
      :dropdownClassName="item.dropdownClassName"
      autocomplete="new-password"
      @change="handleChange(item, item.value, index)"
      @select="onSelect"
      @pressEnter="onPressEnter"
      @focus="onFocus(index)"
      @blur="onBlur(item.value, index)"
      class="input-item float-label"
      :class="[
        item.class,
        !item.icon ? 'not-has-icon' : 'has-icon-input',
        isActivePasswordIcon(item) ? 'password-item' : '',
        !item.label ? 'not-has-label' : 'has-label',
        item.inline && 'inline'
      ]"
    >
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
          style="padding: 4px"
        />
      </template>

      <!-- endregion -->
    </component>
    <component
      :id="item.id"
      v-else-if="item.name !== 'radio'"
      :is="item.inputType"
      v-model:value="item.value"
      :disabled="item.disabled || item.loading"
      :options="item.options"
      :style="item.style"
      :dropdownClassName="item.dropdownClassName"
      :mode="item.mode"
      :type="item.keyboardType || ''"
      autocomplete="new-password"
      show-search
      :filter-option="filterOption"
      @change="handleChange(item, item.value, index)"
      @select="onSelect"
      @pressEnter="onPressEnter"
      @focus="onFocus(index)"
      @blur="onBlur(item.value, index)"
      @keydown="item.inputBehaviour"
      @keypress="onKeyPress(item.value, index)"
      class="input-item float-label"
      :class="[
        item.class,
        !item.icon ? 'not-has-icon' : 'has-icon-input',
        isActivePasswordIcon(item) ? 'password-item' : '',
        !item.label ? 'not-has-label' : 'has-label',
        item.inline && 'inline',
        item.mode && 'multiple'
      ]"
    >
      <!-- //region slot input  -->
      <template #prefix v-if="item.icon">
        <component :is="item.icon" :color="item.iconColor" />
      </template>
      <template #suffix>
        <component :is="item.suffixIcon" :color="item.iconColor" />
        <LoadingSpinner v-if="item.loading" />
      </template>
      <!-- endregion -->

      <!-- //region slot select and autocomplete  -->
      <template #option="{ label, value, content }">
        <div
          class="custom-form__option-wrapper px-10 d-flex justify-start align-center"
        >
          <div class="checkbox mr-10">
            <a-checkbox
              :checked="checked(item.value, value)"
              v-if="item.mode"
            />
          </div>
          <div
            class="content fill-height d-flex flex-column justify-center gap-6z custom-form__custom-option-padding"
            :class="
              item.mode === 'multiple'
                ? 'custom-form__custom-multiple-option-padding'
                : ''
            "
          >
            <div class="text-content">{{ content }}</div>
            <div class="text-label">{{ label }}</div>
          </div>
        </div>
      </template>

      <template #tagRender="{ label, value }">
        <a-tag class="tag-select d-flex align-center">
          {{ label }}
          <img
            src="@/assets/icons/ic_close_tag.svg"
            @click="$emit('close', index, value)"
            class="ml-10"
          />
          <!-- <span role="img" :aria-label="val">{{ option.icon }}</span> -->
        </a-tag>
      </template>

      <!-- endregion -->

      <!-- //region slot select  -->
      <template #suffixIcon>
        <div v-if="item.loading">
          <LoadingSpinner />
        </div>
        <IcDropDown :color="item.disabled ? '#999999' : '#3C3C3C'" />
      </template>
      <!-- endregion -->
    </component>

    <div
      class="d-flex align-center"
      v-if="item.actionBtn && item.actionBtn.name"
    >
      <a-button
        class="custom-form__action-btn"
        :disabled="item.actionBtn.disabled || false"
        :loading="item.actionBtn.loading || false"
        @click="item.actionBtn.click"
        >{{ $t(item.actionBtn.name) }}</a-button
      >
    </div>

    <label
      v-if="item.label"
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
      <span
        :class="[item.disabled ? 'disabled-require' : 'require']"
        v-if="item.required"
        >*</span
      >
    </label>

    <div v-if="item.inline && item.spaceStyle" :style="item.spaceStyle"></div>

    <slot v-if="item.inputType === 'ARadioGroup'" name="radio"></slot>
  </a-form-item>
</template>

<script setup lang="ts">
//#region import
import IcDropDown from "@/assets/icons/IcDropDown.vue";
import LoadingSpinner from "@/modules/base/components/InputLoadingSpinner.vue";
//#endregion

//*===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "input", value: any, index: number): void;
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
  (e: "onKeyPress", value: string | number, index: number): void;
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
const checked = (values: string[], value: string): boolean => {
  return (values || []).includes(value);
};

const convertJpNumber = (value: string): string => {
  const replaceFn = (
    text: string,
    search = "０１２３４５６７８９．　",
    replace = "0123456789. "
  ): string => {
    if (!text) return "";
    // Make the search string a regex.
    var regex = RegExp("[" + search + "]", "g");
    var t = text.replace(regex, function (chr) {
      var ind = search.indexOf(chr);
      var r = replace.charAt(ind);
      return r;
    });
    return t;
  };
  return replaceFn(value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleChange = (item: any, value: any, index: number): void => {
  const unicodeValue = convertJpNumber(value);
  item.value = unicodeValue;
  emit("change", unicodeValue, index);
};

const onSelect = (value: string | Event): void => emit("select", value);

const onPressEnter = (): void => emit("pressEnter");

const onBlur = (value: number | boolean | Event, index: number): void => {
  emit("onBlur", value, index);
};

const onFocus = (index: number): void => {
  emit("onFocus", index);
};

const onKeyPress = (value: string | number, index: number): void => {
  emit("onKeyPress", value, index);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isActivePasswordIcon = (item: any): boolean => {
  return item.name === "password" && item?.value?.length;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterOption = (input: string, option: any): boolean => {
  if (!input) return true;
  return option.label.toLowerCase().includes(input.toLowerCase());
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
  @include text(400, 12px, 100%);
}
.disabled-require {
  color: $text-1;
  @include text(400, 12px, 100%);
}

.custom-form {
  &__action-btn {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 100%;
    color: $primary-400;
    border: 1px solid $primary-400;
    border-radius: 6px;
  }

  &__option-wrapper {
    height: 64px !important;
  }

  &__custom-option-padding {
    margin-left: -10px;
  }
  &__custom-multiple-option-padding {
    margin-left: 10px;
  }
}

:deep() {
  .multiple {
    position: relative;
  }

  .dropdown {
    position: absolute;
    top: 27px;
    right: 13px;
  }
  .ant-form-item-explain {
    margin-top: 8px;
  }
  .input-item {
    height: 60px;
    border: 1px solid $grey-1;
    outline: none;
    border-radius: 10px;
    background: $neutral-50;

    &:has(.ant-select-selector) {
      border: none !important;
    }

    .ant-input {
      background: transparent;
      border-radius: 10px;
      font-size: 16px;
      line-height: 16px;
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
      border: 1px solid $neutral-100;
      .ant-select-selection-overflow {
        .ant-select-selection-overflow-item {
          span {
            .tag-select {
              margin-right: 8px;
              border-radius: 38px;
              border: 1px solid $primary;
              @include text(400, 16px, 100%);
              padding: 11px 20px;
              top: 8px;
              position: relative;
              height: 38px;
              box-sizing: border-box;
              img {
                cursor: pointer;
              }
            }
          }
        }
      }

      .ant-select-selection-item {
        height: 38px;
        top: 22px;
        .ant-select-selection-item-content {
          margin-top: 11px;
          @include text(400, 16px, 100%);
        }
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

  .ant-select-arrow {
    &:has(div > div.input-loading-spinner) {
      right: 68px;
    }
  }
}
</style>

<style lang="scss">
.ant-select-dropdown {
  padding: 0;
}

.text-label {
  color: $neutral-600;
  @include text(400, 16px, 20px);
}

.text-content {
  color: $neutral-400;
  @include text(400, 14px, 18px);
}

.ant-select-item-option-selected {
  .text-label {
    color: $neutral-600;
    font-weight: 600 !important;
  }
}

.form-option-content {
  .ant-select-item-option-active,
  .ant-select-item-option-selected {
    background-color: $grey-2;
    .text-content {
      color: $neutral-600;
      @include text(600, 16px, 100%);
    }
  }
  .ant-select-item-option {
    padding: 0px !important;

    .ant-select-item-option-state {
      display: none;
    }
    .ant-select-item-option-content {
      .checkbox {
        .ant-checkbox-wrapper {
          .ant-checkbox-inner {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
  .ant-select-item-option:not(:last-child) {
    border-bottom: 1px solid $neutral-100 !important;
  }
}

.float-label {
  position: relative;
}

.label {
  position: absolute;
  pointer-events: none;
  left: 12px;
  top: 22px;
  transition: 0.2s ease all;
  z-index: 1000;
  color: #999999;
  @include text(400, 16px !important, 100%);
}

.as-label {
  top: 10px;
  font-size: 14px !important;
}

.has-icon {
  left: 44px !important;
  margin-left: 0px;
}

.rc-virtual-list-scrollbar-thumb {
  background-color: #d7d7d7 !important;
}
</style>
