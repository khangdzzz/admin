<template>
  <div v-if="!noDivider" class="bg-neutral-200 h-[1px] my-5"></div>
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
export default defineComponent({
  props: ["value", "loading", "noDivider"]
});
</script>
