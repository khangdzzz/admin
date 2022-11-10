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
      d="M1.99922 0L0.824219 1.175L4.64089 5L0.824219 8.825L1.99922 10L6.99922 5L1.99922 0Z"
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
