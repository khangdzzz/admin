<template>
  <ListSearchHeader :title="$t('vehicle')">
    <template #action>
      <a-button
        :class="[vehicleList.btn]"
        type="primary"
        ghost
        v-if="selectedKeys.length > 0"
      >
        <template #icon>
          <img
            src="@/assets/icons/ic_delete.svg"
            :class="[vehicleList.btnIcon]"
          />
        </template>
        {{ $t("delete_btn") }}
      </a-button>
      <a-button :class="[vehicleList.btn]" type="primary" ghost>
        <template #icon>
          <img
            src="@/assets/icons/ic_import.svg"
            :class="[vehicleList.btnIcon]"
          />
        </template>
        {{ $t("import_btn") }}
      </a-button>
      <a-button :class="[vehicleList.btn]" type="primary" ghost>
        <template #icon>
          <img
            src="@/assets/icons/ic_export.svg"
            :class="[vehicleList.btnIcon]"
          />
        </template>
        {{ $t("export_btn") }}
      </a-button>
      <a-button type="primary" :class="[vehicleList.btnAddNew]">
        <template #icon>
          <img
            src="@/assets/icons/ic_plus.svg"
            :class="[vehicleList.btnIcon]"
          />
        </template>
        {{ $t("add_new_type_btn") }}
      </a-button>
    </template>
  </ListSearchHeader>
  <div :class="[vehicleList.tableContainer]">
    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'type'">
          <span>{{ record.type }}</span>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <img
            src="@/assets/icons/ic_btn_edit.svg"
            :class="[vehicleList.actionIcon]"
          />
          <img
            src="@/assets/icons/ic_btn_delete.svg"
            :class="[vehicleList.actionIcon]"
          />
          <img
            src="@/assets/icons/icon_cell_table.svg"
            :class="[vehicleList.actionIcon]"
          />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import { onMounted, ref } from "vue";
import type { TableProps, TableColumnType } from "ant-design-vue";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { i18n } from "@/i18n";
import { service } from "@/services";

interface DataType {
  key: string;
  type: string;
  name: string;
  numberPlate: string;
}
type Key = string | number;
//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
const selectedKeys = ref<DataType[]>([]);

const columns: TableColumnType<DataType>[] = [
  {
    title: i18n.global.t("vehicle_type"),
    dataIndex: "type"
  },
  {
    title: i18n.global.t("vehicle_name"),
    dataIndex: "name"
  },
  {
    title: i18n.global.t("number_plate"),
    dataIndex: "numberPlate"
  },
  {
    title: "",
    dataIndex: "action",
    width: "10%"
  }
];
const data = ref<DataType[]>([]);
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
onMounted(() => {
  fetchVehicleList();
});
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
const rowSelection: TableProps["rowSelection"] = {
  onChange: (selectedRowKeys: Key[], selectedRows: DataType[]): void => {
    selectedRowKeys;
    selectedKeys.value = [...selectedRows];
  }
};

const fetchVehicleList = () :void =>  {
  const res = service.vehicle.getListVehicle();
  data.value = [...res];
};

//#endregion===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊

//#===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏Computed
//#endregion===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏

//#===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
//#endregion===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍

//===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀Watchers
//#endregion===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀
</script>

<style scoped lang="scss" module="vehicleList">
.tableContainer {
  margin: 30px;

  .actionIcon {
    margin-left: 20px;
  }
}

.btnAddNew {
  width: 170px;
  height: 48px;
  margin-left: 15px;
  padding: 0 15px 0 15px;
}

.btn {
  font-weight: 600;
  font-size: 18px;
  min-width: 120px;
  height: 48px;
  margin-left: 15px;
  padding: 0 15px 0 15px;

  .btnIcon {
    margin-right: 10px;
  }
}
</style>
