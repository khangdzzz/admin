<template>
  <a-modal
    v-model:visible="visible"
    width="420px"
    :closable="false"
    class="custom-modal"
    centered
    :footer="null"
    :maskClosable="false">
    <div class="modal-content">
      <img
        :src="modalIcon"
        class="modal-icon"
        v-if="modalType !== MessengerType.Confirm" />
      <h3 class="modal-title" v-if="modalTitle">{{ $t(modalTitle) }}</h3>
      <p class="modal-message" v-if="modalMessage">{{ $t(modalMessage) }}</p>
      <a-button
        type="primary"
        class="btn-ok"
        @click="onOKClick"
        v-if="modalType !== MessengerType.Confirm"
        >OK</a-button
      >
      <div v-else class="modal-action-container">
        <a-button
          type="primary"
          class="modal-action-container__action-button"
          @click="visible = false"
          ghost>
          Cancel
        </a-button>
        <a-button
          type="primary"
          class="modal-action-container__action-button"
          @click="onOKClick">
          OK
        </a-button>
      </div>
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
const modalType = ref<MessengerType>(MessengerType.Info);
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
  modalType.value = type;
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
  margin: 6px;

  .modal-icon {
    margin-bottom: 24px;
  }

  .modal-title {
    margin: 0;
    margin-bottom: 10px;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    color: $neutral-600;
  }

  .modal-message {
    color: $text-1;
    margin-top: 0px;
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

  .modal-action-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 4px;
    &__action-button {
      font-family: "Roboto";
      font-style: normal;
      width: calc(50% - 5px);
      height: 48px;
      font-weight: 600;
      font-size: 18px;
      line-height: 18px;
    }
  }
}

.custom-modal .ant-modal-content {
  border-radius: 30px !important;
}
</style>
