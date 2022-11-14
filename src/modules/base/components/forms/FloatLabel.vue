<template>
    <div class="relative wrapper" :class="{ 'focused': isFocused }">
        <slot></slot>
        <div class="label" :class="{ 'label--floating': isFloating }" v-html="label"></div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        label: String,
        isFloating: Boolean,
        isFocused: Boolean
    },

})
</script>
  
<style lang="scss" scoped>
.wrapper {
    height: 60px !important;
    background: $neutral-50 !important;
    border: 1px solid $line !important;
    border-radius: 10px !important;
    border-color: $line !important;
    overflow: hidden;
    &.focused {
        border-color: $primary-400;
        box-shadow: 0 0 0 2px rgb(7 160 184 / 20%);
    }
}

.label {
    position: absolute;
    top: 22px;
    left: 12px;
    color: $neutral-400;
    font-size: 1rem;
    line-height: 100%;
    transition: all 0.3s;
}

.label--floating {
    @extend .label;
    font-size: 0.875rem;
    top: 11px;
    left: 12px;
}
</style>
  