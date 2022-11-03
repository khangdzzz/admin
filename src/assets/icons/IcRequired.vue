<template>
  <span :style="`font-size:${fontSize};color:${color}`">&nbsp;* </span>
</template>
<script setup lang="ts">
//#region import
//#endregion

//#region props
defineProps({
  fontSize: {
    type: String,
    default: "16px"
  },
  color: {
    default: "#f54e4e",
    type: String
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

<style lang="scss" scoped></style>
