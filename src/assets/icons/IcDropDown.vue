<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.85252 0.952477L5.54602 5.75251C5.24997 6.0825 4.75007 6.0825 4.45402 5.75251L0.147485 0.952477C-0.176068 0.591804 0.0676582 0 0.539773 0H9.46019C9.93234 0 10.1761 0.591804 9.85252 0.952477Z"
      :fill="color"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: "20"
  },
  height: {
    type: String,
    default: "20"
  },
  color: {
    type: String,
    default: "#3C3C3C"
  }
});
</script>

<style lang="scss" scoped></style>
