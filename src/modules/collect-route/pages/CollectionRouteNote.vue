<template>
  <template v-if="!noDivider">
    <div class="bg-grey-3 h-[1px] my-5"></div>
    <CollectRouteReferenceData />
    <div class="bg-grey-3 h-[1px] my-5"></div>
  </template>
  <div class="mb-[10px] text-neutral-600 text-base font-bold capitalize">
    {{ $t("route") }}
  </div>
  <!-- <a-skeleton v-if="loading" active /> -->
  <div class="overflow-auto max-h-[180px]">
    {{ value.length ? value : "---" }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CollectRouteReferenceData from "./CollectRouteReferenceData.vue";

export default defineComponent({
  props: ["value", "loading", "noDivider"],
  components: {
    CollectRouteReferenceData
  }
});
</script>
