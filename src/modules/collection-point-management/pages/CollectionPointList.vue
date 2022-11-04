<template>
  <div class="fill-height d-flex flex-column">
    <ListSearchHeader
      ref="searchHeader"
      :title="$t('collection_point')"
      :colTitle="3"
      :colAction="21"
      v-model:model-value.sync="searchValue"
      @onChange="handleSearchChange"
    >
      <template #action>
        <a-button
          class="btn-action color-btn-delete"
          ghost
          type="primary"
          v-if="selectedKeys.length > 0"
          @click="(event: MouseEvent)=> deleteCollectionPoint(event, undefined)"
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
    <div :class="[collectionPoint.tableContainer, 'mx-30 mb-30']">
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
          <template v-if="column.key === 'customer'">
            <div @click="changeSortCustomer()">
              <span class="header-title">{{ column.title }}</span>
              <SortView class="mx-12" :sort="sortCustomer" />
            </div>
          </template>

          <template v-if="column.key === 'postalCode'">
            <div @click="changeSortPostalCode()">
              <span class="header-title">{{ column.title }}</span>
              <SortView class="mx-12" :sort="sortPostalCode" />
            </div>
          </template>
          <template v-if="column.key === 'address'">
            <div @click="changeSortAddress()">
              <span class="header-title">{{ column.title }}</span>
              <SortView class="mx-12" :sort="sortAddress" />
            </div>
          </template>
          <template v-if="column.key === 'phoneNumber'">
            <div @click="changeSortPhoneNumber()">
              <span class="header-title">{{ column.title }}</span>
              <SortView class="mx-12" :sort="sortPhoneNumber" />
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
              :class="[collectionPoint.actionIcon, 'ml-0']"
              @click="(event) => handleClickEdit(event, record.id)"
            />
            <img
              src="@/assets/icons/ic_btn_delete.svg"
              :class="[collectionPoint.actionIcon]"
              @click="(event) => deleteCollectionPoint(event, record.id)"
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
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import IcTrash from "@/assets/icons/IcTrash.vue";
import { i18n } from "@/i18n";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import NoData from "@/modules/base/components/NoData.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import HeaderRef from "@/modules/base/models/search-header.model";
import SortView from "@/modules/common/components/SortView.vue";
import ThePagination from "@/modules/common/components/ThePagination.vue";
import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import type { TableColumnType } from "ant-design-vue";
import { debounce } from "lodash";
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import { CollectionPointModel } from "../models/collection-point.model";
import { NULL_VALUE_DISPLAY } from "@/utils/constants";

//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
const sortCustomer = ref<Sort>(Sort.None);

const sortName = ref<Sort>(Sort.None);

const sortAddress = ref<Sort>(Sort.None);

const sortPostalCode = ref<Sort>(Sort.None);

const sortPhoneNumber = ref<Sort>(Sort.None);

const selectedKeys = ref<number[]>([]);

const columns: TableColumnType<CollectionPointModel>[] = [
  {
    title: i18n.global.t("customer"),
    dataIndex: "customer___name",
    key: "customer"
  },
  {
    title: i18n.global.t("name"),
    dataIndex: "name",
    key: "name"
  },
  {
    title: i18n.global.t("common_postal_code_label"),
    dataIndex: "postalCode",
    key: "postalCode"
  },
  {
    title: i18n.global.t("address"),
    dataIndex: "address",
    key: "address",
    width: "20%"
  },
  {
    title: i18n.global.t("common_phone_field_name"),
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    width: "20%"
  },
  {
    dataIndex: "action",
    width: "130px"
  }
];
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
const data = ref<CollectionPointModel[]>([]);
const searchValue = ref<string>("");
const searchHeader = ref<HeaderRef | null>(null);
const isLoading = ref<boolean>(false);
const pageOption = reactive<Pagination<CollectionPointModel>>({
  currentPage: 1,
  pageSize: 20,
  total: 0
});
const innerHeight = ref<number>(0);
let sourceData: CollectionPointModel[] = [];
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
onMounted(() => {
  innerHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
  });
  fetchCollectionPointList();
});
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
const resetSort = (): void => {
  sortCustomer.value = Sort.None;
  sortName.value = Sort.None;
  sortAddress.value = Sort.None;
  sortPostalCode.value = Sort.None;
  sortPhoneNumber.value = Sort.None;
};
const customRow = (
  record: CollectionPointModel
): { onClick: (_event: PointerEvent) => void } => {
  return {
    onClick: (_event: PointerEvent): void => {
      _event;
      router.push({
        name: routeNames.collectionPointDetail,
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

const changeSortCustomer = (): void => {
  const backupSortCustomer = sortCustomer.value;
  resetSort();
  sortCustomer.value = calculateNextSortStatus(backupSortCustomer);
  fetchCollectionPointList();
};

const changeSortName = (): void => {
  const backupSortName = sortName.value;
  resetSort();
  sortName.value = calculateNextSortStatus(backupSortName);
  fetchCollectionPointList();
};

const changeSortPostalCode = (): void => {
  const backupSortPostalCode = sortPostalCode.value;
  resetSort();
  sortPostalCode.value = calculateNextSortStatus(backupSortPostalCode);
  fetchCollectionPointList();
};
const changeSortPhoneNumber = (): void => {
  const backupSortPhoneNumber = sortPhoneNumber.value;
  resetSort();
  sortPhoneNumber.value = calculateNextSortStatus(backupSortPhoneNumber);
  fetchCollectionPointList();
};

const changeSortAddress = (): void => {
  const backupSortAddress = sortAddress.value;
  resetSort();
  sortAddress.value = calculateNextSortStatus(backupSortAddress);
  fetchCollectionPointList();
};

const onShowSizeChange = (current: number, pageSize: number): void => {
  pageOption.currentPage = current;
  pageOption.pageSize = pageSize;
  fetchCollectionPointList();
};

const onChange = (pageNumber: number): void => {
  pageOption.currentPage = pageNumber;
  fetchCollectionPointList();
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

const fetchCollectionPointList = async (): Promise<void> => {
  isLoading.value = true;
  const sort = {
    sortCustomer: sortCustomer.value,
    sortName: sortName.value,
    sortPostalCode: sortPostalCode.value,
    sortAddress: sortAddress.value,
    sortPhoneNumber: sortPhoneNumber.value
  };

  const result = await service.collectionPoint.getListCollectionPoint(
    pageOption?.currentPage || 1,
    pageOption.pageSize || 20,
    sort,
    searchValue.value
  );
  isLoading.value = false;

  if (result) {
    sourceData = (result?.results || []).map((item, index) => {
      return { ...item, key: item.id || index + 1 };
    });
    data.value = [...sourceData];
    pageOption.currentPage = result?.currentPage;
    pageOption.pageSize = result?.pageSize || 20;
    pageOption.total = result?.total;
    pageOption.totalPage = result?.totalPage;
  }
};

const onSearchChange = debounce((): void => {
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  fetchCollectionPointList();
}, 500);

const handleClickEdit = ($event: MouseEvent, id: string): void => {
  if ($event.stopPropagation) $event.stopPropagation();

  if (!id) return;
  router.push({
    name: routeNames.editCollectionPoint,
    params: {
      id
    }
  });
};

const deleteCollectionPoint = ($event: MouseEvent, id?: number): void => {
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
      const selectedCollectionPointIds = id ? [id] : selectedKeys.value;
      onDeleteCollectionPoint(selectedCollectionPointIds);
    }
  });
};

const onDeleteCollectionPoint = async (deleteIds: number[]): Promise<void> => {
  if (!deleteIds.length) {
    return;
  }
  isLoading.value = true;
  const isSuccess = await service.collectionPoint.deleteCollectionPointById(
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
      fetchCollectionPointList();
    }
  });
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  searchValue.value = "";
};

const onCreate = (): void => {
  router.push({ name: routeNames.createCollectionPoint });
};

const handleSearchChange = (currentSearchValue: string): void => {
  searchValue.value = currentSearchValue;
};

const handleBackToList = (): void => {
  if (searchHeader.value) {
    isLoading.value = true;
    searchHeader.value.clearInput();
  }
};
//#endregion===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊

//#===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏Computed
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
//#endregion===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏

//#===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
//#endregion===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍

//===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀Watchers
watch(searchValue, onSearchChange);
//#endregion===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀
</script>

<style lang="scss" module="collectionPoint">
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
