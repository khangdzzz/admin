<template>
  <a-modal wrapClassName="tw" v-model:visible="visible" :width="660" :keyboard="false" :maskClosable="false">
    <template #title>
      <div class="text-center text-[22px] leading-7 font-bold text-neutral-600">
        {{ $t("reference_data") }}
      </div>
    </template>
    <template #closeIcon>
      <close-outlined width="24" @click="visible = false" />
    </template>
    <template #footer>
      <div class="flex justify-center">
        <a-button :loading="loading" :class="[
          'btn--primary-400 w-[180px]',
          selectedItems ? '' : 'btn--disabled'
        ]" @click="handleOk">
          {{ $t("select") }}
        </a-button>
      </div>
    </template>
    <div class="list_wrapper">
      <div class="flex justify-between items-center bg-primary-200 px-[15px] py-[10px]">
        <div class="text-lg text-neutral-600 font-bold">{{ $t("list_data") }}</div>
        <a-input v-model:value="searchText" class="size--default w-[300px]" placeholder="Search user">
          <template #prefix>
            <search-outlined />
          </template>
        </a-input>
      </div>
      <ReferenceDataList :data="filteredData" @select-row="selectRow" />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
//#region import
import { useVModel } from "@/composable/v-model";
import emitter, { EMITTER_EVENTS } from "@/utils/emiiter";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { computed, ref } from "vue";
import ReferenceDataList from "./ReferenceDataList.vue";
import { LocationCollectRouteReferences } from "@/services/dtos/location/location.dto"
import { getLocationHistory } from "@/services/location.service";

//#endregion

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
//#region props
const props = defineProps<{
  modelValue: boolean;
  items: LocationCollectRouteReferences[]
}>();
//#endregion

//#region variables
const selectedItems = ref<LocationCollectRouteReferences | null>(null);
const searchText = ref("");
const visible = useVModel(props, { emit });
const loading = ref(false)
//#endregion

//#region hooks
//#endregion

//#region function
const handleOk = async (): Promise<LocationCollectRouteReferences | undefined> => {
  if (!selectedItems.value) return
  loading.value = true
  const { user_id, last_update_time } = selectedItems.value
  const res = await getLocationHistory({
    user_id,
    last_update_time
  })
  if (!res) return
  const { results } = res
  emitter.emit(
    EMITTER_EVENTS.SELECT_COLLECT_ROUTE_REFERENCE_DATA,
    results.map(x => [x.latitude, x.longitude])
  );
  visible.value = false;
  loading.value = false
};

const selectRow = (value: LocationCollectRouteReferences): void => {
  selectedItems.value = value;
};
//#endregion

//#region computed
const filteredData = computed(() =>
  props.items.filter((x) =>
    searchText.value
      ? [x.user_email, x.user_name].some((x) =>
        x.toLowerCase().includes(searchText.value.toLowerCase())
      )
      : x
  )
);
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.list_wrapper {
  box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid $neutral-200;
}
</style>
