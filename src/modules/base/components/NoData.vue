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
      <div class="no-data-container__message mb-30 d-flex">
        Sorry we couldn't find any matches for
        <span class="no-data-container__value">&nbsp;“{{ value }}”</span>
      </div>
      <div class="no-data-container__sub-message mb-30">
        Try searching for another term
      </div>
      <div>
        <a-button
          type="primary"
          class="no-data-container__back-to-list-btn d-flex justify-center align-center gap-10"
          @click="handleClick"
        >
          <template #icon><ArrowLeft /></template>
          Back to list</a-button
        >
      </div>
    </div>
    <div class="no-data-container__no-data" v-if="!isLoading && !value">
      No data
    </div>
    <div v-if="isLoading">
      <div class="d-flex justify-center align-center mb-20">
        <LoadingSpinner />
      </div>
      <div class="no-data-container__loading">Loading...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
//#region import
import ImNotFound from "@/assets/images/ImNotFound.vue";
import ArrowLeft from "@/assets/icons/IcArrowLeft.vue";
import LoadingSpinner from "@/modules/base/components/LoadingSpinner.vue";

//#endregion

//#region props
defineProps({
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
    line-height: 33px;
    color: $neutral-600;
    max-width: 70%;
    flex-wrap: wrap;
    word-break: break-all;
  }

  &__value {
    font-weight: 700;
  }

  &__sub-message {
    font-style: normal;
    font-weight: 400;
    font-size: 22px;
    line-height: 26px;
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
</style>
