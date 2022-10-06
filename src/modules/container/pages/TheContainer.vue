<template>
  <ListSearchHeader :title="$t('container_container')">
    <template #action>
      <a-button
        class="btn-action"
        type="primary"
        ghost
        v-if="selectedKeys.length > 0"
      >
        <template #icon>
          <img src="@/assets/icons/ic_delete.svg" class="btn-icon" />
        </template>
        {{ $t("delete_btn") }}
      </a-button>
      <a-button class="btn-action" type="primary" ghost>
        <template #icon>
          <img src="@/assets/icons/ic_import.svg" class="btn-icon" />
        </template>
        {{ $t("import_btn") }}
      </a-button>
      <a-button class="btn-action" type="primary" ghost>
        <template #icon>
          <img src="@/assets/icons/ic_export.svg" class="btn-icon" />
        </template>
        {{ $t("export_btn") }}
      </a-button>
      <a-button type="primary" class="btn-add-new" @click="handleAddContainer">
        <template #icon>
          <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
        </template>
        {{ $t("container_add_container") }}
      </a-button>
    </template>
  </ListSearchHeader>
  <div class="table-container">
    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data"
      :scroll="{ y: 700 }"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'index'">
          <span>{{ $t(column.title) }}</span>
        </template>
        <template
          v-if="['containerName', 'containerType'].includes(column.key)"
        >
          <div>
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
          <a @click="onEditContainer(record.key)">
            <img src="@/assets/icons/ic_btn_edit.svg" class="action-icon" />
          </a>
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
import SortView from "@/modules/common/components/SortView.vue";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { routeNames, router } from "@/routes";
import { computed, ref } from "vue";
import { Container } from "@/modules/container/models";
import { Sort } from "@/modules/common/models/sort.enum";
type Key = string | number;

//#endregion

//#region props

//#endregion

//#region variables
const sort = ref<Sort>(Sort.None);
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
const selectedKeys = ref<number[]>([]);
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
const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedKeys.value,
    onChange: (keys: number[]): void => {
      selectedKeys.value = keys;
    },
    columnWidth: "50px"
  };
});

const handleAddContainer = (): void => {
  router.push({ name: routeNames.createNewContainer });
};
const onEditContainer = (id: string): void => {
  router.push({ name: routeNames.editContainer, params: { id: id } });
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

:deep() {
  .ant-table {
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
    border: none;
  }
}
</style>
