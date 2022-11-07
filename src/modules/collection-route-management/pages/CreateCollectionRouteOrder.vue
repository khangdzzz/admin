<template>
  <a-spin :tip="$t('common_loading')" :spinning="isLoading">
    <div
      class="create-collection-route-order p-30 fill-height d-flex flex-column"
    >
      <div class="create-collection-route-order-title">
        {{ $t("collection_route_order") }}
      </div>
      <a-card class="create-collection-route-order__card">
        <a-form
          :model="formData"
          ref="createCollectionRouteOrder"
          name="createCollectionRouteOrder"
        >
          <div
            class="create-collection-route-order__duo-inputs-wrapper d-flex justify-space-between gap-20"
          >
            <CustomForm
              :form-data="formData.duoInputs"
              @on-focus="handleOnDuoInputsFocus"
              @on-blur="handleOnDuoInputsBlur"
            />
            <CustomForm
              :form-data="formData.duoInputs2"
              @on-focus="handleOnDuoInputs2Focus"
              @on-blur="handleOnDuoInputs2Blur"
            />
          </div>
          <a-form-item
            name="note"
            label=""
            class="mb-20 form-item-note"
            :class="
              formNoteError
                ? ['ant-form-item-has-error', ' ant-form-item-with-help']
                : ''
            "
          >
            <label class="label-note">{{
              $t("collection_route_detail_note")
            }}</label>
            <div class="create-collection-route-order__note">
              <a-textarea :maxlength="777" v-model:value="formNote.note" />
            </div>
            <div
              :class="formNoteError ? '' : 'active'"
              class="ant-form-item-explain ant-form-item-explain-connected"
            >
              <div role="alert" class="ant-form-item-explain-error mt-10 mb-0">
                {{ $t("max_length_input", { maxLength: 255 }) }}
              </div>
            </div>
          </a-form-item>
          <div class="">
            <p class="collection-point-title">
              {{ $t("collection_route_point_selection") }}
              <IcRequired />
            </p>
            <div class="collection-point-content d-flex">
              <div class="collection-point__data-left">
                <div class="collection-point__head">
                  <div class="collection-point__head--title">
                    {{ $t("collection_route_all_collection_points") }}
                  </div>
                  <div class="collection-point__head--total">
                    <span>{{ $t("collection_route_total") }}: </span>
                    <span class="number-total">
                      {{ listCollectionPoint.length || 0}}
                    </span>
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
                    :class="
                      getListIdSelectedCP.includes(data.id) ? 'active' : ''
                    "
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
                    {{ $t("collection_route_selected_collection_point") }}
                  </div>
                  <div class="collection-point__head--total">
                    <span>{{ $t("collection_route_total") }}: </span>
                    <span class="number-total">
                      {{ numberOfSelectedCollectionPoint }}
                    </span>
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
                  <template #item="{ element, index }">
                    <div
                      class="collection-point__data-item d-flex justify-space-between"
                      @dblclick="onHandleRemoveCollectionPointById(element.id)"
                    >
                      <div class="collection-point__data-item--cp">
                        <span class="item-index">
                          <div class="item-index__content">{{ index + 1 }}</div>
                        </span>
                        <span> {{ element.name }}</span>
                      </div>
                      <div class="collection-point__data-item--cn">
                        {{ element.customerName }}
                      </div>
                    </div>
                  </template>
                </draggable>
                <div class="collection-point__data mh-300"></div>
                <ul class="helper">
                  <li class="helper-item mb-12">
                    {{ $t("collection_route_select_store") }}
                  </li>
                  <li class="helper-item">
                    {{ $t("collection_route_rearrange_order") }}
                  </li>
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
          :disabled="isDisableSubmit"
          :loading="false"
          @click="handleClickSubmit"
          >{{ $t("btn_submit") }}</a-button
        >
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
//#region import
import IcSwap from "@/assets/icons/IcSwap.vue";
import IcRequired from "@/assets/icons/IcRequired.vue";
import CustomForm from "@/modules/base/components/CustomForm.vue";
import {
  computed,
  reactive,
  ref,
  inject,
  onBeforeUnmount,
  onMounted,
  watch
} from "vue";
import { FormDataCreateCollectionRoute } from "@/modules/collection-route-management/models/collection-route.model";
import { formData as reactiveFormData } from "@/modules/collection-route-management/models/create-collection-route-order-base-form";
import { routeNames, router } from "@/routes";
import draggable from "vuedraggable";
import { service } from "@/services";
import { makeUniqueName } from "@/utils/string.helper";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import {
  CollectionPoint,
  CollectionBase
} from "@/modules/collection-route-management/models/collection-route.model";
export interface Form {
  note: string;
}
//#endregion

//#region props
//#endregion

//#region variables
const isLoading = ref<boolean>(false);
const messenger: (
  param: MessengerParamModel
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
) => void = inject("messenger")!;
const searchCollectionPoint = ref<string>("");
const drag = ref<boolean>(false);
const formData = reactive<FormDataCreateCollectionRoute>(reactiveFormData);
const isSubmitting = ref<boolean>(false);
const isDisableSubmit = ref<boolean>(true);
const formNote = reactive<Form>({ note: "" });
const listCollectionPoint = ref<CollectionPoint[]>([]);
const listSelectedCollectionPoint = ref<CollectionPoint[]>([]);
const listCollectionBase = ref<CollectionBase[]>();
const formNoteError = ref<boolean>(false);
const handleSubmitBtn = reactive<any>({
  formData: formData,
  listSelectedCollectionPoint: listSelectedCollectionPoint,
  formNoteError: formNoteError
});
//#endregion

//#region hooks
onMounted(async () => {
  isLoading.value = true;
  await Promise.all([fetchCollectionBase(), fetchListCollectionPoint()]);
  isLoading.value = false;
});
onBeforeUnmount(() => {
  clearInputs();
});
// //#endregion

// //#region function

const fetchListCollectionPoint = async (): Promise<void> => {
  const res = await service.collectionRoute.getCollectionPoint();
  if (res) {
    listCollectionPoint.value = res?.map((item) => ({
      id: item.id,
      name: item.name,
      customerName: item.customer___name
    }));
  }
};
const fetchCollectionBase = async (): Promise<void> => {
  const res = await service.collectionRoute.getWorkplace();
  if (res) {
    listCollectionBase.value = res?.map((item) => ({
      value: item.id || 0,
      label: item.name
    }));
    formData.duoInputs2[0].options = listCollectionBase.value;
  }
};

const clearInputs = (): void => {
  formData.duoInputs[0].value = "";
  formData.duoInputs2[0].value = "";
};
const filteredCollectionPointList = computed(function () {
  return listCollectionPoint.value.filter((data: CollectionPoint) =>
    data.name.toLowerCase().includes(searchCollectionPoint.value.toLowerCase())
  );
});
const numberOfSelectedCollectionPoint = computed(() => {
  return listSelectedCollectionPoint.value.length;
});
const getListIdSelectedCP = computed(() => {
  let data: number[] = [];
  listSelectedCollectionPoint.value.forEach((element) => data.push(element.id));
  return data;
});

const onHandleAddCollectionPointByIdById = (id: number): void => {
  listSelectedCollectionPoint.value.push(filteredCollectionPointList.value[id]);
  listCollectionPoint.value.length -= 1;
};
const onHandleRemoveCollectionPointById = (id: number): void => {
  listSelectedCollectionPoint.value.splice(
    listSelectedCollectionPoint.value.findIndex((item) => item.id == id),
    1
  );
  listCollectionPoint.value.length += 1;
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
const handleOnDuoInputs2Focus = (index: number | boolean | Event): void => {
  formData.duoInputs2[Number(index)].isFocus = true;
};

const handleOnDuoInputs2Blur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  formData.duoInputs2[Number(index)].isFocus = false;
};

const handleClickCancel = (): void => {
  router.push({ name: routeNames.listCollectionRoute });
};
const converListIdToString = (listId: number[]): string => {
  let str = listId.toString().replace(/,/g, ", ");
  return str;
};
const handleClickSubmit = async (): Promise<void> => {
  const listStringId = converListIdToString(getListIdSelectedCP.value);
  const data = {
    name: makeUniqueName(formData.duoInputs[0].value.toString()) as string,
    workplace_id: +formData.duoInputs2[0].value,
    collect_point_ids: listStringId,
    notice: makeUniqueName(formNote.note.toString())
  };
  isSubmitting.value = true;
  const { error, res } = await service.collectionRoute.createCollectionRoute(
    data
  );
  isSubmitting.value = false;
  if (!error && res) {
    messenger({
      title: "common_msg_create_successfully",
      message: "",
      type: MessengerType.Success,
      callback: (isConfirm: boolean) => {
        isConfirm;
        router.push({
          name: routeNames.listCollectionRoute
        });
        clearInputs();
      }
    });
  } else {
    messenger({
      title: "popup_create_fail_title",
      message: "",
      type: MessengerType.Error
    });
  }
};
const activeSubmitButton = (): void => {
  if (
    handleSubmitBtn.formData.duoInputs[0].value &&
    handleSubmitBtn.formData.duoInputs2[0].value &&
    handleSubmitBtn.listSelectedCollectionPoint.length > 0 &&
    !handleSubmitBtn.formNoteError
  ) {
    isDisableSubmit.value = false;
  } else {
    isDisableSubmit.value = true;
  }
};
//#endregion

//#region reactive
watch(handleSubmitBtn, () => {
  activeSubmitButton();
});
watch(formNote, () => {
  if (formNote.note?.length > 225) {
    formNoteError.value = true;
  } else {
    formNoteError.value = false;
  }
});
//#endregion
</script>

<style lang="scss" scoped>
.create-collection-route-order {
  .create-collection-route-order-title {
    font-weight: 700;
    font-size: 28px;
    line-height: 36px;
    margin-bottom: 20px;
    color: $neutral-600;
  }
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
    margin-bottom: 10px;
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
    transition: background-color 0.5s;
  }
  .item-index {
    min-height: 20px;
    min-width: 20px;
    width: auto;
    background: $primary-400;
    border-radius: 24px;
    color: $white;
    font-weight: 700;
    font-size: 14px;
    line-height: 14px;
    margin-right: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    &__content {
      align-content: center;
      text-align: center;
      margin-left: 4px;
      margin-right: 4px;
      padding: 1px 1px 0 0;
    }
  }
  .collection-point__data-right .collection-point__data-item:hover {
    background-color: $neutral-0;
    transition: background-color 0.5s;
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
    display: flex;
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
    .helper-item {
      height: 18px;
      line-height: 100%;
      color: $neutral-600;
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
    display: none;
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
    left: 13px;
  }

  .form-item-note {
    margin-top: -20px;
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
  .create-collection-route-order__duo-inputs-wrapper .ant-row.ant-form-item {
    margin-bottom: 20px !important;
  }

  .create-collection-route-order__note {
    .ant-input {
      border-color: transparent;
      border: 1px solid transparent;
      outline: none;
      border-radius: 10px;
    }
  }
  textarea.ant-input {
    background-color: transparent !important;
  }
  .form-item-note
    .ant-form-item-explain.ant-form-item-explain-connected.active {
    display: none;
  }
  .ant-form-item-explain .ant-form-item-explain-error {
    margin-bottom: 0px !important;
  }
}
</style>
