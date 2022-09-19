<template>
  <a-modal
    v-model:visible="visible"
    width="420px"
    :closable="false"
    class="custom-modal"
    centered
    :footer="null"
    :maskClosable="false"
  >
    <div class="modal-content">
      <img :src="modalIcon" class="modal-icon" />
      <h3 class="modal-title">{{ $t(modalTitle) }}</h3>
      <p class="modal-message">{{ $t(modalMessage) }}</p>
      <a-button type="primary" class="btn-ok" @click="onOKClick">OK</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
//#region import
//#endregion

import { Emitter, EventType } from "mitt";
import { inject, onMounted, ref } from "vue";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";

type Modal = {
  type: MessengerType;
  title: string;
  message: string;
  callback: () => void;
};
//#region props
//#endregion

//#region variables

const emitter: Emitter<Record<EventType, unknown>> | undefined =
  inject("emitter");
const visible = ref<boolean>(false);
const modalIcon = ref<string>("");
const modalTitle = ref<string>("");
const modalMessage = ref<string>("");
const action = ref<() => void>();
//#endregion

//#region hooks
onMounted(() => {
  if (emitter) {
    emitter.on("ShowModal", (value) => onShowModal(value as Modal));
  }
});

//#endregion

//#region function
const onShowModal = ({ type, title, message, callback }: Modal): void => {
  const errorIcon = new URL(
    "../../../assets/icons/ic_error.png",
    import.meta.url
  ).href;
  const successIcon = new URL(
    "../../../assets/icons/ic_success.png",
    import.meta.url
  ).href;
  visible.value = true;
  modalMessage.value = message;
  modalIcon.value = type === MessengerType.Error ? errorIcon : successIcon;
  modalTitle.value = title;
  action.value = callback;
};

const onOKClick = (): void => {
  if (action.value) {
    action.value();
  }
  visible.value = false;
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
    font-size: 18px;
    line-height: 22px;
    text-align: center;
  }

  .modal-message {
    color: $text-1;
    margin-top: 10px;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
  }

  .btn-ok {
    font-family: "Roboto";
    font-style: normal;
    width: 360px;
    height: 48px;
    font-weight: 600;
    font-size: 18px;
    line-height: 18px;
  }
}

.custom-modal .ant-modal-content {
  border-radius: 30px !important;
}
</style>
