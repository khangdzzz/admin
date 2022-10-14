<template>
  <div class="fill-height d-flex flex-column">
    <ListSearchHeader
      ref="searchHeader"
      :title="$t('vehicle')"
      :colTitle="3"
      :colAction="21"
      v-model:model-value.sync="searchString"
      @onChange="handleSearchChange"
    >
      <template #action>
        <a-button
          class="btn-action color-btn-delete"
          ghost
          type="primary"
          v-if="selectedKeys.length > 0"
          @click="deleteVehicle(undefined)"
        >
          <template #icon>
            <IcTrash class="btn-icon" :color="'#F54E4E'" />
          </template>
          {{ $t("delete_btn") }}
        </a-button>
        <a-button class="btn-action" type="primary">
          <template #icon>
            <img src="@/assets/icons/ic_import.svg" class="btn-icon" />
          </template>
          {{ $t("import_btn") }}
        </a-button>
        <a-button class="btn-action" type="primary">
          <template #icon>
            <img src="@/assets/icons/ic_export.svg" class="btn-icon" />
          </template>
          {{ $t("export_btn") }}
        </a-button>
        <a-button type="primary" class="btn-add-new" @click="onCreate">
          <template #icon>
            <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
          </template>
          {{ $t("add_new_type_btn") }}
        </a-button>
      </template>
    </ListSearchHeader>
    <div :class="[vehicleList.tableContainer, 'mx-30 mb-30']">
      <NoData
        :value="searchValue"
        :is-loading="isLoading"
        @onClick="handleBackToList"
        v-if="isLoading || !data || !data.length"
      />

      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        v-if="!isLoading && data && data.length > 0"
        :scroll="{ y: 700 }"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'vehicle_type'">
            <div @click="changeSortType()">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortType" />
            </div>
          </template>
          <template v-if="column.key === 'name'">
            <div @click="changeSortName()">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortName" />
            </div>
          </template>

          <template v-if="column.key === 'plate_number'">
            <div @click="changeSortPlateNumber()">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortPlateNumber" />
            </div>
          </template>
          <template v-if="column.key === 'workplace_name'">
            <div @click="changeSortWorkPlace()">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortWorkPlace" />
            </div>
          </template>

          <template v-if="column.key === 'max_capacity'">
            <div @click="changeSortCapacity()">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortCapacity" />
            </div>
          </template>

          <template v-if="column.key === 'permission_flag'">
            <div @click="changeSortPermission()">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortPermission" />
            </div>
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'type'">
            <span>{{ record.type }}</span>
          </template>
          <template v-if="column.dataIndex === 'permission_flag'">
            <a-tag
              :class="[
                !!record.permission_flag ? 'permisson-yes' : 'permisson-no'
              ]"
            >
              <span>
                {{ !!record.permission_flag ? $t("yes") : $t("no") }}
              </span></a-tag
            >
          </template>
          <template v-if="column.dataIndex === 'action'">
            <router-link
              :to="{
                name: routeNames.editVehicle,
                params: { id: record.id }
              }"
            >
              <img
                src="@/assets/icons/ic_btn_edit.svg"
                :class="[vehicleList.actionIcon]"
              />
            </router-link>
            <img
              src="@/assets/icons/ic_btn_delete.svg"
              :class="[vehicleList.actionIcon]"
              @click="deleteVehicle(record.id)"
            />
            <img
              src="@/assets/icons/ic_btn_qrcode.svg"
              :class="[vehicleList.actionIcon]"
              @click="getVehicleDetail(record.id)"
            />
          </template>
        </template>
      </a-table>
      <div :class="vehicleList.pagination">
        <a-pagination
          v-model:current="pageOption.currentPage"
          v-model:page-size="pageOption.pageSize"
          :total="pageOption.total"
          :pageSizeOptions="['20', '30', '40', '50']"
          show-size-changer
          @showSizeChange="onShowSizeChange"
          @change="onChange"
          :class="['ant-pagination', 'd-flex', 'justify-end']"
        >
          <template #itemRender="item">
            <a-button
              :class="[vehicleList.btnPagination, 'mt-10']"
              type="primary"
              ghost
              v-if="item.type === 'prev' && isShowPrevBtn()"
            >
              <img
                src="@/assets/icons/ic_prev.svg"
                :class="[vehicleList.btnIconPrev]"
              />
              <span :class="[vehicleList.action]">Previous</span>
            </a-button>
            <a-button
              :class="[vehicleList.btnPagination, 'mt-10', 'mr-15']"
              type="primary"
              ghost
              v-else-if="item.type === 'next' && isShowNextBtn()"
            >
              <span :class="[vehicleList.action]">Next</span>
              <img
                src="@/assets/icons/ic_next.svg"
                :class="[vehicleList.btnIconNext]"
              />
            </a-button>

            <component
              v-else-if="item.type === 'page'"
              :is="item.originalElement"
            ></component>
          </template>

          <template #buildOptionText="{ value }">
            <div class="options-text">
              <span class="mr-13">{{ value }} </span>
              <img src="@/assets/icons/ic_arrow.svg" />
            </div>
          </template>
        </a-pagination>
      </div>
    </div>
  </div>

  <VehicleDetailModal
    v-if="!!vehicleId"
    :currentVehicle="vehicleDetail"
    @close="vehicleId = ''"
  />
</template>

<script setup lang="ts">
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import IcTrash from "@/assets/icons/IcTrash.vue";
import { i18n } from "@/i18n";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import HeaderRef from "@/modules/base/models/search-header.model";
import { Pagination } from "@/modules/common/models/pagination.model";
import { Sort } from "@/modules/common/models/sort.enum";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { TableColumnType } from "ant-design-vue/lib/components";
import { debounce } from "lodash";
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import { ResVehicle, Vehicle, VehicleDetail } from "../models/vehicle.model";
import VehicleDetailModal from "./VehicleDetailModal.vue";
//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
const sortType = ref<Sort>(Sort.None);

const sortName = ref<Sort>(Sort.None);

const sortPlateNumber = ref<Sort>(Sort.None);

const sortWorkPlace = ref<Sort>(Sort.None);

const sortCapacity = ref<Sort>(Sort.None);

const vehicleDetail = ref<Vehicle>();

const sortPermission = ref<Sort>(Sort.None);

const selectedKeys = ref<any[]>([]);

const vehicleId = ref<string | undefined>(undefined);

const columns: TableColumnType<VehicleDetail>[] = [
  {
    title: "vehicle_type",
    dataIndex: "vehicle_type___name",
    key: "vehicle_type"
  },
  {
    title: "vehicle_name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "number_plate",
    dataIndex: "plate_number",
    key: "plate_number"
  },
  {
    title: "work_place",
    dataIndex: "workplace___name",
    key: "workplace_name"
  },
  {
    title: "capacity",
    dataIndex: "max_capacity",
    key: "max_capacity"
  },
  {
    title: "permission",
    dataIndex: "permission_flag",
    key: "permission_flag"
  },
  {
    dataIndex: "action",
    width: "180px"
  }
];
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
const data = ref<ResVehicle[]>([]);
const searchValue = ref<string>("");
const searchHeader = ref<HeaderRef | null>(null);
const isLoading = ref<boolean>(false);
const searchString = ref<string>("");
const pageOption = reactive<Pagination<ResVehicle>>({
  currentPage: 1,
  pageSize: 20,
  total: 0
});
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
onMounted(() => {
  fetchVehicleList();
});
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
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

const changeSortType = (): void => {
  sortType.value = calculateNextSortStatus(sortType.value);
  fetchVehicleList();
};

const changeSortName = (): void => {
  sortName.value = calculateNextSortStatus(sortName.value);
  fetchVehicleList();
};

const changeSortCapacity = (): void => {
  sortCapacity.value = calculateNextSortStatus(sortCapacity.value);
  fetchVehicleList();
};

const changeSortPlateNumber = (): void => {
  sortPlateNumber.value = calculateNextSortStatus(sortPlateNumber.value);
  fetchVehicleList();
};

const changeSortWorkPlace = (): void => {
  sortWorkPlace.value = calculateNextSortStatus(sortWorkPlace.value);
  fetchVehicleList();
};

const changeSortPermission = (): void => {
  sortPermission.value = calculateNextSortStatus(sortPermission.value);
  fetchVehicleList();
};

const onShowSizeChange = (current: number, pageSize: number): void => {
  pageOption.currentPage = current;
  pageOption.pageSize = pageSize;
  fetchVehicleList();
};

const onChange = (pageNumber: number): void => {
  pageOption.currentPage = pageNumber;
  fetchVehicleList();
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

const fetchVehicleList = async (): Promise<void> => {
  const sort = {
    sortType: sortType.value,
    sortName: sortName.value,
    sortPlateNumber: sortPlateNumber.value,
    sortWorkPlace: sortWorkPlace.value,
    sortCapacity: sortCapacity.value,
    sortPermission: sortPermission.value
  };

  isLoading.value = true;
  const res = await service.vehicle.getListVehicle(
    Number(pageOption.currentPage),
    Number(pageOption.pageSize),
    sort,
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
  fetchVehicleList();
}, 500);

const deleteVehicle = (id?: number): void => {
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
      const selectedVehicleIds = id ? [id] : selectedKeys.value;
      onDeleteVehicle(selectedVehicleIds);
    }
  });
};

const onDeleteVehicle = async (deleteIds: number[]): Promise<void> => {
  if (!deleteIds.length) {
    return;
  }
  isLoading.value = true;
  const isSuccess = await service.vehicle.deleteVehicleById(deleteIds);
  isLoading.value = false;
  if (!isSuccess) {
    messenger({
      title: "popup_delete_fail_lbl_title",
      message: "popup_delete_fail_lbl_message",
      type: MessengerType.Error
    });
    return;
  }
  messenger({
    title:
      deleteIds.length > 1
        ? i18n.global.t("delete_vehicle_mutiple_successfully", {
            length: deleteIds.length
          })
        : "delete_vehicle_successfully",
    message: "",
    type: MessengerType.Success,
    callback: (isConfirm: boolean): void => {
      isConfirm;
      fetchVehicleList();
    }
  });
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  searchString.value = "";
};

const onCreate = (): void => {
  router.push({ name: routeNames.createVehicle });
};

const handleSearchChange = (currentSearchValue: string): void => {
  searchValue.value = currentSearchValue;
};

const handleBackToList = (): void => {
  if (searchHeader.value) {
    searchHeader.value.clearInput();
  }
};

//#endregion===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊

//#===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏Computed
const getVehicleDetail = async (id: string): Promise<void> => {
  isLoading.value = true;
  const res = await service.vehicle.getVehicleDetail(id);
  isLoading.value = false;
  if (res) {
    vehicleDetail.value = res;
    setVehicleId(id);
  }
};
//#endregion===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏

//#===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
//#endregion===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍

//===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀Watchers
watch(searchString, onSearchChange);
//#endregion===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀
</script>

<style lang="scss" module="vehicleList">
@mixin size-btn($width, $height) {
  min-width: $width;
  height: $height;
}

@mixin text($fontWeight, $fontSize, $lineHeight) {
  font-weight: $fontWeight;
  font-size: $fontSize;
  line-height: $lineHeight;
}

.tableContainer {
  flex-grow: 1;

  .actionIcon {
    margin-left: 20px;
    cursor: pointer;
  }
  .ant-table-cell {
    text-align: center;
  }

  .pagination {
    text-align: end;
    background-color: #fff;
    height: 60px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    .btnPagination {
      @include size-btn(82px, 40px);
      border-color: #eaeaea;
      background-color: #fff;

      .btnIconPrev {
        margin-right: 8px;
      }

      .btnIconNext {
        margin-left: 8px;
      }
    }

    .action {
      @include text(700, 14px, 18px);
      text-align: center;
      color: $neutral-600;
    }
  }
}
</style>

<style scoped lang="scss">
.border {
  border: 1px solid #eaeaea;
  border-radius: 6px;
}

@mixin permission($background, $borderColor, $color) {
  padding: 3px 10px;
  background: $background;
  border: 1px solid $borderColor;
  border-radius: 22px;
  span {
    @include text(400, 16px, 16px);
    color: $color;
  }
}

.permisson-no {
  @include permission(#feeded, rgba(245, 78, 78, 0.5), $red-1);
}

.permisson-yes {
  @include permission(#f0f8fa, rgba(7, 160, 184, 0.5), $primary);
}

@mixin size-btn($width, $height) {
  min-width: $width;
  height: $height;
}

@mixin pagination-item($color) {
  background-color: $color;
  @extend .border;
}

@mixin text($fontWeight, $fontSize, $lineHeight) {
  font-weight: $fontWeight;
  font-size: $fontSize;
  line-height: $lineHeight;
}

//extend
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep() {
  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: $grey-2;
    border-color: rgba(0, 0, 0, 0.03);
  }
}
</style>

<style lang="scss">
.tableContainer {
  .ant-checkbox-inner {
    &::after {
      top: 45%;
      left: 30%;
    }
  }
}
</style>
