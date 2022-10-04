<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2.25 10.1C2.25 9.68577 2.58579 9.34999 3 9.34999H17C17.4142 9.34999 17.75 9.68577 17.75 10.1C17.75 10.5142 17.4142 10.85 17 10.85H3C2.58579 10.85 2.25 10.5142 2.25 10.1Z"
      :fill="color || 'currentColor'"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.13033 3.96967C9.42322 4.26256 9.42322 4.73744 9.13033 5.03033L4.06066 10.1L9.13033 15.1697C9.42322 15.4626 9.42322 15.9374 9.13033 16.2303C8.83744 16.5232 8.36256 16.5232 8.06967 16.2303L2.46967 10.6303C2.17678 10.3374 2.17678 9.86256 2.46967 9.56967L8.06967 3.96967C8.36256 3.67678 8.83744 3.67678 9.13033 3.96967Z"
      :fill="color || 'currentColor'"
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
    type: String
  }
});
</script>
