<template>
  <div class="input-loading-spinner">
    <div
      v-for="number in 8"
      :key="number"
      :style="`background-color: ${backgroundColor};`"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  backgroundColor: {
    type: String,
    default: "#07A0B8"
  }
});
</script>

<style lang="scss" scoped>
.input-loading-spinner {
  display: inline-block;
  position: relative;
  width: 60px;
  height: 30px;

  div {
    transform-origin: 38px 15px;
    animation: spinner 0.8s linear infinite;

    &::after {
      content: " ";
      display: block;
      position: absolute;
      top: 3px;
      left: 37px;
      width: 2px;
      height: 6px;
      border-radius: 8px;
      background-color: inherit;
    }

    &:nth-child(1) {
      transform: rotate(0deg);
      animation-delay: -0.7s;
    }
    &:nth-child(2) {
      transform: rotate(45deg);
      animation-delay: -0.6s;
    }
    &:nth-child(3) {
      transform: rotate(90deg);
      animation-delay: -0.5s;
    }
    &:nth-child(4) {
      transform: rotate(135deg);
      animation-delay: -0.4s;
    }
    &:nth-child(5) {
      transform: rotate(180deg);
      animation-delay: -0.3s;
    }
    &:nth-child(6) {
      transform: rotate(225deg);
      animation-delay: -0.2s;
    }
    &:nth-child(7) {
      transform: rotate(270deg);
      animation-delay: -0.1s;
    }
    &:nth-child(8) {
      transform: rotate(315deg);
      animation-delay: 0s;
    }
  }
}

@keyframes spinner {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
