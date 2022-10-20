<template>
  <div class="create-collection-base p-30 fill-height">
    <div class="create-collection-base__title mb-20">
      {{ $t("add_collection_base_add_new") }}
    </div>
    <div
      class="create-collection-base__content-wrapper d-flex justify-space-between gap-20 px-20 pt-20"
    >
      <a-form
        class="create-collection-base__form-wrapper"
        :model="formData"
        ref="createCollectionBaseRef"
      >
        <div>
          <CustomForm
            :form-data="formData.name"
            @on-focus="handleOnNameFocus"
            @on-blur="handleOnNameBlur"
          />
        </div>
        <div class="d-flex my-30 gap-40">
          <div class="create-collection-base__type-selector">
            {{ $t("type") }}
            <span class="create-collection-base__required-mark">&nbsp;* </span>
          </div>
          <div>
            <a-radio-group
              v-model:value="collectionBaseType"
              name="radioGroup"
              size="large"
              class="create-collection-base__radio-group d-flex gap-40"
            >
              <a-radio :value="1">{{ $t("collection") }}</a-radio>
              <a-radio :value="2">{{ $t("manufacture") }}</a-radio>
              <a-radio :value="3">{{ $t("both") }}</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div>
          <CustomForm
            :form-data="formData.contact"
            @on-focus="handleOnContactFocus"
            @on-blur="handleOnContactBlur"
          />
        </div>
      </a-form>
      <div class="create-collection-base__map-wrapper">
        <ol-map
          :loadTilesWhileAnimating="true"
          :loadTilesWhileInteracting="true"
          style="height: calc(100% - 24px)"
          ref="map"
        >
          <ol-view
            ref="view"
            :center="center"
            :rotation="rotation"
            :zoom="zoom"
            :projection="projection"
          />

          <ol-tile-layer>
            <ol-source-osm />
          </ol-tile-layer>
          <ol-geolocation
            :projection="projection"
            @positionChanged="geoLocChange"
          >
            <template v-slot>
              <ol-vector-layer :zIndex="2">
                <ol-source-vector>
                  <ol-feature ref="positionFeature">
                    <ol-style>
                      <ol-style-icon
                        :src="locationIcon"
                        :scale="1"
                      ></ol-style-icon>
                    </ol-style>
                  </ol-feature>
                </ol-source-vector>
              </ol-vector-layer>
            </template>
          </ol-geolocation>

          <ol-geolocation
            :projection="projection"
            v-for="(geoLocation, index) in geoLocations"
            :key="index"
          >
            <template v-slot>
              <ol-vector-layer :zIndex="2">
                <ol-source-vector>
                  <ol-feature ref="positionFeature">
                    <ol-geom-point :coordinates="geoLocation"></ol-geom-point>
                    <ol-style>
                      <ol-style-icon
                        :src="locationIcon"
                        :scale="1"
                      ></ol-style-icon>
                    </ol-style>
                  </ol-feature>
                </ol-source-vector>
              </ol-vector-layer>
            </template>
          </ol-geolocation>

          <ol-vector-layer>
            <ol-source-vector :projection="projection">
              <ol-interaction-draw
                type="Point"
                @drawend="drawend"
                @drawstart="drawstart"
              >
              </ol-interaction-draw>
            </ol-source-vector>

            <ol-style>
              <ol-style-circle :radius="7">
                <ol-style-fill color="transparent"></ol-style-fill>
                <ol-style-stroke color="transparent"></ol-style-stroke>
              </ol-style-circle>
            </ol-style>
          </ol-vector-layer>
        </ol-map>
        <div
          class="create-collection-base__map-wrapper__position-detail"
          v-if="geoLocations.length"
        >
          {{ geoLocations[0][0] }}, {{ geoLocations[0][1] }}
          <img
            src="@/assets/icons/ic_btn_copy.svg"
            @click="copyLocationToClipboard"
          />
        </div>
      </div>
    </div>
    <div class="d-flex justify-center gap-20 mt-20 pb-20">
      <a-button
        type="secondary"
        class="create-collection-base__btn-style create-collection-base__cancel-btn"
        :disabled="isSubmitting"
        @click="handleCancel"
        >{{ $t("btn_cancel") }}</a-button
      >
      <a-button
        type="primary"
        class="create-collection-base__btn-style"
        :disabled="isButtonDisabled"
        :loading="isSubmitting"
        @click="handleSubmit"
        >{{ $t("btn_submit") }}</a-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import locationIcon from "@/assets/icons/ic_collection_base.png";
import { i18n } from "@/i18n";
import CustomForm from "@/modules/base/components/CustomForm.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
import { formData as reactiveFormData } from "@/modules/staff-management/pages/create-collection-base-form";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { commonStore } from "@/stores";
import { makeUniqueName } from "@/utils/string.helper";
import { message } from "ant-design-vue";
import { computed, inject, onBeforeUnmount, reactive, ref } from "vue";
//#region import
//#endregion

//#region props
//#endregion

//#region variables
const userStore = commonStore();
const formData = reactive<FormData>(reactiveFormData());
const collectionBaseType = ref<number>(1);
const center = ref<number[]>([40, 40]);
const projection = ref<string>("EPSG:4326");
const zoom = ref<number>(20);
const rotation = ref<number>(0);
const view = ref(null);
const map = ref(null);
const geoLocations = ref<number[][]>([]);
const messenger: (
  param: MessengerParamModel
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
) => void = inject("messenger")!;
const createCollectionBaseRef = ref();
const isSubmitting = ref<boolean>(false);
//#endregion

//#region hooks
onBeforeUnmount(() => {
  clearInputs();
});
//#endregion

//#region function
const handleOnNameFocus = (index: number | boolean | Event): void => {
  formData.name[Number(index)].isFocus = true;
};
const handleOnContactFocus = (index: number | boolean | Event): void => {
  formData.contact[Number(index)].isFocus = true;
};

const handleOnNameBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  formData.name[Number(index)].isFocus = false;
};

const handleOnContactBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  formData.contact[Number(index)].isFocus = false;
};

const isButtonDisabled = computed((): boolean => {
  const { name, contact } = formData;

  return (
    !name[0].value ||
    !name[1].value ||
    !collectionBaseType.value ||
    !contact[0].value ||
    !contact[1].value ||
    !geoLocations.value.length
  );
});

const clearInputs = (): void => {
  createCollectionBaseRef.value.resetFields();
};

const handleCancel = (): void => {
  router.push({ name: routeNames.listCollectionBase });
  clearInputs();
};

const handleSubmit = async (): Promise<void> => {
  const { name, contact } = formData;
  const data = {
    name: makeUniqueName(name[0].value.toString()),
    shortName: makeUniqueName(name[1].value.toString()),
    kana: makeUniqueName(name[2].value.toString()),
    postalCode: makeUniqueName(contact[0].value.toString()),
    address: makeUniqueName(contact[1].value.toString()),
    telephone: makeUniqueName(contact[2].value.toString()),
    email: makeUniqueName(contact[3].value.toString()),
    representative: makeUniqueName(contact[4].value.toString()),
    latitude: geoLocations.value[0][0],
    longitude: geoLocations.value[0][1],
    collectionBaseType: collectionBaseType.value || 1
  };
  if (!userStore.user) return;
  isSubmitting.value = true;
  const { error, res } = await service.collectionBase.createCollectionBase(
    data
  );
  if (res && !error) {
    messenger({
      title: "create_collection_base_msg_create_successfully",
      message: "",
      type: MessengerType.Success,
      callback: (isConfirm: boolean) => {
        isConfirm;
        router.push({
          name: routeNames.collectionBaseDetail,
          params: {
            id: res.id
          }
        });
        clearInputs();
      }
    });
  } else {
    messenger({
      title: "popup_create_fail_title",
      message: "popup_create_fail_message",
      type: MessengerType.Error
    });
  }
  isSubmitting.value = false;
};

const geoLocChange = (loc: number[]): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (view?.value as any)?.fit([loc[0], loc[1], loc[0], loc[1]], {
    maxZoom: 14
  });
};

const drawstart = (_event: { target: { sketchCoords_: number[] } }): void => {
  geoLocations.value = [];
};

const drawend = (event: { target: { sketchCoords_: number[] } }): void => {
  geoLocations.value.push(event.target.sketchCoords_);
};

const copyLocationToClipboard = (): void => {
  if (geoLocations.value.length) {
    navigator.clipboard.writeText(
      `${geoLocations.value[0][0]}, ${geoLocations.value[0][1]}`
    );
    message.success(i18n.global.t("common_msg_copied_to_clipboard"));
  }
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.create-collection-base {
  &__content-wrapper {
    background-color: $white;
  }

  &__title {
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 36px;
    color: $neutral-600;
  }

  &__form-wrapper {
    width: 50%;
  }

  &__map-wrapper {
    position: relative;
    width: 50%;
    height: auto;
    &__position-detail {
      position: absolute;
      display: flex;
      bottom: 34px;
      left: 10px;
      width: auto;
      padding-left: 10px;
      padding-right: 10px;
      height: 40px;
      background-color: white;
      border-radius: 6px;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      align-items: center;
      color: $neutral-800;
      text-align: center;
      img {
        width: 20px;
        height: 20px;
        object-fit: fill;
        vertical-align: middle;
        margin-left: 16px;
        cursor: pointer;
      }
    }
  }

  &__btn-style {
    height: 48px;
    width: 180px;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 100%;
  }

  &__cancel-btn {
    border: 1px solid $primary;
    background-color: $white;
    color: $primary;
  }

  &__required-mark {
    color: $red-1;
  }

  &__type-selector {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: $neutral-600;
  }

  &__radio-group {
    .ant-radio-wrapper {
      margin-right: 0 !important;
      display: flex;
      align-items: center;
    }
  }
}

:deep() {
  .create-collection-base {
    &__custom-input-wrapper {
      .ant-form-item {
        width: 100%;
      }
    }

    &__map-wrapper {
      .ol-viewport {
        border-radius: 10px;
        .ol-layers {
          .ol-layer {
            canvas {
              height: 100% !important;
            }
          }
        }
      }
    }
  }

  @media only screen and (max-width: 1382px) {
    .create-collection-base {
      &__radio-group {
        flex-direction: column;
        gap: 10px;
      }
    }
  }
}
</style>
