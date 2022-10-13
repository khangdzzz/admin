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
      :class="VehicleDetailModal.closeIcon"
      @click="$emit('close')"
    />

    <div :class="[VehicleDetailModal.wrap]" class="d-flex align-flex-start">
      <div
        :class="[
          VehicleDetailModal.qrCode,
          'd-flex',
          'flex-column',
          'align-center',
          'justify-center'
        ]"
      >
        <img
          :class="[VehicleDetailModal.imgQr]"
          :src="urlQrCode"
          alt="Vehicle QR Code"
          :srcset="urlQrCode"
        />
        <a-button :class="[VehicleDetailModal.btn]" type="primary" ghost>
          <template #icon>
            <img
              src="@/assets/icons/ic_download.svg"
              :class="[VehicleDetailModal.btnIcon, 'my-8']"
            />
          </template>
          {{ $t("download_btn") }}
        </a-button>
      </div>
      <div :class="[VehicleDetailModal.infomaitionVehicle]">
        <div v-for="(item, index) in information" :key="item.title">
          <div :class="[VehicleDetailModal.title, 'mb-8']">
            {{ item.title }}
          </div>
          <div :class="[VehicleDetailModal.value]">{{ item.value }}</div>
          <a-divider
            v-if="index < information.length - 1"
            style="border-color: #e8e8e8; margin: 10px 0"
          />
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
import { Vehicle } from "../models/vehicle.model";

interface Information {
  title: string;
  value: string | number | null | boolean;
}
//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆

//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
const props = defineProps({
  currentVehicle: {
    type: Object as PropType<Vehicle> | undefined,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: {}
  }
});

// eslint-disable-next-line vue/no-setup-props-destructure
const { currentVehicle } = props;
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
const visible = ref<boolean>(true);

const urlQrCode = ref<string>("");

const form = reactive<{ information: Information[] }>({
  information: [
    {
      title: i18n.global.t("owner_type"),
      value: currentVehicle.ownerType || null
    },
    {
      title: i18n.global.t("owner"),
      value: currentVehicle.ownerName || null
    },
    {
      title: i18n.global.t("vehicle_type"),
      value: currentVehicle.vehicleType
    },
    {
      title: i18n.global.t("vehicle_name"),
      value: currentVehicle.vehicleName
    },
    {
      title: i18n.global.t("vehicle_number_plate"),
      value: currentVehicle.vehiclePlate
    },
    {
      title: i18n.global.t("vehicle_max_loading_weight"),
      value: currentVehicle.maxWeight || null
    },

    {
      title: i18n.global.t("vehicle_industrial_waste"),
      value: currentVehicle.isHasPermission ? "Yes" : "No"
    }
  ]
});

const { information } = toRefs(form);
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
onMounted(() => {
  const data = Object.values(currentVehicle).toString();
  QRCode.toDataURL(data, (error: Error | null | undefined, url: string) => {
    if (error) {
      throw new Error(error.message);
    }
    urlQrCode.value = url;
  });
});
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods

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

<style lang="scss" module="VehicleDetailModal">
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
    min-width: 400px;
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
      min-width: 200px;
      min-height: 200px;
    }

    .btn {
      padding: 0px 15px;
      width: 140px;
      height: 32px;
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
