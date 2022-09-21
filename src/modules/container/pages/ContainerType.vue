<template>
  <ListSearchHeader :title="$t('vehicle_type')">
    <template #action>
      <a-button class="btn" type="primary" ghost>
        <!-- v-if="selectedRowKeys.length > 0" -->

        <template #icon>
          <img src="@/assets/icons/ic_delete.svg" class="btn-icon" />
        </template>
        Delete
      </a-button>
      <a-button type="primary" class="btn btn-add-new">
        <template #icon>
          <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
        </template>
        Add new type
      </a-button>
    </template>
  </ListSearchHeader>
</template>

<script setup lang="ts">
//#region import
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";

//#endregion

//#region props

//#endregion

//#region variables

//#endregion

//#region hooks
//#endregion

//#region function
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
</style>
