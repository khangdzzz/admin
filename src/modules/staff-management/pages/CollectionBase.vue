<template>
  <div class="d-flex flex-column">
    <ListSearchHeader
      :title="$t('staff_collection_base')"
      v-model:model-value.sync="searchString"
    >
      <template #action>
        <a-button
          class="btn-action color-btn-delete"
          type="primary"
          @click="($event: MouseEvent) => deleteCollectionBase($event, undefined)"
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
        <a-button type="primary" class="btn-add-new" @click="onCreate">
          <template #icon>
            <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
          </template>
          {{ $t("add_btn") }}
        </a-button>
      </template>
    </ListSearchHeader>
  </div>
  <div class="table-container mx-30 mb-30">
    <div v-if="!isLoading && data && data.length">
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :scroll="{ y: tableMaxHeight }"
        :customRow="customRow"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'index'">
            <span class="header-title">{{ $t(column.title) }}</span>
          </template>
          <template v-if="column.key === 'name'">
            <div @click="changeSortName()">
              <span class="header-title">{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortName" />
            </div>
          </template>
          <template v-if="column.key === 'postal_code'">
            <div @click="changeSortPostalCode()">
              <span class="header-title">{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortPostalCode" />
            </div>
          </template>
          <template v-if="column.key === 'address'">
            <div @click="changeSortAdress()">
              <span class="header-title">{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortAddress" />
            </div>
          </template>
          <template v-if="column.key === 'telephone'">
            <div @click="changeSortTelephone()">
              <span class="header-title">{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortTelephone" />
            </div>
          </template>
        </template>
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'action'">
            <img
              src="@/assets/icons/ic_user.svg"
              class="action-icon"
              @click="($event) => handleClickUser($event)"
            />
            <img
              src="@/assets/icons/ic_btn_edit.svg"
              class="action-icon"
              @click="($event) => handleClickEdit($event, record.id)"
            />
            <img
              src="@/assets/icons/ic_btn_delete.svg"
              class="action-icon"
              @click="($event) => deleteCollectionBase($event, record.id)"
            />
          </template>
          <template v-else>
            <span>{{ text || NULL_VALUE_DISPLAY }}</span>
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
    </div>
    <NoData
      :value="searchString"
      :is-loading="isLoading"
      @onClick="handleBackToList"
      v-if="isLoading || !data || !data.length"
    />
  </div>
</template>

<script setup lang="ts">
//#region import
import { i18n } from "@/i18n";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { Sort } from "@/modules/common/models/sort.enum";
import { routeNames, router } from "@/routes";
import SortView from "@/modules/common/components/SortView.vue";
import ThePagination from "@/modules/common/components/ThePagination.vue";
import { service } from "@/services";
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import NoData from "@/modules/base/components/NoData.vue";
import { CollectionBase } from "../models/collection-base.model";
import { Pagination } from "@/modules/common/models/pagination.model";
import IcTrash from "@/assets/icons/IcTrash.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { debounce } from "lodash";
import { NULL_VALUE_DISPLAY } from "@/utils/constants";
//#endregion

//#region props
//#endregion

//#region variables
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
const data = ref<CollectionBase[]>([]);
const selectedKeys = ref<number[]>([]);
const sortName = ref<Sort>(Sort.None);

const sortPostalCode = ref<Sort>(Sort.None);

const sortAddress = ref<Sort>(Sort.None);

const sortTelephone = ref<Sort>(Sort.None);

const isLoading = ref<boolean>(false);
const searchString = ref<string>("");
const innerHeight = ref<number>(0);
const pageOption = reactive<Pagination<CollectionBase>>({
  currentPage: 1,
  pageSize: 20,
  total: 0
});
let sourceData: CollectionBase[] = [];
const columns = [
  {
    title: i18n.global.t("collection_name"),
    dataIndex: "name",
    key: "name"
  },
  {
    title: i18n.global.t("common_postal_code_label"),
    dataIndex: "postalCode",
    key: "postal_code"
  },
  {
    title: i18n.global.t("collection_address"),
    dataIndex: "address",
    key: "address"
  },
  {
    title: i18n.global.t("common_phone_field_name"),
    dataIndex: "telephone",
    key: "telephone"
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    width: "200px"
  }
];

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
const resetSort = (): void => {
  sortName.value = Sort.None;
  sortPostalCode.value = Sort.None;
  sortAddress.value = Sort.None;
  sortTelephone.value = Sort.None;
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
  initialize();
};

const changeSortPostalCode = (): void => {
  const backupSortPostalCode = sortPostalCode.value;
  resetSort();
  sortPostalCode.value = calculateNextSortStatus(backupSortPostalCode);
  initialize();
};

const changeSortAdress = (): void => {
  const backupSortAddress = sortAddress.value;
  resetSort();
  sortAddress.value = calculateNextSortStatus(backupSortAddress);
  initialize();
};

const changeSortTelephone = (): void => {
  const backupSortPhone = sortTelephone.value;
  resetSort();
  sortTelephone.value = calculateNextSortStatus(backupSortPhone);
  initialize();
};

const onCreate = (): void => {
  router.push({ name: routeNames.createCollectionBase });
};

const handleBackToList = (): void => {
  if (searchString.value) {
    isLoading.value = true;
    searchString.value = "";
  }
};

const initialize = async (): Promise<void> => {
  isLoading.value = true;
  const sort = {
    sortName: sortName.value,
    sortPostalCode: sortPostalCode.value,
    sortAddress: sortAddress.value,
    sortTelephone: sortTelephone.value
  };

  const result = await service.collectionBase.getListCollectionBase(
    pageOption?.currentPage || 1,
    pageOption.pageSize || 20,
    sort,
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

const isShowPrevBtn = (): boolean => {
  const isFirstPage = pageOption.currentPage === 1;
  if (totalPages() === 1 || isFirstPage) return false;

  return true;
};

const onSearchChange = debounce((): void => {
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  initialize();
}, 500);

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

const deleteCollectionBase = (e: MouseEvent, id?: number): void => {
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

      if (!selectedKeys.value?.length && !id) {
        return;
      }
      const selectedCollectionBaseIds = id ? [id] : selectedKeys.value;
      onDeleteCollectionBase(selectedCollectionBaseIds);
    }
  });
};

const onDeleteCollectionBase = async (deleteIds: number[]): Promise<void> => {
  if (!deleteIds.length) {
    return;
  }
  isLoading.value = true;
  const isSuccess = await service.collectionBase.deleteCollectionBaseById(
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

const customRow = (
  record: CollectionBase
): { onClick: (_event: PointerEvent) => void } => {
  return {
    onClick: (_event: PointerEvent): void => {
      _event;
      router.push({
        name: routeNames.collectionBaseDetail,
        params: {
          id: record.id
        }
      });
    }
  };
};

const handleClickEdit = (e: MouseEvent, id: string): void => {
  if (e && e.stopPropagation) e.stopPropagation();

  router.push({
    name: routeNames.editCollectionBase,
    params: {
      id
    }
  });
};

const handleClickUser = (e: MouseEvent): void => {
  if (e && e.stopPropagation) e.stopPropagation();
  //
};
//#endregion

//#region computed
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

//#region computed
//#endregion

//#region reactive
watch(searchString, onSearchChange);
//#endregion
</script>

<style lang="scss" scoped>
.table-container {
  height: 100%;
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

  .ant-table-row {
    cursor: pointer;
  }
}
</style>

<style lang="scss" scoped module="collectionBase">
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
