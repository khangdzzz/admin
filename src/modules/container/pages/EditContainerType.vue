<template>
  <div class="edit-container-type-form">
    <a-card :bordered="false">
      <h3 class="edit-container-type-form__title">
        {{ $t("edit_container_type") }}
      </h3>
      <a-form :model="dynamicValidateForm" name="basic" autocomplete="off">
        <CustomForm :formData="dynamicValidateForm.formData" @change="handleOnChange" @onBlur="handleOnBlur"
          @onFocus="handleOnFocus">
        </CustomForm>
        <div class="edit-container-type-form__action">
          <a-button class="edit-container-type-form__action--cancel" :disabled="isLoading"
            @click="redirectToContainerType">
            {{ $t("btn_cancel") }}
          </a-button>
          <a-button type="primary" class="edit-container-type-form__action--submit" html-type="submit"
            :disabled="!isDisabled" :loading="isLoading">
            {{ $t("btn_submit") }}
          </a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import { i18n } from "@/i18n";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import CustomForm from "@/modules/base/components/CustomForm.vue";

//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
const route = useRoute();

const { id } = route.params;
const isDisabled = ref<boolean>(false);
const isLoading = ref<boolean>(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicValidateForm = reactive<{ formData: any[] }>({
  formData: [
    {
      inputType: "AInput",
      value: "",
      placeHolder: "name",
      label: "name",
      name: "name",
      disabled: false,
      required: true,
      key: 1,
      isFocus: false,
      rules: [
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 })
        }
      ]
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "container_weight",
      label: "container_weight",
      name: "weight",
      disabled: false,
      rules: [
        {
          max: 10,
          message: i18n.global.t("max_length_input", { maxLength: 10 })
        },
        {
          pattern: /^\d*$/,
          message: i18n.global.t("allow_input_number")
        }
      ],
      required: false,
      key: 3,
      isFocus: false
    },
    {
      inputType: "AInput",
      value: "",
      placeHolder: "container_capacity",
      label: "container_capacity",
      name: "capacity",
      disabled: false,
      rules: [
        {
          max: 50,
          message: i18n.global.t("max_length_input", { maxLength: 50 })
        }
      ],
      required: false,
      key: 4,
      isFocus: false
    }
  ]
});
const handleOnChange = (value: string, index: number): void => {
  isDisabled.value = dynamicValidateForm.formData[0].value.length > 0;
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
const redirectToContainerType = (): void => {
  router.push({ name: routeNames.containerType });
};
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
onMounted(() => {
  fetchContainerTypeById();
});
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
const fetchContainerTypeById = async (): Promise<void> => {
  const data = await service.container.getContainerTypeById(id.toString());
  const toArrayRes = Object.values(data);
  dynamicValidateForm.formData.forEach((item, index) => {
    dynamicValidateForm.formData[index].value = toArrayRes[index];
  });
};
//#endregion===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊

//#===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏Computed
//#endregion===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏

//#===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
//#endregion===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍

//===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀Watchers
watch(dynamicValidateForm, () => {
  handleOnChange
});
//#endregion===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀
</script>

<style lang="scss" scoped>
.edit-container-type-form {
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
    &--submit {
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
      margin-right: 20px;
    }
  }
}

.edit-container-type-form__action--save.active {
  background: $primary;
  color: $neutral-0;
}
</style>
