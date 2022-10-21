<template>
  <div class="fill-height d-flex flex-column">
    <ListSearchHeader
      :title="$t('container_type')"
      v-model:model-value.sync="searchString"
    >
      <template #action>
        <a-button
          class="btn-action color-btn-delete"
          type="primary"
          ghost
          @click="deleteContainerType(undefined)"
          v-if="selectedKeys.length > 0"
        >
          <template #icon>
            <IcTrash class="btn-icon" :color="'#F54E4E'" />
          </template>
          {{ $t("delete_btn") }}
        </a-button>

        <a-button type="primary" class="btn-add-new" @click="onCreate">
          <template #icon>
            <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
          </template>
          {{ $t("add_btn") }}
        </a-button>
      </template>
    </ListSearchHeader>
    <div :class="[containerTypeList.tableContainer, 'mx-30']">
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :scroll="{ y: tableMaxHeight }"
        v-if="!isLoading && data && data.length"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'index'">
            <span>{{ $t(column.title) }}</span>
          </template>
          <template v-if="['name'].includes(column.key)">
            <div :class="[containerTypeList.headerTitle]" @click="changeSort">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sort" />
            </div>
          </template>
        </template>
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'type'">
            <span v-if="text" class="has-value">{{ text }} </span>
            <span class="null-value" v-else>---</span>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <center>
              <router-link
                :to="{
                  name: routeNames.editContainerType,
                  params: {
                    id: record.id
                  }
                }"
              >
                <img
                  src="@/assets/icons/ic_btn_edit.svg"
                  :class="[containerTypeList.actionIcon]"
                />
              </router-link>
              <img
                src="@/assets/icons/ic_btn_delete.svg"
                :class="[containerTypeList.actionIcon]"
                @click="deleteContainerType(record.id)"
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
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import SortView from "@/modules/common/components/SortView.vue";
import ThePagination from "@/modules/common/components/ThePagination.vue";
import { Sort } from "@/modules/common/models/sort.enum";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import type { TableColumnType } from "ant-design-vue";
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import ContainerTypeModel, {
  ContainerType
} from "../models/container-type.models";
import NoData from "@/modules/base/components/NoData.vue";
import { debounce } from "lodash";
import { Pagination } from "@/modules/common/models";
import { router } from "@/routes";
import IcTrash from "@/assets/icons/IcTrash.vue";

//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
let sourceData: ContainerTypeModel[] = [];
const sort = ref<Sort>(Sort.None);
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
const selectedKeys = ref<number[]>([]);

const pageOption = reactive<Pagination<ContainerType>>({
  currentPage: 1,
  pageSize: 20,
  total: 0
});

const columns: TableColumnType<ContainerType>[] = [
  {
    title: "name",
    dataIndex: "name",
    key: "name"
  },
  {
    dataIndex: "action",
    width: "150px"
  }
];
const data = ref<ContainerTypeModel[]>([]);
const searchString = ref<string>("");
const isLoading = ref<boolean>(false);
const innerHeight = ref<number>(0);
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
onMounted(() => {
  innerHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
  });

  initialize();
});
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedKeys.value,
    onChange: (keys: number[]): void => {
      selectedKeys.value = keys;
    },
    columnWidth: "50px"
  };
});
const onCreate = (): void => {
  router.push({ name: routeNames.createContainerType });
};

const initialize = async (): Promise<void> => {
  isLoading.value = true;
  const res = await service.container.getListContainerType(
    pageOption?.currentPage || 1,
    pageOption?.pageSize ? +pageOption?.pageSize : 20,
    sort.value,
    searchString.value
  );
  isLoading.value = false;
  sourceData = (res?.results || []).map((item, index) => {
    return { ...item, key: item.id || index + 1 };
  });
  data.value = [...sourceData];
  pageOption.currentPage = res?.currentPage;
  pageOption.pageSize = res?.pageSize || 20;
  pageOption.total = res?.total;
  pageOption.totalPage = res?.totalPage;
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

const totalPages = (): number => {
  return Math.ceil(Number(pageOption.total) / Number(pageOption.pageSize));
};
const onSearchChange = debounce((): void => {
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  initialize();
}, 500);

const deleteContainerType = (id?: number): void => {
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
      const selectedVehicleTypeIds = id ? [id] : selectedKeys.value;
      onDeleteContainerType(selectedVehicleTypeIds);
    }
  });
};

const onDeleteContainerType = async (deleteIds: number[]): Promise<void> => {
  isLoading.value = true;
  const isSuccess = await service.container.deleteContainerTypeById(deleteIds);
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
    title: "container_type_delete_successfully",
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
const handleBackToList = (): void => {
  searchString.value = "";
};

const onShowSizeChange = (current: number, pageSize: number): void => {
  pageOption.currentPage = current;
  pageOption.pageSize = pageSize;
  initialize();
};

const onChange = (pageNumber: number): void => {
  pageOption.currentPage = pageNumber;
  initialize();
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
watch(searchString, onSearchChange);
//#endregion===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀
</script>

<style lang="scss" module="containerTypeList">
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

<style scoped lang="scss">
.border {
  border: 1px solid #eaeaea;
  border-radius: 6px;
}

@mixin size-btn($width, $height) {
  min-width: $width;
  height: $height;
}

@mixin text($fontWeight, $fontSize, $lineHeight) {
  font-weight: $fontWeight;
  font-size: $fontSize;
  line-height: $lineHeight;
}

//extend
:deep() {
  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: $grey-2;
    border-color: rgba(0, 0, 0, 0.03);
  }
  .btn-pagination.ant-btn[disabled] {
    background-color: $neutral-0 !important;
  }

  .has-value,
  .null-value {
    @include text(400, 16px, 20px);
    color: $neutral-600;
  }
  .options-text {
    color: $neutral-600;
  }
}
</style>
<style lang="scss">
.container-type {
  &__table-wrapper {
    .ant-checkbox-inner {
      &::after {
        top: 45%;
        left: 30%;
      }
    }
  }
}
</style>
