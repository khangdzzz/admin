<template>
  <ListSearchHeader :title="$t('vehicle_type')">
    <template #action>
      <a-button class="btn" type="primary" ghost v-if="selectedKeys.length > 0">
        <template #icon>
          <img src="@/assets/icons/ic_delete.svg" class="btn-icon" />
        </template>
        {{ $t("delete_btn") }}
      </a-button>
      <a-button type="primary" class="btn btn-add-new" @click="onCreate">
        <template #icon>
          <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
        </template>
        {{ $t("add_new_type_btn") }}
      </a-button>
    </template>
  </ListSearchHeader>
  <div class="table-container">
    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data"
      :pagination="false">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'index'">
          <span>{{ $t(column.title) }}</span>
        </template>
        <template v-if="column.key === 'name'">
          <div @click="softName">
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
            @click="editVehicleType(record.id)" />
          <img src="@/assets/icons/ic_btn_delete.svg" class="action-icon" />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
//#region import
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import SortView from "@/modules/common/components/SortView.vue";
import { Sort } from "@/modules/common/models/sort.enum";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { TableProps } from "ant-design-vue";
import { Key } from "ant-design-vue/lib/table/interface";
import { onMounted, ref } from "vue";
import { VehicleTypeModel } from "../models";

//#endregion

//#region props
//#endregion
//#region variables
const columns = [
  {
    title: "vehicle_column_no",
    dataIndex: "index",
    key: "index",
    width: "5%"
  },
  {
    title: "vehicle_column_name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    width: "120px"
  }
];

// todo: handle any here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sourceData: VehicleTypeModel[] = [];
const data = ref<VehicleTypeModel[]>([]);
const selectedKeys = ref<VehicleTypeModel[]>([]);
const sort = ref<Sort>(Sort.None);
//#endregion

//#region hooks
onMounted(async () => {
  const result = await service.vehicleType.fetchListVehicleType(1, 10);
  sourceData = (result?.results || []).map((item, index) => {
    return { ...item, key: index + 1 };
  });
  data.value = [...sourceData];
});
//#endregion

//#region function
const rowSelection: TableProps["rowSelection"] = {
  onChange: (
    selectedRowKeys: Key[],
    selectedRows: VehicleTypeModel[]
  ): void => {
    selectedRowKeys;
    selectedKeys.value = [...selectedRows];
  }
};
const onCreate = (): void => {
  router.push({ name: routeNames.createVehicleType });
};
const editVehicleType = (id: string): void => {
  router.push(`edit-vehicle-type/${id}`);
};
const softName = (): void => {
  switch (sort.value) {
    case Sort.Asc:
      sort.value = Sort.Desc;
      data.value = [...sourceData].sort((firtVehicleType, secondVehicleType) =>
        firtVehicleType.name.localeCompare(secondVehicleType.name)
      );
      break;
    case Sort.Desc:
      sort.value = Sort.None;
      data.value = [...sourceData];
      break;
    default:
      sort.value = Sort.Asc;
      data.value = [...sourceData].sort((firtVehicleType, secondVehicleType) =>
        secondVehicleType.name.localeCompare(firtVehicleType.name)
      );
  }
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.table-container {
  margin: 30px;
}

.btn {
  font-weight: 600;
  font-size: 18px;
  width: 120px;
  height: 48px;
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

.action-icon {
  margin-left: 20px;
  cursor: pointer;
}

:deep() {
  .ant-table {
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
    background: transparent;
    border: none;
  }

  .ant-table-cell {
    background-color: white;
  }

  .ant-table-selection-column {
    padding: 0 18px;
  }

  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    background: $white;
  }

  .ant-table-row-selected .ant-table-cell {
    background-color: $neutral-50;
  }

  .ant-table-container table > thead > tr:first-child th {
    color: $text-1;
  }

  .ant-table-container table > thead > tr:first-child th:first-child {
    border-top-left-radius: 10px;
  }

  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: 10px;
  }

  .ant-table-container table > tbody > tr:last-child td:first-child {
    border-bottom-left-radius: 10px;
  }

  .ant-table-container table > tbody > tr:last-child td:last-child {
    border-bottom-right-radius: 10px;
  }

  .ant-pagination-item-active {
    background-color: $primary;
    color: $white;
  }

  .ant-pagination-item {
    font-weight: 700;
    font-size: 14px;
  }

  .ant-pagination-item-active a {
    color: $white;
  }

  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    height: 0;
  }
}
</style>
