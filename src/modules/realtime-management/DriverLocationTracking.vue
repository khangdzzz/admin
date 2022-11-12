<template>
  <a-spin :spinning="isLoading" :tip="$t('common_loading')">
    <div class="p-30">
      <div class="d-flex justify-space-between align-center mb-20">
        <div class="driver-tracking-location__title">
          {{ $t("realtime_management") }}
        </div>
        <div class="d-flex gap-15">
          <div>
            <CustomSelect
              :options="options"
              v-model:value="refreshTime"
              :disabled="!data.length"
            />
          </div>
          <div>
            <a-button
              type="primary"
              class="driver-tracking-location__refresh-button d-flex align-center gap-10"
              :disabled="!data.length"
              @click="immediatelyRefresh"
            >
              <template #icon>
                <Refresh />
              </template>
              {{ $t("refresh") }}
            </a-button>
          </div>
        </div>
      </div>
      <div class="driver-tracking-location__body d-flex gap-20">
        <div class="driver-tracking-location__table-wrapper fill-height">
          <a-card class="driver-tracking-location__table-card fill-height">
            <div
              class="driver-tracking-location__table-card-title-wrapper d-flex justify-space-between align-center px-15"
            >
              <div class="driver-tracking-location__table-card-title">
                {{ $t("list_of_collection_point") }}
              </div>
              <div
                :class="[
                  'driver-tracking-location__table-card-search-input d-flex align-center',
                  !data.length
                    ? 'driver-tracking-location__table-card-search-input__disabled'
                    : ''
                ]"
                :style="[
                  isSearchBoxExpanded
                    ? 'width: calc(100% - 30px)'
                    : 'width: 40px;',
                  data.length ? 'cursor:pointer;' : ''
                ]"
              >
                <a-input
                  id="searchInput"
                  v-model:value="searchString"
                  @focusout="onSearchUnfocus"
                  @change="onSearchChange"
                >
                  <template #prefix>
                    <div
                      class="d-flex align-center justify-center fill-height"
                      style="width: 40px"
                      @click="data.length ? handleClickExpandSearchBox() : ''"
                    >
                      <MagnifyingGlass />
                    </div>
                  </template>
                  <template #suffix>
                    <a-button
                      shape="circle"
                      class="driver-tracking-location__clear-input-button d-flex align-center justify-center"
                      @click="handleClickClearButton"
                      v-if="searchString"
                    >
                      <template #icon>
                        <CloseIcon color="white" />
                      </template>
                    </a-button>
                  </template>
                </a-input>
              </div>
            </div>
            <div>
              <div
                class="driver-tracking-location__table-container fill-height"
              >
                <a-table
                  :scroll="{ y: calculatedTableScrollHeight }"
                  :columns="listOfCollectionPointColumns"
                  :data-source="data"
                  :pagination="false"
                  :class="
                    !data.length
                      ? 'driver-tracking-location__hide-table-body'
                      : ''
                  "
                  v-if="!isLoading"
                >
                  <template #headerCell="{ column }">
                    <template v-if="column.key === 'name'">
                      <div class="header-title">
                        <span class="header-title">{{ column.title }}</span>
                        <SortView
                          class="mx-12"
                          :sort="sortName"
                          @click="changeSortName"
                        />
                      </div>
                    </template>
                  </template>
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'name'">
                      <div class="driver-tracking-location__href-name">
                        {{ record.name }}
                      </div>
                    </template>
                  </template>
                </a-table>
                <NoData
                  class="driver-tracking-location__no-data"
                  :value="searchString"
                  size="small"
                  :no-action-button="true"
                  v-if="!data.length"
                />
              </div>
            </div>
          </a-card>
        </div>
        <div class="driver-tracking-location__map-wrapper">
          <a-card class="driver-tracking-location__map-card">
            <div
              class="driver-tracking-location__map-title-wrapper d-flex justify-space-between align-center px-15"
            >
              <div class="driver-tracking-location__map-title">
                {{ userName ? userName : $t("user_location") }}
              </div>
              <div class="d-flex align-center gap-30">
                <div class="d-flex gap-30">
                  <div
                    class="d-flex gap-8 align-center justify-center"
                    v-for="(dot, index) in mapDots"
                    :key="dot.title + '' + index"
                  >
                    <div
                      class="driver-tracking-location__active-dot driver-tracking-location__dot-size"
                      :style="`background-color: ${dot.color}`"
                    ></div>
                    <div class="driver-tracking-location__map-status-text">
                      {{ dot.title }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="driver-tracking-location__user-map-info d-flex align-center justify-space-between px-15 gap-30"
            >
              <div>
                <div class="driver-tracking-location__user-info-title">
                  {{ $t("time") }}
                </div>
                <div class="driver-tracking-location__user-info-data">
                  {{ lastUpdateTime }}
                </div>
              </div>
              <div>
                <div class="driver-tracking-location__user-info-title">
                  {{ $t("route") }}
                </div>
                <div class="driver-tracking-location__user-info-data">
                  {{ routeName }}
                </div>
              </div>
              <div>
                <div class="driver-tracking-location__user-info-title">
                  {{ $t("vehicle") }}
                </div>
                <div class="driver-tracking-location__user-info-data">
                  {{ vehicleName }}
                </div>
              </div>
              <div>
                <div class="driver-tracking-location__user-info-title">
                  {{ $t("loading_weight") }}
                </div>
                <div class="driver-tracking-location__user-info-data">
                  {{ loadignWeight }}
                </div>
              </div>
              <div>
                <div class="driver-tracking-location__user-info-title">
                  {{ $t("capacity") }}
                </div>
                <div class="driver-tracking-location__user-info-data">
                  {{ capacity }}
                </div>
              </div>
            </div>
            <div>
              <ol-map
                v-if="calculatedHeightForMap"
                :loadTilesWhileAnimating="true"
                :loadTilesWhileInteracting="true"
                :style="calculatedHeightForMap"
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
                <ol-overlay
                  v-for="(geoLocation, index) in geoLocations"
                  :key="index"
                  :position="[geoLocation.longitude, geoLocation.latitude]"
                >
                  <template v-slot="slotProps">
                    <div
                      v-if="slotProps"
                      class="driver-tracking-location__user-location-pin"
                    >
                      <div>
                        <img
                          class="driver-tracking-location__user-location-pin__icon"
                          :src="geoLocation.icon"
                        />
                      </div>
                      <div
                        class="driver-tracking-location__user-name-icon"
                        :style="`color: ${geoLocation.color};`"
                      >
                        {{ geoLocation.title }}
                      </div>
                    </div>
                  </template>
                </ol-overlay>

                <!-- list collection point -->
                <ol-geolocation
                  :projection="projection"
                  v-for="(trackPoint, index) in userTrackingData"
                  :key="index"
                >
                  <template v-slot>
                    <ol-vector-layer :zIndex="2">
                      <ol-source-vector>
                        <ol-feature ref="positionFeature">
                          <ol-geom-point
                            :coordinates="trackPoint"
                          ></ol-geom-point>
                          <ol-style>
                            <ol-style-circle :radius="4">
                              <ol-style-fill color="#F54E4E"></ol-style-fill>
                              <ol-style-stroke
                                color="transparent"
                                :width="0"
                              ></ol-style-stroke>
                            </ol-style-circle>
                          </ol-style>
                        </ol-feature>
                      </ol-source-vector>
                    </ol-vector-layer>
                  </template>
                </ol-geolocation>

                <ol-vector-layer>
                  <ol-source-vector>
                    <ol-feature>
                      <ol-geom-line-string :coordinates="currentRoute">
                      </ol-geom-line-string>
                      <ol-style>
                        <ol-style-stroke
                          :color="'#82A6FF'"
                          :width="4"
                        ></ol-style-stroke>
                      </ol-style>
                    </ol-feature>
                  </ol-source-vector>
                </ol-vector-layer>
              </ol-map>
            </div>
          </a-card>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
//#region import
import CloseIcon from "@/assets/icons/IcCloseIcon.vue";
import MagnifyingGlass from "@/assets/icons/IcMagnifyingGlass.vue";
import Refresh from "@/assets/icons/IcRefresh.vue";
import driverIcon from "@/assets/icons/ic_driver.svg";
import startPointLocation from "@/assets/icons/ic_start_point_location.svg";
import endPointLocation from "@/assets/icons/ic_end_point_location.svg";
import icColectedCollectionPoint from "@/assets/icons/ic_route_collected_collection_point.svg";
import icCollectionPoint from "@/assets/icons/ic_route_collection_point.svg";
import { i18n } from "@/i18n";
import NoData from "@/modules/base/components/NoData.vue";
import CustomSelect from "@/modules/common/components/CustomSelect.vue";
import SortView from "@/modules/common/components/SortView.vue";
import { listOfCollectionPointColumns } from "@/modules/realtime-management/models/table-columns";
import { router } from "@/routes";
import { service } from "@/services";
import { format } from "date-fns";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch
} from "vue";
import { Sort } from "../common/models/sort.enum";
//#endregion

//#region props
//#endregion

//#region variables
const options = ref([
  { value: 0, label: i18n.global.t("no_refresh") },
  { value: 1, label: i18n.global.t("number_minute", { number: 1 }) },
  { value: 2, label: i18n.global.t("number_minute", { number: 2 }) },
  { value: 3, label: i18n.global.t("number_minute", { number: 3 }) }
]);
const refreshTime = ref(0);
const isSearchBoxExpanded = ref(false);
const searchString = ref("");
const isLoading = ref(false);
const pageOption = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 1
});
const data = ref<{ name: string; id: number }[]>([]);
let backupData: { name: string; id: number }[] = [];
const geoLocations = ref<
  {
    id: number;
    title: string;
    latitude: number;
    longitude: number;
    icon: string;
    color: string;
  }[]
>([]);
const userTrackingData = ref<number[][]>([]);
const vehicleName = ref<string>("");
const routeName = ref<string>("");
const capacity = ref<string>("");
const loadignWeight = ref<string>("");
const userName = ref<string>("");
const lastUpdateTime = ref<string>("");
const center = ref<number[]>([40, 40]);
const projection = ref<string>("EPSG:4326");
const zoom = ref<number>(14);
const rotation = ref<number>(0);
const innerHeight = ref<number>(0);
const view = ref(null);
const map = ref(null);
const mapDots = ref<
  {
    title: string;
    color: string;
  }[]
>([]);
const currentRoute = ref<number[][]>([]);
const sortName = ref<Sort>(Sort.None);
const interval = ref();
const userId = +router.currentRoute.value.params.id;
//#endregion

//#region hooks
onBeforeUnmount(() => {
  clearInterval(interval.value);
});

onMounted(() => {
  innerHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
  });

  fetchUserTrackingDetail(userId);
});
//#endregion

//#region function
const generateMapDots = (): void => {
  mapDots.value = [
    {
      title: i18n.global.t("current_location"),
      color: "#2f6bff"
    },
    {
      title: i18n.global.t("on_going_collection_point"),
      color: "#07A0B8"
    },
    {
      title: i18n.global.t("collected_collection_point"),
      color: "#999999"
    }
  ];
};

const handleClickExpandSearchBox = (): void => {
  if (!isSearchBoxExpanded.value) {
    isSearchBoxExpanded.value = true;
    document.getElementById("searchInput")?.focus();
  }
};

const handleClickClearButton = (): void => {
  searchString.value = "";
  isSearchBoxExpanded.value = false;
  onSearchChange();
};

const onSearchUnfocus = (): void => {
  if (!searchString.value) isSearchBoxExpanded.value = false;
};

const fetchUserTrackingDetail = async (userId: number): Promise<void> => {
  isLoading.value = true;
  const history = await service.location.getUserLocationDetail(userId);
  isLoading.value = false;
  if (!history) {
    return;
  }
  currentRoute.value = (history.collectRoute.listCoordinates || []).map(
    (coordinate) => [coordinate[1], coordinate[0]]
  );
  userTrackingData.value = history.history.map((h) => {
    return [h.longitude, h.latitude];
  });
  vehicleName.value = history.vehicleName;
  routeName.value = history.routeName;
  capacity.value = `${history.maxWeight || 0} kg`;
  loadignWeight.value = `${history.loadingWeight || 0} kg`;
  lastUpdateTime.value = format(Date.now(), "yyyy/MM/dd hh:mm:ss");
  userName.value = history.userName;
  backupData = history.collectOrder.collectPoints.map((cp) => {
    const { name, id } = cp;
    return { name, id };
  });
  data.value = [...backupData];

  const defaultGeos = [
    {
      id: 0,
      icon: driverIcon,
      title: history.userName,
      latitude: history.currentLat,
      longitude: history.currentLong,
      color: "#2F6BFF"
    }
  ];
  if (history.collectRoute.startPoint) {
    defaultGeos.push({
      id: 1,
      icon: startPointLocation,
      title: "",
      latitude: history.collectRoute.startPoint[0],
      longitude: history.collectRoute.startPoint[1],
      color: "#F54E4E"
    });
  }
  if (history.collectRoute.endPoint) {
    defaultGeos.push({
      id: 1,
      icon: endPointLocation,
      title: "",
      latitude: history.collectRoute.endPoint[0],
      longitude: history.collectRoute.endPoint[1],
      color: "#F54E4E"
    });
  }

  geoLocations.value = [
    ...defaultGeos,
    ...history.collectOrder.collectPoints.map((cp) => {
      const { id, name: title, latitude, longitude } = cp;
      return {
        id,
        title,
        latitude,
        longitude,
        icon: cp.isCollected ? icColectedCollectionPoint : icCollectionPoint,
        color: cp.isCollected ? "#999999" : "#07A0B8"
      };
    })
  ];
  setTimeout(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (view?.value as any)?.fit(
      [
        history.currentLong,
        history.currentLat,
        history.currentLong,
        history.currentLat
      ],
      {
        maxZoom: 14
      }
    );
  }, 100);
};

const onSearchChange = (): void => {
  const searchResult = [
    ...backupData.filter(
      (dt) =>
        !searchString.value ||
        dt.name.toLowerCase().includes(searchString.value.toLowerCase())
    )
  ];
  switch (sortName.value) {
    case Sort.Asc:
      data.value = searchResult.sort();
      break;

    case Sort.Desc:
      data.value = searchResult.sort().reverse();
      break;

    default:
      data.value = searchResult;
      break;
  }
};

const changeSortName = (): void => {
  const backupSortName = sortName.value;
  sortName.value = calculateNextSortStatus(backupSortName);
};

const calculateNextSortStatus = (currentSort: Sort): Sort => {
  switch (currentSort) {
    case Sort.Asc:
      return Sort.Desc;
    case Sort.Desc:
      return Sort.None;
    default:
      return Sort.Asc;
  }
};

const immediatelyRefresh = async (): Promise<void> => {
  await fetchUserTrackingDetail(+userId);
};
//#endregion

//#region computed
const calculatedTableScrollHeight = computed(() => {
  const pageTitleAndPadding = 128;
  const tableHeader = 58;
  const tablePagination = data.value.length > pageOption.pageSize ? 60 : 0;
  const tableWrapperTitle = 60;

  return (
    innerHeight.value -
    pageTitleAndPadding -
    tableHeader -
    tablePagination -
    tableWrapperTitle
  );
});

const calculatedHeightForMap = computed((): string | undefined => {
  const pageTitleAndPadding = 128;
  const tableWrapperTitle = 60;
  const userInfoWrapper = userName.value ? 72 : 0;
  const total =
    innerHeight.value -
    pageTitleAndPadding -
    tableWrapperTitle -
    userInfoWrapper;

  if (total > 0) {
    return `height: ${total}px`;
  }

  return undefined;
});
//#endregion

//#region reactive
watch(
  () => userName.value,
  () => {
    generateMapDots();
  }
);

watch(
  () => sortName.value,
  () => {
    switch (sortName.value) {
      case Sort.Asc:
        data.value.sort();
        break;

      case Sort.Desc:
        data.value.sort().reverse();
        break;

      default:
        data.value = [...backupData];
    }
  }
);

watch(refreshTime, () => {
  if (refreshTime.value) {
    interval.value = setInterval(async () => {
      isLoading.value = true;
      await fetchUserTrackingDetail(+userId);
      isLoading.value = false;
    }, refreshTime.value * 60 * 1000);
  }
});
//#endregion
</script>

<style lang="scss" scoped>
.driver-tracking-location {
  &__title {
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 36px;
    color: $neutral-600;
  }

  &__refresh-option {
    height: 48px;
    width: 240px;
  }

  &__refresh-button {
    height: 48px;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 18px;
    color: $white;
  }

  &__table-wrapper {
    width: 450px;
  }

  &__body {
    height: calc(100vh - 128px);
  }

  &__table-card {
    position: relative;
    border: none !important;
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02) !important;
    border-radius: 10px !important;
  }

  &__table-card-title-wrapper {
    border-bottom: 1px solid $grey-3;
    height: 60px;
  }

  &__table-card-title {
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    color: $neutral-600;
  }

  &__table-card-search-input {
    position: absolute;
    right: 15px;
    top: 10px;
    transition: width 300ms ease-out;
    height: 40px;

    &__disabled {
      .ant-input-affix-wrapper {
        padding: 0 8px 0 0 !important;
        height: 100%;
        border-radius: 6px;
        border: 1px solid $neutral-200;
        overflow: hidden;

        &:hover {
          border-color: $neutral-200 !important;
        }
      }
    }

    .ant-input-affix-wrapper {
      padding: 0 8px 0 0 !important;
      height: 100%;
      border-radius: 6px;
      border: 1px solid $neutral-200;
      overflow: hidden;

      &:hover {
        border-color: #27b5c4;
      }
    }

    .ant-input-affix-wrapper-focused {
      box-shadow: 0 0 0 2px rgb(7 160 184 / 20%) !important;
      border-color: #27b5c4;
    }
  }

  &__clear-input-button {
    min-width: 0 !important;
    height: 20px;
    width: 20px;
    background-color: $neutral-400;

    &:hover {
      background-color: #27b5c4;
    }
  }

  &__map-wrapper {
    flex-grow: 1;
  }

  &__map-title-wrapper {
    height: 60px;
  }

  &__map-title {
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    color: $neutral-600;
  }

  &__user-map-info {
    height: 72px;
    border-top: 1px solid $grey-3;
    border-bottom: 1px solid $grey-3;
    max-width: 100%;
    overflow: auto;
  }

  &__user-info-title {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: $neutral-400;
  }

  &__user-info-data {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: $neutral-600;

    &:nth-child(2) {
      max-width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  &__dot-size {
    width: 16px;
    height: 16px;
    border-radius: 50px;
  }

  &__map-status-text {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: $neutral-600;
  }

  &__floating-selector {
    width: 240px;
    height: 40px;
  }

  &__href-name {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: $neutral-800;
  }
}

.user-enable-status {
  width: 38px;
  height: 20px;
  background-color: $primary;
  border-radius: 10px;
  padding: 2px;
  position: relative;
  cursor: pointer;
  .indicator {
    position: absolute;
    width: 16px;
    height: 16px;
    right: 2px;
    border-radius: 8px;
    background-color: white;
  }
}

.user-enable-status-disabled {
  width: 38px;
  height: 20px;
  background-color: $neutral-200;
  border-radius: 10px;
  padding: 2px;
  position: relative;
  cursor: pointer;
  .indicator {
    position: absolute;
    width: 16px;
    height: 16px;
    left: 2px;
    border-radius: 8px;
    background-color: white;
  }
}

:deep() {
  .driver-tracking-location__user-location-pin {
    position: relative;
    &__icon {
      position: absolute !important;
      left: -25px !important;
      top: -25px !important;
    }
  }

  .driver-tracking-location {
    &__refresh-option {
      .ant-select-selector {
        height: 48px !important;
        border: 1px solid $neutral-200;
        border-radius: 10px;

        .ant-select-selection-item {
          display: flex;
          align-items: center;
        }
      }
    }

    &__table-card {
      .ant-card-body {
        padding: 0 !important;
      }
    }

    &__clear-input-button {
      circle {
        fill: inherit !important;
      }
    }

    &__table-card-search-input {
      .ant-input {
        margin-left: -10px !important;
      }
    }

    &__table-container {
      .ant-table-body {
        overflow-x: hidden !important;
      }
    }

    &__map-card {
      border: none !important;
      box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02) !important;
      border-radius: 10px !important;
      .ant-card-body {
        padding: 0 !important;
      }
    }
  }
}
</style>

<style lang="scss">
.driver-tracking-location {
  &__refresh-option-wrapper {
    padding: 0 !important;

    .ant-select-item {
      height: 48px;
      &:not(:nth-last-child(1), :nth-last-child(2)) {
        border-bottom: 1px solid $neutral-100;
      }

      &:last-child {
        height: 60px !important;
      }
    }
  }

  &__map-wrapper {
    canvas {
      width: 100% !important;
    }
  }

  &__hide-table-body {
    .ant-table-placeholder {
      display: none !important;
    }
  }

  &__no-data {
    height: calc(100vh - 246px) !important;
  }

  &__user-name-icon {
    position: absolute !important;
    left: 50% !important;
    top: -45px !important;
    right: 0 !important;
    min-width: max-content;
    transform: translateX(-50%);

    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: $blue-500;
    text-shadow: 2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff, 1px 1px #fff,
      -1px -1px #fff, 1px -1px #fff, -1px 1px #fff;
  }
}
</style>
