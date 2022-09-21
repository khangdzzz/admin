<template>
  <ListSearchHeader :title="$t('container_container')">
    <template #action>
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
      <a-button
        type="primary"
        class="btn btn-add-new"
        @click="handleAddContainer">
        <template #icon>
          <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
        </template>
        {{ $t("container_add_container") }}
      </a-button>
    </template>
  </ListSearchHeader>
  <div class="table-container">
    <a-table
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :columns="columns"
      :data-source="data">
      <template #bodyCell="{ column, index }">
        <template v-if="column.key === 'index'">
          <span>{{ index + 1 }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <img src="@/assets/icons/ic_btn_edit.svg" class="action-icon" />
          <img src="@/assets/icons/ic_btn_delete.svg" class="action-icon" />
          <img src="@/assets/icons/ic_btn_qrcode.svg" class="action-icon" />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
//#region import
import { i18n } from "@/i18n";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { Container } from "@/modules/container/models/index";
import { routeNames, router } from "@/routes";
import { ref } from "vue";
type Key = string | number;

//#endregion

//#region props

//#endregion

//#region variables
const selectedRowKeys = ref<Key[]>([]);
const columns = [
  {
    title: i18n.global.t("container_container_name"),
    dataIndex: "containerName",
    key: "containerName",
    width: "40%"
  },
  {
    title: i18n.global.t("container_container_type"),
    dataIndex: "containerType",
    key: "containerType",
    width: "40%"
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    width: "15%"
  }
];

const data: Container[] = [];
for (let i = 0; i < 20; i++) {
  data.push({
    key: i,
    containerName: `Basket trolley No. ${i}`,
    containerType: `Folding Container ${i}`
  });
}
//#endregion

//#region hooks
//#endregion

//#region function
const onSelectChange = (rowSelect: Key[]): void => {
  selectedRowKeys.value = rowSelect;
};

const handleAddContainer = (): void => {
  router.push({ name: routeNames.createNewContainer });
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
.action-icon {
  margin-left: 20px;
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
:deep() {
  .ant-table {
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
    background: transparent;
    border: none;
  }

  .ant-table-cell {
    background-color: white;
  }
  .ant-table-thead > tr > th {
    font-weight: 700;
  }
  .ant-table-selection-column {
    padding: 0 18px;
  }

  .ant-table-row-selected .ant-table-cell {
    background-color: $neutral-50;
  }

  .ant-table-container table > thead > tr:first-child th {
    color: $text-1;
  }

  .ant-table-container table > thead > tr:first-child th:first-child {
    border-top-left-radius: 20px;
  }

  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: 20px;
  }

  .ant-table-container table > tbody > tr:last-child td:first-child {
    border-bottom-left-radius: 20px;
  }

  .ant-table-container table > tbody > tr:last-child td:last-child {
    border-bottom-right-radius: 20px;
  }

  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    height: 0;
  }
  .table-container .ant-table-container,
  .ant-checkbox-inner {
    width: 20px !important;
    height: 20px !important;
  }
}
</style>
