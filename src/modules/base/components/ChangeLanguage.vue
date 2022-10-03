<template>
  <div class="language-container" @click="changeLanguage">
    <img :src="logoUrl" class="img-flag" />
    <span class="title-flag">{{ $t("current_language") }}</span>
  </div>
</template>

<script setup lang="ts">
//#region import

import { i18n } from "@/i18n";
import { service } from "@/services";
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
  currentLanguage.value = i18n.global.locale;
  if (currentLanguage.value === "en") {
    logoUrl.value = new URL(
      "../../../assets/images/im_japan_flag.png",
      import.meta.url
    ).href;
  } else {
    logoUrl.value = new URL(
      "../../../assets/images/im_england_flag.png",
      import.meta.url
    ).href;
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
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 2%;
  right: 0;
}

.img-flag {
  width: 30px;
  margin-right: 12px;
}

.title-flag {
  color: $white;
  display: inline-block;
  width: 60px;
  margin-right: 40px;
  background: transparent;
  cursor: pointer;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
}
</style>
