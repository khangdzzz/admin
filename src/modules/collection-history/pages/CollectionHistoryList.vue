<template>
  <div class="fill-height collection-history">
    <ListSearchHeader
      class="collection-history__search-header"
      ref="searchHeader"
      :title="$t('menu_lbl_collection_history')"
      :colTitle="3"
      :colAction="21"
      :hint-title="$t('collection_history_hint_title')"
      :hint-message="$t('collection_history_hint_message')"
      v-model:model-value.sync="searchValue"
      @onChange="handleSearchChange"
    >
      <template #action>
        <div class="d-flex gap-15">
          <a-select
            v-model:value="workPlace"
            placeholder="Select a workplace"
            class="custome-select"
            :options="options"
            ><template #suffixIcon>
              <img
                src="@/assets/icons/ic_dropdown.svg"
                width="20"
                height="20"
                style="padding: 4px"
              /> </template
          ></a-select>
          <CustomerDatePicker />
          <a-button type="primary" ghost class="btn-action">
            <template #icon>
              <img src="@/assets/icons/ic_filter.svg" class="btn-icon" />
            </template>
            Filter
          </a-button>
        </div>
      </template>
    </ListSearchHeader>
    <div class="mx-30">
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 500, y: calculatedHeightForTable }"
        :pagination="false"
        :row-key="(record) => record.id"
        v-if="!isLoading && data && data.length > 0"
        @resizeColumn="handleResizeColumn"
      >
        <template #summary>
          <a-table-summary fixed="top">
            <a-table-summary-row>
              <a-table-summary-cell :index="i" v-for="(item, i) in 20" :key="i">
                <div v-if="item === 9" style="text-align: right">
                  {{ floatParser(summary.sumApportionment) }}
                </div>
                <div v-else-if="item === 10" style="text-align: right">
                  {{ floatParser(summary.sumWeight) }}
                </div>
                <div v-else-if="item === 11" style="text-align: right">
                  {{ summary.sumQuantity }}
                </div>
                <div v-else-if="item === 12" style="text-align: right">
                  {{ floatParser(summary.sumPackageWeight) }}
                </div>
              </a-table-summary-cell>
            </a-table-summary-row>
          </a-table-summary>
        </template>
        <template #headerCell="{ column }">
          <div
            @click="changeSort(sort.sortA, column.key)"
            v-if="column.dataIndex !== 'action'"
          >
            <span class="header-title">{{ column.title }}</span>
            <SortView class="mx-12" :sort="column.key" />
          </div>
        </template>
        <template #bodyCell="{ column, record }">
          <div v-if="column.dataIndex === 'action' && record.remarks">
            <a-tooltip
              placement="bottomRight"
              overlayClassName="collection-history__tooltip"
              trigger="click"
              class="collection-history__tooltip-icon"
            >
              <template #title>
                <div class="collection-history__remark-title">
                  {{ $t("collection_history_remarks") }}:
                </div>
                <div class="collection-history__remark-content">
                  {{ record.remarks }}
                </div>
              </template>
              <IcMessagePopup color="#07A0B8" />
            </a-tooltip>
          </div>
          <div
            v-if="column.dataIndex === 'buyOrSell'"
            :class="[
              record.buyOrSell
                ? 'collection-history__table-sell'
                : 'collection-history__table-buy',
              'collection-history__table-buy-or-sell d-flex align-center justify-center'
            ]"
          >
            {{
              record.buyOrSell
                ? $t("collection_history_sell")
                : $t("collection_history_buy")
            }}
          </div>
          <div
            v-if="column.dataIndex === 'unit'"
            class="collection-history__table-unit"
          >
            {{ record.unit }}
          </div>
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
        :value="searchValue"
        :is-loading="isLoading"
        v-if="isLoading || !data || !data.length"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
//#region import
import CustomerDatePicker from "@/modules/base/components/DatePicker.vue";
import NoData from "@/modules/base/components/NoData.vue";
import { columns } from "@/modules/collection-history/models/table-columns.model";
import { computed, onMounted, reactive, ref, watch } from "vue";
import ThePagination from "@/modules/common/components/ThePagination.vue";
import { service } from "@/services";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { CollectionHistoryModel } from "../models/collection-history.model";
import { Pagination } from "@/modules/common/models";
import SortView from "@/modules/common/components/SortView.vue";
import { Sort } from "@/modules/common/models/sort.enum";
import HeaderRef from "@/modules/base/models/search-header.model";
import { debounce } from "lodash";
import IcMessagePopup from "@/assets/icons/IcMessagePopup.vue";
//#endregion

//#region props
//#endregion

//#region variables
const data = ref<CollectionHistoryModel[]>();
const sort = ref<{ sortA: Sort; sortB: Sort }>({
  sortA: Sort.None,
  sortB: Sort.None
});
const workPlace = ref<number>();
const searchValue = ref<string>("");
const selectedKeys = ref<number[]>([]);
const searchHeader = ref<HeaderRef | null>(null);
const options = [
  {
    value: 1,
    label: "Workplace 1"
  },
  {
    value: 2,
    label: "Workplace 2"
  }
];
const isLoading = ref<boolean>(false);
const pageOption = reactive<Pagination<CollectionHistoryModel>>({
  currentPage: 1,
  pageSize: 10,
  total: 0
});
const innerHeight = ref<number>(0);
const summary = reactive<{
  sumApportionment?: number;
  sumWeight?: number;
  sumQuantity?: number;
  sumPackageWeight?: number;
}>({});
//#endregion

//#region hooks
onMounted(() => {
  innerHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
  });

  fetchCollectionHistory();
});
//#endregion

//#region function
const fetchCollectionHistory = async (): Promise<void> => {
  isLoading.value = true;
  const res = await service.collectionHistory.getListCollectionHistory(
    pageOption.currentPage,
    pageOption.pageSize,
    searchValue.value
  );
  isLoading.value = false;
  if (res) {
    data.value = res?.results;
    summary.sumApportionment = res.sumApportionment;
    summary.sumWeight = res.sumWeight;
    summary.sumQuantity = res.sumQuantity;
    summary.sumPackageWeight = res.sumPackageWeight;
    pageOption.currentPage = res?.currentPage;
    pageOption.pageSize = res?.pageSize || 20;
    pageOption.total = res?.total;
    pageOption.totalPage = res?.totalPage;
  }
};

function changeSort(newSort: Sort, currentKey: string): void {
  Object.keys(sort.value).forEach((key) => {
    sort.value[key] = key === currentKey ? newSort : Sort.None;
  });
}

const handleSearchChange = (currentSearchValue: string): void => {
  searchValue.value = currentSearchValue;
};

const onSearchChange = debounce((): void => {
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  fetchCollectionHistory();
}, 500);

const rowSelection: any = {
  onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record: any) => {
    return {
      class: record.isConfirm
        ? "collection-history__table-row-confirmed"
        : "collection-history__table-row-unconfirmed"
    };
  },
  columnWidth: "50px"
};

const onShowSizeChange = (current: number, pageSize: number): void => {
  pageOption.currentPage = current;
  pageOption.pageSize = pageSize;
  fetchCollectionHistory();
};

const onChange = (pageNumber: number): void => {
  pageOption.currentPage = pageNumber;
  fetchCollectionHistory();
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

const floatParser = (float: number | undefined): string => {
  if (!float) return "0";
  return parseFloat(float.toString()).toFixed(2);
};
const handleResizeColumn = (w: number, col: { width: number }): void => {
  col.width = w;
};
//#endregion

//#region computed
const calculatedHeightForTable = computed(() => {
  const headerHeight = 98;
  const tableHeader = 58;
  const tableFooter = 58.14;
  const tablePagination = 60;
  const footerHeight = 30;

  return (
    innerHeight.value -
    headerHeight -
    tableHeader -
    tablePagination -
    footerHeight -
    tableFooter
  );
});
//#endregion

//#region reactive
watch(searchValue, onSearchChange);
//#endregion
</script>

<style lang="scss" scoped>
.collection-history {
  height: 100%;
  &__title {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 36px;
    color: $neutral-600;
  }

  &__table-buy-or-sell {
    width: 47px;
    height: 22px;
    border-radius: 22px;

    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
  }

  &__table-buy {
    background: $primary-50;
    border: 1px solid rgba(7, 160, 184, 0.5);
    color: $primary-400;
  }

  &__table-sell {
    background: #feeded;
    border: 1px solid rgba(245, 78, 78, 0.5);
    color: $red-500;
  }

  &__table-unit {
    text-transform: capitalize;
  }

  &__remark-title {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #ffffff;
  }

  &__remark-content {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #ffffff;
  }
}

:deep() {
  .collection-history {
    &__form-card {
      width: 180px;
      .ant-card-body {
        padding: 0 !important;
      }
    }

    &__search-header {
      margin-top: 0 !important;
      padding-top: 30px !important;
    }
  }

  .ant-table-ping-left {
    .ant-table-cell-fix-left-last {
      border-right: 2px solid $primary-200;
    }
  }

  .ant-table-thead {
    .ant-table-cell {
      &:first-child {
        border-left: 4px solid transparent;
      }
    }
  }

  .ant-table-cell {
    &:has(.collection-history__table-row-unconfirmed) {
      border-left: 4px solid #f56c6c;
    }

    &:has(.collection-history__table-row-confirmed) {
      border-left: 4px solid transparent;
    }
  }

  .ant-table-body {
    &::-webkit-scrollbar {
      height: 10px;
    }
  }
}
</style>
<style lang="scss">
.collection-history {
  &__tooltip {
    max-width: 346px;
    .ant-tooltip-placement-bottomRight {
      .ant-tooltip-arrow {
        right: 3px !important;
      }
    }
  }

  &__tooltip-icon {
    cursor: pointer;
    &:focus {
      outline: none !important;
    }
  }
}
.ant-tooltip-inner {
  &:has(.collection-history__remark-title) {
    position: absolute !important;
    right: -15px;
  }
}
</style>
