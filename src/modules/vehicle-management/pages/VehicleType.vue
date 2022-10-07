<template>
  <div class="fill-height d-flex flex-column">
    <ListSearchHeader
      :title="$t('vehicle_type')"
      v-model:model-value.sync="searchString"
    >
      <template #action>
        <a-button
          class="btn-action"
          type="primary"
          ghost
          @click="deleteVehicleType(undefined)"
          v-if="selectedKeys.length > 0"
        >
          <template #icon>
            <img src="@/assets/icons/ic_delete.svg" class="btn-icon" />
          </template>
          {{ $t("delete_btn") }}
        </a-button>
        <a-button type="primary" class="btn-add-new" @click="onCreate">
          <template #icon>
            <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
          </template>
          {{ $t("add_new_type_btn") }}
        </a-button>
      </template>
    </ListSearchHeader>
    <div class="table-container mx-30 mb-30">
      <div v-if="!isLoading && data && data.length">
        <a-table
          :row-selection="rowSelection"
          :columns="columns"
          :data-source="data"
          :pagination="false"
          :scroll="{ y: tableMaxHeight }"
        >
          <template #headerCell="{ column }">
            <template v-if="column.key === 'index'">
              <span>{{ $t(column.title) }}</span>
            </template>
            <template v-if="column.key === 'name'">
              <div @click="changeSort">
                <span>{{ $t(column.title) }}</span>
                <SortView class="mx-12" :sort="sort" />
              </div>
            </template>
          </template>
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <img
                src="@/assets/icons/ic_btn_edit.svg"
                class="action-icon"
                @click="editVehicleType(record.id)"
              />
              <img
                src="@/assets/icons/ic_btn_delete.svg"
                class="action-icon"
                @click="deleteVehicleType(record.id)"
              />
            </template>
          </template>
        </a-table>
        <div :class="vehicleType.pagination">
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
            <template #buildOptionText="{ value }">
              <div class="options-text">
                <span class="mr-13">{{ value }} </span>
                <img src="@/assets/icons/ic_arrow.svg" />
              </div>
            </template>
            <template #itemRender="item">
              <a-button
                :class="[vehicleType.btnPagination, 'mt-10']"
                type="primary"
                ghost
                v-if="item.type === 'prev' && isShowPrevBtn()"
              >
                <img
                  src="@/assets/icons/ic_prev.svg"
                  :class="[vehicleType.btnIconPrev]"
                />
                <span :class="[vehicleType.action]">Previous</span>
              </a-button>
              <a-button
                :class="[vehicleType.btnPagination, 'mt-10', 'mr-15']"
                type="primary"
                ghost
                v-else-if="item.type === 'next' && isShowNextBtn()"
              >
                <span :class="[vehicleType.action]">Next</span>
                <img
                  src="@/assets/icons/ic_next.svg"
                  :class="[vehicleType.btnIconNext]"
                />
              </a-button>

              <component
                v-else-if="item.type === 'page'"
                :is="item.originalElement"
              ></component>
            </template>
          </a-pagination>
        </div>
      </div>

      <NoData
        :value="searchString"
        :is-loading="isLoading"
        @onClick="handleBackToList"
        v-else
      />
    </div>
  </div>
</template>
<script setup lang="ts">
//#region import
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import NoData from "@/modules/base/components/NoData.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import SortView from "@/modules/common/components/SortView.vue";
import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { debounce } from "lodash";
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import { VehicleTypeModel } from "../models";

//#endregion

//#region props
//#endregion
//#region variables

const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;

const columns = [
  {
    title: "vehicle_column_name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    width: "150px"
  }
];
// todo: handle any here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sourceData: VehicleTypeModel[] = [];
const data = ref<VehicleTypeModel[]>([]);
const selectedKeys = ref<number[]>([]);
const sort = ref<Sort>(Sort.None);
const isLoading = ref<boolean>(false);
const searchString = ref<string>("");
const innerHeight = ref<number>(0);
const pageOption = reactive<Pagination<VehicleTypeModel>>({
  currentPage: 1,
  pageSize: 20,
  total: 0
});
//#endregion

//#region hooks
onMounted(async () => {
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
  const result = await service.vehicleType.fetchListVehicleType(
    pageOption?.currentPage || 1,
    pageOption.pageSize || 20,
    sort.value,
    searchString.value
  );
  isLoading.value = false;
  sourceData = (result?.results || []).map((item, index) => {
    return { ...item, key: item.id || index + 1 };
  });
  data.value = [...sourceData];
  pageOption.currentPage = result?.currentPage;
  pageOption.pageSize = result?.pageSize || 20;
  pageOption.total = result?.total;
  pageOption.totalPage = result?.totalPage;
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

const onShowSizeChange = (current: number, pageSize: number): void => {
  pageOption.currentPage = current;
  pageOption.pageSize = pageSize;
  initialize();
};

const onChange = (pageNumber: number): void => {
  pageOption.currentPage = pageNumber;
  initialize();
};

const onCreate = (): void => {
  router.push({ name: routeNames.createVehicleType });
};

const editVehicleType = (id: string): void => {
  router.push(`edit-vehicle-type/${id}`);
};

const changeSort = (): void => {
  switch (sort.value) {
    case Sort.Asc:
      sort.value = Sort.Desc;
      break;
    case Sort.Desc:
      sort.value = Sort.None;
      break;
    default:
      sort.value = Sort.Asc;
  }
  initialize();
};

const onSearchChange = debounce((): void => {
  initialize();
}, 500);

const deleteVehicleType = (id?: number): void => {
  messenger({
    title: "vehicle_type_msg_confirm_delete",
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
      const selectedVehicleTypeIds = id ? [id] : selectedKeys.value;
      onDeleteVehicleType(selectedVehicleTypeIds);
    }
  });
};

const onDeleteVehicleType = async (deleteIds: number[]): Promise<void> => {
  if (!deleteIds.length) {
    return;
  }
  isLoading.value = true;
  const isSuccess = await service.vehicleType.deleteVehicleTypeById(deleteIds);
  isLoading.value = false;
  if (!isSuccess) {
    messenger({
      title: "vehicle_type_delete_fail_lbl_title",
      message: "vehicle_type_delete_fail_lbl_message",
      type: MessengerType.Error
    });
    return;
  }
  messenger({
    title: "vehicle_type_msg_delete_successfully",
    message: "",
    type: MessengerType.Success,
    callback: (isConfirm: boolean): void => {
      isConfirm;
      initialize();
    }
  });
};

const handleBackToList = (): void => {
  searchString.value = "";
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
//#endregion

//#region computed
const totalPages = (): number => {
  return Math.ceil(Number(pageOption.total) / Number(pageOption.pageSize));
};

const tableMaxHeight = computed(() => {
  const tableHeaderHeight = 58;
  const tableFooterHeight = 52;
  const pageHeaderHeight = 120;
  const marginBottom = 30;

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

<style lang="scss" scoped>
.table-container {
  flex-grow: 1;
}

.action-icon {
  margin-left: 30px;
  cursor: pointer;
}
:deep() {
  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: $grey-2;
    border-color: rgba(0, 0, 0, 0.03);
  }
}
</style>
<style lang="scss" module="vehicleType">
@mixin size-btn($width, $height) {
  min-width: $width;
  height: $height;
}
@mixin text($fontWeight, $fontSize, $lineHeight) {
  font-weight: $fontWeight;
  font-size: $fontSize;
  line-height: $lineHeight;
}
.pagination {
  text-align: start;
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
</style>
