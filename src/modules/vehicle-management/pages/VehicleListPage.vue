<template>
  <div class="d-flex flex-column fill-height">
    <ListSearchHeader
      :title="$t('vehicle')"
      v-model:model-value.sync="searchString"
    >
      <template #action>
        <a-button
          id="vehicle-list-page_btn-delete-multiple"
          class="btn-action color-btn-delete"
          type="primary"
          @click="($event: MouseEvent) => deleteItems($event, selectedKeys)"
          ghost
          v-if="selectedKeys.length > 0"
        >
          <template #icon>
            <IcTrash class="btn-icon" :color="'#F54E4E'" />
          </template>
          {{ $t("delete_btn") }}
        </a-button>
        <a-button
          id="vehicle-list-page_btn-import"
          class="btn-action"
          type="primary"
        >
          <template #icon>
            <img src="@/assets/icons/ic_import.svg" class="btn-icon" />
          </template>
          {{ $t("import_btn") }}
        </a-button>
        <a-button
          id="vehicle-list-page_btn-export"
          class="btn-action"
          type="primary"
        >
          <template #icon>
            <img src="@/assets/icons/ic_export.svg" class="btn-icon" />
          </template>
          {{ $t("export_btn") }}
        </a-button>
        <a-button
          id="vehicle-list-page_btn-create-new"
          type="primary"
          class="btn-add-new"
          @click="onAddNewItem"
        >
          <template #icon>
            <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
          </template>
          {{ $t("add_new_type_btn") }}
        </a-button>
      </template>
    </ListSearchHeader>
    <div class="table-container mx-30 mb-30">
      <div v-if="!isLoading && data && data.length">
        <div
          v-if="selectedKeys.length > 0"
          class="table-container__lbl-data-selected"
        >
          {{ $t("common_lbl_data_selected", { number: selectedKeys.length }) }}
        </div>
        <a-table
          :columns="columns"
          :data-source="data"
          :pagination="false"
          :scroll="{ y: tableMaxHeight, x: 500 }"
          :row-key="(record) => record.id"
          :row-selection="rowSelection"
          @resizeColumn="handleResizeColumn"
        >
          <template #headerCell="{ column }">
            <template v-if="column.key !== 'action'">
              <div>
                <span class="header-title">{{ $t(column.title) }}</span>
                <SortView
                  :id="`vehicle-list-page_list-sort_${column.title}`"
                  v-if="column.key"
                  class="mx-12"
                  :sort="sort[column.key]"
                  @click="changeSort(column.key)"
                />
              </div>
            </template>
          </template>
          <template #bodyCell="{ column, record, index, text }">
            <template v-if="column.dataIndex === 'permission_flag'">
              <a-tag
                :class="[
                  !!record.permission_flag ? 'permisson-yes' : 'permisson-no',
                  'd-flex justify-center align-center'
                ]"
              >
                {{ !!record.permission_flag ? $t("yes") : $t("no") }}
              </a-tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <router-link
                :id="`vehicle-list-page_list-item-${index}_btn-edit`"
                :to="{
                  name: routeNames.editVehicle,
                  params: { id: record.id }
                }"
              >
                <img src="@/assets/icons/ic_btn_edit.svg" class="action-icon" />
              </router-link>
              <img
                :id="`vehicle-list-page_list-item-${index}_btn-delete`"
                src="@/assets/icons/ic_btn_delete.svg"
                class="action-icon"
                @click="($event) => onDeleteItem($event, record.id)"
              />
              <img
                :id="`vehicle-list-page_list-item-${index}_btn-detail`"
                src="@/assets/icons/ic_btn_qrcode.svg"
                class="action-icon"
                @click="getVehicleDetail(record.id)"
              />
            </template>
            <template v-else>
              <span class="table-container__list-item-text">{{
                text || NULL_VALUE_DISPLAY
              }}</span>
            </template>
          </template>
        </a-table>
        <ThePagination
          :isShowPagination="!isLoading && data && !!data.length"
          :currentPage="pageOption.currentPage"
          :pageSize="pageOption.pageSize"
          :total="pageOption.total"
          @onShowSizeChange="onShowSizeChange"
          @onChange="onChange"
        />
      </div>
      <NoData
        :value="searchString"
        :is-loading="isLoading"
        @onClick="handleBackToList"
        v-if="isLoading || !data || !data.length"
      />
    </div>
  </div>
  <VehicleDetailModal
    v-if="!!vehicleId"
    :currentVehicle="vehicleDetail"
    @close="vehicleId = ''"
  />
</template>

<script setup lang="ts">
//#region import
import IcTrash from "@/assets/icons/IcTrash.vue";
import { i18n } from "@/i18n";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import NoData from "@/modules/base/components/NoData.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import SortView from "@/modules/common/components/SortView.vue";
import ThePagination from "@/modules/common/components/ThePagination.vue";
import { NULL_VALUE_DISPLAY } from "@/modules/common/constants/table.constant";
import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { routeNames, router } from "@/routes";
import { service } from "@/services";
import { TableColumnsType } from "ant-design-vue";
import { debounce } from "lodash";
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch
} from "vue";
import { ResVehicle, Vehicle } from "../models/vehicle.model";
import VehicleDetailModal from "./VehicleDetailModal.vue";
//#endregion
//#region props
//#endregion
interface sortVehicleDto {
  vehicle_type___name: Sort;
  name: Sort;
  plate_number: Sort;
  workplace___name: Sort;
  max_capacity: Sort;
  permission_flag: Sort;
}

//#region variables
const searchString = ref<string>("");
// Todo: need to define your columns here. Note: all columns that are not action column, must enable resizable
const columns = ref<TableColumnsType>([
  {
    title: "vehicle_type",
    dataIndex: "vehicle_type___name",
    key: "vehicle_type___name",
    width: -1,
    resizable: true
  },
  {
    title: "vehicle_name",
    dataIndex: "name",
    key: "name",
    width: -1,
    resizable: true
  },
  {
    title: "number_plate",
    dataIndex: "plate_number",
    key: "plate_number",
    width: -1,
    resizable: true
  },
  {
    title: "work_place",
    dataIndex: "workplace___name",
    key: "workplace___name",
    width: -1,
    resizable: true
  },
  {
    title: "capacity",
    dataIndex: "max_capacity",
    key: "max_capacity",
    width: "140px"
  },
  {
    title: "permission",
    dataIndex: "permission_flag",
    key: "permission_flag",
    width: "96px"
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    width: "190px"
  }
]);
const data = ref<ResVehicle[]>([]); // Todo: must define data model and update here
const selectedKeys = ref<number[]>([]);
const sort = ref({});
const isLoading = ref<boolean>(false);
const innerHeight = ref<number>(0);
const vehicleId = ref<string | undefined>(undefined);
const vehicleDetail = ref<Vehicle>();
const pageOption = reactive<Pagination<ResVehicle>>({
  currentPage: 1,
  pageSize: 20,
  total: 0
});
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
//#endregion

//#region hooks
onMounted(() => {
  innerHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
  });

  const sortKey = columns.value.map((c) => c.key?.toString());
  sortKey.forEach((key) => {
    if (key && key !== "action") sort.value[key] = Sort.None;
  });

  fetchDataAsync();
});

onUnmounted(() => {
  innerHeight.value = window.innerHeight;
  window.removeEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
  });
});
//#endregion

//#region function
const fetchDataAsync = async (): Promise<void> => {
  isLoading.value = true;
  const res = await service.vehicle.getListVehicle(
    Number(pageOption.currentPage),
    Number(pageOption.pageSize),
    sort.value as sortVehicleDto,
    searchString.value
  );
  isLoading.value = false;

  if (res) {
    data.value = res.results.map((item) => {
      return {
        ...item,
        key: item.id
      };
    });

    pageOption.currentPage = res.current_page || 0;
    pageOption.total = res.count;
  }
};

const onSearchChange = debounce((): void => {
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  fetchDataAsync();
}, 500);

const onShowSizeChange = (current: number, pageSize: number): void => {
  pageOption.currentPage = current;
  pageOption.pageSize = pageSize;
  fetchDataAsync();
};

const onChange = (pageNumber: number): void => {
  pageOption.currentPage = pageNumber;
  fetchDataAsync();
};

const handleBackToList = (): void => {
  if (searchString.value) {
    isLoading.value = true;
    searchString.value = "";
  }
};

const onAddNewItem = (): void => {
  router.push({ name: routeNames.createVehicle });
};

const deleteItems = (e: MouseEvent, ids: number[]): void => {
  if (e && e.stopPropagation) e.stopPropagation();
  messenger({
    title: "popup_msg_confirm_delete",
    message: "",
    type: MessengerType.Confirm,
    buttonOkTitle: "btn_delete",
    callback: async (isConfirm: boolean): Promise<void> => {
      if (!isConfirm) {
        return;
      }
      onDeleteItems(ids);
    }
  });
};

const onDeleteItems = async (deleteIds: number[]): Promise<void> => {
  if (!deleteIds.length) {
    return;
  }
  isLoading.value = true;
  const isSuccess = await service.vehicle.deleteVehicleById(deleteIds);
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
      fetchDataAsync();
    }
  });
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  searchString.value = "";
};

const onDeleteItem = (e: MouseEvent, id: number): void => {
  if (e && e.stopPropagation) e.stopPropagation();
  deleteItems(e, [id]);
};

const getVehicleDetail = async (id: string): Promise<void> => {
  isLoading.value = true;
  const res = await service.vehicle.getVehicleDetail(id);
  isLoading.value = false;
  if (res) {
    vehicleDetail.value = res;
    setVehicleId(id);
  }
};

const setVehicleId = (id: string): void => {
  vehicleId.value = id;
};

const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedKeys.value,
    onChange: (keys: number[]): void => {
      selectedKeys.value = keys;
    },
    columnWidth: "50px"
  };
});

const handleResizeColumn = (w: number, col: { width: number }): void => {
  col.width = w;
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

const changeSort = (key: string): void => {
  Object.keys(sort.value).forEach((objKey) => {
    sort.value[objKey] =
      objKey !== key ? Sort.None : calculateNextSortStatus(sort.value[objKey]);
  });
  fetchDataAsync();
};
//#endregion

//#region computed
const tableMaxHeight = computed(() => {
  const pageHeaderHeight = 98;
  const labelSelectedItemHeight = selectedKeys.value.length ? 30 : 0;
  const tableHeaderHeight = 58;
  const tableFooterHeight = 60;
  const marginBottom = 30;

  return (
    innerHeight.value -
    tableHeaderHeight -
    labelSelectedItemHeight -
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

<style lang="scss" scoped>
.table-container {
  flex-grow: 1;
  height: calc(100% - 98px - 30px);

  @mixin permission($background, $borderColor, $color, $width) {
    background: $background;
    border: 1px solid $borderColor;
    border-radius: 22px;
    width: $width;
    height: 22px;
    @include text(400, 16px, 100%);
    color: $color;
  }

  .permisson-no {
    @include permission(#feeded, rgba(245, 78, 78, 0.5), $red-1, 41px);
  }

  .permisson-yes {
    @include permission(#f0f8fa, rgba(7, 160, 184, 0.5), $primary, 46px);
  }

  &__lbl-data-selected {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: $neutral-600;
    margin-bottom: 10px;
  }

  &__list-item-text {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: $neutral-600;
  }
}

.action-icon {
  margin-left: 20px;
  cursor: pointer;
}

:deep() {
  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: $grey-2;
    border-color: rgba(0, 0, 0, 0.03);
  }

  .ant-table-row {
    cursor: pointer;
  }

  .ant-pagination-options {
    .ant-pagination-options-size-changer {
      .ant-select-selector {
        width: auto !important;
        padding: 6px !important;
      }
      .ant-select-selection-item {
        .options-text {
          span {
            font-style: normal;
            font-weight: 700;
            font-size: 14px;
            line-height: 18px;
            color: $neutral-600;
          }

          img {
            width: 16px;
            height: 16px;
            vertical-align: middle;
          }
        }
      }

      .ant-select-arrow {
        display: none;
      }
    }
  }
}
</style>
