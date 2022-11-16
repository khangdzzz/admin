<template>
  <span class="sort-view">
    <IcSortAsc v-if="sort === Sort.Asc" />
    <IcSortDesc v-else-if="sort === Sort.Desc" />
    <IcSortNone v-else />
  </span>
</template>

<script setup lang="ts">
//#region import
import { Sort } from "../models/sort.enum";
import IcSortNone from "@/assets/icons/IcSortNone.vue";
import IcSortDesc from "@/assets/icons/IcSortDesc.vue";
import IcSortAsc from "@/assets/icons/IcSortAsc.vue";
import { PropType } from "vue";
//#endregion

//#region props
defineProps({
  sort: {
    type: String as PropType<Sort>,
    default: Sort.None
  }
});
//#endregion

//#region variables
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
.sort-view {
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  height: 24px;
  &__icon-container {
    margin: 0px;
    padding: 4px 0px;
  }
  svg {
    position: relative;
    top: 4px;
  }
}
</style>
