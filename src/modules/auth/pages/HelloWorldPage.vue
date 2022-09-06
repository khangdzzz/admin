<script setup lang="ts">
//#region import
import { i18n } from "@/i18n";
import { service } from "@/services";
import { message } from "ant-design-vue";
import { ref } from "vue";
//#endregion

//#region props
//#endregion

//#region variables
const currentLanguage = ref("en");
//#endregion

//#region hooks
//#endregion

//#region function
const changeLanguage = (): void => {
  const newLang = currentLanguage.value === "ja" ? "en" : "ja";
  currentLanguage.value = newLang;
  i18n.global.locale = newLang;
};

const test = async (): Promise<void> => {
  const rs = await service.auth.test()
  if (rs) message.success(rs)
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<template>
  <h1>{{ $t('hello') }}</h1>

  <div class="card">
    <a-button type="primary" @click="changeLanguage">{{
    $t("hello_btn_change_language")
    }}</a-button>

    <a-button type="primary" @click="test">{{
    $t("test")
    }}</a-button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
