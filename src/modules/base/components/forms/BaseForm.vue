<template>
  <a-form-item :key="name" v-for="(field, name) in currentValue" :has-feedback="hasFeedBack" :name="name">
    <template v-if="isAnt(field.component)">
      <!-- <a-skeleton-input v-if="loading" style="width: 100%" :size="size" /> -->
      <div class="h-[60px] border-b border-b-neutral-200" v-if="field.readonly">
        <div class="text-neutral-400 text-sm leading-[18px] mb-2">{{ field.label }}</div>
        <div class="text-neutral-600 text-lg leading-[22px] h-[22px] font-bold truncate">{{
            getFieldText(field)
        }}</div>
      </div>
      <FloatLabel v-else v-click-outside="() => field.isFocused = false" class="" :isFocused="field.isFocused"
        :isFloating="field.isFocused || !!field.value" :label="field.label" :disabled="field.disabled"
        @click="handleClickLable(field, `field-${name}`)">
        <component :ref="`field-${name}`" :is="field.component" v-model:value="field.value" :type="field.type"
          :autocomplete="field.autocomplete" :field-names="field.fieldNames" :loading="loading" :options="field.options"
          :class="[
            field.class, field.isFocused || !!field.value ? 'floating' : ''
          ]" @focusin="field.isFocused = true" @focusout="field.isFocused = false"
          @change="value => handleChange(field, value)" />

      </FloatLabel>
    </template>
    <template v-else>
      <component :no-divider="field.noDivider" :is="field.component" v-model:value="field.value"
        :autocomplete="field.autocomplete" :disabled="field.readonly || field.disabled" :loading="loading" />
    </template>
  </a-form-item>
</template>
<script lang="ts">
import CollectionRouteNote from "@/modules/collect-route/pages/CollectionRouteNote.vue";
import { defineComponent } from "vue";
import { FormItems } from '@/modules/base/components/forms/form-models'
import FloatLabel from "@/modules/base/components/forms/FloatLabel.vue";

interface IField {
  component: string;
  value: number | string | string[] | number[];
  type?: string;
  autocomplete?: boolean;
  icon?: string;
  label?: string;
  inline?: boolean;
  mode?: boolean;
  class?: string;
  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean;
  options?: any[];
  fieldNames?: {
    label?: string;
    value?: string;
    options?: string;
  };
  isFocused?: boolean;
  noDivider?: boolean;
  change?: (value) => void
}
interface IFormField {
  [name: string]: IField
}
export default defineComponent({
  components: {
    CollectionRouteNote,
    FloatLabel
  },
  props: {
    hasFeedBack: Boolean,
    modelValue: {
      type: Object as () => IFormField,
      default<IFormField>(rawProps: IFormField): IFormField {
        return rawProps;
      }
    },
    loading: Boolean,
    size: {
      type: String,
      default: "large"
    }
  },
  computed: {
    currentValue: {
      get() {
        return this.modelValue;
      },
      set(value: IFormField) {
        this.$emit("update:modelValue", value);
      }
    },
    isAnt() {
      return (component: any) => {
        return [FormItems.INPUT, FormItems.SELECT].includes(component)
      }
    },
    getFieldText() {
      return (field: IField) => {
        if (field.component === FormItems.SELECT) {
          const labelKey = field.fieldNames?.label
          const valueKey = field.fieldNames?.value
          if (!labelKey || !valueKey) return field.value
          const option = field.options && field.options.find(x => x[valueKey] === field.value)
          if (!option) return field.value
          return option[labelKey]
        }
        return field.value
      }
    }
  },
  setup() {
    return {};
  },
  methods: {
    handleChange(field, value) {
      if (field.change) field.change(value)
    },
    handleClickLable(field, ref) {
      field.isFocused = true;
      (this.$refs[ref] as HTMLInputElement[])[0].focus()
    }
  }
});
</script>

<style lang="scss" scoped>
:deep() {

  .ant-input,
  .ant-select,
  .ant-select-selector {
    height: 60px !important;
    background: $neutral-50 !important;
    border: 1px solid $neutral-50 !important;
    border-radius: 10px !important;
    border-color: $neutral-50 !important;
    color: $neutral-400;

    &:focus {
      box-shadow: none;
    }
  }

  .ant-select-selection-item {
    color: $neutral-400;
  }

  .floating {
    &.ant-input {
      height: 16px !important;
      top: 29px;
    }

    .ant-select-selection-item {
      line-height: 16px;
      height: 16px;
      top: 29px;
    }
  }
}
</style>