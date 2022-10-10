<template>
  <div class="fill-height d-flex flex-column">
    <ListSearchHeader
      :title="$t('staff_collection_base')"
      v-model:model-value.sync="searchString"
    >
      <template #action>
        <a-button
          class="btn-action color-btn-delete"
          type="primary"
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
  <div class="collection-base-table mx-30">
    <div v-if="listCollectionBase && listCollectionBase.length">
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="listCollectionBase"
        :pagination="false"
        :scroll="{ y: tableMaxHeight }"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'index'">
            <span>{{ $t(column.title) }}</span>
          </template>
          <template v-if="column.isSort">
            <div>
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sort" />
            </div>
          </template>
        </template>
        <template #bodyCell="{ column, index }">
          <template v-if="column.key === 'index'">
            <span>{{ index + 1 }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <img src="@/assets/icons/ic_user.svg" class="action-icon" />
            <img src="@/assets/icons/ic_btn_edit.svg" class="action-icon" />
            <img src="@/assets/icons/ic_btn_delete.svg" class="action-icon" />
          </template>
        </template>
      </a-table>
      <div :class="collectionBase.pagination">
        <a-pagination
          v-model:current="pageOption.currentPage"
          v-model:page-size="pageOption.pageSize"
          :total="pageOption.total"
          :pageSizeOptions="['10', '25', '50']"
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
              :class="[collectionBase.btnPagination, 'mt-10']"
              type="primary"
              ghost
              v-if="item.type === 'prev' && isShowPrevBtn()"
            >
              <img
                src="@/assets/icons/ic_prev.svg"
                :class="[collectionBase.btnIconPrev]"
              />
              <span :class="[collectionBase.action]">Previous</span>
            </a-button>
            <a-button
              :class="[collectionBase.btnPagination, 'mt-10', 'mr-15']"
              type="primary"
              ghost
              v-else-if="item.type === 'next' && isShowNextBtn()"
            >
              <span :class="[collectionBase.action]">Next</span>
              <img
                src="@/assets/icons/ic_next.svg"
                :class="[collectionBase.btnIconNext]"
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
</template>

<script setup lang="ts">
//#region import
import { i18n } from "@/i18n";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { Sort } from "@/modules/common/models/sort.enum";
import { routeNames, router } from "@/routes";
import SortView from "@/modules/common/components/SortView.vue";
import { service } from "@/services";
import { computed, onMounted, reactive, ref } from "vue";
import NoData from "@/modules/base/components/NoData.vue";
import { CollectionBase } from "../models/collection-base.model";
import { Pagination } from "@/modules/common/models/pagination.model";
import IcTrash from "@/assets/icons/IcTrash.vue";

//#endregion

//#region props
//#endregion

//#region variables
const listCollectionBase = ref<CollectionBase[]>();
const selectedKeys = ref<number[]>([]);
const sort = ref<Sort>(Sort.None);
const isLoading = ref<boolean>(false);
const searchString = ref<string>("");
const innerHeight = ref<number>(0);
const pageOption = reactive<Pagination<CollectionBase>>({
  currentPage: 1,
  pageSize: 10,
  total: 0
});
const columns = [
  {
    title: i18n.global.t("collection_name"),
    dataIndex: "name",
    key: "name",
    isSort: true
  },
  {
    title: i18n.global.t("collection_postal_code"),
    dataIndex: "postal_code",
    key: "portal_code",
    isSort: true
  },
  {
    title: i18n.global.t("collection_address"),
    dataIndex: "address",
    key: "address",
    isSort: true
  },
  {
    title: i18n.global.t("collection_phone_number"),
    dataIndex: "phone_number",
    key: "phone_number",
    isSort: true
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
  initialize();
});
//#endregion

//#region function
const onCreate = (): void => {
  router.push({ name: routeNames.createCollectionBase });
};
const handleBackToList = (): void => {
  searchString.value = "";
};
const initialize = async (): Promise<void> => {
  const res = service.collectionBase.getListCollectionBase();
  listCollectionBase.value = res?.results;
  pageOption.currentPage = res?.currentPage;
  pageOption.pageSize = res?.pageSize || 10;
  pageOption.total = res?.total;
  pageOption.totalPage = res?.totalPage;
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
const totalPages = (): number => {
  return Math.ceil(Number(pageOption.total) / Number(pageOption.pageSize));
};

//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
:deep() {
  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: $grey-2;
    border-color: rgba(0, 0, 0, 0.03);
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
