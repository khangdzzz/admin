<template>
  <div class="edit-collection-base p-30 fill-height">
    <div class="edit-collection-base__title">Edit collection base</div>
    <div
      class="edit-collection-base__content-wrapper d-flex justify-space-between gap-20 px-20 pt-20 my-20 fill-height"
    >
      <a-form class="edit-collection-base__form-wrapper" :model="formData">
        <div
          class="edit-collection-base__custom-input-wrapper d-flex justify-space-between gap-20"
        >
          <CustomForm
            :form-data="formData.name"
            @on-focus="handleOnNameFocus"
            @on-blur="handleOnNameBlur"
          />
        </div>
        <div>
          <CustomForm
            :form-data="formData.japaneseName"
            @on-focus="handleOnJapaneseNameFocus"
            @on-blur="handleOnJapaneseNameBlur"
          />
        </div>
        <div class="d-flex my-30 gap-40">
          <div class="edit-collection-base__type-selector">
            Type
            <span class="edit-collection-base__required-mark">&nbsp;* </span>
          </div>
          <div>
            <a-radio-group
              v-model:value="collectionBaseType"
              name="radioGroup"
              size="large"
              class="edit-collection-base__radio-group d-flex gap-40"
            >
              <a-radio value="collection">Collection</a-radio>
              <a-radio value="manufacture">Manufacture</a-radio>
              <a-radio value="both">Both</a-radio>
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
        <div
          class="edit-collection-base__custom-input-wrapper d-flex justify-space-between gap-20"
        >
          <CustomForm
            :form-data="formData.coordinate"
            @on-focus="handleOnCoordinateFocus"
            @on-blur="handleOnCoordinateBlur"
          />
        </div>
        <div>
          <CustomForm
            :form-data="formData.addressAndPhone"
            @on-focus="handleOnAddressAndPhoneFocus"
            @on-blur="handleOnAddressAndPhoneBlur"
          />
        </div>
      </a-form>
      <div class="edit-collection-base__map-wrapper">
        <ol-map
          :loadTilesWhileAnimating="true"
          :loadTilesWhileInteracting="true"
          style="height: 100%"
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
                    <ol-geom-point
                      :coordinates="[
                        formData.coordinate[0].value || 50,
                        formData.coordinate[1].value || 50
                      ]"
                    ></ol-geom-point>
                    <ol-style>
                      <ol-style-icon
                        :src="locationIcon"
                        :scale="0.7"
                      ></ol-style-icon>
                    </ol-style>
                  </ol-feature>
                </ol-source-vector>
              </ol-vector-layer>
            </template>
          </ol-geolocation>
        </ol-map>
      </div>
    </div>
    <div class="d-flex justify-center gap-20">
      <a-button
        type="secondary"
        class="edit-collection-base__btn-style edit-collection-base__cancel-btn"
        >Cancel</a-button
      >
      <a-button
        type="primary"
        class="edit-collection-base__btn-style"
        :disabled="isButtonDisabled"
        @click="handleSave"
        >Save</a-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import locationIcon from "@/assets/icons/ic_collection_base.png";
import CustomForm from "@/modules/base/components/CustomForm.vue";
import { service } from "@/services";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
import { formData as reactiveFormData } from "@/modules/staff-management/pages/create-collection-base-form";
import { computed, reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";

//#region import
//#endregion

//#region props
//#endregion

//#region variables
const route = useRoute();
const { id } = route.params;
const formData = reactive<FormData>(reactiveFormData);
const collectionBaseType = ref<string>("collection");
const center = ref<number[]>([40, 40]);
const projection = ref<string>("EPSG:4326");
const zoom = ref<number>(20);
const rotation = ref<number>(0);
const view = ref(null);
const map = ref(null);
//#endregion

//#region hooks
onMounted(() => {
  fetchCollectionBaseById();
});
//#endregion

//#region function
const handleOnNameFocus = (index: number | boolean | Event): void => {
  formData.name[Number(index)].isFocus = true;
};

const handleOnJapaneseNameFocus = (index: number | boolean | Event): void => {
  formData.japaneseName[Number(index)].isFocus = true;
};

const handleOnContactFocus = (index: number | boolean | Event): void => {
  formData.contact[Number(index)].isFocus = true;
};

const handleOnCoordinateFocus = (index: number | boolean | Event): void => {
  formData.coordinate[Number(index)].isFocus = true;
};

const handleOnAddressAndPhoneFocus = (
  index: number | boolean | Event
): void => {
  formData.addressAndPhone[Number(index)].isFocus = true;
};

const handleOnNameBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  formData.name[Number(index)].isFocus = false;
};

const handleOnJapaneseNameBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  formData.japaneseName[Number(index)].isFocus = false;
};

const handleOnContactBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  formData.contact[Number(index)].isFocus = false;
};

const handleOnCoordinateBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  formData.coordinate[Number(index)].isFocus = false;
};

const handleOnAddressAndPhoneBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  formData.addressAndPhone[Number(index)].isFocus = false;
};

const isButtonDisabled = computed((): boolean => {
  const { name, contact, coordinate } = formData;

  return (
    !name[0].value ||
    !name[1].value ||
    !collectionBaseType.value ||
    !contact[2].value ||
    !coordinate[0].value ||
    !coordinate[1].value
  );
});

const handleSave = (): void => {
  const { name, contact, coordinate, addressAndPhone } = formData;

  const data = {
    name: name[0].value,
    shortName: name[1].value,
    kana: name[1].value,
    postalCode: contact[0].value,
    email: contact[1].value,
    representative: contact[2].value,
    latitude: coordinate[0].value,
    longitude: coordinate[1].value,
    address: addressAndPhone[0].value,
    telephone: addressAndPhone[1].value
  };
  data;
};
const fetchCollectionBaseById = async (): Promise<void> => {
  const data = await service.collectionBase.getMockCollectionBaseById(
    id.toString()
  );
  formData.name[0].value = data.name;
  formData.name[1].value = data.shortName;
  formData.contact[0].value = data.postalCode;
  formData.contact[1].value = data.email;
  formData.contact[2].value = data.representative;
  formData.coordinate[0].value = data.latitude;
  formData.coordinate[1].value = data.longitude;
  formData.addressAndPhone[0].value = data.address;
  formData.addressAndPhone[1].value = data.telephone;
};

const geoLocChange = (loc: number[]): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (view?.value as any)?.fit([loc[0], loc[1], loc[0], loc[1]], {
    maxZoom: 14
  });
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.edit-collection-base {
  &__content-wrapper {
    background-color: $white;
    max-height: 747px;
    min-height: 747px;
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
    width: 50%;
    height: calc(100% - 20px);
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
  .edit-collection-base {
    &__custom-input-wrapper {
      .ant-form-item {
        width: 100%;
      }
    }

    &__map-wrapper {
      .ol-viewport {
        border-radius: 10px;
      }
    }

    &__radio-group {
      .ant-radio-wrapper {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 100%;
        color: $neutral-600;
        .ant-radio {
          font-size: 0px;
          .ant-radio-inner {
            width: 24px;
            height: 24px;

            &::after {
              width: 24px;
              height: 24px;
              margin-top: -12px;
              margin-left: -12px;
            }
          }
        }
      }
    }
  }

  @media only screen and (max-width: 1382px) {
    .edit-collection-base {
      &__content-wrapper {
        min-height: 816px;
        max-height: 816px;
      }

      &__radio-group {
        flex-direction: column;
        gap: 10px;
      }
    }
  }
}
</style>
