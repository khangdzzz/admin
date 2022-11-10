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
            <IcRequired />
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
          <ol-geolocation :projection="projection">
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

        <a-btn
          class="create-collection-base__map-wrapper__current-location-button"
          @click="focusCurrentLocation"
        >
          <img src="@/assets/icons/ic_btn_current_location.svg" />
        </a-btn>

        <div class="create-collection-base__map-wrapper__position-detail">
          {{ geoLocations.length ? geoLocations[0][1] : NULL_VALUE_DISPLAY }},
          {{ geoLocations.length ? geoLocations[0][0] : NULL_VALUE_DISPLAY }}
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
import IcRequired from "@/assets/icons/IcRequired.vue";
import locationIcon from "@/assets/icons/ic_collection_base.png";
import { i18n } from "@/i18n";
import CustomForm from "@/modules/base/components/CustomForm.vue";
import validator from "@/modules/base/components/validator/validator";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
import { formData as reactiveFormData } from "@/modules/staff-management/pages/create-collection-base-form";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { commonStore } from "@/stores";
import { NULL_VALUE_DISPLAY } from "@/utils/constants";
import { makeUniqueName } from "@/utils/string.helper";
import { message } from "ant-design-vue";
import { Rule } from "ant-design-vue/lib/form";
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch
} from "vue";
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
const { name, contact } = formData;
const isPostalCodeHasError = ref<boolean>(false);
const existFields = ref<string[]>([]);
//#endregion

//#region hooks
onBeforeUnmount(() => {
  clearInputs();
});

onMounted(() => {
  if (contact[0].actionBtn) {
    contact[0].actionBtn.name = "search_address";
    contact[0].actionBtn.click = handleSearchAddress;
    contact[0].actionBtn.disabled = isEnableSearchAddress();
    contact[0].class = "input-with-action-btn";
  }

  name[0].rules?.push({
    validator: (): Promise<void> => {
      if (existFields.value.includes("name")) {
        return Promise.reject(
          i18n.global.t("error_unique_constraint", {
            fieldName: i18n.global.t("name")
          })
        );
      }
      return Promise.resolve();
    },
    trigger: ["blur", "change"]
  });

  name[1].rules?.push({
    validator: (): Promise<void> => {
      if (existFields.value.includes("short_name")) {
        return Promise.reject(
          i18n.global.t("error_unique_constraint", {
            fieldName: i18n.global.t("short_name")
          })
        );
      }
      return Promise.resolve();
    },
    trigger: ["blur", "change"]
  });

  contact[0].id = "create-collection-base_postal-code";
  contact[0].rules?.push({
    validator: (rule: Rule, value: string): Promise<void> => {
      if (isPostalCodeHasError.value)
        return Promise.reject(
          i18n.global.t("cannot_find_address_from_field_name", {
            fieldName: i18n.global.t("common_postal_code_label").toLowerCase()
          })
        );
      return validator.validatePostalCode(rule, value);
    },
    trigger: ["blur", "change"]
  });

  focusCurrentLocation();
});
//#endregion

//#region function
const handleOnNameFocus = (index: number | boolean | Event): void => {
  name[Number(index)].isFocus = true;
  if (typeof index === "number") clearExistError(index);
};

const handleOnNameBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  name[Number(index)].isFocus = false;
  if (typeof index === "number") clearExistError(index);
};

const clearExistError = (index: number): void => {
  if (index === 0 && existFields.value.length) {
    const errorIndex = existFields.value.indexOf("name");
    if (errorIndex >= 0) {
      existFields.value.splice(errorIndex, 1);
    }
  }

  if (index === 1 && existFields.value.length) {
    const errorIndex = existFields.value.indexOf("short_name");
    if (errorIndex >= 0) {
      existFields.value.splice(errorIndex, 1);
    }
  }
};

const handleOnContactFocus = (index: number | boolean | Event): void => {
  contact[Number(index)].isFocus = true;
};

const handleOnContactBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  contact[Number(index)].isFocus = false;
};
const handleValidateFields = (
  value: string,
  maxLength: number,
  isRequire: boolean
): boolean => {
  const valueLength = value?.length || 0;
  if (valueLength > maxLength) {
    return false;
  }
  return isRequire ? valueLength > 0 : true;
};

const clearInputs = (): void => {
  createCollectionBaseRef.value.resetFields();
};

const handleCancel = (): void => {
  router.push({ name: routeNames.listCollectionBase });
  clearInputs();
};

const handleSubmit = async (): Promise<void> => {
  const data = {
    name: name[0].value?.toString(),
    shortName: name[1].value?.toString(),
    kana: name[2].value?.toString(),
    postalCode: contact[0].value?.toString(),
    address: contact[1].value?.toString(),
    telephone: contact[2].value?.toString(),
    email: contact[3].value?.toString(),
    representative: contact[4].value?.toString(),
    longitude: geoLocations.value.length ? geoLocations.value[0][0] : null,
    latitude: geoLocations.value.length ? geoLocations.value[0][1] : null,
    collectionBaseType: collectionBaseType.value || 1
  };
  if (!userStore.user) return;
  setBtnActionDisableState(true);
  isSubmitting.value = true;
  const { error, res, errorParams } =
    await service.collectionBase.createCollectionBase(data);
  if (res && !error) {
    messenger({
      title: "common_msg_create_successfully",
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
      }
    });
  } else {
    if ((error as string).includes("error_workplace_unique")) {
      if (errorParams) {
        existFields.value = errorParams;
      }
      createCollectionBaseRef.value.validate();
    } else {
      messenger({
        title: "popup_create_fail_title",
        message: "",
        type: MessengerType.Error
      });
    }
  }
  setBtnActionDisableState(false);
  isSubmitting.value = false;
};

const setBtnActionDisableState = (state: boolean): void => {
  if (contact[0].actionBtn) {
    contact[0].actionBtn.disabled = state;
  }
};

const handleSearchAddress = async (): Promise<void> => {
  setBtnActionDisableState(true);
  contact[1].loading = true;
  const { res } = await service.location.isPostalAddressExists(
    makeUniqueName(contact[0].value.toString()) || ""
  );
  setBtnActionDisableState(false);

  if (!res) {
    isPostalCodeHasError.value = true;
    contact[0].class = "input-with-action-btn postal-code__uniq-warning";
  } else {
    contact[1].value = res?.full_address || "";
    await getLatLongFromAddress(res.full_address);
  }
  contact[1].loading = false;
  document.getElementById("create-collection-base_postal-code")?.focus();
  document.getElementById("create-collection-base_postal-code")?.blur();
};

const getLatLongFromAddress = async (address: string): Promise<void> => {
  const { error, res } = await service.location.getLatLongFromAddress(address);

  if (!error && res && res.length > 0) {
    geoLocations.value = [[+res[0].lon, +res[0].lat]];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (view?.value as any)?.fit(
      [+res[0].lon, +res[0].lat, +res[0].lon, +res[0].lat],
      {
        maxZoom: 14
      }
    );
    contact[1].value = address;
  }
};

const geoLocChange = (loc: number[]): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (view?.value as any)?.fit([loc[0], loc[1], loc[0], loc[1]], {
    maxZoom: 14
  });
};

const drawstart = (): void => {
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

const isEnableSearchAddress = (): boolean => {
  if (contact[0]?.actionBtn) {
    if (!contact[0].value || (contact[0].value && isNaN(+contact[0].value))) {
      contact[0].actionBtn.disabled = true;
      return true;
    }

    contact[0].actionBtn.disabled = false;
  }

  return false;
};

//#endregion

//#region computed
const isButtonDisabled = computed((): boolean => {
  return (
    !handleValidateFields(name[0].value.toString(), 50, true) ||
    !handleValidateFields(name[1].value.toString(), 50, true) ||
    !validator.checkEmailFormat(contact[3].value.toString(), false) ||
    !validator.checkPhoneFormat(contact[2].value.toString(), false) ||
    !collectionBaseType.value ||
    !contact[0].value ||
    isNaN(Number(contact[0].value)) ||
    !contact[1].value
  );
});
//#endregion

//#region reactive
watch(
  () => contact[0].value,
  () => {
    isPostalCodeHasError.value = false;
    contact[0].class = "input-with-action-btn";
    isEnableSearchAddress();
  }
);
//#endregion
</script>

<style lang="scss" scoped>
.create-collection-base {
  &__content-wrapper {
    background-color: $white;
    border-radius: 10px;
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
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
      bottom: 34px;
      right: 10px;
      cursor: pointer;
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
    min-width: 51px;
    margin-right: -12px;
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

  .ant-form-item-explain-error {
    color: $red-500 !important;
  }
}
</style>
