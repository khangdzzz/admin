<template>
    <div class="demo-page">
        <a-form :model="formState">
            <FloatingLabelInput class="demo-page__floating-label-input" place-holder="Nghia Place Holder"
                label="Nghia Label" control-name="username" v-model:value="formState.username"></FloatingLabelInput>
        </a-form>
    </div>
</template>

<script setup lang="ts">
//#region import
import FloatingLabelInput from '@/modules/base/components/FloatingLabelInput.vue'
import { reactive } from 'vue';
//#endregion

//#region props
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
interface FormState {
    username: string;
}

const formState = reactive<FormState>({
    username: 'Nghia',
});
//#endregion
</script>

<style lang="scss" scoped>
.demo-page {
    padding: 20px;

    &__floating-label-input {
        width: 500px;
    }
}
</style>