<template>
    <div class="create-new-vehicle-type-form">
        <a-card :bordered="false">
            <h3 class="create-new-vehicle-type-form__title">Edit Vehicle type</h3>
            <a-form :model="dynamicValidateForm" name="basic" autocomplete="off">
                <CustomForm :formData="dynamicValidateForm.formData" @change="handleOnChange" @onBlur="handleOnBlur"
                    @onFocus="handleOnFocus">
                </CustomForm>
                <div class="create-new-vehicle-type-form__action">
                    <a-button class="create-new-vehicle-type-form__action--cancel" :disabled="isLoading"
                        @click="redirectToVehicleType">
                        {{ $t("btn_cancel") }}
                    </a-button>
                    <a-button type="primary" class="create-new-vehicle-type-form__action--save" html-type="save"
                        :disabled="!isValidated" :loading="isLoading">
                        {{ $t("btn_save") }}
                    </a-button>
                </div>
            </a-form>
        </a-card>
    </div>

</template>

<script setup lang="ts">
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import CustomForm from "../../base/components/CustomForm.vue";
import { reactive, ref } from "vue";
import { routeNames } from "@/routes/route-names";
import { router } from "@/routes";
import { i18n } from "@/i18n";


//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
const isValidated = ref<boolean>(false);
const isLoading = ref<boolean>(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicValidateForm = reactive<{ formData: any[] }>({
    formData: [
        {
            inputType: "AInput",
            value: "",
            placeHolder: "Name",
            label: "Name",
            name: "name",
            disabled: false,
            required: true,
            key: 1,
            isFocus: false,
            rules: [
                { required: true, message: i18n.global.t("please_enter_input", { fieldName: i18n.global.t('vehicle_type') }) },
                { max: 50, message: i18n.global.t("max_length_input", { maxLength: 50 }) },
            ]
        },
    ]
});
const handleOnChange = (value: string, index: number): void => {
    isValidated.value = dynamicValidateForm.formData[index].value.length > 0
};
const handleOnBlur = (
    value: number | boolean | Event,
    index: string | number | Event
): void => {
    index = Number(index);
    dynamicValidateForm.formData[index].isFocus = false;
};
const handleOnFocus = (index: number | boolean | Event): void => {
    index = Number(index);
    dynamicValidateForm.formData[index].isFocus = true;
};
const redirectToVehicleType = (): void => {
    router.push({ name: routeNames.vehicleType });
};
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
//#endregion===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊

//#===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏Computed
//#endregion===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏

//#===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
//#endregion===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍

//===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀Watchers
//#endregion===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀
</script>

<style lang="scss" scoped>
.create-new-vehicle-type-form {
    font-family: "Roboto" !important;
    font-style: normal;
    width: 660px;
    height: auto;
    margin: auto;
    background-color: $neutral-0;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 20px;
    padding: 6px 0;

    &__title {
        font-size: 22px;
        font-weight: 600;
        line-height: 18px;
        text-align: center;
        margin-bottom: 30px;
    }

    &__action {
        display: flex;
        flex-direction: row;
        text-align: center;
        font-weight: 600;
        font-size: 18px;
        line-height: 100%;
        justify-content: center;
        margin-top: 6px;

        &--cancel,
        &--save {
            width: 175px !important;
            height: 48px !important;
            height: 18px;
            font-family: "Roboto";
            font-style: normal;
            font-weight: 600;
            font-size: 18px;
            line-height: 100%;
            padding: 15px;
        }

        &--cancel {
            color: $primary-400;
            border-color: $primary-400;
            margin-right: 20px
        }
    }
}

.create-new-vehicle-type-form__action--save.active {
    background: $primary;
    color: $neutral-0;
}
</style> 