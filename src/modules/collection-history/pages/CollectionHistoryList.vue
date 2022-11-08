<template>
  <div class="edit-collection-history m-30">
    <div class="d-flex justify-space-between align-center">
      <div class="edit-collection-history__title mb-20">
        {{ $t("edit_collection_history") }}
      </div>
      <div class="d-flex gap-15">
        <div>search</div>
        <div>unconfirmed</div>
        <div>
          <CustomerDatePicker />
        </div>
        <div>filter</div>
        <div>confirm</div>
      </div>
    </div>

    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data"
      :scroll="{ x: 500, y: 700 }"
      :pagination="false"
    >
      <template #summary>
        <a-table-summary fixed>
          <a-table-summary-row>
            <a-table-summary-cell :index="i" v-for="(item, i) in 17" :key="i">
              <div v-if="item > 7 && item < 12">test</div>
              <div v-else></div>
            </a-table-summary-cell>
          </a-table-summary-row>
        </a-table-summary>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
//#region import
import CustomerDatePicker from "@/modules/base/components/DatePicker.vue";

import { columns } from "@/modules/collection-history/models/table-columns.model";
import { onMounted, ref } from "vue";
import type { TableProps } from "ant-design-vue";
//#endregion

//#region props
//#endregion

//#region variables
const data = ref([]);
//#endregion

//#region hooks
onMounted(() => {
  fakeData();
});
//#endregion

//#region function
const fakeData = (): void => {
  const fakeData: any = [];
  for (let i = 0; i < 20; i++) {
    fakeData.push({
      collectionDate: "2022/10/02",
      username: "tashuma213",
      collectionPoint: "Collection point 1",
      collectionItem: "Clothes",
      vehicle: "120 11-11",
      customer: "Hisashi",
      apportionment: "10.00",
      weight: "80.00",
      quantity: 6,
      packageWeight: "6.00",
      unit: "Kg",
      buyOrSell: "Buy",
      price: "80.00",
      transportationPrice: "0.00",
      disposalPrice: "0.00",
      commissionPrice: "0.00",
      otherPrice: "0.00",
      action: "test"
    });
  }

  data.value = fakeData;
};

const rowSelection: any = {
  onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record: any) => ({
    disabled: record.name === "Disabled User", // Column configuration not to be checked
    name: record.name
  })
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.edit-collection-history {
  &__title {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 36px;
    color: $neutral-600;
  }
}

:deep() {
  .edit-collection-history {
    &__form-card {
      width: 180px;
      .ant-card-body {
        padding: 0 !important;
      }
    }
  }
}
</style>
