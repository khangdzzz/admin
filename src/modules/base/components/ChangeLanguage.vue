<template>
  <div class="language-container">
    <img :src="logoUrl" class="img-flag" @click="changeLanguage" />
    <span @click="changeLanguage" class="title-flag">{{
      $t("current_language")
    }}</span>
  </div>
</template>

<script setup lang="ts">
//#region import
import { service } from "@/services";
import { localStorageKeys } from "@/services/local-storage-keys";
import { onMounted, ref } from "vue";
//#endregion

//#region props
//#endregion

//#region variables
const currentLanguage = ref<string | null>();
const logoUrl = ref<string>("");

//#endregion

//#region hooks
onMounted(() => {
  setLogoUrl();
});

//#endregion

//#region function
const changeLanguage = (): void => {
  service.language.changeLanguage();
  setLogoUrl();
};
const setLogoUrl = (): void => {
  currentLanguage.value = service.localStorage.getItem(
    localStorageKeys.currentLanguage
  );
  if (currentLanguage.value === "en") {
    logoUrl.value = "src/assets/images/im_japan_flag.png";
  } else {
    logoUrl.value = "src/assets/images/im_england_flag.png";
  }
};

//#endregion

//#region computed

//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.language-container {
  float: right;
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.img-flag {
  width: 30px;
  margin-right: 5px;
}
.title-flag {
  color: $white;
  display: inline-block;
  width: 60px;
  background: transparent;
  margin-right: 30px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
}
</style>
