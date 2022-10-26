<template>
  <div
    class="create-collection-route-order px-30 py-20 fill-height d-flex flex-column"
  >
    <a-card class="create-collection-route-order__card">
      <a-form :model="formData" ref="createCustomerForm">
        <div
          class="create-collection-route-order__duo-inputs-wrapper d-flex justify-space-between gap-20"
        >
          <CustomForm
            :form-data="formData.duoInputs"
            @on-focus="handleOnDuoInputsFocus"
            @on-blur="handleOnDuoInputsBlur"
          />
        </div>
        <a-form-item name="note" label="">
          <label class="label-note">Note</label>
          <div class="create-collection-route-order__note">
            <a-textarea :maxlength="100" v-model:value="formNote.note" />
          </div>
        </a-form-item>
        <div class="">
          <p class="collection-point-title">Collection point selection</p>
          <div class="collection-point-content d-flex">
            <div class="collection-point__data-left">
              <div class="collection-point__head">
                <div class="collection-point__head--title">
                  All collection points
                </div>
                <div class="collection-point__head--total">
                  <span>Total: </span>
                  <span class="number-total">
                    {{ numberOfCollectionPoint }}</span
                  >
                </div>
              </div>
              <div class="collection-point__search p-9">
                <div class="d-flex gap-15">
                  <a-input
                    v-model:value="searchCollectionPoint"
                    :placeholder="$t('search_input')"
                    class="search-input"
                    allow-clear
                    ><template #prefix>
                      <img src="@/assets/icons/ic_search.svg" />
                    </template>
                  </a-input>
                  <slot name="action"></slot>
                </div>
              </div>
              <div class="collection-point__data">
                <div
                  class="collection-point__data-item d-flex justify-space-between"
                  v-for="(data, index) in filteredCollectionPointList"
                  :key="index"
                  :class="getListIdSelectedCP.includes(data.id) ? 'active' : ''"
                  @dblclick="onHandleAddCollectionPointByIdById(index)"
                >
                  <div class="collection-point__data-item--cp">
                    {{ data.name }}
                  </div>
                  <div class="collection-point__data-item--cn">
                    {{ data.customerName }}
                  </div>
                </div>
              </div>
            </div>
            <div class="collection-point__icon-swap">
              <IcSwap class="ic-swap" />
            </div>
            <div class="collection-point__data-right">
              <div class="collection-point__head">
                <div class="collection-point__head--title">
                  Selected collection point
                </div>
                <div class="collection-point__head--total">
                  <span>Total: </span>
                  <span class="number-total">
                    {{ numberOfSelectedCollectionPoint }}</span
                  >
                </div>
              </div>
              <draggable
                v-model="listSelectedCollectionPoint"
                group="people"
                @start="drag = true"
                @end="drag = false"
                item-key="id"
                class="collection-point__data mh-300"
              >
                <template #item="{ element }">
                  <div
                    class="collection-point__data-item d-flex justify-space-between"
                    @dblclick="onHandleRemoveCollectionPointById(element.id)"
                  >
                    <div class="collection-point__data-item--cp">
                      {{ element.name }}
                    </div>
                    <div class="collection-point__data-item--cn">
                      {{ element.customerName }}
                    </div>
                  </div>
                </template>
              </draggable>
              <div class="collection-point__data mh-300"></div>
              <ul class="helper">
                <li class="helper-item">
                  Double click to select store to route
                </li>
                <li class="helper-item">Drag and drop to rearrange order</li>
              </ul>
            </div>
          </div>
        </div>
        <div></div>
      </a-form>
    </a-card>
    <div class="d-flex justify-center gap-20 mt-20 pb-20">
      <a-button
        type="secondary"
        class="create-collection-base__btn-style create-collection-base__cancel-btn"
        :disabled="isSubmitting"
        @click="handleClickCancel"
        >{{ $t("btn_cancel") }}</a-button
      >
      <a-button
        type="primary"
        class="create-collection-base__btn-style"
        :disabled="true"
        :loading="false"
        >{{ $t("btn_submit") }}</a-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
//#region import
import IcSwap from "@/assets/icons/IcSwap.vue";
import CustomForm from "@/modules/base/components/CustomForm.vue";
import { computed, reactive, ref } from "vue";
import { formData as reactiveFormData } from "@/modules/collection-route-management/models/create-collection-route-order-base-form";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
import { routeNames, router } from "@/routes";
import draggable from "vuedraggable";

export interface form {
  note: string;
}

//#endregion

//#region props
//#endregion

//#region variables

const searchCollectionPoint = ref<string>("");
const drag = ref<boolean>(false);
const formData = reactive<FormData>(reactiveFormData);
const isSubmitting = ref<boolean>(false);
const createCustomerForm = ref();
const formNote = reactive<form>({ note: "" });
const listCollectionPoint = ref<any>([
  { id: "0", name: "John Brown 1", customerName: "New York" },
  { id: "1", name: "John Brown 2", customerName: "New York" },
  { id: "2", name: "John Brown 3", customerName: "New York" },
  { id: "3", name: "John Brown 4", customerName: "New York" },
  { id: "4", name: "John Brown 5", customerName: "New York" },
  { id: "5", name: "John Brown 6", customerName: "New York" },
  { id: "6", name: "John Brown 7", customerName: "New York" },
  { id: "7", name: "John Brown 8", customerName: "New York" },
  { id: "8", name: "John Brown 9", customerName: "New York" },
  { id: "9", name: "John Brown 10", customerName: "New York" },
  { id: "10", name: "John Brown 11", customerName: "New York" },
  { id: "11", name: "John Brown 12", customerName: "New York" },
  { id: "12", name: "John Brown 13", customerName: "New York" },
  { id: "13", name: "John Brown 14", customerName: "New York" },
  { id: "14", name: "John Brown 15", customerName: "New York" },
  { id: "15", name: "John Brown 16", customerName: "New York" },
  { id: "16", name: "John Brown 17", customerName: "New York" },
  { id: "17", name: "John Brown 18", customerName: "New York" }
]);
const listSelectedCollectionPoint = ref<any[]>([]);
//#endregion

//#region hooks
// //#endregion

// //#region function
const filteredCollectionPointList = computed(function () {
  return listCollectionPoint.value.filter((data) =>
    data.name.toLowerCase().includes(searchCollectionPoint.value.toLowerCase())
  );
});
const numberOfCollectionPoint = computed(() => {
  return listCollectionPoint.value.length;
});
const numberOfSelectedCollectionPoint = computed(() => {
  return listSelectedCollectionPoint.value.length;
});
const getListIdSelectedCP = computed(() => {
  let data = [];
  listSelectedCollectionPoint.value.forEach((element) => data.push(element.id));
  return data;
});

const onHandleAddCollectionPointByIdById = (id: string | number): void => {
  const data = listCollectionPoint.value.find((data) => data.id == id);
  listSelectedCollectionPoint.value.push(data);
};
const onHandleRemoveCollectionPointById = (id: string | number): void => {
  listSelectedCollectionPoint.value.splice(
    listSelectedCollectionPoint.value.findIndex((item) => item.id == id),
    1
  );
};
const handleOnDuoInputsFocus = (index: number | boolean | Event): void => {
  formData.duoInputs[Number(index)].isFocus = true;
};

const handleOnDuoInputsBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  formData.duoInputs[Number(index)].isFocus = false;
};

const handleClickCancel = (): void => {
  router.push({ name: routeNames.customerList });
};

//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.create-collection-route-order {
  &__card {
    width: auto;
    background: $neutral-0;
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
    border-radius: 10px;
  }

  &__title {
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    line-height: 28px;
    color: $neutral-600;
  }
  &__note {
    border: 1px solid $neutral-100;
    outline: none;
    border-radius: 10px;
    background: $neutral-50;
    textarea {
      background: transparent;
      padding-top: 24px;
      resize: none;
    }
    div {
      border: transparent;
    }
    .ant-input {
      font-weight: 400;
      font-size: 16px;
      line-height: 16px;
      color: $neutral-800;
      height: 100px;
    }
  }

  &__btn-style {
    width: 180px;
    height: 48px;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 18px;
  }

  &__cancel-btn {
    background: $white;
    border: 1px solid $primary;
    color: $primary;
  }
  .collection-point {
    &__head {
      display: flex;
      justify-content: space-between;
      background-color: $primary-200;
      height: 48px;
      padding: 15px 14px;
    }
    &__search {
      border: 1px solid $neutral-100;
    }
    &__icon-swap {
      margin: auto;
      .ic-swap {
        display: block;
        margin: auto;
      }
    }
    &__data {
      overflow: auto;
    }
    &__data-item {
      border: 1px solid $neutral-100;
      padding: 15px 10px;
    }
  }
  .collection-point-content {
    width: 100%;
  }

  .collection-point__icon-swap {
    width: 10%;
  }
  .collection-point-title {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: $neutral-600;
  }
  .collection-point__data-left,
  .collection-point__data-right {
    width: 45%;
    position: relative;
  }
  .collection-point__data-left,
  .collection-point__data-right {
    border: 1px solid $neutral-100;
    border-radius: 6px;
  }
  .collection-point__head {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  .collection-point__search .search-input {
    border: 1px solid $neutral-100;
    border-radius: 6px;
    height: 40px;
  }

  .collection-point__data {
    max-height: 240px;
  }
  .collection-point__data-item {
    height: 40px;
    padding: 10px 15px;
    border-right: transparent;
    border-top: 0px;
    cursor: pointer;
  }
  .collection-point__data-left .collection-point__data-item:hover {
    background-color: $primary-100;
  }

  .collection-point__data-right .collection-point__data-item:hover {
    background-color: $neutral-0;
  }
  .collection-point__head--title {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: $neutral-800;
  }
  .collection-point__data-item--cp {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: $neutral-600;
  }
  .collection-point__data-item--cn {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: $neutral-400;
  }

  .collection-point__head--total {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: $neutral-800;
    .number-total {
      font-family: "Roboto";
      font-style: normal;
      font-weight: 700 !important;
      font-size: 16px;
      line-height: 20px;
      color: $neutral-800;
    }
  }
  .collection-point__data-right {
    .collection-point__data-item {
      background-color: $primary-100;
    }
  }
  .mh-300 {
    max-height: 300px;
  }
  ul {
    list-style: none; /* Remove list bullets */
    padding: 20px;
    // margin: 0;
    list-style-image: url("@/assets/icons/ic_dot.svg");
  }
  .helper {
    position: absolute;
    top: 100%;
    padding-top: 10px;

    li::before {
      // content: "•";
      padding-right: 8px;
      font-size: 6px;
      color: $neutral-400;
    }
  }
  .create-collection-base__btn-style {
    height: 48px;
    width: 180px;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 100%;
  }
  .create-collection-base__cancel-btn {
    border: 1px solid $primary;
    background-color: $white;
    color: $primary;
  }
  .collection-point__data-item.active {
    background-color: $primary-100;
    pointer-events: none;
  }
  .label-note {
    position: relative;
    font-size: 14px;
    font-weight: 400;
    font-size: 14px;
    height: 14px;
    line-height: 100%;
    color: $neutral-400;
    top: 28px;
    left: 10px;
  }
}

:deep() {
  .create-collection-route-order {
    &__duo-inputs-wrapper {
      .ant-form-item {
        width: 100%;
      }
    }
  }
  .collection-point__search .search-input .ant-input {
    font-size: 16px;
  }
  .ant-card-body {
    padding: 20px 20px 80px 20px !important;
  }
}
</style>
