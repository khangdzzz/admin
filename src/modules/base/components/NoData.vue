<template>
  <div
    class="no-data-container fill-height fill-width d-flex flex-column justify-center align-center"
  >
    <div class="mb-40" v-if="!isLoading">
      <ImNotFound
        dashed-file="#07A0B8"
        background-color="#E6F6F9"
        loading-icon-color="#07A0B8"
        glass-outer-border-color="#07A0B8"
        glass-inner-border-color="#07A0B8"
        glass-border-color="#96DDE9"
        glass-background-color="#FFFFFF"
        question-mark-color="#07A0B8"
        glass-handle-color="#07A0B8"
        glass-conector-color="#3DC0D5"
        ray-color="#FFFFFF"
      />
    </div>
    <div
      v-if="!isLoading && value"
      class="fill-width d-flex flex-column justify-center align-center"
    >
      <div
        class="no-data-container__message mb-30 d-flex"
        v-html="getMessage"
      ></div>
      <div class="no-data-container__sub-message mb-30">
        {{ $t("try_searching_for_another_term") }}
      </div>
      <div>
        <a-button
          type="primary"
          class="no-data-container__back-to-list-btn d-flex justify-center align-center gap-10"
          @click="handleClick"
        >
          <template #icon><ArrowLeft /></template>
          {{ $t("back_to_list") }}</a-button
        >
      </div>
    </div>
    <div class="no-data-container__no-data" v-if="!isLoading && !value">
      {{ $t("no_data") }}
    </div>
    <div v-if="isLoading">
      <div class="d-flex justify-center align-center mb-20">
        <LoadingSpinner />
      </div>
      <div class="no-data-container__loading">{{ $t("common_loading") }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
//#region import
import ImNotFound from "@/assets/images/ImNotFound.vue";
import ArrowLeft from "@/assets/icons/IcArrowLeft.vue";
import LoadingSpinner from "@/modules/base/components/LoadingSpinner.vue";
import { computed } from "vue";
import { service } from "@/services";
import { SupportedLanguage } from "../models";

//#endregion

//#region props
const props = defineProps({
  value: {
    type: String
  },
  isLoading: {
    type: Boolean
  }
});

const emit = defineEmits<{ (e: "onClick"): void }>();
//#endregion

//#region variables
//#endregion

//#region hooks
//#endregion

//#region function
const handleClick = (): void => {
  emit("onClick");
};
//#endregion

//#region computed
const getMessage = computed(() => {
  const currentLanguage = service.language.getCurrentLanguage();
  if (currentLanguage === SupportedLanguage.English) {
    return `Sorry we couldn't find any matches for<span class="no-data-container__value">&nbsp;“${props.value}”</span>`;
  }

  return ` <span class="no-data-container__value">&nbsp;“${props.value}”</span>に一致する情報は見つかりませんでした。`;
});
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.no-data-container {
  background-color: $white;
  border-radius: 10px;

  &__message {
    font-style: normal;
    font-weight: 400;
    font-size: 28px;
    line-height: 32.81px;
    color: $neutral-600;
    max-width: 70%;
    flex-wrap: wrap;
    word-break: break-all;
  }

  &__sub-message {
    font-style: normal;
    font-weight: 400;
    font-size: 22px;
    line-height: 25.78px;
    color: $neutral-400;
  }

  &__back-to-list-btn {
    height: 48px;
    width: 240px;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 100%;
    color: $white;
  }

  &__no-data {
    font-style: normal;
    font-weight: 400;
    font-size: 28px;
    line-height: 33px;
    color: $neutral-400;
  }

  &__loading {
    font-style: normal;
    font-weight: 400;
    font-size: 28px;
    line-height: 33px;
    color: $primary-400;
  }
}

:deep() {
  .no-data-container {
    &__value {
      font-weight: 700 !important;
    }
  }
}
</style>
