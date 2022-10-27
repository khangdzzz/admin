<template>
  <a-spin
    :spinning="isLoading"
    :tip="$t('common_loading')"
    class="customer-detail__spin"
  >
    <div class="d-flex flex-column customer-detail">
      <ListSearchHeader
        :title="$t('customer_detail')"
        :enable-search="false"
        :enable-back="true"
        @goBack="handleClickGoBack"
      >
        <template #action>
          <a-button class="btn-action" type="primary" @click="editCustomer">
            <template #icon>
              <img src="@/assets/icons/ic_btn_edit.svg" class="btn-icon" />
            </template>
            {{ $t("edit_btn") }}
          </a-button>
          <a-button
            class="btn-action color-btn-delete"
            ghost
            type="primary"
            @click="handleClickDelete"
          >
            <template #icon>
              <IcTrash class="btn-icon" :color="'#F54E4E'" />
            </template>
            {{ $t("delete_btn") }}
          </a-button>
        </template>
      </ListSearchHeader>
      <div class="customer-detail__infor-wrapper p-20 mx-30">
        <div
          v-for="(item, index) in customerDetails"
          :key="index + item.key"
          class="customer-detail__outter-item-wrapper mb-15"
        >
          <div
            v-if="item.key !== 'pair'"
            class="customer-detail__item-wrapper pb-10"
          >
            <div class="customer-detail__label mb-8">{{ $t(item.key) }}</div>
            <div class="customer-detail__value">{{ item.value }}</div>
          </div>
          <div class="d-flex gap-20" v-else>
            <div
              v-for="(pairItem, index) in item.value"
              :key="index + pairItem.key"
              class="customer-detail__item-wrapper fill-width pb-10"
            >
              <div class="customer-detail__label mb-8">
                {{ $t(pairItem.key) }}
              </div>
              <div class="customer-detail__value">{{ pairItem.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
//#region import
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import { router } from "@/routes";
import { routeNames } from "@/routes/route-names";
import { inject, onMounted, ref } from "vue";
import { service } from "@/services";
import IcTrash from "@/assets/icons/IcTrash.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { NULL_VALUE_DISPLAY } from "@/utils/constants";
//#endregion

//#region props
//#endregion

//#region variables
const isLoading = ref<boolean>(false);
const customerDetails = ref();
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
//#endregion

//#region hooks
onMounted(async () => {
  await initialize();
});
//#endregion

//#region function
const initialize = async (): Promise<void> => {
  const customerId = router.currentRoute.value.params.id;
  isLoading.value = true;
  const { error, res } = await service.customer.getCustomerDetail(+customerId);
  isLoading.value = false;

  if (!error && res) {
    const {
      name,
      short_name,
      name_kana,
      postal_code,
      address,
      mail,
      representative,
      external_code,
      telephone
    } = res;

    customerDetails.value = [
      { key: "name", value: name || NULL_VALUE_DISPLAY },
      { key: "short_name", value: short_name || NULL_VALUE_DISPLAY },
      { key: "name_kana", value: name_kana || NULL_VALUE_DISPLAY },
      { key: "postal_code", value: postal_code || NULL_VALUE_DISPLAY },
      { key: "address", value: address || NULL_VALUE_DISPLAY },
      { key: "phone_number", value: telephone || NULL_VALUE_DISPLAY },
      { key: "collection_email", value: mail || NULL_VALUE_DISPLAY },
      {
        key: "pair",
        value: [
          {
            key: "representative",
            value: representative || NULL_VALUE_DISPLAY
          },
          {
            key: "external_code",
            value: external_code || NULL_VALUE_DISPLAY
          }
        ]
      }
    ];
  }
};

const handleClickGoBack = (): void => {
  router.push({ name: routeNames.customerList });
};

const handleClickDelete = (): void => {
  if (!router.currentRoute.value.params?.id) return;

  messenger({
    title: "popup_msg_confirm_delete",
    message: "",
    type: MessengerType.Confirm,
    buttonOkTitle: "btn_delete",
    callback: async (isConfirm: boolean): Promise<void> => {
      if (!isConfirm) {
        return;
      }
      deleteCustomer(+router.currentRoute.value.params?.id);
    }
  });
};

const deleteCustomer = async (id: number): Promise<void> => {
  isLoading.value = true;
  const isSuccess = await service.customer.deleteCustomerById([id]);
  isLoading.value = false;
  if (!isSuccess) {
    messenger({
      title: "popup_delete_fail_lbl_title",
      message: "",
      type: MessengerType.Error
    });
    return;
  }
  messenger({
    title: "customer_delete_successfully",
    message: "",
    type: MessengerType.Success,
    callback: (isConfirm: boolean): void => {
      isConfirm;
    }
  });
  router.push({ name: routeNames.customerList });
};

const editCustomer = async (): Promise<void> => {
  const customerId = router.currentRoute.value.params.id;
  await router.push({
    name: routeNames.editCustomer,
    params: { id: customerId }
  });
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.ant-spin-nested-loading {
  height: 100%;
}
.customer-detail__spin {
  height: 100vh;
  width: 100%;
}

.customer-detail {
  &__infor-wrapper {
    background-color: $white;
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
    border-radius: 10px;
  }

  &__outter-item-wrapper {
    &:last-child {
      margin-bottom: 0px !important;
    }
  }

  &__item-wrapper {
    border-bottom: 1px solid $neutral-200;
  }

  &__label {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: $neutral-400;
  }

  &__value {
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    color: $neutral-600;
  }
}
</style>
