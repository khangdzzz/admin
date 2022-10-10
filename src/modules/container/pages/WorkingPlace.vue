<template>
  <ListSearchHeader
    :title="$t('vehicle_type')"
    v-model:model-value.sync="searchString"
  >
    <template #action>
      <a-button
        class="btn-action color-btn-delete"
        type="primary"
        ghost
        v-if="selectedKeys.length > 0"
      >
        <template #icon>
          <IcTrash class="btn-icon" :color="'#F54E4E'" />
        </template>
        {{ $t("delete_btn") }}
      </a-button>
      <a-button class="btn btn-action" type="primary" ghost>
        <template #icon>
          <img src="@/assets/icons/ic_import.svg" class="btn-icon" />
        </template>
        {{ $t("import_btn") }}
      </a-button>
      <a-button class="btn btn-action" type="primary" ghost>
        <template #icon>
          <img src="@/assets/icons/ic_export.svg" class="btn-icon" />
        </template>
        {{ $t("export_btn") }}
      </a-button>
      <a-button type="primary" class="btn btn-add-new">
        <template #icon>
          <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
        </template>
        {{ $t("add_btn") }}
      </a-button>
    </template>
  </ListSearchHeader>
</template>

<script setup lang="ts">
//#region import
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import IcTrash from "@/assets/icons/IcTrash.vue";

import { ref } from "vue";

//#endregion

//#region props

//#endregion

//#region variables
const selectedKeys = ref<number[]>([]);
const searchString = ref<string>("");

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
</style>
