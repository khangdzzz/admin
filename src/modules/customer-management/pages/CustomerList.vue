<template>
  <ListSearchHeader
    :title="$t('customer')"
    v-model:model-value.sync="searchString"
  >
    <template #action>
      <a-button
        class="btn-action color-btn-delete"
        ghost
        type="primary"
        @click="deleteCustomer(undefined)"
        v-if="selectedKeys.length > 0"
      >
        <template #icon>
          <IcTrash class="btn-icon" :color="'#F54E4E'" />
        </template>
        {{ $t("delete_btn") }}
      </a-button>
      <a-button class="btn" type="primary" ghost>
        <template #icon>
          <img src="@/assets/icons/ic_import.svg" class="btn-icon" />
        </template>
        {{ $t("import_btn") }}
      </a-button>
      <a-button class="btn" type="primary" ghost>
        <template #icon>
          <img src="@/assets/icons/ic_export.svg" class="btn-icon" />
        </template>
        {{ $t("export_btn") }}
      </a-button>
      <a-button type="primary" class="btn btn-add-new">
        <template #icon>
          <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
        </template>
        {{ $t("add_btn") }}
      </a-button>
    </template>
  </ListSearchHeader>
  <div class="customer-list__table-container mx-30">
    <a-table
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
        columnWidth: '50px'
      }"
      :scroll="{ y: tableMaxHeight }"
      :columns="columns"
      :data-source="data"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a>
            <img src="@/assets/icons/ic_btn_edit.svg" class="action-icon" />
          </a>
          <a @click="deleteCustomer(record.id)">
            <img src="@/assets/icons/ic_btn_delete.svg" class="action-icon"
          /></a>
        </template>
        <template v-if="column.key === 'name'">
          <a-tooltip placement="topLeft">
            <template #title>
              <span>External code: {{ record.externalCode }}</span>
            </template>
            {{ record.name }}
          </a-tooltip>
        </template>
      </template>
    </a-table>
  </div>
  <div class="customer-list__pagination mx-30">
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
      <template #itemRender="{ type, originalElement }">
        <a-button
          class="btnPagination btn-pagination mt-10"
          type="primary"
          v-if="type === 'prev'"
          v-show="isShowPrevBtn()"
        >
          <template #icon>
            <img src="@/assets/icons/ic_prev.svg" class="btnIconPrev" />
            <span class="action">{{ $t("previous_btn") }}</span>
          </template>
        </a-button>
        <a-button
          class="btnPagination btn-pagination mt-10 mr-15"
          type="primary"
          v-else-if="type === 'next'"
          v-show="isShowNextBtn()"
        >
          <template #icon>
            <span class="action">{{ $t("next_btn") }}</span>
            <img src="@/assets/icons/ic_next.svg" class="btnIconNext" />
          </template>
        </a-button>
        <component :is="originalElement" v-else></component>
      </template>
    </a-pagination>
  </div>
</template>

<script setup lang="ts">
//#region import
import IcTrash from "@/assets/icons/IcTrash.vue";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { computed, onMounted, reactive, ref, inject } from "vue";
import { columns } from "../models/CustomerListColumn";
import { data } from "../models/CustomerListData";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { service } from "@/services";

//#endregion

//#region props
//#endregion

//#region variables
const isLoading = ref<boolean>(false);
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
const selectedKeys = ref<number[]>([]);
const selectedRowKeys = ref([]);
const innerHeight = ref<number>(0);
const pageOption = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 1
});
const searchString = ref<string>("");
//#endregion

//#region hooks
onMounted(() => {
  innerHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
  });
});
//#endregion

//#region function
const onSelectChange = (rowSelect: []): void => {
  selectedRowKeys.value = rowSelect;
};

const onShowSizeChange = (current: number, pageSize: number): void => {
  pageOption.currentPage = current;
  pageOption.pageSize = pageSize;
};

const onChange = (pageNumber: number): void => {
  pageOption.currentPage = pageNumber;
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
const deleteCustomer = (id?: number): void => {
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
  const isSuccess = await service.container.deleteContainerTypeById(deleteIds);
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
    title: "customer_delete_successfully",
    message: "",
    type: MessengerType.Success,
    callback: (isConfirm: boolean): void => {
      isConfirm;
      // initialize();
    }
  });
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  searchString.value = "";
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

//#region reactive
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
}
</style>
<style lang="scss">
.customer-list {
  &__table-container {
    .ant-checkbox-inner {
      &::after {
        top: 45%;
        left: 30%;
      }
    }
  }
}
</style>
