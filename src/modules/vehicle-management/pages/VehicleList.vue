<template>
  <ListSearchHeader :title="$t('vehicle')" :colTitle="3" :colAction="21">
    <template #action>
      <a-button
        :class="[vehicleList.btn]"
        type="primary"
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
      <a-button :class="[vehicleList.btn]" type="primary">
        <template #icon>
          <img
            src="@/assets/icons/ic_import.svg"
            :class="[vehicleList.btnIcon]"
          />
        </template>
        {{ $t("import_btn") }}
      </a-button>
      <a-button :class="[vehicleList.btn]" type="primary">
        <template #icon>
          <img
            src="@/assets/icons/ic_export.svg"
            :class="[vehicleList.btnIcon]"
          />
        </template>
        {{ $t("export_btn") }}
      </a-button>
      <a-button
        type="primary"
        :class="[vehicleList.btnAddNew]"
        @click="onCreate"
      >
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
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'type'">
          <span>{{ record.type }}</span>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <router-link
            :to="{
              name: routeNames.editVehicle,
              params: { id: record.key }
            }"
          >
            <img
              src="@/assets/icons/ic_btn_edit.svg"
              :class="[vehicleList.actionIcon]"
            />
          </router-link>
          <img
            src="@/assets/icons/ic_btn_delete.svg"
            :class="[vehicleList.actionIcon]"
          />
          <img
            src="@/assets/icons/ic_btn_qrcode.svg"
            :class="[vehicleList.actionIcon]"
          />
        </template>
      </template>
    </a-table>
    <div :class="vehicleList.pagination" v-if="data.length > 50">
      <a-pagination
        v-model:current="currentPage"
        :total="data.length"
        class="ant-pagination"
      >
        <template #itemRender="{ type, originalElement }">
          <a-button
            :class="[vehicleList.btnPagination]"
            type="primary"
            ghost
            v-if="type === 'prev'"
          >
            <template #icon>
              <img
                src="@/assets/icons/ic_prev.svg"
                :class="[vehicleList.btnIconPrev]"
              />
              <span :class="[vehicleList.action]">Previous</span>
            </template>
          </a-button>
          <a-button
            :class="[vehicleList.btnPagination]"
            type="primary"
            ghost
            v-else-if="type === 'next'"
          >
            <template #icon>
              <span :class="[vehicleList.action]">Next</span>
              <img
                src="@/assets/icons/ic_next.svg"
                :class="[vehicleList.btnIconNext]"
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
</template>

<script setup lang="ts">
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import { onMounted, ref } from "vue";
import type { TableProps, TableColumnType } from "ant-design-vue";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { i18n } from "@/i18n";
import { service } from "@/services";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";

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

const currentPage = ref<number>(1);

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
    dataIndex: "action",
    width: "20%"
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

const fetchVehicleList = (): void => {
  const res = service.vehicle.getListVehicle();
  data.value = res;
};

const onCreate = (): void => {
  router.push({ name: routeNames.createVehicle });
};
//#endregion===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊

//#===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏Computed
//#endregion===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏

//#===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
//#endregion===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍

//===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀Watchers
//#endregion===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀
</script>

<style lang="scss" module="vehicleList">
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
    margin-left: 20px;
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
  @include size-btn(170px, 48px);
  margin-left: 15px;
  padding: 0px 15px;
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

:deep() {
  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: #f7f7f7;
    border-color: rgba(0, 0, 0, 0.03);
  }
  .ant-pagination {
    .ant-pagination-options {
      float: left;
      @include size-btn(60px, 30px);
      @extend .flex-center;
      .ant-select {
        .ant-select-selector {
          @extend .border;
        }
      }
    }
    .ant-pagination-prev {
      height: 40px;
    }

    .ant-pagination-next {
      height: 40px;
    }

    .ant-pagination-item {
      @include size-btn(40px, 40px);
      @include pagination-item(#ffffff);
      padding: 0px;

      a {
        @extend .flex-center;
        height: 100%;
        @include pagination-item(#ffffff);
        @include text(700, 14px, 18px);
      }
    }

    .ant-pagination-item-active {
      a {
        color: #ffffff;
        @include pagination-item(#07a0b8);
        @include text(700, 14px, 18px);
      }
    }
  }
}
</style>
