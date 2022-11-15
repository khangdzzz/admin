<template>
  <a-table :showSorterTooltip="false" bordered :columns="columns" :data-source="data" :pagination="false" :scroll="{
    y: scrollY
  }" :customRow="customRow" :row-class-name="
  (_record) =>
    _record.id === selectedId
      ? 'cursor-pointer row--selected'
      : 'cursor-pointer'
">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'user'">
        {{ record.user_name }} - {{ record.user_email }}
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { LocationCollectRouteReferences } from "@/services/dtos/location/location.dto"
import { i18n } from "@/i18n";

interface Props {
  data: LocationCollectRouteReferences[];
  scrollX?: number;
  scrollY?: number;
}
//#region import
//#endregion

const { t } = i18n.global;
const emit = defineEmits<{
  (e: "selectRow", value: LocationCollectRouteReferences): void;
}>();
//#region props
const props = withDefaults(defineProps<Props>(), {
  scrollY: 348
});
// const props = defineProps<{ data: DataSource[]; scrollX: number }>();
//#endregion

//#region variables
const selectedId = ref<string | null>(null);
const data = computed(() => props.data);
const scrollY = ref(props.scrollY);
const columns = ref([
  {
    dataIndex: "last_update_time",
    key: "last_update_time",
    title: t("date"),
    width: 140,
    sorter: (a: LocationCollectRouteReferences, b: LocationCollectRouteReferences): boolean => a.last_update_time < b.last_update_time
  },
  {
    dataIndex: "user",
    key: "user",
    title: t("user"),
    sorter: (a: LocationCollectRouteReferences, b: LocationCollectRouteReferences): boolean => a.user_name < b.user_name
  }
]);
//#endregion

//#region hooks
//#endregion

//#region function
const customRow = (
  record: LocationCollectRouteReferences,
): { onClick: (_event: PointerEvent) => void } => {
  return {
    onClick: (_event: PointerEvent): void => {
      _event;
      selectedId.value = record.id;
      emit("selectRow", record);
    }
  };
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
:deep() {
  .row--selected {
    td {
      background: $primary-50;
      font-weight: bold;
    }
  }
}
</style>
