<template>
  <div class="fill-height d-flex flex-column">
    <ListSearchHeader
      ref="searchHeader"
      :title="$t('vehicle')"
      :colTitle="3"
      :colAction="21"
      @onChange="handleSearchChange"
    >
      <template #action>
        <a-button
          class="btn-action color-btn-delete"
          ghost
          type="primary"
          v-if="selectedKeys.length > 0"
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
        <a-button type="primary" class="btn-add-new" @click="onCreate">
          <template #icon>
            <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
          </template>
          {{ $t("add_btn") }}
        </a-button>
      </template>
    </ListSearchHeader>
    <div :class="[vehicleList.tableContainer, 'mx-30 mb-30']">
      <NoData
        :value="searchValue"
        :is-loading="isLoading"
        @onClick="handleBackToList"
        v-if="isLoading || !data || !data.length"
      />

      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        v-if="!isLoading && data && data.length > 0"
        :scroll="{ y: 700 }"
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
              @click="setVehicleId(record.key)"
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
  </div>

  <VehicleDetailModal
    v-if="!!vehicleId"
    :currentVehicle="getVehicleById"
    @close="vehicleId = ''"
  />
</template>

<script setup lang="ts">
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import { i18n } from "@/i18n";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import type { TableColumnType, TableProps } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import { VehicleDetail } from "../models/vehicle.model";
import HeaderRef from "@/modules/base/models/search-header.model";
import VehicleDetailModal from "./VehicleDetailModal.vue";
import NoData from "@/modules/base/components/NoData.vue";
import IcTrash from "@/assets/icons/IcTrash.vue";

type Key = string | number;
//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
const selectedKeys = ref<VehicleDetail[]>([]);

const currentPage = ref<number>(1);

const vehicleId = ref<string | undefined>(undefined);

const columns: TableColumnType<VehicleDetail>[] = [
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
    width: "180px"
  }
];
const data = ref<VehicleDetail[]>([]);
const searchValue = ref<string>("");
const searchHeader = ref<HeaderRef | null>(null);
const isLoading = ref<boolean>(false);

//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
onMounted(() => {
  fetchVehicleList();
});
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
const setVehicleId = (id: string): void => {
  vehicleId.value = id;
};

const rowSelection: TableProps["rowSelection"] = {
  onChange: (selectedRowKeys: Key[], selectedRows: VehicleDetail[]): void => {
    selectedRowKeys;
    selectedRows;
    selectedKeys.value = [...selectedRows];
  },
  columnWidth: "50px"
};

const fetchVehicleList = (): void => {
  isLoading.value = true;
  const res = service.vehicle.getListVehicle();
  isLoading.value = false;
  data.value = res;
};

const onCreate = (): void => {
  router.push({ name: routeNames.createVehicle });
};

const handleSearchChange = (currentSearchValue: string): void => {
  searchValue.value = currentSearchValue;
};

const handleBackToList = (): void => {
  if (searchHeader.value) {
    searchHeader.value.clearInput();
  }
};

//#endregion===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊

//#===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏Computed
const getVehicleById = computed(() =>
  data.value.find((vehicle) => vehicle.key === vehicleId.value)
);
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
  flex-grow: 1;

  .actionIcon {
    margin-left: 20px;
    cursor: pointer;
  }
  .ant-table-cell {
    text-align: center;
  }

  .pagination {
    text-align: start;
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
    background: $grey-2;
    border-color: rgba(0, 0, 0, 0.03);
  }
}
</style>
