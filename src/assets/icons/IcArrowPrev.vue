<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 7 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6.82344 1.175L5.64844 0L0.648438 5L5.64844 10L6.82344 8.825L3.00677 5L6.82344 1.175Z"
      :fill="color || 'currentColor'"
      fill-opacity="0.6"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: "7"
  },
  height: {
    type: String,
    default: "10"
  },
  color: {
    type: String
  }
});
</script>
