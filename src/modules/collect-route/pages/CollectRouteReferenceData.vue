<template>
  <div class="flex justify-between mb-5">
    <div class="text-base font-bold text-neutral-600">{{ $t("reference_data") }}</div>
    <div class="flex items-center">
      <div class="text-base text-neutral-800 mr-[10px]">{{ $t("hide_or_show") }}</div>
      <a-switch @change="handleChange" v-model:checked="checked" />
    </div>
  </div>
  <div class="btn--text-primary-400 btn--small w-[130px]" @click="visible = true">
    {{ $t("show_data") }}
  </div>
  <ReferenceDataDialog v-model="visible" :items="items" />
</template>

<script setup lang="ts">
//#region import
import { ref, onMounted } from "vue";
import ReferenceDataDialog from "./ReferenceDataDialog.vue";
import emitter, { EMITTER_EVENTS } from "@/utils/emiiter";
import { getCollectOrderReferences } from "@/services/location.service"
import { useRoute } from "vue-router";
import { LocationCollectRouteReferences } from "@/services/dtos/location/location.dto"

//#endregion
//#region props
//#endregion

//#region variables
const visible = ref(false);
const checked = ref(false);
const items = ref<LocationCollectRouteReferences[]>([])
//#endregion

//#region hooks
onMounted(async () => {
  const collectRouteId = useRoute().params.id
  if (collectRouteId) {
    const results = await getCollectOrderReferences(+collectRouteId)
    if (results) items.value = results
  }
})
//#endregion

//#region function
const handleChange = (): void => {
  emitter.emit(EMITTER_EVENTS.SHOW_COLLECT_ROUTE_REFERENCE_DATA, checked.value);
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>

</style>
