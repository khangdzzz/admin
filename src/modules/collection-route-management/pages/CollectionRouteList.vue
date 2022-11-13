<template>
  <div class="fill-height d-flex flex-column">
    <ListSearchHeader
      :title="$t('collection_route')"
      v-model:model-value.sync="searchString"
    >
      <template #action>
        <a-button
          class="btn-action btn color-btn-delete"
          type="primary"
          @click="(event: MouseEvent) => deleteCollectionRoute(event, undefined)"
          ghost
          v-if="selectedKeys.length > 0"
        >
          <template #icon>
            <IcTrash class="btn-icon" :color="'#F54E4E'" />
          </template>
          {{ $t("delete_btn") }}
        </a-button>
        <a-button class="btn btn-action" type="primary" ghost>
          <template #icon>
            <img src="@/assets/icons/ic_import.svg" class="btn-icon" />
          </template>
          {{ $t("import_btn") }}
        </a-button>
        <a-button class="btn btn-action" type="primary" ghost>
          <template #icon>
            <img src="@/assets/icons/ic_export.svg" class="btn-icon" />
          </template>
          {{ $t("export_btn") }}
        </a-button>
        <a-button
          type="primary"
          class="btn btn-add-new"
          @click="handleClickAdd"
        >
          <template #icon>
            <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
          </template>
          {{ $t("add_btn") }}
        </a-button>
      </template>
    </ListSearchHeader>
    <div :class="[collectionRouteList.tableContainer, 'mx-30']">
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :scroll="{ y: tableMaxHeight }"
        :customRow="customRow"
        v-if="!isLoading && data && data.length"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'index'">
            <span>{{ $t(column.title) }}</span>
          </template>

          <template v-if="column.key === 'name'">
            <div @click="changeSortName()">
              <span class="header-title">{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortName" />
            </div>
          </template>
          <template v-if="column.key === 'workPlace'">
            <div @click="changeSortWorkPlace()">
              <span class="header-title">{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortWorkPlace" />
            </div>
          </template>
          <template v-if="column.key === 'numberOfStore'">
            <div @click="changeSortNumberStore()">
              <span class="header-title">{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortNumberOfStores" />
            </div>
          </template>
          <template v-if="column.key === 'lastUpdate'">
            <div @click="changeSortLastUpdate()">
              <span class="header-title">{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortLastUpdate" />
            </div>
          </template>
          <template v-if="column.key === 'navigationId'">
            <div @click="changeSortNavigationId()">
              <span class="header-title">{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortNavigationId" />
            </div>
          </template>
        </template>
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'navigationId'">
            <a
              class="navigation-link"
              v-if="text"
              @click="(event) => redirectRouteDetail(event, record.id, text)"
              >{{ text }}</a
            >
            <a-button
              type="primary"
              class="btn-create-navigation-link"
              ghost
              v-else
              @click="(event) => addCollectionRoute(event, record.id)"
            >
              <template #icon>
                <img
                  src="@/assets/icons/ic_plus_primary.png"
                  class="btn-navigation-icon"
                />
              </template>
              Create
            </a-button>
          </template>
          <template v-if="column.key === 'lastUpdate'">
            {{ formatDateTime(text, "yyyy/MM/dd HH:mm:ss") }}
          </template>
          <template v-if="column.dataIndex === 'action'">
            <center>
              <img
                src="@/assets/icons/ic_btn_edit.svg"
                :class="[collectionRouteList.actionIcon]"
                @click="(event: MouseEvent) => goToEditPage(event, record.id)"
              />

              <img
                src="@/assets/icons/ic_btn_delete.svg"
                :class="[collectionRouteList.actionIcon]"
                @click="(event: MouseEvent) => deleteCollectionRoute(event, record.id)"
              />
            </center>
          </template>
        </template>
      </a-table>

      <ThePagination
        :isShowPagination="!isLoading && data && !!data.length"
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
        v-if="isLoading || !data || !data.length"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
//#region import
import IcTrash from "@/assets/icons/IcTrash.vue";
import { i18n } from "@/i18n";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import NoData from "@/modules/base/components/NoData.vue";
import { formatDateTime } from "@/modules/base/components/validator/dateFormat";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import SortView from "@/modules/common/components/SortView.vue";
import ThePagination from "@/modules/common/components/ThePagination.vue";
import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { routeNames, router } from "@/routes";
import { service } from "@/services";
import { TableColumnType } from "ant-design-vue";
import { debounce } from "lodash";
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import { CollectionRoute } from "../models/collection-route.model";
//#endregion

//#region props
//#endregion

//#region variables
const pageOption = reactive<Pagination<CollectionRoute>>({
  currentPage: 1,
  pageSize: 20,
  total: 0
});

const columns: TableColumnType<CollectionRoute>[] = [
  {
    title: "collection_route_name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "collection_route_workplace",
    dataIndex: "workPlace",
    key: "workPlace"
  },
  {
    title: "collection_route_number_of_stores",
    dataIndex: "numberOfStore",
    key: "numberOfStore"
  },
  {
    title: "collection_route_last_update",
    dataIndex: "lastUpdate",
    key: "lastUpdate"
  },
  {
    title: "collection_route_navigation_id",
    dataIndex: "navigationId",
    key: "navigationId"
  },
  {
    dataIndex: "action",
    width: "150px"
  }
];
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
let sourceData: CollectionRoute[] = [];
const selectedKeys = ref<number[]>([]);
const data = ref<CollectionRoute[]>();
const sortName = ref<Sort>(Sort.None);
const sortWorkPlace = ref<Sort>(Sort.None);
const sortNumberOfStores = ref<Sort>(Sort.None);
const sortLastUpdate = ref<Sort>(Sort.None);
const sortNavigationId = ref<Sort>(Sort.None);
const searchString = ref<string>("");
const isLoading = ref<boolean>(false);
const innerHeight = ref<number>(0);

//#endregion

//#region hooks
onMounted(() => {
  innerHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
  });

  initialize();
});

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
const resetSort = (): void => {
  sortLastUpdate.value = Sort.None;
  sortName.value = Sort.None;
  sortWorkPlace.value = Sort.None;
  sortNavigationId.value = Sort.None;
  sortNumberOfStores.value = Sort.None;
};
const changeSortName = (): void => {
  const backupSortName = sortName.value;
  resetSort();
  sortName.value = calculateNextSortStatus(backupSortName);
  initialize();
};
const changeSortWorkPlace = (): void => {
  const backupSortWorkPlace = sortWorkPlace.value;
  resetSort();
  sortWorkPlace.value = calculateNextSortStatus(backupSortWorkPlace);
  initialize();
};
const changeSortNumberStore = (): void => {
  const backupSortNumberStore = sortNumberOfStores.value;
  resetSort();
  sortNumberOfStores.value = calculateNextSortStatus(backupSortNumberStore);
  initialize();
};
const changeSortLastUpdate = (): void => {
  const backupSortLastUpdate = sortLastUpdate.value;
  resetSort();
  sortLastUpdate.value = calculateNextSortStatus(backupSortLastUpdate);
  initialize();
};
const changeSortNavigationId = (): void => {
  const backupSortNavigationId = sortNavigationId.value;
  resetSort();
  sortNavigationId.value = calculateNextSortStatus(backupSortNavigationId);
  initialize();
};

const onSearchChange = debounce((): void => {
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  initialize();
}, 500);
//#endregion

//#region function
const initialize = async (): Promise<void> => {
  const sort = {
    sortName: sortName.value,
    sortWorkPlace: sortWorkPlace.value,
    sortNumberStore: sortNumberOfStores.value,
    sortLastUpdate: sortLastUpdate.value,
    sortNavigationRouteId: sortNavigationId.value
  };
  isLoading.value = true;
  const res = await service.collectionRoute.getListCollectionRoutes(
    pageOption?.currentPage || 1,
    pageOption?.pageSize ? pageOption?.pageSize : 20,
    sort,
    searchString.value
  );

  sourceData = (res?.results || []).map((item, index) => {
    return { ...item, key: item.id || index + 1 };
  });
  data.value = [...sourceData];
  isLoading.value = false;
  pageOption.currentPage = res?.currentPage;
  pageOption.total = res?.total;
  pageOption.totalPage = res?.totalPage;
};
const onShowSizeChange = (current: number, pageSize: number): void => {
  pageOption.currentPage = current;
  pageOption.pageSize = pageSize;
  initialize();
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
const onChange = (pageNumber: number): void => {
  pageOption.currentPage = pageNumber;
  initialize();
};
const handleBackToList = (): void => {
  isLoading.value = true;
  searchString.value = "";
};
const customRow = (
  record: CollectionRoute
): { onClick: (_event: PointerEvent) => void } => {
  return {
    onClick: (_event: PointerEvent): void => {
      _event;
      router.push({
        name: routeNames.collectionRouteDetail,
        params: {
          id: record.id
        }
      });
    }
  };
};

const goToEditPage = ($event: MouseEvent, id?: number): void => {
  if ($event.stopPropagation) $event.stopPropagation();
  router.push({
    name: routeNames.editCollectionRouteOrder,
    params: {
      id
    }
  });
};

const deleteCollectionRoute = ($event: MouseEvent, id?: number): void => {
  if ($event.stopPropagation) $event.stopPropagation();
  messenger({
    title: "popup_msg_confirm_delete",
    message: "",
    type: MessengerType.Confirm,
    buttonOkTitle: "btn_delete",
    callback: async (isConfirm: boolean): Promise<void> => {
      if (!isConfirm) {
        return;
      }

      if (!selectedKeys.value?.length && !id) {
        return;
      }
      const selectedCollectionRouteIds = id ? [id] : selectedKeys.value;
      onDeleteCollectionRoute(selectedCollectionRouteIds);
    }
  });
};
const handleClickAdd = (): void => {
  router.push({ name: routeNames.createCollectionRouteOrder });
};
const onDeleteCollectionRoute = async (deleteIds: number[]): Promise<void> => {
  if (!deleteIds.length) {
    return;
  }
  isLoading.value = true;
  const isSuccess = await service.collectionRoute.deleteCollectionRoute(
    deleteIds
  );
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
    title:
      deleteIds.length > 1
        ? i18n.global.t("common_msg_delete_multiple_successfully", {
            number: deleteIds.length
          })
        : "common_msg_delete_successfully",
    message: "",
    type: MessengerType.Success,
    callback: (isConfirm: boolean): void => {
      isConfirm;
      initialize();
    }
  });
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  searchString.value = "";
};

const redirectRouteDetail = (
  event: MouseEvent,
  id: number,
  routeId: number
): void => {
  if (event.stopPropagation) {
    event.stopPropagation();
  }
  router.push({
    name: routeNames.createRoute,
    params: { id, mode: "detail", routeId }
  });
};

const addCollectionRoute = (event: MouseEvent, id: number): void => {
  if (event.stopPropagation) {
    event.stopPropagation();
  }
  router.push({
    name: routeNames.createRoute,
    params: { id, mode: "create" }
  });
};
//#endregion

//#region computed
const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedKeys.value,
    onChange: (keys: number[]): void => {
      selectedKeys.value = keys;
    },
    columnWidth: "50px"
  };
});
const tableMaxHeight = computed(() => {
  const tableHeaderHeight = 58;
  const tableFooterHeight = 52;
  const pageHeaderHeight = 120;
  const marginBottom = 20;

  return (
    innerHeight.value -
    tableHeaderHeight -
    tableFooterHeight -
    pageHeaderHeight -
    marginBottom
  );
});
//#endregion

//#region reactive
watch(searchString, onSearchChange);
//#endregion
</script>
<style lang="scss" module="collectionRouteList">
.tableContainer {
  flex-grow: 1;
  .headerTitle {
    font-size: 14px;
  }

  .actionIcon {
    margin-left: 30px;
    cursor: pointer;
  }

  .ant-table-cell {
    text-align: center;
  }
}
</style>
<style lang="scss" scoped>
:deep() {
  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: $grey-2;
    border-color: rgba(0, 0, 0, 0.03);
  }
}

.btn-create-navigation-link {
  width: 89px;
  height: 32px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  padding: 0px 10px;
  line-height: 100%;
  display: flex;
  align-items: center;
}
.btn-navigation-icon {
  margin-right: 7px;
}
.navigation-link {
  color: $primary;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
}
</style>
