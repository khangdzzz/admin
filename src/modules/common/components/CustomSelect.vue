<template>
  <div class="custom-select" :style="`width: ${width}px; height: ${height}px`">
    <div
      :class="[
        'custom-select__label fill-width fill-height d-flex align-center px-12',
        isOpenOptionsList ? 'custom-select__label-focused' : ''
      ]"
      @click="handleClickCustomSelectLabel"
    >
      {{ displayLabel || "" }}
    </div>
    <div
      class="custom-select__options-list"
      v-click-outside="handleClickOutside"
      v-if="isOpenOptionsList"
    >
      <div
        v-for="(option, index) in options"
        :key="option.value + '' + index"
        :class="[
          'custom-select__option-item d-flex align-center px-15',
          isItemSelected(option) ? 'custom-select__option-item-selected' : ''
        ]"
        @click="handleClickSelectItem(option)"
      >
        {{ option.label }}
      </div>
      <div
        class="custom-select__action-button-wrapper d-flex align-center px-15"
      >
        <a-button
          class="custom-select__apply-button fill-width"
          type="primary"
          @click="handleApplySelectedItem"
          >Apply</a-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//#region import
import { computed, onMounted, ref } from "vue";
//#endregion

interface Option {
  value: string | number;
  label: string;
  content?: string;
}

//#region props
const props = defineProps({
  options: {
    type: Array<Option>,
    default: []
  },
  width: {
    type: Number,
    default: 240
  },
  height: {
    type: Number,
    default: 48
  },
  value: {
    type: [String, Number],
    default: ""
  }
});

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "update:value", data: string | number): void;
}>();
//#endregion

//#region variables
const isOpenOptionsList = ref(false);
const shadowSelectedItem = ref<Option>({ value: "", label: "" });
const selectedItem = ref<Option>({ value: "", label: "" });
//#endregion

//#region hooks
onMounted(() => {
  const { value, options } = props;

  const foundOption = options.find((o) => o.value === value);
  if (foundOption) {
    selectedItem.value = foundOption;
    shadowSelectedItem.value = foundOption;
  }
});
//#endregion

//#region function
const handleClickOutside = (): void => {
  isOpenOptionsList.value = false;
};

const handleClickCustomSelectLabel = (): void => {
  isOpenOptionsList.value = true;
};

const handleClickSelectItem = (option: Option): void => {
  shadowSelectedItem.value = option;
};

const handleApplySelectedItem = (): void => {
  selectedItem.value = shadowSelectedItem.value;
  isOpenOptionsList.value = false;
  emit("update:value", selectedItem.value.value);
};

const isItemSelected = (option: Option): boolean => {
  return JSON.stringify(option) === JSON.stringify(shadowSelectedItem.value);
};
//#endregion

//#region computed
const displayLabel = computed(() => {
  return selectedItem.value?.label || "";
});
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.custom-select {
  position: relative;
  &__label {
    background: $white;
    border-radius: 10px;
    transition: border 150ms;
    border: 1px solid $neutral-200;
    cursor: pointer;

    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    color: $neutral-600;

    &:hover {
      border-color: #27b5c4;
    }
  }

  &__label-focused {
    box-shadow: 0 0 0 2px #07a0b833;
  }

  &__options-list {
    position: absolute;
    top: 48px;
    left: 0;
    width: 100%;
    height: auto;
    background-color: $white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    z-index: 1;
  }

  &__option-item {
    height: 48px;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: $neutral-600;
    cursor: pointer;

    &:first-child {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    &:not(:nth-last-child(2)) {
      border-bottom: 1px solid $neutral-100;
    }

    &:hover {
      background-color: $neutral-50;
    }
  }

  &__option-item-selected {
    background: $neutral-50;
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    color: $neutral-600;
  }

  &__action-button-wrapper {
    height: 60px;
  }

  &__apply-button {
    height: 40px;
  }
}
</style>
