<template>
  <a-spin
    :spinning="isLoading"
    :tip="$t('common_loading')"
    class="collection-route-detail__spin"
  >
    <div class="collection-detail-container">
      <div class="collection-detail-header">
        <ListSearchHeader
          :enable-search="false"
          :enable-back="true"
          :title="$t('collection_route_detail')"
          @goBack="handleGoBack"
        >
          <template #action>
            <a-button
              class="btn-action"
              ghost
              type="primary"
              @click="editCollectionRoute()"
            >
              <template #icon>
                <img src="@/assets/icons/ic_btn_edit.svg" class="btn-icon" />
              </template>
              {{ $t("edit_btn") }}
            </a-button>
            <a-button class="btn-action color-btn-delete" ghost type="primary">
              <template #icon>
                <IcTrash class="btn-icon" :color="'#F54E4E'" />
              </template>
              {{ $t("delete_btn") }}
            </a-button>
          </template>
        </ListSearchHeader>
      </div>
      <div :class="[CollectionRouteDetail.detailContent, 'mx-30 px-20 py-20']">
        <div :class="[CollectionRouteDetail.title, 'mb-8']">
          {{ $t("collection_route_name") }}
        </div>
        <div :class="[CollectionRouteDetail.value]">
          {{ collectionRouteDetail?.name }}
        </div>
        <a-divider class="mt-10 mb-15" style="border-color: #e8e8e8" />
        <div :class="[CollectionRouteDetail.title, 'mb-8']">
          {{ $t("collection_route_workplace") }}
        </div>
        <div :class="[CollectionRouteDetail.value]">
          {{ collectionRouteDetail?.workPlace }}
        </div>
        <a-divider class="mt-10 mb-15" style="border-color: #e8e8e8" />
        <div :class="[CollectionRouteDetail.title, 'mb-8']">
          {{ $t("collection_route_detail_note") }}
        </div>
        <div :class="[CollectionRouteDetail.value]">
          <span v-if="collectionRouteDetail?.notice">{{
            collectionRouteDetail?.notice
          }}</span>
          <span v-else>- - -</span>
        </div>
        <a-divider class="mt-10 mb-15" style="border-color: #e8e8e8" />
        <div :class="[CollectionRouteDetail.title, 'mb-8']">
          {{ $t("collection_route_navigation_id") }}
        </div>
        <div :class="[CollectionRouteDetail.value]">
          <span
            :class="[CollectionRouteDetail.link]"
            v-if="collectionRouteDetail?.navigationId"
            >{{ collectionRouteDetail?.navigationId }}</span
          >
          <span v-else>- - -</span>
        </div>
        <a-divider class="mt-10 mb-15" style="border-color: #e8e8e8" />
        <div class="list-collection-point">
          <div class="d-flex justify-space-between collection-point-header">
            <span>{{ $t("list_of_collection_point") }}</span>
            <span
              ><span class="total-item"
                >{{ $t("total_collection_point") }}:</span
              >
              {{ collectionRouteDetail?.listCollectionPoint?.length }}
            </span>
          </div>

          <div
            class="d-flex justify-space-between collection-point-item"
            v-for="(item, index) in collectionRouteDetail?.listCollectionPoint"
            :class="
              index + 1 === collectionRouteDetail?.listCollectionPoint?.length
                ? 'border-item'
                : ''
            "
            :key="item.id"
          >
            <div class="d-flex gap-10">
              <span class="item-index">{{ index + 1 }}</span>
              <span class="item-text">{{ item.name }}</span>
            </div>
            <div class="item-subtext">{{ item.customer___name }}</div>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
//#region import
import IcTrash from "@/assets/icons/IcTrash.vue";
import { routeNames, router } from "@/routes";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { onMounted, ref } from "vue";
import { CollectionRoute } from "../models/collection-route.model";
import { useRoute } from "vue-router";
import { service } from "@/services";

//#endregion

//#region props
//#endregion

//#region variables
const route = useRoute();
const { id } = route.params;
const collectionRouteDetail = ref<CollectionRoute>();
const isLoading = ref<boolean>(false);
//#endregion

//#region hooks
onMounted(() => {
  getCollectionRouteDetail();
});
//#endregion

//#region function
const handleGoBack = (): void => {
  router.push({ name: routeNames.collectionRouteManagement });
};
const getCollectionRouteDetail = async (): Promise<void> => {
  isLoading.value = true;
  const res = await service.collectionRoute.getCollectionRouteById(Number(id));
  isLoading.value = false;
  collectionRouteDetail.value = res;
};
const editCollectionRoute = (): void => {
  router.push({
    params: { id },
    name: routeNames.editCollectionRouteOrder
  });
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>
<style lang="scss" module="CollectionRouteDetail">
@mixin titleValue($fw, $fs, $lh, $color) {
  font-weight: $fw;
  font-size: $fs;
  line-height: $lh;
  color: $color;
}
.detailContent {
  background-color: $white;
  box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
  border-radius: 10px;

  .title {
    @include titleValue(400, 14px, 18px, $text-1);
  }
  .value {
    @include titleValue(600, 18px, 22px, $neutral-600);
  }
  .link {
    color: $primary;
  }
}
</style>
<style lang="scss" scoped>
@mixin text($fw, $fs, $lh, $color) {
  font-weight: $fw;
  font-size: $fs;
  line-height: $lh;
  color: $color;
}
.collection-route-detail__spin {
  height: 100vh;
  width: 100%;
}
.list-collection-point {
  .collection-point-header {
    background-color: $primary-200;
    height: 48px;
    padding: 13px 15px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    @include text(700, 16px, 20px, $neutral-800);
  }
  .total-item {
    @include text(400, 16px, 20px, $neutral-800);
  }
  .collection-point-item {
    padding: 10px 20px 10px 15px;
    background-color: $primary-100;

    .item-index {
      display: block;
      min-height: 20px;
      min-width: 20px;
      background: $primary-400;
      border-radius: 24px;
      @include text(700, 14px, 14px, $white);
      padding: 3px 6px;
    }
    .item-text {
      @include text(400, 16px, 20px, $neutral-600);
    }
    .item-subtext {
      @include text(400, 14px, 18px, $text-1);
    }
  }
  .border-item {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
}
</style>
