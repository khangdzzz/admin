<template>
  <a-row type="flex" align="middle" justify="center" class="header mt-30 mb-20">
    <a-col :span="colTitle">
      <h2 class="header-title">{{ title }}</h2>
    </a-col>
    <a-col :span="colAction">
      <a-row type="flex" align="middle" justify="end" class="gap-20">
        <a-input
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
      </a-row>
    </a-col>
  </a-row>
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
    default: 4
  },
  colAction: {
    type: Number,
    default: 20
  },
  modelValue: {
    type: String,
    default: ""
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
  .header-title {
    margin: 0 !important;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 600;
    color: $neutral-600;
    font-size: 28px;
    line-height: 32.81px;
  }
  .ant-input {
    font-size: 20px;
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
