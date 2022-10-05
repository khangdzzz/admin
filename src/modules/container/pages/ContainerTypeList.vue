<template>
  <a-spin :tip="$t('common_loading')" :spinning="isLoading">
    <ListSearchHeader
      :title="$t('container_type')"
      @onChange="handleSearchChange"
    >
      <template #action>
        <a-button
          class="btn"
          type="primary"
          ghost
          @click="deleteContainerType(undefined)"
          v-if="selectedKeys.length > 0"
        >
          <template #icon>
            <img src="@/assets/icons/ic_delete.svg" class="btn-icon" />
          </template>
          {{ $t("delete_btn") }}
        </a-button>
        <router-link
          :to="{
            name: routeNames.createContainerType
          }"
        >
          <a-button
            type="primary"
            :class="[containerTypeList.btnAddNew]"
            class="btn btn-add-new"
          >
            <template #icon>
              <img
                src="@/assets/icons/ic_plus.svg"
                :class="[containerTypeList.btnIcon]"
              />
            </template>
            {{ $t("add_container_type") }}
          </a-button>
        </router-link>
      </template>
    </ListSearchHeader>
    <div
      :class="[
        containerTypeList.tableContainer,
        'container-type__table-wrapper'
      ]"
    >
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :pagination="false"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'index'">
            <span>{{ $t(column.title) }}</span>
          </template>
          <template v-if="['name'].includes(column.key)">
            <div @click="changeSort">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sort" />
            </div>
          </template>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'type'">
            <span>{{ record.type }}</span>
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
      <div :class="containerTypeList.pagination" v-if="data.length > 50">
        <a-pagination
          v-model:current="currentPage"
          :total="data.length"
          class="ant-pagination"
        >
          <template #itemRender="{ type, originalElement }">
            <a-button
              :class="[containerTypeList.btnPagination]"
              type="primary"
              ghost
              v-if="type === 'prev'"
            >
              <template #icon>
                <img
                  src="@/assets/icons/ic_prev.svg"
                  :class="[containerTypeList.btnIconPrev]"
                />
                <span :class="[containerTypeList.action]">{{
                  $t("previous_btn")
                }}</span>
              </template>
            </a-button>
            <a-button
              :class="[containerTypeList.btnPagination]"
              type="primary"
              ghost
              v-else-if="type === 'next'"
            >
              <template #icon>
                <span :class="[containerTypeList.action]">{{
                  $t("next_btn")
                }}</span>
                <img
                  src="@/assets/icons/ic_next.svg"
                  :class="[containerTypeList.btnIconNext]"
                />
              </template>
            </a-button>
            <component :is="originalElement" v-else></component>
          </template>

          <template #buildOptionText="{ value }">
            {{ value }}
          </template>
        </a-pagination>
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import SortView from "@/modules/common/components/SortView.vue";
import { Sort } from "@/modules/common/models/sort.enum";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import type { TableColumnType } from "ant-design-vue";
import { computed, inject, onMounted, ref } from "vue";
import ContainerTypeModel, {
  ContainerType
} from "../models/container-type.models";
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

const currentPage = ref<number>(1);

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
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
onMounted(() => {
  fetchListContainerType();
});
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedKeys.value,
    onChange: (keys: number[]): void => {
      selectedKeys.value = keys;
    }
  };
});

const fetchListContainerType = async (): Promise<void> => {
  isLoading.value = true;
  const res = await service.container.getListContainerType();
  isLoading.value = false;
  sourceData = (res?.results || []).map((item, index) => {
    return { ...item, key: item.id || index + 1 };
  });
  data.value = [...sourceData];
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
  sortAndFilterName();
};

const sortAndFilterName = (): void => {
  const filteredData = [...sourceData].filter((containerType) => {
    return containerType.name
      .toLowerCase()
      .includes(searchString.value.toLowerCase());
  });
  switch (sort.value) {
    case Sort.Asc:
      data.value = [...filteredData].sort(
        (firstContainerType, secondContainerType) =>
          firstContainerType.name.localeCompare(secondContainerType.name)
      );
      break;
    case Sort.Desc:
      data.value = [...filteredData].sort(
        (firstContainerType, secondContainerType) =>
          secondContainerType.name.localeCompare(firstContainerType.name)
      );
      break;
    default:
      data.value = [...filteredData];
  }
};
const handleSearchChange = (value: string): void => {
  searchString.value = value || "";
  sortAndFilterName();
};
const deleteContainerType = (id?: number): void => {
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
      title: "vehicle_type_delete_fail_lbl_title",
      message: "vehicle_type_delete_fail_lbl_message",
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
      fetchListContainerType();
    }
  });
};
//#endregion===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊

//#===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏Computed
//#endregion===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏

//#===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
//#endregion===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍

//===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀Watchers
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
  margin: 30px;

  .actionIcon {
    margin-left: 30px;
    cursor: pointer;
  }

  .ant-table-cell {
    text-align: center;
  }

  .pagination {
    text-align: end;
    padding: 10px 0;
    background-color: #fff;

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

.btnAddNew {
  @include size-btn(215px, 48px);
  margin-left: 15px;
  padding: 0px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  a {
    color: $white;
  }
}

.btn {
  @include size-btn(108px, 40px);
  @include text(600, 18px, 100%);
  margin-left: 15px;
  padding: 0px 15px;
  background-color: #fff;
  color: #07a0b8;

  .btnIcon {
    margin-right: 10px;
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
.btn {
  font-weight: 600;
  font-size: 18px;
  width: 120px;
  height: 48px;
  display: flex;
  align-items: center;
  line-height: 18px;
  margin-left: 15px;
  padding: 0 15px 0 15px;

  .btn-icon {
    margin-right: 10px;
  }
}

.btn-add-new {
  width: 170px;
  height: 48px;
}

:deep() {
  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: $grey-2;
    border-color: rgba(0, 0, 0, 0.03);
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
