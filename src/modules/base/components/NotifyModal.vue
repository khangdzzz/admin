<template>
  <a-modal v-model:visible="visible" width="420px" :closable="false" class="custom-modal" centered :footer="null">
    <div class="modal-content">
      <img :src="modalIcon" class="modal-icon" />
      <h3 class="modal-title">{{ $t(modalTitle) }}</h3>
      <p class="modal-message">{{ $t(modalMessage) }}</p>
      <a-button type="primary" class="btn-ok" @click="visible = false">OK</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
//#region import
//#endregion

import { inject, onMounted, ref } from "vue";

type Modal = {
  icon: string;
  title: string;
  message: string;
};
//#region props
// const props = defineProps<{
//   visible: boolean;
//   icon: string;
//   title: string;
//   message: string;
// }>();
//#endregion

//#region variables

const emitter = inject("emitter");
const visible = ref<boolean>(false);
const modalIcon = ref<string>("");
const modalTitle = ref<string>("");
const modalMessage = ref<string>("");
//#endregion

//#region hooks
onMounted(() => {
  emitter.on("ShowModal", (value: Modal) => onShowModal(value));
});

//#endregion

//#region function
const onShowModal = ({ icon, title, message }: Modal): void => {
  visible.value = true;
  modalMessage.value = message;
  modalIcon.value = icon;
  modalTitle.value = title;
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss">
.modal-content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .modal-icon {
    margin-bottom: 24px;
  }

  .modal-title {
    margin: 0;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    line-height: 28px;
  }

  .modal-message {
    color: $text-1;
    margin-top: 10px;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
  }

  .btn-ok {
    width: 360px;
    height: 48px;
  }
}

.custom-modal .ant-modal-content {
  border-radius: 20px !important;
}
</style>
