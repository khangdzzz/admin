

<template>
    <div class="flex justify-between mb-5">
        <div class="flex items-center gap-5">
            <img v-if="allowBack" src="@/assets/icons/ic_back.svg" @click="emit('back')" />
            <div class="font-bold text-2.5xl text-neutral-600">
                {{ title }}
            </div>
        </div>
        <div v-if="!disabled" class="flex gap-[15px]">
            <div class="btn--text-primary-400 w-[120px]" @click="emit('edit')">
                <img src="@/assets/icons/ic_btn_edit.svg" />{{ $t("edit_btn") }}
            </div>
            <div class="btn--text-red-500 w-[120px]" @click="emit('delete')">
                <IcDelete :color="'#f54e4e'" />{{ $t("delete_btn") }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import IcDelete from "@/assets/icons/IcDelete.vue";
defineProps({
    title: String,
    disabled: Boolean,
    allowBack: Boolean
})
const emit = defineEmits(['delete', 'edit', 'back'])
</script>

<style scoped>

</style>