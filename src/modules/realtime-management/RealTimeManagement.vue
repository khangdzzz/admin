<template>
  <a-spin :spinning="isLoading" :tip="$t('common_loading')">
    <div class="p-30">
      <div class="d-flex justify-space-between align-center mb-20">
        <div class="realtime-manage__title">
          {{ $t("realtime_management") }}
        </div>
        <div class="d-flex gap-15">
          <div>
            <CustomSelect
              :options="options"
              v-model:value="refreshTime"
              :disabled="!selectedCollectionBase"
            />
          </div>
          <div>
            <a-button
              type="primary"
              class="realtime-manage__refresh-button d-flex align-center gap-10"
              :disabled="!selectedCollectionBase"
              @click="onRefreshImmediately"
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
                {{ $t("list_of_user") }}
              </div>

              <div
                :class="[
                  'realtime-manage__table-card-search-input d-flex align-center',
                  !data.length
                    ? 'realtime-manage__table-card-search-input__disabled'
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
                      @click="!data.length ? '' : handleClickExpandSearchBox()"
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
            <div class="realtime-manage__table-container fill-height">
              <a-table
                :scroll="{ y: calculatedTableScrollHeight }"
                :columns="listOfUserColumns"
                :data-source="data"
                :pagination="false"
                :class="!data.length ? 'realtime-manage__hide-table-body' : ''"
                v-if="!isLoading"
              >
                <template #headerCell="{ column }">
                  <template v-if="column.key === 'userName'">
                    <div class="header-title">
                      <span class="header-title">{{ column.title }}</span>
                      <SortView
                        class="mx-12"
                        :sort="sortUsername"
                        @click="changeSortUsername"
                      />
                    </div>
                  </template>

                  <template v-if="column.key === 'lastUpdateTime'">
                    <div class="header-title">
                      <span class="header-title">{{ column.title }}</span>
                      <SortView
                        class="mx-12"
                        :sort="sortLastActiveTime"
                        @click="changeSortLastActiveTime"
                      />
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
                        changeUserVisibleState(record.userId, record.isVisible)
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
                  <template v-if="column.key === 'name'">
                    <a
                      :href="`${userTrackingPath}/${record.id}`"
                      target="blank"
                      class="realtime-manage__href-name"
                      >{{ record.name }}</a
                    >
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
                class="realtime-manage__no-data"
                :value="searchString"
                size="small"
                :no-action-button="true"
                v-if="!data.length"
              />
            </div>
          </a-card>
        </div>
        <div class="realtime-manage__map-wrapper">
          <a-card class="realtime-manage__map-card">
            <div
              class="realtime-manage__map-disable-layout d-flex align-center justify-center"
              :style="calculatedHeightForMap"
              v-if="!selectedCollectionBase"
            >
              {{ $t("please_select_workplace") }}
            </div>
            <div
              class="realtime-manage__map-title-wrapper d-flex justify-space-between align-center px-15"
            >
              <div class="realtime-manage__map-title">
                {{ $t("user_location") }}
              </div>
              <div class="d-flex align-center gap-30">
                <div class="realtime-manage__floating-selector">
                  <FloatingLabelSelect
                    place-holder="staff_workplace"
                    label="staff_workplace"
                    :required="false"
                    control-name="workPlace"
                    :options="listCollectionBase"
                    :no-label="true"
                    :placeholder="$t('workplace')"
                    size="small"
                    v-model:value="selectedCollectionBase"
                  >
                  </FloatingLabelSelect>
                </div>
              </div>
            </div>

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
            </ol-map>
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
import { i18n } from "@/i18n";
import FloatingLabelSelect from "@/modules/base/components/FloatingLabelSelect.vue";
import NoData from "@/modules/base/components/NoData.vue";
import CustomSelect from "@/modules/common/components/CustomSelect.vue";
import ThePagination from "@/modules/common/components/ThePagination.vue";
import SortView from "@/modules/common/components/SortView.vue";
import { listOfUserColumns } from "@/modules/realtime-management/models/table-columns";
import { router } from "@/routes";
import { service } from "@/services";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch
} from "vue";
import { formatDateTime } from "../base/components/validator/dateFormat";
import { Sort } from "../common/models/sort.enum";
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

const selectedCollectionBase = ref();
const listCollectionBase = ref<{ value: number | undefined; label: string }[]>(
  []
);
const driverLocations = ref<
  { icon: string; latitude: number; longitude: number; userId: number }[]
>([]);

const currentRoute = ref<number[][]>([]);
const interval = ref();
const sortUsername = ref(Sort.None);
const sortLastActiveTime = ref(Sort.None);

//#endregion

//#region hooks
onMounted(() => {
  innerHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
  });

  initialize();
});

onBeforeUnmount(() => {
  clearInterval(interval.value);
});
//#endregion

//#region function
const initialize = async (): Promise<void> => {
  isLoading.value = true;
  await fetchCollectionBase();
  isLoading.value = false;
};

const fetchCollectionBase = async (): Promise<void> => {
  const res = await service.collectionRoute.getWorkplace();
  if (res) {
    listCollectionBase.value = (res || []).map((collectionBase) => {
      const { name, id } = collectionBase;
      return {
        value: id,
        label: name
      };
    });
  }
};

const fetchWorkplaceTrackingInformation = async (): Promise<void> => {
  isLoading.value = true;
  data.value = await service.location.getListCurrentUserLocations(
    selectedCollectionBase.value
  );
  await fetchCollectionBase();
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

const onRefreshImmediately = async (): Promise<void> => {
  isLoading.value = true;
  await fetchWorkplaceTrackingInformation();
  isLoading.value = false;
};

const resetSort = (): void => {
  sortUsername.value = Sort.None;
  sortLastActiveTime.value = Sort.None;
};

const changeSortUsername = (): void => {
  const backupSortUsername = sortUsername.value;
  resetSort();
  sortUsername.value = calculateNextSortStatus(backupSortUsername);
  initialize();
};

const changeSortLastActiveTime = (): void => {
  const backupSortLastActiveTime = sortLastActiveTime.value;
  resetSort();
  sortLastActiveTime.value = calculateNextSortStatus(backupSortLastActiveTime);
  initialize();
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

const userTrackingPath = computed((): string => {
  const rootPath = router.currentRoute.value.fullPath.replace(
    router.currentRoute.value.path,
    ""
  );
  return `${rootPath}/driver-location-tracking`;
});

//#endregion

//#region reactive
watch(selectedCollectionBase, async () => {
  if (selectedCollectionBase.value) {
    isLoading.value = true;
    await fetchWorkplaceTrackingInformation();
    isLoading.value = false;
  }
});

watch(refreshTime, () => {
  if (refreshTime.value) {
    interval.value = setInterval(async () => {
      isLoading.value = true;
      await fetchWorkplaceTrackingInformation();
      isLoading.value = false;
    }, refreshTime.value * 60 * 1000);
  }
});
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
    border: none !important;
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02) !important;
    border-radius: 10px !important;
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

    &__disabled {
      .ant-input-affix-wrapper {
        padding: 0 8px 0 0 !important;
        height: 100%;
        border-radius: 10px;
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
  .realtime-management__user-location-pin {
    position: relative;
    &__icon {
      position: absolute !important;
      left: -25px !important;
      top: -25px !important;
    }
  }

  .floating-label__placeholder {
    top: 10px;
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
      position: relative;
      border: none !important;
      box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02) !important;
      border-radius: 10px !important;
      .ant-card-body {
        padding: 0 !important;
      }
    }

    &__map-disable-layout {
      position: absolute;
      width: 100%;
      height: 500px;
      background-color: $white;
      z-index: 1;
      bottom: 0px;
      opacity: 0.5;

      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 22px;
      color: $primary-400;
    }

    &__hide-table-body {
      .ant-table-placeholder {
        display: none !important;
      }
    }

    &__no-data {
      height: calc(100vh - 246px) !important;
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
