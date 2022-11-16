<template>
  <div class="fill-height d-flex flex-column">
    <ListSearchHeader
      ref="searchHeader"
      :title="$t('container_container')"
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
          @click="deleteContainer(undefined)"
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
    <div :class="[containerList.tableContainer, 'mx-30 mb-30']">
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        v-if="!isLoading && data && data.length > 0"
        :scroll="{ y: tableMaxHeight }"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'name'">
            <div @click="changeSortName()">
              <span class="header-title">{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortName" />
            </div>
          </template>
          <template v-if="column.key === 'type'">
            <div @click="changeSortType()">
              <span class="header-title">{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortType" />
            </div>
          </template>

          <template v-if="column.key === 'capacity'">
            <div @click="changeSortCapacity()">
              <span class="header-title">{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortCapacity" />
            </div>
          </template>
          <template v-if="column.key === 'weight'">
            <div @click="changeSortWeight()">
              <span class="header-title">{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortWeight" />
            </div>
          </template>
        </template>

        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'action'">
            <router-link
              :to="{
                name: routeNames.editContainer,
                params: { id: record.id }
              }"
            >
              <img
                src="@/assets/icons/ic_btn_edit.svg"
                :class="[containerList.actionIcon, 'ml-0']"
              />
            </router-link>
            <img
              src="@/assets/icons/ic_btn_delete.svg"
              :class="[containerList.actionIcon]"
              @click="deleteContainer(record.id)"
            />
            <img
              src="@/assets/icons/ic_btn_qrcode.svg"
              :class="[containerList.actionIcon]"
              @click="fetchContainerDetail(record.id)"
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
      <NoData
        :value="searchValue"
        :is-loading="isLoading"
        @onClick="handleBackToList"
        v-if="isLoading || !data || !data.length"
      />
    </div>
  </div>
  <ContainerDetailModal
    v-if="!!containerDetail"
    :detail="containerDetail"
    @close="containerDetail = undefined"
  />
</template>

<script setup lang="ts">
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import { NULL_VALUE_DISPLAY } from "@/modules/common/constants/table.constant";
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
import { Container } from "../models/container.model";
import ContainerDetailModal from "./ContainerDetailModal.vue";

//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
const sortType = ref<Sort>(Sort.None);

const sortName = ref<Sort>(Sort.None);

const sortWeight = ref<Sort>(Sort.None);

const sortCapacity = ref<Sort>(Sort.None);

const selectedKeys = ref<number[]>([]);

const containerDetail = ref<Container | undefined>();

const columns: TableColumnType<Container>[] = [
  {
    title: "container_container_name",
    dataIndex: "containerName",
    key: "name"
  },
  {
    title: "container_container_type",
    dataIndex: "containerType",
    key: "type"
  },
  {
    title: "container_weight",
    dataIndex: "weight",
    key: "weight"
  },
  {
    title: "container_capacity",
    dataIndex: "capacity",
    key: "capacity"
  },
  {
    dataIndex: "action",
    width: "180px"
  }
];
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
const data = ref<Container[]>([]);
const searchValue = ref<string>("");
const searchHeader = ref<HeaderRef | null>(null);
const isLoading = ref<boolean>(false);
const pageOption = reactive<Pagination<Container>>({
  currentPage: 1,
  pageSize: 20,
  total: 0
});
const innerHeight = ref<number>(0);

//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
onMounted(() => {
  innerHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
  });
  fetchContainerList();
});
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
const resetSort = (): void => {
  sortType.value = Sort.None;
  sortName.value = Sort.None;
  sortWeight.value = Sort.None;
  sortCapacity.value = Sort.None;
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

const changeSortType = (): void => {
  const backupSortType = sortType.value;
  resetSort();
  sortType.value = calculateNextSortStatus(backupSortType);
  fetchContainerList();
};

const changeSortName = (): void => {
  const backupSortName = sortName.value;
  resetSort();
  sortName.value = calculateNextSortStatus(backupSortName);
  fetchContainerList();
};

const changeSortCapacity = (): void => {
  const backupSortCapacity = sortCapacity.value;
  resetSort();
  sortCapacity.value = calculateNextSortStatus(backupSortCapacity);
  fetchContainerList();
};

const changeSortWeight = (): void => {
  const backupSortWeight = sortWeight.value;
  resetSort();
  sortWeight.value = calculateNextSortStatus(backupSortWeight);
  fetchContainerList();
};

const onShowSizeChange = (current: number, pageSize: number): void => {
  pageOption.currentPage = current;
  pageOption.pageSize = pageSize;
  fetchContainerList();
};

const onChange = (pageNumber: number): void => {
  pageOption.currentPage = pageNumber;
  fetchContainerList();
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

const fetchContainerList = async (): Promise<void> => {
  const sort = {
    sortType: sortType.value,
    sortName: sortName.value,
    sortCapacity: sortCapacity.value,
    sortWeight: sortWeight.value
  };

  isLoading.value = true;
  const res = await service.container.getListContainer(
    Number(pageOption.currentPage),
    Number(pageOption.pageSize),
    sort,
    searchValue.value
  );
  isLoading.value = false;

  if (res) {
    data.value = res.results || [];
    pageOption.currentPage = res.currentPage;
    pageOption.total = res.total;
  }
};

const onSearchChange = debounce((): void => {
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  fetchContainerList();
}, 500);

const deleteContainer = (id?: number): void => {
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
      const selectedContainerIds = id ? [id] : selectedKeys.value;
      onDeleteContainer(selectedContainerIds);
    }
  });
};

const onDeleteContainer = async (deleteIds: number[]): Promise<void> => {
  if (!deleteIds.length) {
    return;
  }
  isLoading.value = true;
  const isSuccess = await service.container.deleteContainer(deleteIds);
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
      fetchContainerList();
    }
  });
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  searchValue.value = "";
};

const onCreate = (): void => {
  router.push({ name: routeNames.createNewContainer });
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

const fetchContainerDetail = async (id: number): Promise<void> => {
  isLoading.value = true;
  const res = await service.container.getContainerById(id);
  isLoading.value = false;
  if (res) {
    containerDetail.value = res;
  }
};
//#endregion===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊

//#===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏Computed
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
//#endregion===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏

//#===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
//#endregion===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍

//===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀Watchers
watch(searchValue, onSearchChange);
//#endregion===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀
</script>

<style lang="scss" module="containerList">
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
