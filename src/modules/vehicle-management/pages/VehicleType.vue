<template>
  <ListSearchHeader :title="$t('vehicle_type')">
    <template #action>
      <a-button class="btn" type="primary" ghost v-if="selectedRowKeys.length > 0">
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
    <a-table :row-selection="{
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange
    }" :columns="columns" :data-source="data">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          <span>{{ index + 1 }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <img src="@/assets/icons/ic_btn_edit.svg" class="action-icon" @click="editVehicleType" />
          <img src="@/assets/icons/ic_btn_delete.svg" class="action-icon" />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
//#region import
import { i18n } from "@/i18n";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { onMounted, ref } from "vue";
import { VehicleType } from "../models/vehicle.model";

//#endregion

//#region props
//#endregion
type Key = string | number;
//#region variables
const columns = [
  {
    title: i18n.global.t("vehicle_column_no"),
    dataIndex: "index",
    key: "index",
    width: "5%"
  },
  {
    title: i18n.global.t("vehicle_column_name"),
    dataIndex: "name",
    key: "name"
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    width: "8%"
  }
];

// todo: handle any here
// eslint-disable-next-line @typescript-eslint/no-explicit-any

const data = ref<VehicleType[]>([]);
const selectedRowKeys = ref<Key[]>([]);
//#endregion

//#region hooks
onMounted(() => {
  data.value = service.vehicle.getVehicleTypes();
});
//#endregion

//#region function
const onSelectChange = (rowSelect: Key[]): void => {
  selectedRowKeys.value = rowSelect;
};
const onCreate = (): void => {
  router.push({ name: routeNames.createVehicleType });
};
const editVehicleType = (): void => {
  // router.push({ name: routeNames.editVehicleType });
}
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

  .ant-table-container table>thead>tr:first-child th {
    color: $text-1;
  }

  .ant-table-container table>thead>tr:first-child th:first-child {
    border-top-left-radius: 20px;
  }

  .ant-table-container table>thead>tr:first-child th:last-child {
    border-top-right-radius: 20px;
  }

  .ant-table-container table>tbody>tr:last-child td:first-child {
    border-bottom-left-radius: 20px;
  }

  .ant-table-container table>tbody>tr:last-child td:last-child {
    border-bottom-right-radius: 20px;
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

  .ant-table-thead>tr>th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    height: 0;
  }
}
</style>
