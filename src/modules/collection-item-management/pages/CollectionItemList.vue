<template>
  <div class="fill-height d-flex flex-column">
    <ListSearchHeader
      ref="searchHeader"
      :title="$t('collection_item_management')"
      :colTitle="3"
      :colAction="21"
      v-model:model-value.sync="searchValue"
      @onChange="handleSearchChange"
    >
      <template #action>
        <a-button type="primary" class="btn-add-new" @click="onCreate">
          <template #icon>
            <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
          </template>
          {{ $t("add_new_type_btn") }}
        </a-button>
      </template>
    </ListSearchHeader>
    <div :class="[collectionItem.tableContainer, 'mx-30 mb-30']">
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        v-if="!isLoading && data && data.length > 0"
        :customRow="customRow"
        :scroll="{ y: tableMaxHeight }"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'name'">
            <div @click="changeSortName()">
              <span class="header-title">{{ column.title }}</span>
              <SortView class="mx-12" :sort="sortName" />
            </div>
          </template>
          <template v-if="column.key === 'category'">
            <div @click="changeSortCategory()">
              <span class="header-title">{{ column.title }}</span>
              <SortView class="mx-12" :sort="sortCategory" />
            </div>
          </template>

        </template>

        <template #bodyCell="{ column, record, text }">
          <template
            v-if="columns.includes(column) && column.dataIndex !== 'action'"
          >
            <span v-if="text" class="has-value">{{ text }} </span>
            <span class="null-value" v-else>{{ NULL_VALUE_DISPLAY }}</span>
          </template>

          <template v-if="column.dataIndex === 'action'">
            <img
              src="@/assets/icons/ic_btn_edit.svg"
              :class="[collectionItem.actionIcon, 'ml-0']"
              @click="(event) => handleClickEdit(event, record.id)"
            />
            <img
              src="@/assets/icons/ic_btn_delete.svg"
              :class="[collectionItem.actionIcon]"
              @click="(event) => deleteCollectionItem(event, record.id)"
            />
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
        :value="searchValue"
        :is-loading="isLoading"
        @onClick="handleBackToList"
        v-if="isLoading || !data || !data.length"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import { i18n } from "@/i18n";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import NoData from "@/modules/base/components/NoData.vue";
import HeaderRef from "@/modules/base/models/search-header.model";
import SortView from "@/modules/common/components/SortView.vue";
import ThePagination from "@/modules/common/components/ThePagination.vue";
import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import type { TableColumnType } from "ant-design-vue";
import { debounce } from "lodash";
import { computed,  onMounted, reactive, ref, watch } from "vue";
import { NULL_VALUE_DISPLAY } from "@/utils/constants";
import { CollectionItemModel } from "../models/collection-item.model";

const sortName = ref<Sort>(Sort.None);

const sortCategory = ref<Sort>(Sort.None);

const selectedKeys = ref<number[]>([]);

const columns: TableColumnType<CollectionItemModel>[] = [
  {
    title: i18n.global.t("name"),
    dataIndex: "name",
    key: "name",
  },
  {
    title: i18n.global.t("category"),
    dataIndex: "category",
    key: "category",
    width: "70%"
  },
  {
    dataIndex: "action",
    width: "130px"
  }
];

const data = ref<CollectionItemModel[]>([]);
const searchValue = ref<string>("");
const searchHeader = ref<HeaderRef | null>(null);
const isLoading = ref<boolean>(false);
const pageOption = reactive<Pagination<CollectionItemModel>>({
  currentPage: 1,
  pageSize: 20,
  total: 0
});
const innerHeight = ref<number>(0);
  let sourceData: CollectionItemModel[] = [];
onMounted(() => {
  innerHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
  });
  fetchCollectionItemList();
});

const resetSort = (): void => {
  sortName.value = Sort.None;
  sortCategory.value = Sort.None;
};

const customRow = (
  record: CollectionItemModel
): { onClick: (_event: PointerEvent) => void } => {
  return {
    onClick: (_event: PointerEvent): void => {
      _event;
      router.push({
        name: routeNames.collectionItemManagement,
        params: {
          id: record.id
        }
      });
    }
  };
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


const changeSortName = (): void => {
  const backupSortName = sortName.value;
  resetSort();
  sortName.value = calculateNextSortStatus(backupSortName);
  fetchCollectionItemList();
};

const changeSortCategory = (): void => {
  const backupSortCategory = sortCategory.value;
  resetSort();
  sortCategory.value = calculateNextSortStatus(backupSortCategory);
  fetchCollectionItemList();
};

const onShowSizeChange = (current: number, pageSize: number): void => {
  pageOption.currentPage = current;
  pageOption.pageSize = pageSize;
  fetchCollectionItemList();
};

const onChange = (pageNumber: number): void => {
  pageOption.currentPage = pageNumber;
  fetchCollectionItemList();
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

const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedKeys.value,
    onChange: (keys: number[]): void => {
      selectedKeys.value = keys;
    },
    columnWidth: "50px"
  };
});

const fetchCollectionItemList = async (): Promise<void> => {

  let result = [
    {
      name: "Clothing",
      category: "Clothing & Accessories"
    },
    {
      name: "Shoes",
      category: "Clothing & Accessories"
    },
    {
      name: "Bags",
      category: "Clothing & Accessories"
    },
  ]
    sourceData = result
    data.value = [...sourceData];
    pageOption.currentPage = 1; 
    pageOption.pageSize = 20;
    pageOption.total = 3;
    pageOption.totalPage = 1;
};

const onSearchChange = debounce((): void => {
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  fetchCollectionItemList();
}, 500);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const handleClickEdit = ($event: MouseEvent, id: string): void => {};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const deleteCollectionItem = ($event: MouseEvent, id?: number): void => {};


// eslint-disable-next-line @typescript-eslint/no-empty-function
const onCreate = (): void => {};

const handleSearchChange = (currentSearchValue: string): void => {
  searchValue.value = currentSearchValue;
};

const handleBackToList = (): void => {
  if (searchHeader.value) {
    isLoading.value = true;
    searchHeader.value.clearInput();
  }
};
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

watch(searchValue, onSearchChange);

</script>

<style lang="scss" module="collectionItem">
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
    margin-left: 30px;
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
  .ant-table-row {
    cursor: pointer;
  }
}
.has-value,
.null-value {
  @include text(400, 16px, 20px);
  color: $neutral-600;
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
