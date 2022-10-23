<template>
    <a-form-item :rules="[
      {
        required: true,
        message: $t('forgot_password_msg_err_code_required'),
        trigger: ['change', 'blur']
      }
    ]" :name="controlName">
        <div class="floating-label">
            <slot></slot>
            <label :class="`floating-label__place-holder${!isFocused ? '' : '__focused'}`">{{label}}</label>
        </div>
    </a-form-item>
</template>

<script setup lang="ts">
//#region import
//#endregion

import { computed } from '@vue/reactivity';

//#region props
defineProps({
    isFocused: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: ''
    },
    controlName: {
        type: String,
        default: '',
        required: true
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
    background-color: #F7F7F7;
    border: 1px solid #EAEAEA;
    border-radius: 10px;
    padding-left: 12px;
    padding-right: 12px;

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
    }
}
</style>