<template>
  <a-modal
    v-model:visible="visible"
    width="660px"
    :closable="false"
    class="qr-code-modal"
    centered
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
  >
    <img
      src="@/assets/icons/ic_close.svg"
      :class="ContainerDetailModal.closeIcon"
      @click="$emit('close')"
    />

    <div :class="[ContainerDetailModal.wrap]" class="d-flex align-flex-start">
      <div
        :class="[
          ContainerDetailModal.qrCode,
          'd-flex',
          'flex-column',
          'align-center',
          'justify-center'
        ]"
      >
        <img
          :class="[ContainerDetailModal.imgQr]"
          :src="urlQrCode"
          alt="Vehicle QR Code"
          :srcset="urlQrCode"
        />
        <a-button
          :class="[ContainerDetailModal.btn]"
          type="primary"
          ghost
          @click="downloadQR"
        >
          <template #icon>
            <img
              src="@/assets/icons/ic_download.svg"
              :class="[ContainerDetailModal.btnIcon, 'my-8']"
            />
          </template>
          {{ $t("download_btn") }}
        </a-button>
      </div>
      <div :class="[ContainerDetailModal.infomaitionVehicle]">
        <div
          v-for="item in information"
          :key="item.title"
          :style="{ width: item.width, marginRight: item.marginRight }"
        >
          <div :class="[ContainerDetailModal.title, 'mb-8']">
            {{ item.title }}
          </div>
          <div :class="[ContainerDetailModal.value]">{{ item.value }}</div>
          <a-divider style="border-color: #e8e8e8; margin: 10px 0" />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
import { i18n } from "@/i18n";
import QRCode from "qrcode";
import { onMounted, PropType, reactive, ref, toRefs } from "vue";
import { Container } from "../models/container.model";
import { Base64 } from "js-base64";

//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
const props = defineProps({
  detail: {
    type: Object as PropType<Container> | undefined,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: {}
  }
});

// eslint-disable-next-line vue/no-setup-props-destructure
const { detail } = props;
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
const visible = ref<boolean>(true);

const urlQrCode = ref<string>("");

const form = reactive<{
  information: {
    title: string;
    value: string | number | null | boolean;
    width: string;
    marginRight: string;
  }[];
}>({
  information: [
    {
      title: i18n.global.t("container_container_name"),
      value: detail.containerName || null,
      width: "100%",
      marginRight: "0"
    },
    {
      title: i18n.global.t("container_container_type"),
      value: detail.containerType || null,
      width: "100%",
      marginRight: "0"
    },
    {
      title: i18n.global.t("container_weight"),
      value: detail.weight || null,
      width: "190px",
      marginRight: "20px"
    },
    {
      title: i18n.global.t("container_capacity"),
      value: detail.capacity || null,
      width: "190px",
      marginRight: "0"
    }
  ]
});

const { information } = toRefs(form);
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
onMounted(async () => {
  const qrValue = {
    sys: "EVP",
    type: "container ¥",
    id: detail.id
  };
  const data = Base64.encode(JSON.stringify(qrValue));
  urlQrCode.value = await QRCode.toDataURL(data, { width: 500, margin: 2 });
});
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
const downloadQR = async (): Promise<void> => {
  const anchor = document.createElement("a");
  anchor.href = urlQrCode.value;
  anchor.download = `${detail.containerName}`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};
//#endregion===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊

//#===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏Computed
//#endregion===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏

//#===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
//#endregion===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍

//===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀Watchers
//#endregion===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀
</script>

<style lang="scss">
.qr-code-modal {
  .ant-modal-content {
    border-radius: 10px !important;
  }
  .ant-modal-body {
    padding: 30px 20px 20px;
  }
}
</style>

<style lang="scss" module="ContainerDetailModal">
@mixin titleValue($fw, $fs, $lh, $color) {
  font-weight: $fw;
  font-size: $fs;
  line-height: $lh;
  color: $color;
}
.closeIcon {
  position: absolute;
  width: 16px;
  height: 16px;
  top: 14px;
  right: 14px;
  cursor: pointer;
}
.wrap {
  .infomaitionVehicle {
    display: flex;
    width: 400px;
    flex-wrap: wrap;
    .title {
      @include titleValue(400, 14px, 18px, $text-1);
    }
    .value {
      @include titleValue(600, 18px, 22px, $neutral-600);
    }
  }
  .qrCode {
    margin-right: 20px;

    .imgQr {
      width: 200px;
      height: 200px;
      object-fit: contain;
    }

    .btn {
      margin-top: 20px;
      padding: 0px 15px;
      width: 140px;
      height: 32px;
      margin-bottom: 10px;
      .btnIcon {
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }
      span {
        font-weight: 600;
        font-size: 16px;
        line-height: 100%;
        color: $primary;
      }
    }
  }
}
</style>
