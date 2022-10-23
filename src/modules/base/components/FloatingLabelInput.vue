<template>
    <FloatingLabel class="floating-label-input" :is-focused="isFocused || !!value"
        :label="isFocused || !!value ? label : placeHolder" :control-name="controlName">
        <a-input class="floating-label-input__input" @focusin="isFocused = true" @focusout="isFocused = false"
            :bordered="false" v-model:value="value">
        </a-input>
    </FloatingLabel>
</template>

<script setup lang="ts">
//#region import
import FloatingLabel from '@/modules/base/components/FloatingLabel.vue';
import { ref } from 'vue';
//#endregion

//#region props
defineProps({
    label: {
        type: String,
        default: ""
    },
    placeHolder: {
        type: String,
        default: ""
    },
    controlName: {
        type: String,
        default: "",
        require: true
    },
    value: {
        type: String,
        default: ""
    }
})
//#endregion

//#region variables
const isFocused = ref(false);
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
.floating-label-input {
    height: 60px;
    position: relative;

    &__input {
        position: absolute;
        top: 20px;
        height: 40px;
        bottom: 0;
        width: calc(100% - 24px);
        left: 12px;
        right: 12px;
        background-color: transparent !important;
        padding-left: 0;
        padding-right: 0;

        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 100%;
        color: #222222;
    }

    &__input:focus {
        position: absolute;
        top: 20px;
        height: 40px;
        bottom: 0;
        padding-left: 0;
        padding-right: 0;
        background-color: transparent !important;
    }
}
</style>