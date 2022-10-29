<template>
  <a-spin
    :spinning="isLoading"
    :tip="$t('common_loading')"
    class="collection-base-detail__spin"
  >
    <div class="d-flex flex-column collection-base-detail">
      <ListSearchHeader
        :title="$t('collection_base_detail')"
        :enable-search="false"
        :enable-back="true"
        @goBack="goToCollectionBaseListPage"
      >
        <template #action>
          <a-button
            class="btn-action"
            ghost
            type="primary"
            @click="editCollectionBase"
          >
            <template #icon>
              <img src="@/assets/icons/ic_btn_edit.svg" class="btn-icon" />
            </template>
            {{ $t("edit_btn") }}
          </a-button>
          <a-button
            class="btn-action color-btn-delete"
            ghost
            type="primary"
            @click="deleteCollectionBase"
          >
            <template #icon>
              <IcTrash class="btn-icon" :color="'#F54E4E'" />
            </template>
            {{ $t("delete_btn") }}
          </a-button>
        </template>
      </ListSearchHeader>
      <div
        class="collection-base-detail__content-wrapper d-flex justify-space-between gap-20 fill-height"
      >
        <div class="collection-base-detail__form-wrapper">
          <div
            v-for="(item, index) in informations"
            :key="index"
            class="collection-base-detail__form-wrapper__row"
            :class="index !== 0 ? 'mt-15' : ''"
          >
            <div class="collection-base-detail__form-wrapper__title">
              {{ $t(item.key) }}
            </div>
            <div class="collection-base-detail__form-wrapper__value">
              {{ item.value || NULL_VALUE_DISPLAY }}
            </div>

            <a-divider style="border-color: #e8e8e8; margin: 10px 0" />
          </div>
        </div>
        <div class="collection-base-detail__map-wrapper">
          <ol-map
            v-if="geoLocations.length"
            :loadTilesWhileAnimating="true"
            :loadTilesWhileInteracting="true"
            ref="map"
            class="collection-base-detail__map-wrapper__map"
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

            <ol-overlay
              v-for="(geoLocation, index) in geoLocations"
              :key="index"
              :position="geoLocation"
            >
              <template v-slot="slotProps">
                <div
                  class="collection-base-detail__map-wrapper__overlay-content"
                  v-if="slotProps && collectionBaseAddress"
                >
                  {{ collectionBaseAddress }}
                </div>
              </template>
            </ol-overlay>
          </ol-map>
          <div
            class="collection-base-detail__map-wrapper__position-detail"
            v-if="geoLocations.length && !isLoading"
          >
            {{ geoLocations[0][0] }}, {{ geoLocations[0][1] }}
            <img
              src="@/assets/icons/ic_btn_copy.svg"
              @click="copyLocationToClipboard"
            />
          </div>
          <a-btn
            class="collection-base-detail__map-wrapper__current-location-button"
            @click="focusCurrentLocation"
            v-if="!isLoading"
          >
            <img src="@/assets/icons/ic_btn_current_location.svg" />
          </a-btn>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import locationIcon from "@/assets/icons/ic_collection_base.png";

import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { i18n } from "@/i18n";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { message } from "ant-design-vue";
import { inject, onMounted, ref } from "vue";
import { service } from "@/services";
import IcTrash from "@/assets/icons/IcTrash.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { NULL_VALUE_DISPLAY } from "@/utils/constants";
//#region import
//#endregion

//#region props
//#endregion

//#region variables
const isLoading = ref<boolean>(false);
const center = ref<number[]>([40, 40]);
const projection = ref<string>("EPSG:4326");
const zoom = ref<number>(20);
const rotation = ref<number>(0);
const view = ref(null);
const map = ref(null);
const geoLocations = ref<number[][]>([]);
const informations = ref<{ key: string; value: string }[]>([]);
const collectionBaseAddress = ref<string>("");
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
//#endregion

//#region hooks
onMounted(async (): Promise<void> => {
  if (router.currentRoute.value.params?.id) {
    isLoading.value = true;
    const detail = await service.collectionBase.getCollectionBaseById(
      +router.currentRoute.value.params?.id
    );
    if (detail) {
      const {
        name,
        shortName,
        kana,
        longitude,
        latitude,
        collectionBaseType,
        postalCode,
        address,
        telephone,
        email: mail,
        representative
      } = detail;
      if (longitude && latitude) {
        const lat = +latitude;
        const long = +longitude;
        geoLocations.value.push([lat, long]);
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (view?.value as any)?.fit([lat, long, lat, long], {
            maxZoom: 14
          });
        }, 300);
        collectionBaseAddress.value = address || "";
      } else {
        setTimeout(() => {
          focusCurrentLocation();
        }, 300);
      }

      informations.value = [
        { key: "collection_base_lbl_name", value: name },
        { key: "collection_base_lbl_short_name", value: shortName },
        { key: "collection_base_lbl_name_kana", value: kana },
        {
          key: "collection_base_lbl_type",
          value: i18n.global.t(
            `collection_base_lbl_type_${collectionBaseType?.toString()}`
          )
        },
        { key: "collection_base_lbl_postal_code", value: postalCode || "" },
        { key: "collection_base_lbl_address", value: address || "" },
        { key: "collection_base_lbl_phone_number", value: telephone || "" },
        { key: "collection_base_lbl_email", value: mail || "" },
        { key: "collection_base_lbl_representative", value: representative }
      ];
    }
    isLoading.value = false;
  }
});
//#endregion

//#region function
const goToCollectionBaseListPage = (): void => {
  router.push({ name: routeNames.listCollectionBase });
};

const copyLocationToClipboard = (): void => {
  if (geoLocations.value.length) {
    navigator.clipboard.writeText(
      `${geoLocations.value[0][0]}, ${geoLocations.value[0][1]}`
    );
    message.success(i18n.global.t("common_msg_copied_to_clipboard"));
  }
};

const editCollectionBase = (): void => {
  if (!router.currentRoute.value.params?.id) return;
  router.push({
    name: routeNames.editCollectionBase,
    params: {
      id: router.currentRoute.value.params?.id
    }
  });
};

const deleteCollectionBase = async (): Promise<void> => {
  if (!router.currentRoute.value.params?.id) return;
  messenger({
    title: "popup_msg_confirm_delete",
    message: "",
    type: MessengerType.Confirm,
    buttonOkTitle: "btn_delete",
    callback: async (isConfirm: boolean): Promise<void> => {
      if (!isConfirm) {
        return;
      }
      onDeleteCollectionBase(+router.currentRoute.value.params?.id);
    }
  });
};

const onDeleteCollectionBase = async (deleteId: number): Promise<void> => {
  isLoading.value = true;
  const isSuccess = await service.collectionBase.deleteCollectionBaseById([
    deleteId
  ]);
  isLoading.value = false;
  if (!isSuccess) {
    messenger({
      title: "popup_delete_fail_lbl_title",
      message: "",
      type: MessengerType.Error
    });
    return;
  }
  messenger({
    title: "collection_base_msg_delete_successfully",
    message: "",
    type: MessengerType.Success,
    callback: (isConfirm: boolean): void => {
      isConfirm;
      goToCollectionBaseListPage();
    }
  });
};

const geoLocChange = (loc: number[]): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (view?.value as any)?.fit([loc[0], loc[1], loc[0], loc[1]], {
    maxZoom: 14
  });
};

const focusCurrentLocation = (): void => {
  navigator.geolocation.getCurrentPosition(
    (position: { coords: { longitude: number; latitude: number } }): void => {
      geoLocChange([position.coords.longitude, position.coords.latitude]);
    },
    (error: { message: string }): void => {
      error.message;
    },
    {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: Infinity
    }
  );
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.ant-spin-nested-loading {
  height: 100%;
}
.collection-base-detail__spin {
  height: 100vh;
  width: 100%;
}
.collection-base-detail {
  height: 100% !important;
  width: 100% !important;
  padding-bottom: 30px;
  &__content-wrapper {
    margin-left: 30px;
    margin-right: 30px;
    border-radius: 10px;
    background-color: $white;
    padding: 20px;
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
    height: auto;
    &__row {
      min-height: 60px;
      height: 60px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    &__title {
      width: 100%;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #999999;
      margin-bottom: 8px;
    }
    &__value {
      width: 100%;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 22px;
      color: $neutral-600;
      max-width: 100%;
      min-height: 22px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  &__map-wrapper {
    position: relative;
    width: 50%;
    &__map {
      height: 100%;
    }
    &__position-detail {
      position: absolute;
      display: flex;
      bottom: 10px;
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

    &__current-location-button {
      display: flex;
      justify-content: space-around;
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background-color: white;
      align-content: center;
      align-items: center;
      position: absolute;
      bottom: 10px;
      right: 10px;
    }

    &__overlay-content {
      text-shadow: 2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff,
        1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff;
      font-family: "Roboto";
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      line-height: 19px;
      display: flex;
      align-items: center;
      color: #f54e4e;
      margin-top: -20px;
      margin-left: 30px;
      max-width: 133px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: 38px;
      word-wrap: break-word;
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
  .collection-base-detail {
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
  }
}
</style>
