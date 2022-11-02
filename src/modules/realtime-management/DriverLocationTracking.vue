<template>
  <a-spin :spinning="isLoading" :tip="$t('common_loading')">
    <div class="p-30">
      <div class="d-flex justify-space-between align-center mb-20">
        <div class="realtime-manage__title">
          {{ $t("realtime_management") }}
        </div>
        <div class="d-flex gap-15">
          <div>
            <CustomSelect :options="options" v-model:value="refreshTime" />
          </div>
          <div>
            <a-button
              type="primary"
              class="realtime-manage__refresh-button d-flex align-center gap-10"
            >
              <template #icon><Refresh /></template>
              {{ $t("refresh") }}
            </a-button>
          </div>
        </div>
      </div>
      <div class="realtime-manage__body d-flex gap-20">
        <div class="realtime-manage__table-wrapper fill-height">
          <a-card class="realtime-manage__table-card fill-height">
            <div
              class="realtime-manage__table-card-title-wrapper d-flex justify-space-between align-center px-15"
            >
              <div class="realtime-manage__table-card-title">
                {{
                  selectedUser?.userName
                    ? $t("list_of_collection_point")
                    : $t("list_of_user")
                }}
              </div>

              <div
                class="realtime-manage__table-card-search-input d-flex align-center"
                :style="
                  isSearchBoxExpanded
                    ? 'width: calc(100% - 30px)'
                    : 'width: 40px; cursor:pointer;'
                "
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
                      @click="handleClickExpandSearchBox()"
                    >
                      <MagnifyingGlass />
                    </div>
                  </template>
                  <template #suffix>
                    <a-button
                      shape="circle"
                      class="realtime-manage__clear-input-button d-flex align-center justify-center"
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
              <div class="realtime-manage__table-container fill-height">
                <a-table
                  :scroll="{ y: calculatedTableScrollHeight }"
                  :columns="listOfUserColumns"
                  :data-source="data"
                  :pagination="false"
                  v-if="!isLoading"
                >
                  <template #headerCell="{ column }">
                    <template v-if="column.key === 'userName'">
                      <div class="header-title">
                        <span class="header-title">{{ column.title }}</span>
                      </div>
                    </template>

                    <template v-if="column.key === 'lastUpdateTime'">
                      <div class="header-title">
                        <span class="header-title">{{ column.title }}</span>
                      </div>
                    </template>

                    <template v-if="column.key === 'name'">
                      <div class="header-title">
                        <span class="header-title">{{ column.title }}</span>
                      </div>
                    </template>
                  </template>
                  <template #bodyCell="{ column, record, text }">
                    <template v-if="column.key === 'action'">
                      <div
                        :class="
                          !record.isVisible
                            ? 'user-enable-status-disabled'
                            : 'user-enable-status'
                        "
                        @click="
                          changeUserVisibleState(
                            record.userId,
                            record.isVisible
                          )
                        "
                      >
                        <div class="indicator"></div>
                      </div>
                    </template>
                    <template v-if="column.key === 'lastUpdateTime'">
                      <div>
                        {{ formatDateTime(text, "yyyy/MM/dd hh:mm:ss") }}
                      </div>
                    </template>
                  </template>
                </a-table>
                <ThePagination
                  :isShowPagination="
                    !isLoading && data.length > pageOption.pageSize
                  "
                  :currentPage="pageOption.currentPage"
                  :pageSize="pageOption.pageSize"
                  :total="pageOption.total"
                  :isShowPrevBtn="isShowPrevBtn()"
                  :isShowNextBtn="isShowNextBtn()"
                  @onShowSizeChange="onShowSizeChange"
                  @onChange="onChange"
                />
                <NoData
                  :value="searchString"
                  :is-loading="isLoading"
                  @onClick="handleBackToList"
                  v-if="isLoading"
                />
              </div>
            </div>
          </a-card>
        </div>
        <div class="realtime-manage__map-wrapper">
          <a-card class="realtime-manage__map-card">
            <div
              class="realtime-manage__map-title-wrapper d-flex justify-space-between align-center px-15"
            >
              <div class="realtime-manage__map-title" @click="handleChangeUser">
                {{
                  selectedUser && selectedUser.userName
                    ? selectedUser.userName
                    : $t("user_location")
                }}
              </div>
              <div class="d-flex align-center gap-30">
                <div class="d-flex gap-30">
                  <div
                    class="d-flex gap-8"
                    v-for="(dot, index) in mapDots"
                    :key="dot.title + '' + index"
                  >
                    <div
                      class="realtime-manage__active-dot realtime-manage__dot-size"
                      :style="`background-color: ${dot.color}`"
                    ></div>
                    <div class="realtime-manage__map-status-text">
                      {{ dot.title }}
                    </div>
                  </div>
                </div>
                <div
                  class="realtime-manage__floating-selector"
                  v-if="!selectedUser?.userName"
                >
                  <FloatingLabelSelect
                    place-holder="staff_workplace"
                    label="staff_workplace"
                    :required="false"
                    control-name="workPlace"
                    :options="listCollectionBase"
                    :no-label="true"
                    size="small"
                    v-model:value="selectedCollectionBase"
                  >
                  </FloatingLabelSelect>
                </div>
              </div>
            </div>
            <div
              class="realtime-manage__user-map-info d-flex align-center justify-space-between px-15 gap-30"
              v-if="selectedUser?.userName"
            >
              <div>
                <div class="realtime-manage__user-info-title">
                  {{ $t("time") }}
                </div>
                <div class="realtime-manage__user-info-data">
                  2022/10/02 14:30:12
                </div>
              </div>
              <div>
                <div class="realtime-manage__user-info-title">
                  {{ $t("route") }}
                </div>
                <div class="realtime-manage__user-info-data">Shibuya</div>
              </div>
              <div>
                <div class="realtime-manage__user-info-title">
                  {{ $t("vehicle") }}
                </div>
                <div class="realtime-manage__user-info-data">
                  Kagoshima 100Ah 33-66
                </div>
              </div>
              <div>
                <div class="realtime-manage__user-info-title">
                  {{ $t("loading_weight") }}
                </div>
                <div class="realtime-manage__user-info-data">100 kg</div>
              </div>
              <div>
                <div class="realtime-manage__user-info-title">
                  {{ $t("capacity") }}
                </div>
                <div class="realtime-manage__user-info-data">500 kg</div>
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

                <!-- list collection point -->
                <ol-geolocation
                  :projection="projection"
                  v-for="(geoLocation, index) in collectionPointLocations"
                  :key="index"
                >
                  <template v-slot>
                    <ol-vector-layer :zIndex="2">
                      <ol-source-vector>
                        <ol-feature ref="positionFeature">
                          <ol-geom-point
                            :coordinates="[
                              geoLocation.longitude,
                              geoLocation.latitude
                            ]"
                          ></ol-geom-point>
                          <ol-style>
                            <ol-style-icon
                              :src="collectionPoint"
                              :scale="1"
                            ></ol-style-icon>
                          </ol-style>
                        </ol-feature>
                      </ol-source-vector>
                    </ol-vector-layer>
                  </template>
                </ol-geolocation>
                <!-- list driver -->
                <ol-overlay
                  v-for="(geoLocation, index) in driverLocations"
                  :key="index"
                  :position="[geoLocation.longitude, geoLocation.latitude]"
                >
                  <template v-slot="slotProps">
                    <div
                      v-if="slotProps"
                      class="realtime-management__user-location-pin"
                      @click="selectUser(geoLocation.userId)"
                    >
                      <img
                        class="realtime-management__user-location-pin__icon"
                        :src="geoLocation.icon"
                      />
                    </div>
                  </template>
                </ol-overlay>

                <!-- route -->
                <ol-vector-layer>
                  <ol-source-vector>
                    <ol-feature>
                      <ol-geom-line-string
                        :coordinates="currentRoute"
                      ></ol-geom-line-string>
                      <ol-style>
                        <ol-style-stroke
                          :color="'red'"
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
import FloatingLabelSelect from "@/modules/base/components/FloatingLabelSelect.vue";
import NoData from "@/modules/base/components/NoData.vue";
import CustomSelect from "@/modules/common/components/CustomSelect.vue";
import ThePagination from "@/modules/common/components/ThePagination.vue";
import driverIcon from "@/assets/icons/ic_driver.svg";
import collectionPoint from "@/assets/icons/ic_route_collection_point.svg";
import { i18n } from "@/i18n";
import { listOfUserColumns } from "@/modules/realtime-management/models/table-columns";
import { service } from "@/services";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { formatDateTime } from "../base/components/validator/dateFormat";
import { CurrentUserLocationModel } from "./models/current-user-location.model";
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
const data = ref<CurrentUserLocationModel[]>([]);
let backupData: CurrentUserLocationModel[] = [];
const selectedUser = ref<CurrentUserLocationModel | undefined>(undefined);
const center = ref<number[]>([40, 40]);
const projection = ref<string>("EPSG:4326");
const zoom = ref<number>(14);
const rotation = ref<number>(0);
const innerHeight = ref<number>(0);
const view = ref(null);
const map = ref(null);

const selectedCollectionBase = ref("");
const listCollectionBase = ref<any[]>([]);
const mapDots = ref<any[]>([]);
const driverLocations = ref<
  { icon: string; latitude: number; longitude: number; userId: number }[]
>([]);

const collectionPointLocations = ref<
  {
    name: string;
    latitude: number;
    longitude: number;
    icon: string;
  }[]
>([]);

const currentRoute = ref<number[][]>([]);

//#endregion

//#region hooks
onMounted(() => {
  innerHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
  });

  initialize();
});
//#endregion

//#region function
const initialize = async (): Promise<void> => {
  isLoading.value = true;
  data.value = await service.location.getListCurrentUserLocations();
  isLoading.value = false;
  backupData = [...data.value];

  driverLocations.value = data.value.map((currentUserLocation) => {
    return {
      icon: driverIcon,
      latitude: currentUserLocation.latitude,
      longitude: currentUserLocation.longitude,
      userId: currentUserLocation.userId
    };
  });

  if (driverLocations.value.length) {
    const { longitude, latitude } = driverLocations.value[0];
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (view?.value as any)?.fit([longitude, latitude, longitude, latitude], {
        maxZoom: 14
      });
    }, 100);
  }
};

const generateMapDots = (): void => {
  if (selectedUser.value?.userName) {
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
  } else {
    mapDots.value = [
      {
        title: i18n.global.t("status_active"),
        color: "#2f6bff"
      },
      {
        title: "Inactive more than 1 hour",
        color: "#999999"
      }
    ];
  }
};

const handleChangeUser = (): void => {
  // if (selectedUser.value?.userName) {
  //   selectedUser.value.userName = "";
  // } else {
  //   selectedUser.value?.userName = "User B";
  // }
};

const handleClickExpandSearchBox = (): void => {
  if (!isSearchBoxExpanded.value) {
    isSearchBoxExpanded.value = true;
    document.getElementById("searchInput")?.focus();
  }
};

const handleClickClearButton = (): void => {
  searchString.value = "";
  onSearchChange();
};

const handleBackToList = (): void => {
  if (searchString.value) {
    isLoading.value = true;
    searchString.value = "";
  }
};

const isShowPrevBtn = (): boolean => {
  const isFirtPage = pageOption.currentPage === 1;
  if (totalPages() === 1 || isFirtPage) return false;
  return true;
};

const isShowNextBtn = (): boolean => {
  const isLastPage =
    pageOption.currentPage ===
    Math.ceil(Number(pageOption.total) / Number(pageOption?.pageSize));
  if (totalPages() === 1 || isLastPage) return false;
  return true;
};

const totalPages = (): number => {
  return Math.ceil(Number(pageOption.total) / Number(pageOption.pageSize));
};

const onShowSizeChange = (current: number, pageSize: number): void => {
  pageOption.currentPage = current;
  pageOption.pageSize = pageSize;
};

const onChange = (pageNumber: number): void => {
  pageOption.currentPage = pageNumber;
};

const onSearchUnfocus = (): void => {
  if (!searchString.value) isSearchBoxExpanded.value = false;
};

const selectUser = async (userId: number): Promise<void> => {
  selectedUser.value = data.value.find((user) => user.userId === userId);
  if (selectedUser.value) {
    driverLocations.value = driverLocations.value.filter(
      (user) => user.userId === userId
    );
  }
  data.value.forEach((user) => (user.isVisible = user.userId === userId));
  isLoading.value = true;
  const history = await service.location.getUserLocationDetail(25);
  isLoading.value = false;
  if (!history) {
    return;
  }
  // collectionPointLocations.value = history.collectOrder.collectPoints;
  currentRoute.value = (history.collectRoute.listCoordinates || []).map(
    (coordinate) => [coordinate[1], coordinate[0]]
  );
};

const changeUserVisibleState = (
  userId: number,
  currentStatus: boolean
): void => {
  backupData.forEach((user) => {
    if (user.userId === userId) {
      user.isVisible = !currentStatus;
    }
  });

  data.value.forEach((user) => {
    if (user.userId === userId) {
      user.isVisible = !currentStatus;
    }
  });

  driverLocations.value = data.value
    .filter((userLocation) => userLocation.isVisible)
    .map((currentUserLocation) => {
      return {
        icon: driverIcon,
        latitude: currentUserLocation.latitude,
        longitude: currentUserLocation.longitude,
        userId: currentUserLocation.userId
      };
    });
};

const onSearchChange = (): void => {
  if (!searchString.value) {
    data.value = [...backupData];
  } else {
    data.value = [
      ...backupData.filter((user) =>
        user.userName.toLowerCase().includes(searchString.value.toLowerCase())
      )
    ];
  }

  driverLocations.value = data.value
    .filter((userLocation) => userLocation.isVisible)
    .map((currentUserLocation) => {
      return {
        icon: driverIcon,
        latitude: currentUserLocation.latitude,
        longitude: currentUserLocation.longitude,
        userId: currentUserLocation.userId
      };
    });
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
  const userInfoWrapper = selectedUser.value?.userName ? 72 : 0;
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
  () => selectedUser.value?.userName,
  () => {
    generateMapDots();
  }
);
//#endregion
</script>

<style lang="scss" scoped>
.realtime-manage {
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
  }

  &__table-card-title-wrapper {
    border-bottom: 1px solid $neutral-200;
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
    border-radius: 10px;

    .ant-input-affix-wrapper {
      padding: 0 8px 0 0 !important;
      height: 100%;
      border-radius: 10px;
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
    border-top: 1px solid $neutral-100;
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
  .realtime-management__user-location-pin {
    position: relative;
    &__icon {
      position: absolute !important;
      left: -25px !important;
      top: -25px !important;
    }
  }

  .realtime-manage {
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
      .ant-card-body {
        padding: 0 !important;
      }
    }
  }
}
</style>

<style lang="scss">
.realtime-manage {
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
}
</style>
