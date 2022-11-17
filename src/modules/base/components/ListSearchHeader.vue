<template>
  <div class="d-flex justify-space-between mx-30 mt-30 mb-20 header">
    <div class="header__content">
      <img
        src="@/assets/icons/ic_back.svg"
        @click="$emit('goBack')"
        v-if="enableBack"
      />
      <div class="header__content__title">{{ title }}</div>
    </div>
    <div class="d-flex gap-15">
      <a-tooltip
        :placement="hintPlacement"
        overlayClassName="search-header__tooltip"
        v-if="hintMessage && enableSearch"
      >
        <template #title>
          <div class="search-header__hint-title" v-if="hintTitle">
            {{ hintTitle }}
          </div>
          <div class="search-header__hint-message">
            {{ hintMessage }}
          </div>
        </template>
        <a-input
          id="list-search-header_edt-search"
          v-if="enableSearch"
          :value="modelValue"
          :placeholder="$t('search_input')"
          class="search-input"
          @change="onSeachChange($event.target.value)"
          allow-clear
          ><template #prefix>
            <img src="@/assets/icons/ic_search.svg" />
          </template>
        </a-input>
      </a-tooltip>
      <a-input
        v-if="!hintMessage && enableSearch"
        :value="modelValue"
        :placeholder="$t('search_input')"
        class="search-input"
        @change="onSeachChange($event.target.value)"
        allow-clear
        ><template #prefix>
          <img src="@/assets/icons/ic_search.svg" />
        </template>
      </a-input>

      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
//#region import
//#endregion

//#region props
defineProps({
  title: {
    type: String,
    default: ""
  },
  colTitle: {
    type: Number,
    default: 6
  },
  colAction: {
    type: Number,
    default: 6
  },
  modelValue: {
    type: String,
    default: ""
  },
  enableSearch: {
    type: Boolean,
    default: true
  },
  enableBack: {
    type: Boolean,
    default: false
  },
  hintTitle: {
    type: String,
    default: ""
  },
  hintMessage: {
    type: String,
    default: ""
  },
  hintPlacement: {
    type: String,
    default: "bottomLeft"
  }
});

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();
//#endregion

//#region variables
//#endregion

//#region hooks
//#endregion

//#region function
const onSeachChange = (value: string): void => {
  emit("update:modelValue", value);
};

const clearInput = (): void => {
  emit("update:modelValue", "");
};

defineExpose({ clearInput });

//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.header {
  margin: 36px 30px;
  &__content {
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      object-fit: fill;
      margin-right: 20px;
      cursor: pointer;
    }
    &__title {
      margin: 0 !important;
      font-family: "Roboto";
      font-style: normal;
      font-weight: 600;
      color: $neutral-600;
      font-size: 28px;
      line-height: 32.81px;
    }
  }
  .ant-input {
    font-size: 20px;
  }
}
:deep() {
  .ant-select {
    .ant-select-selector {
      width: 180px !important;
      height: 48px;
      border: 1px solid $neutral-200;
      border-radius: 10px;
      display: flex;
      align-items: center;
    }
  }
}
.search-input {
  width: 330px;
  height: 48px;
  background: #ffffff;
  border: 1px solid #d7d7d7;
  border-radius: 10px;
  margin: 0;
}
</style>
<style lang="scss">
.search-input {
  .ant-input {
    font-size: 18px !important;
  }
}

.search-header {
  &__hint-title {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: $white;
  }

  &__hint-message {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: $white;
  }

  &__tooltip {
    max-width: 538px !important;
  }
}
</style>
