<template>
  <div class="fill-height d-flex flex-column">
    <ListSearchHeader :title="$t('staff_collection_base')">
      <template #action>
        <a-button class="btn-action" type="primary" ghost>
          <template #icon>
            <img src="@/assets/icons/ic_delete.svg" class="btn-icon" />
          </template>
          {{ $t("delete_btn") }}
        </a-button>
        <a-button type="primary" class="btn-add-new" @click="onCreate">
          <template #icon>
            <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
          </template>
          {{ $t("add_new_type_btn") }}
        </a-button>
      </template>
    </ListSearchHeader>
  </div>
</template>

<script setup lang="ts">
//#region import
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { routeNames, router } from "@/routes";
//#endregion

//#region props
//#endregion

//#region variables
//#endregion

//#region hooks
//#endregion

//#region function
const onCreate = (): void => {
  router.push({ name: routeNames.createCollectionBase });
};

//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped></style>
