<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.7628 13.7636C14.1143 13.4121 14.6841 13.4121 15.0356 13.7636L20.4356 19.1636C20.7871 19.515 20.7871 20.0849 20.4356 20.4363C20.0841 20.7878 19.5143 20.7878 19.1628 20.4363L13.7628 15.0363C13.4114 14.6849 13.4114 14.115 13.7628 13.7636Z"
      :fill="color || 'currentColor'"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.89922 4.49995C6.91688 4.49995 4.49922 6.91761 4.49922 9.89995C4.49922 12.8823 6.91688 15.3 9.89922 15.3C12.8816 15.3 15.2992 12.8823 15.2992 9.89995C15.2992 6.91761 12.8816 4.49995 9.89922 4.49995ZM2.69922 9.89995C2.69922 5.9235 5.92277 2.69995 9.89922 2.69995C13.8757 2.69995 17.0992 5.9235 17.0992 9.89995C17.0992 13.8764 13.8757 17.1 9.89922 17.1C5.92277 17.1 2.69922 13.8764 2.69922 9.89995Z"
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

<style lang="scss" scoped></style>
