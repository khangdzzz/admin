<template>
  <div class="fill-height d-flex flex-column">
    <ListSearchHeader
      :title="$t('vehicle_type')"
      v-model:model-value.sync="searchString"
    >
      <template #action>
        <a-button
          class="btn-action"
          type="primary"
          ghost
          @click="deleteVehicleType(undefined)"
          v-if="selectedKeys.length > 0"
        >
          <template #icon>
            <img src="@/assets/icons/ic_delete.svg" class="btn-icon" />
          </template>
          {{ $t("delete_btn") }}
        </a-button>
        <a-button type="primary" class="btn-add-new" @click="onCreate">
          <template #icon>
            <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
          </template>
          {{ $t("add_new_type_btn") }}
        </a-button>
      </template>
    </ListSearchHeader>
    <div class="table-container mx-30 mb-30">
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :scroll="{ y: 640 }"
        v-if="!isLoading && data && data.length"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'index'">
            <span>{{ $t(column.title) }}</span>
          </template>
          <template v-if="column.key === 'name'">
            <div @click="changeSort">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sort" />
            </div>
          </template>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            <span>{{ index + 1 }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <img
              src="@/assets/icons/ic_btn_edit.svg"
              class="action-icon"
              @click="editVehicleType(record.id)"
            />
            <img
              src="@/assets/icons/ic_btn_delete.svg"
              class="action-icon"
              @click="deleteVehicleType(record.id)"
            />
          </template>
        </template>
      </a-table>

      <NoData
        :value="searchString"
        :is-loading="isLoading"
        @click="handleBackToList"
        v-else
      />
    </div>
  </div>
</template>
<script setup lang="ts">
//#region import
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import SortView from "@/modules/common/components/SortView.vue";
import { Sort } from "@/modules/common/models/sort.enum";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { computed, inject, onMounted, ref, watch } from "vue";
import { VehicleTypeModel } from "../models";
import NoData from "@/modules/base/components/NoData.vue";
import { debounce } from "lodash";
//#endregion

//#region props
//#endregion
//#region variables

const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;

const columns = [
  {
    title: "vehicle_column_name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    width: "150px"
  }
];
// todo: handle any here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sourceData: VehicleTypeModel[] = [];
const data = ref<VehicleTypeModel[]>([]);
const selectedKeys = ref<number[]>([]);
const sort = ref<Sort>(Sort.None);
const isLoading = ref<boolean>(false);
const searchString = ref<string>("");
//#endregion

//#region hooks
onMounted(async () => {
  initialize();
});
//#endregion

//#region function
const initialize = async (): Promise<void> => {
  isLoading.value = true;
  const result = await service.vehicleType.fetchListVehicleType(1, 10);
  isLoading.value = false;
  sourceData = (result?.results || []).map((item, index) => {
    return { ...item, key: item.id || index + 1 };
  });
  data.value = [...sourceData];
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

const onCreate = (): void => {
  router.push({ name: routeNames.createVehicleType });
};
const editVehicleType = (id: string): void => {
  router.push(`edit-vehicle-type/${id}`);
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

const onSearchChange = debounce((): void => {
  sortAndFilterName();
}, 500);

const sortAndFilterName = (): void => {
  const filteredData = [...sourceData].filter((vehicleType) => {
    return vehicleType.name
      .toLowerCase()
      .includes(searchString.value.toLowerCase());
  });
  switch (sort.value) {
    case Sort.Asc:
      data.value = [...filteredData].sort(
        (firstVehicleType, secondVehicleType) =>
          firstVehicleType.name.localeCompare(secondVehicleType.name)
      );
      break;
    case Sort.Desc:
      data.value = [...filteredData].sort(
        (firstVehicleType, secondVehicleType) =>
          secondVehicleType.name.localeCompare(firstVehicleType.name)
      );
      break;
    default:
      data.value = [...filteredData];
  }
};
const deleteVehicleType = (id?: number): void => {
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
      onDeleteVehicleType(selectedVehicleTypeIds);
    }
  });
};

const onDeleteVehicleType = async (deleteIds: number[]): Promise<void> => {
  if (!deleteIds.length) {
    return;
  }
  isLoading.value = true;
  const isSuccess = await service.vehicleType.deleteVehicleTypeById(deleteIds);
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
    title: "vehicle_type_msg_delete_successfully",
    message: "",
    type: MessengerType.Success,
    callback: (isConfirm: boolean): void => {
      isConfirm;
      initialize();
    }
  });
};

const handleBackToList = (): void => {
  searchString.value = "";
};
//#endregion

//#region computed
//#endregion

//#region reactive
watch(searchString, onSearchChange);
//#endregion
</script>

<style lang="scss" scoped>
.table-container {
  margin: 30px;
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
}
</style>
<style lang="scss">
.table-container {
  .ant-checkbox-inner {
    &::after {
      top: 45%;
      left: 30%;
    }
  }
}
</style>
