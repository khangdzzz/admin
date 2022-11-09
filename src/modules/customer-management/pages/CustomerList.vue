<template>
  <div class="fill-height d-flex flex-column">
    <ListSearchHeader
      :title="$t('customer')"
      ref="searchHeader"
      v-model:model-value.sync="searchString"
    >
      <template #action>
        <a-button
          class="btn-action color-btn-delete"
          ghost
          type="primary"
          v-if="selectedKeys.length > 0"
          @click="(event: MouseEvent)=> deleteCustomer(event, undefined)"
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
        <a-button type="primary" class="btn-add-new" @click="handleClickAdd">
          <template #icon>
            <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
          </template>
          {{ $t("add_new_type_btn") }}
        </a-button>
      </template>
    </ListSearchHeader>
    <div class="customer-list__table-container mx-30">
      <a-table
        :row-selection="rowSelection"
        :scroll="{ y: tableMaxHeight }"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        v-if="!isLoading && data && data.length"
        :customRow="customRow"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'name'">
            <div class="header-title" @click="changeSortName()">
              <span class="header-title">{{ $t("human_name") }}</span>
              <SortView class="mx-12" :sort="sortName" />
            </div>
          </template>

          <template v-if="column.key === 'postalCode'">
            <div class="header-title" @click="changeSortPostalCode()">
              <span class="header-title">{{
                $t("common_postal_code_label")
              }}</span>
              <SortView class="mx-12" :sort="sortPostalCode" />
            </div>
          </template>
          <template v-if="column.key === 'address'">
            <div class="header-title" @click="changeSortAddress()">
              <span class="header-title">{{ $t("address") }}</span>
              <SortView class="mx-12" :sort="sortAddress" />
            </div>
          </template>

          <template v-if="column.key === 'phoneNumber'">
            <div class="header-title" @click="changeSortPhoneNumber()">
              <span class="header-title">{{
                $t("customer_phone_number")
              }}</span>
              <SortView class="mx-12" :sort="sortPhoneNumber" />
            </div>
          </template>

          <template v-if="column.key === 'email'">
            <div class="header-title" @click="changeSortEmail()">
              <span class="header-title">{{
                $t("collection_base_lbl_email")
              }}</span>
              <SortView class="mx-12" :sort="sortEmail" />
            </div>
          </template>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a>
              <img
                src="@/assets/icons/ic_btn_edit.svg"
                class="action-icon,'ml-0'"
                @click="(event: MouseEvent) => handleClickEdit(event, record.key)"
              />
            </a>

            <img
              @click="(event) => deleteCustomer(event, record.id)"
              src="@/assets/icons/ic_btn_delete.svg"
              class="action-icon"
            />
          </template>
          <template v-if="column.key === 'name'">
            <a-tooltip
              overlayClassName="tooltip-name-container"
              placement="topLeft"
            >
              <template #title>
                <span class="tooltip-name-style">
                  <span class="tooltip-name-title">External code: </span>
                  <span class="tooltip-name-description">{{
                    record.externalCode
                  }}</span>
                </span>
              </template>
              {{ record.name }}
            </a-tooltip>
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
//#region import
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
import { routeNames, router } from "@/routes";
import { service } from "@/services";
import { debounce } from "lodash";
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import { CustomerModel } from "../models/customer.model";
import { columns } from "../models/CustomerListColumn";
//#endregion

//#region props
//#endregion

//#region variables
let sourceData: CustomerModel[] = [];
const data = ref<CustomerModel[]>([]);
const isLoading = ref<boolean>(false);
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
const selectedKeys = ref<number[]>([]);
const innerHeight = ref<number>(0);
const pageOption = reactive<Pagination<CustomerModel>>({
  currentPage: 1,
  pageSize: 20,
  total: 1
});
const searchString = ref<string>("");
const searchHeader = ref<HeaderRef | null>(null);
const sortName = ref<Sort>(Sort.None);
const sortEmail = ref<Sort>(Sort.None);
const sortPhoneNumber = ref<Sort>(Sort.None);
const sortAddress = ref<Sort>(Sort.None);
const sortPostalCode = ref<Sort>(Sort.None);

const customRow = (
  record: CustomerModel
): { onClick: (_event: PointerEvent) => void } => {
  return {
    onClick: (_event: PointerEvent): void => {
      _event;
      router.push({
        name: routeNames.customerDetail,
        params: {
          id: record.id
        }
      });
    }
  };
};
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

const handleBackToList = (): void => {
  if (searchHeader.value) {
    isLoading.value = true;
    searchHeader.value.clearInput();
  }
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

const initialize = async (): Promise<void> => {
  const sort = {
    sortName: sortName.value,
    sortAddress: sortAddress.value,
    sortPostalCode: sortPostalCode.value,
    sortPhoneNumber: sortPhoneNumber.value,
    sortEmail: sortEmail.value
  };
  isLoading.value = true;
  const res = await service.customer.fetchListCustomer(
    pageOption?.currentPage || 1,
    pageOption?.pageSize ? +pageOption?.pageSize : 20,
    sort,
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

const resetSort = (): void => {
  sortName.value = Sort.None;
  sortPostalCode.value = Sort.None;
  sortAddress.value = Sort.None;
  sortPhoneNumber.value = Sort.None;
  sortEmail.value = Sort.None;
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

const changeSortAddress = (): void => {
  const changeSortAddress = sortAddress.value;
  resetSort();
  sortAddress.value = calculateNextSortStatus(changeSortAddress);
  initialize();
};

const changeSortPhoneNumber = (): void => {
  const changeSortPhoneNumber = sortPhoneNumber.value;
  resetSort();
  sortPhoneNumber.value = calculateNextSortStatus(changeSortPhoneNumber);
  initialize();
};

const changeSortEmail = (): void => {
  const changeSortEmail = sortEmail.value;
  resetSort();
  sortEmail.value = calculateNextSortStatus(changeSortEmail);
  initialize();
};

const totalPages = (): number => {
  return Math.ceil(Number(pageOption.total) / Number(pageOption.pageSize));
};

const deleteCustomer = ($event: MouseEvent, id?: number): void => {
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
      const selectedCustomerIds = id ? [id] : selectedKeys.value;
      onDeleteCustomer(selectedCustomerIds);
    }
  });
};

const onDeleteCustomer = async (deleteIds: number[]): Promise<void> => {
  isLoading.value = true;
  const isSuccess = await service.customer.deleteCustomerById(deleteIds);
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

const onSearchChange = debounce((): void => {
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  initialize();
}, 500);

const handleClickEdit = ($event: MouseEvent, id: string): void => {
  if ($event.stopPropagation) $event.stopPropagation();
  router.push({ name: routeNames.editCustomer, params: { id } });
};

const handleClickAdd = (): void => {
  router.push({ name: routeNames.createNewCustomer });
};
//#endregion

//#region computed
const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedKeys.value,
    onChange: (keys: number[]): void => {
      selectedKeys.value = keys;
    },
    columnWidth: "50px"
  };
});

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
@mixin size-btn($width, $height) {
  min-width: $width;
  height: $height;
}

@mixin text($fontWeight, $fontSize, $lineHeight) {
  font-weight: $fontWeight;
  font-size: $fontSize;
  line-height: $lineHeight;
}

.btn {
  font-weight: 600;
  font-size: 18px;
  width: 120px;
  height: 48px;
  padding: 0 15px 0 15px;

  &-icon {
    margin-right: 10px;
  }
}

.customer-list {
  &__pagination {
    text-align: end;
    background-color: #fff;
    height: 60px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;

    .btnPagination {
      @include size-btn(108px, 40px);
      padding: 0px 15px;
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

:deep() {
  .ant-table-cell {
    &:last-child {
      text-align: right;
    }
  }

  .ant-table-tbody > tr.ant-table-row-selected:hover > td {
    background: #f7f7f7;
  }

  .ant-table-row {
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.customer-list {
  &__table-container {
    height: 100%;

    .ant-checkbox-inner {
      &::after {
        top: 45%;
        left: 30%;
      }
    }
  }
}

.tooltip-name-container .tooltip-name-style {
  color: $neutral-0;
}

.tooltip-name-container .ant-tooltip-inner {
  border-radius: 8px !important;
  background: rgba(0, 0, 0, 0.9);
  padding: 9px 8px;
}

.tooltip-name-container .tooltip-name-title {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
}

.tooltip-name-container .tooltip-name-description {
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
}

.ant-tooltip-content {
  display: block !important;
}
</style>
