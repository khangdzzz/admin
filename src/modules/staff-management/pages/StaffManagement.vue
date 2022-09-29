<template>
  <ListSearchHeader :title="$t('staff')">
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
      <a-button type="primary" class="btn btn-add-new" @click="handleAddStaff">
        <template #icon>
          <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
        </template>
        {{ $t("staff_add_staff") }}
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
      :data-source="data"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'index'">
          <span>{{ $t(column.title) }}</span>
        </template>
        <template
          v-if="
            [
              'employeeCode',
              'name',
              'email',
              'userRole',
              'tenant',
              'collectionBase'
            ].includes(column.key)
          "
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
import { onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { Sort } from "@/modules/common/models/sort.enum";
import { Staff } from "@/modules/staff-management/models";
import { service } from "@/services";

//#endregion

//#region props
//#endregion

//#region variables
const selectedRowKeys = ref<Staff[]>([]);
const sort = ref<Sort>(Sort.None);
const columns = [
  {
    title: i18n.global.t("staff_employee_code"),
    dataIndex: "employeeCode",
    key: "employeeCode"
  },
  {
    title: i18n.global.t("staff_name"),
    dataIndex: "name",
    key: "name"
  },
  {
    title: i18n.global.t("email"),
    dataIndex: "email",
    key: "email"
  },
  {
    title: i18n.global.t("staff_user_role"),
    dataIndex: "userRole",
    key: "userRole"
  },
  {
    title: i18n.global.t("tenant"),
    dataIndex: "tenant",
    key: "tenant"
  },
  {
    title: i18n.global.t("staff_collection_base"),
    dataIndex: "collectionBase",
    key: "collectionBase"
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    width: "110px"
  }
];

const data = ref<Staff[]>([]);
//#endregion

//#region hooks
onMounted(() => {
  fetchListStaff();
});
//#endregion

//#region function
const fetchListStaff = async (): Promise<void> => {
  const res = await service.staff.getlistStaff(1, 10);
  if (res) {
    //Todo: Teddy need to fix this
    data.value = []; //res.results;
  } else {
    message.error("Error");
  }
};
const handleAddStaff = (): void => {
  router.push({ name: routeNames.createNewStaff });
};
const onSelectChange = (rowSelect: Staff[]): void => {
  selectedRowKeys.value = rowSelect;
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
