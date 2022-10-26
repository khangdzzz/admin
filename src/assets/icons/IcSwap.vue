<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M30.2752 12.8676H5.01206V7.78104H30.2752V2L40 10.3243L30.2752 18.6486V12.8676ZM9.7248 27.1324H34.9879V32.219H9.7248V38L0 29.6757L9.7248 21.3514V27.1324Z"
      :fill="color"
    />
  </svg>
</template>

<script setup lang="ts">
//#region import
//#endregion

//#region props
defineProps({
  width: {
    type: String,
    default: "40"
  },
  height: {
    type: String,
    default: "40"
  },
  color: {
    type: String,
    default: "#999999"
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
