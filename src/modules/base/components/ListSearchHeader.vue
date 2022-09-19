<template>
  <a-row type="flex" align="middle" justify="center" class="header">
    <a-col :span="6">
      <h2 class="header-title">{{ title }}</h2>
    </a-col>
    <a-col :span="18">
      <a-row type="flex" align="middle" justify="end">
        <a-input
          v-model:value="searchValue"
          :placeholder="$t('search_input')"
          class="search-input"
          @change="$emit('onChange', searchValue)"
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

import { ref } from "vue";

//#region props
defineProps({
  title: {
    type: String,
    default: ""
  }
});
//#endregion

//#region variables
const searchValue = ref<string>("");
//#endregion

//#region hooks
//#endregion

//#region function
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
    font-size: 28px;
    line-height: 36px;
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
