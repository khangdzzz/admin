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
      <img
        :src="modalIcon"
        class="modal-icon"
        v-if="modalType !== MessengerType.Confirm"
      />
      <h3 class="modal-title" v-if="modalTitle">{{ $t(modalTitle) }}</h3>
      <p class="modal-message mb-0 mt-10" v-if="modalMessage">
        {{ $t(modalMessage) }}
      </p>
      <a-button
        type="primary"
        class="btn-ok mt-20"
        @click="onOKClick"
        v-if="modalType !== MessengerType.Confirm"
      >
        {{ $t(btnOk) }}
      </a-button>
      <div v-else class="modal-action-container">
        <a-button
          type="primary"
          class="modal-action-container__action-button"
          @click="onCancelClick"
          ghost
        >
          {{ $t(btnCancel) }}
        </a-button>
        <a-button
          type="primary"
          class="modal-action-container__action-button"
          @click="onOKClick"
        >
          {{ $t(btnOk) }}
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
import MessengerParamModel from "../models/messenger-param.model";
//#region props
//#endregion

//#region variables

const emitter: Emitter<Record<EventType, unknown>> | undefined =
  inject("emitter");
const visible = ref<boolean>(false);
const modalIcon = ref<string>("");
const modalTitle = ref<string>("");
const modalMessage = ref<string>("");
const action = ref<(isConfirm: boolean) => void>();
const modalType = ref<MessengerType>(MessengerType.Info);
const btnOk = ref<string>("btn_ok");
const btnCancel = ref<string>("btn_cancel");
//#endregion

//#region hooks
onMounted(() => {
  if (emitter) {
    emitter.on("ShowModal", (value) =>
      onShowModal(value as MessengerParamModel)
    );
  }
});

//#endregion

//#region function
const onShowModal = ({
  title,
  message,
  type,
  buttonOkTitle,
  buttonCancelTitle,
  callback
}: MessengerParamModel): void => {
  if (buttonOkTitle) {
    btnOk.value = buttonOkTitle;
  }
  if (buttonCancelTitle) {
    btnCancel.value = buttonCancelTitle;
  }
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
    action.value(true);
  }
  visible.value = false;
};
const onCancelClick = (): void => {
  if (action.value) {
    action.value(false);
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
    font-family: "Roboto";
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    line-height: 28px;
    text-align: center;
    color: $neutral-600;
  }

  .modal-message {
    color: $text-1;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    text-align: center;
    margin-bottom: 10px;
  }

  .btn-ok {
    font-family: "Roboto";
    font-style: normal;
    width: 360px;
    height: 48px;
    font-weight: 600;
    font-size: 18px;
    line-height: 18px;
    margin-top: 10px;
  }

  .modal-action-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
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
