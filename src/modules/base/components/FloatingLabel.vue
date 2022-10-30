<template>
  <div class="floating-label">
    <component :is="prefix.icon" v-if="prefix"></component>
    <slot></slot>
    <label
      :class="`floating-label__place-holder${!isFocused ? '' : '__focused'}`"
      >{{ label }} <span class="required" v-if="required">*</span></label
    >
  </div>
</template>

<script setup lang="ts">
//#region import
//#endregion

import { PropType } from "vue";

//#region props
defineProps({
  isFocused: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ""
  },
  controlName: {
    type: String,
    default: "",
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  prefix: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Object as PropType<{ icon: any; action: any }> | undefined
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
.floating-label {
  position: relative;
  height: 60px;
  background-color: #f7f7f7;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding-left: 12px;
  padding-right: 12px;
  cursor: text;

  &__place-holder {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translate(0, -50%);
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 100%;
    color: #999999;
    cursor: text;
  }

  &__place-holder__focused {
    @extend .floating-label__place-holder;
    color: #999999;
    font-size: 14px;
    top: 11px;
    height: auto;
    text-align: center;
    transform: translate(0, 0);
    transition-property: font-size;
    transition-duration: 200ms;
    transition-property: top;
    transition-duration: 200ms;
    cursor: text;
  }

  .required {
    color: red;
  }
}
</style>
