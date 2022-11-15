<template>
  <a-spin :tip="$t('common_loading')" :spinning="isLoading">
    <div class="create-collection-point p-30 fill-height">
      <div class="create-collection-point__title mb-20">
        {{ $t("add_new_collection_point") }}
      </div>
      <div
        class="create-collection-point__content-wrapper d-flex justify-space-between gap-20 px-20 pt-20"
      >
        <a-form
          class="create-collection-point__form-wrapper"
          :model="formData"
          help="test"
          ref="createCollectionPointRef"
        >
          <div>
            <CustomForm
              :form-data="formData.data"
              @on-focus="handleOnDataFocus"
              @on-blur="handleOnDataBlur"
            />
          </div>
        </a-form>
        <div class="create-collection-point__map-wrapper">
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
          <div class="create-collection-point__map-wrapper__position-detail">
            {{ geoLocations.length ? geoLocations[0][1] : NULL_VALUE_DISPLAY }},
            {{ geoLocations.length ? geoLocations[0][0] : NULL_VALUE_DISPLAY }}
            <img
              src="@/assets/icons/ic_btn_copy.svg"
              @click="copyLocationToClipboard"
            />
          </div>
          <a-btn
            class="create-collection-point__map-wrapper__current-location-button"
            @click="focusCurrentLocation"
            v-if="!isLoading"
          >
            <img src="@/assets/icons/ic_btn_current_location.svg" />
          </a-btn>
        </div>
      </div>
      <div class="d-flex justify-center gap-20 mt-20 pb-20">
        <a-button
          type="secondary"
          class="create-collection-point__btn-style create-collection-point__cancel-btn"
          :disabled="isSubmitting"
          @click="handleCancel"
          >{{ $t("btn_cancel") }}</a-button
        >
        <a-button
          type="primary"
          class="create-collection-point__btn-style"
          :loading="isSubmitting"
          :disabled="!isAllowSubmit"
          @click="handleSubmit"
          >{{ $t("btn_submit") }}</a-button
        >
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
//#region import
import locationIcon from "@/assets/icons/ic_collection_point.png";
import { i18n } from "@/i18n";
import CustomForm from "@/modules/base/components/CustomForm.vue";
import validator from "@/modules/base/components/validator/validator";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { formData as reactiveFormData } from "@/modules/collection-point-management/models/create-collection-point-form.model";
import { FormData } from "@/modules/staff-management/models/collection-base.model";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import utils from "@/utils";
import { NULL_VALUE_DISPLAY } from "@/utils/constants";
import emitter, { EMITTER_EVENTS } from "@/utils/emiiter";
import { makeUniqueName } from "@/utils/string.helper";
import { message } from "ant-design-vue";
import { Rule } from "ant-design-vue/lib/form";
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch
} from "vue";
//#endregion

//#region props
//#endregion

//#region variables
const formData = reactive<FormData>(reactiveFormData());
const center = ref<number[]>([40, 40]);
const projection = ref<string>("EPSG:4326");
const zoom = ref<number>(14);
const rotation = ref<number>(0);
const view = ref(null);
const map = ref(null);
const geoLocations = ref<number[][]>([]);
const messenger: (
  param: MessengerParamModel
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
) => void = inject("messenger")!;
const createCollectionPointRef = ref();
const isSubmitting = ref<boolean>(false);
const { data } = formData;
const isPostalCodeHasError = ref<boolean>(false);
const customerOptions = ref<{ value: number; label: string }[]>();
const isLoading = ref<boolean>(false);

const isExitsField = ref<string[]>([]);
//#endregion

//#region hooks
onBeforeUnmount(() => {
  clearInputs();
});

onMounted(async () => {
  emitter.on(EMITTER_EVENTS.TOGGLE_SIDE_BAR, () => {
    nextTick(() => {
      setTimeout(() => {
        refreshMap();
      }, 300);
    });
  });

  if (data[4].actionBtn) {
    data[4].actionBtn.name = "search_address";
    data[4].actionBtn.click = handleSearchAddress;
    data[4].actionBtn.disabled = isEnableSearchAddress();
    data[4].class = "input-with-action-btn";
  }
  data[4].id = "create-collection-point_postal-code";
  data[4].rules?.push({
    validator: (rule: Rule, value: string): Promise<void> => {
      if (isPostalCodeHasError.value)
        return Promise.reject(
          i18n.global.t("cannot_find_address_from_field_name", {
            fieldName: i18n.global.t("common_postal_code_label").toLowerCase()
          })
        );

      return validator.validatePostalCodePromise(rule, value);
    },
    trigger: ["blur", "change"]
  });

  data[5].id = "create-collection-point_edt-address";

  data[1].rules?.push({
    validator: (): Promise<void> => {
      if (isExitsField.value.includes("name")) {
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

  data[2].rules?.push({
    validator: (): Promise<void> => {
      if (isExitsField.value.includes("short_name")) {
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

  focusCurrentLocation();
  isLoading.value = true;
  await initialize();
  isLoading.value = false;
});

onUnmounted(() => {
  emitter.off(EMITTER_EVENTS.TOGGLE_SIDE_BAR, () => {
    refreshMap();
  });
});
//#endregion

//#region function
const handleOnDataFocus = (index: number | boolean | Event): void => {
  data[Number(index)].isFocus = true;
};

const handleOnDataBlur = (
  value: number | boolean | Event,
  index: string | number | Event
): void => {
  data[Number(index)].isFocus = false;
};

const clearInputs = (): void => {
  createCollectionPointRef.value.resetFields();
};

const handleCancel = (): void => {
  router.push({ name: routeNames.collectionPointManagement });
  clearInputs();
};

const handleSubmit = async (): Promise<void> => {
  const collectionPoint = {
    customer_id: +data[0].value,
    name: makeUniqueName(data[1].value.toString()) || null,
    short_name: makeUniqueName(data[2].value.toString()) || "",
    name_kana: makeUniqueName(data[3].value.toString()) || "",
    postcode: makeUniqueName(data[4].value.toString()) || null,
    address: makeUniqueName(data[5].value.toString()) || "",
    telephone: makeUniqueName(data[6].value.toString()) || null,
    mail: makeUniqueName(data[7].value.toString()) || null,
    external_code: makeUniqueName(data[8].value.toString()) || "",
    longitude: geoLocations.value.length ? geoLocations.value[0][0] : null,
    latitude: geoLocations.value.length ? geoLocations.value[0][1] : null
  };

  isSubmitting.value = true;
  setBtnActionDisableState(true);
  const { error, errorParams, res } =
    await service.collectionPoint.createCollectionPoint(collectionPoint);
  isSubmitting.value = false;
  setBtnActionDisableState(false);

  if (res && !error) {
    messenger({
      title: "common_msg_create_successfully",
      message: "",
      type: MessengerType.Success,
      callback: (isConfirm: boolean) => {
        isConfirm;
        router.push({
          name: routeNames.collectionPointDetail,
          params: {
            id: res.id
          }
        });
      }
    });
  } else {
    if ((error as string) === "error_unique_constraint") {
      if (errorParams) {
        isExitsField.value = errorParams;
      }
      createCollectionPointRef.value.validate();
    } else {
      messenger({
        title: "popup_create_fail_title",
        message: "",
        type: MessengerType.Error
      });
    }
  }
};

const handleSearchAddress = async (): Promise<void> => {
  setBtnActionDisableState(true);
  data[5].loading = true;
  const { res } = await service.location.isPostalAddressExists(
    makeUniqueName(data[4].value.toString()) || ""
  );
  setBtnActionDisableState(false);

  if (!res) {
    isPostalCodeHasError.value = true;
    data[4].class = "input-with-action-btn postal-code__uniq-warning";
  } else {
    data[5].value = res?.full_address || "";
    await getLatLongFromAddress(res.full_address);
  }
  data[5].loading = false;

  document.getElementById("create-collection-point_postal-code")?.focus();
  document.getElementById("create-collection-point_postal-code")?.blur();
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
    data[5].value = address;
    setTimeout(() => {
      document.getElementById("create-collection-point_edt-address")?.focus();
      document.getElementById("create-collection-point_edt-address")?.blur();
    }, 100);
    if (isPostalCodeHasError.value) {
      isPostalCodeHasError.value = false;
      createCollectionPointRef.value.clearValidate();
    }
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
      `${geoLocations.value[0][1]}, ${geoLocations.value[0][0]}`
    );
    message.success(i18n.global.t("common_msg_copied_to_clipboard"));
  }
};

const setBtnActionDisableState = (state: boolean): void => {
  if (data[4].actionBtn) {
    data[4].actionBtn.disabled = state;
  }
};

const fetchListCustomer = async (): Promise<void> => {
  const res = await service.customerManagement.fetchListCustomer(0, "full");

  if (res && res.results) {
    customerOptions.value = res.results
      .sort(utils.collection.sortByName)
      .map((res) => {
        return {
          value: res.id,
          content: i18n.global.t("customer"),
          label: res.name
        };
      });

    data[0].options = customerOptions.value;
  }
};

const checkMaxLength = (data: string, maxLength: number): boolean => {
  return data.length <= maxLength;
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

const initialize = async (): Promise<void> => {
  await fetchListCustomer();
};

const isEnableSearchAddress = (): boolean => {
  if (data[4]?.actionBtn) {
    if (
      !data[4].value ||
      (data[4].value && isNaN(+data[4].value)) ||
      data[4].value.toString().length > 8
    ) {
      data[4].actionBtn.disabled = true;
      return true;
    }

    data[4].actionBtn.disabled = false;
  }

  return false;
};
//#endregion

//#region computed
const isAllowSubmit = computed(() => {
  const isValidEmail =
    !data[7].value ||
    (data[7].value &&
      // eslint-disable-next-line no-control-regex, no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@([a-z]{1})((?=.*[a-z|_])(?=.*[.])(?!.*\.\.)(?!.*\_\_)(?!.*\.\_)(?!.*\_\.)(?!.*\s).{1,61})([a-z]{1})$/.test(
        data[7].value.toString()
      ));
  const isValidPhoneNumber =
    !data[6].value ||
    (data[6].value &&
      checkMaxLength(data[6].value.toString(), 15) &&
      /^[+]?[0-9]{8,15}$/.test(data[6].value.toString()));
  const isValidName =
    checkMaxLength(data[1].value.toString(), 50) && data[1].value;
  const isValidShortName =
    checkMaxLength(data[2].value.toString(), 50) && data[2].value;
  const isValidPostalCode =
    !data[4].value ||
    (data[4].value &&
      !isNaN(+data[4].value) &&
      data[4].value.toString().length < 9);
  const isValidAddress =
    !data[5].value ||
    (checkMaxLength(data[5].value.toString(), 255) && data[5].value);
  const isValidExternalCode =
    !data[8].value ||
    (data[8].value && checkMaxLength(data[8].value.toString(), 16));

  return (
    data[0].value &&
    isValidName &&
    isValidShortName &&
    isValidPostalCode &&
    isValidAddress &&
    isValidEmail &&
    isValidPhoneNumber &&
    isValidExternalCode
  );
});

const refreshMap = (): void => {
  if (!map.value) return;
  const mapRef = map.value as {
    updateSize: () => void;
  };
  if (mapRef) {
    mapRef.updateSize();
  }
};
//#endregion

//#region reactive
watch(
  () => data[4].value,
  () => {
    isPostalCodeHasError.value = false;
    data[4].class = "input-with-action-btn";
    isEnableSearchAddress();
  }
);
//#endregion
</script>

<style lang="scss" scoped>
.create-collection-point {
  &__content-wrapper {
    background-color: $white;
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
    border-radius: 10px;
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
}

:deep() {
  .postal-code {
    &__uniq-warning {
      border-color: $neutral-100 !important;
      box-shadow: none !important;
    }
  }

  .create-collection-point {
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
}
</style>
