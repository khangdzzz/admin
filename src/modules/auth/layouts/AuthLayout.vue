<script setup lang="ts">
//#region import
import { computed, ref } from 'vue';
//#endregion

//#region props
//#endregion


//#region variables
const currentLanguage = ref('en');
//#endregion

//#region computed
const flag = computed(() => {
    return currentLanguage.value === 'en' ? '@/assets/images/im_england_flag.png' : 'src/assets/images/im_japan_flag.png'
})
//#endregion

</script>
<template>
    <div class="auth-layout">
        <img class="auth-layout__btn-change-language" src="@/assets/images/im_england_flag.png" />
        <router-view />
    </div>
</template>

<style lang="scss" scoped>
.auth-layout {
    width: 100%;
    height: 100%;
    background-image: url('@/assets/images/im_login_background.png');
    background-size: cover;

    .auth-layout__btn-change-language {
        position: absolute;
        right: 16px;
        top: 40px;
        width: 32px;
        height: 32px;
        border-radius: 16px;
    }
}
</style>