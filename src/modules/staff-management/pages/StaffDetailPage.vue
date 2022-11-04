<template>
  <a-spin
    :spinning="isLoading"
    :tip="$t('common_loading')"
    class="staff-detail__spin"
  >
    <div class="d-flex flex-column staff-detail">
      <ListSearchHeader
        :title="$t('staff_detail')"
        :enable-search="false"
        :enable-back="true"
        @goBack="handleClickGoBack"
      >
        <template #action>
          <div
            :class="[
              'staff-detail__enable-account-btn d-flex align-center gap-15 mr-15',
              isAccountEnable
                ? 'staff-detail__enable-account-btn__enable'
                : 'staff-detail__enable-account-btn__disable'
            ]"
          >
            {{ $t("enable_account") }}
            <a-switch
              v-model:checked="isAccountEnable"
              class="temporarily-disable"
            ></a-switch>
          </div>
          <a-button class="btn-action" type="primary">
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
      <div class="staff-detail__infor-wrapper p-20 mx-30">
        <div
          v-for="(item, index) in staffDetails"
          :key="index + item.key"
          class="staff-detail__outter-item-wrapper mb-15"
        >
          <div class="staff-detail__item-wrapper pb-10">
            <div class="staff-detail__label mb-8">{{ $t(item.key) }}</div>
            <div
              class="staff-detail__value"
              v-if="item.key !== 'staff_workplace'"
            >
              {{ displayItemValue(item.key, item.value) }}
            </div>
            <div class="staff-detail__value" v-else>
              <div v-if="item.value.length">
                <p
                  v-for="workPlace in item.value"
                  :key="workPlace.id"
                  class="mb-8"
                >
                  <span class="staff-detail__workplace"
                    >{{ formatLabelWorkPlaceType(workPlace.workplace_type) }}
                    -
                  </span>

                  {{ workPlace.name }}
                </p>
              </div>
              <span v-else>{{ NULL_VALUE_DISPLAY }}</span>
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
import { i18n } from "@/i18n";
//#endregion

//#region props
//#endregion

//#region variables
const isLoading = ref<boolean>(false);
const staffDetails = ref();
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;
const staffId = router.currentRoute.value.params.id;
const isAccountEnable = ref<boolean>(false);
//#endregion

//#region hooks
onMounted(async () => {
  await initialize();
});
//#endregion

//#region function
const initialize = async (): Promise<void> => {
  isLoading.value = true;
  const { error, res } = await service.staff.getStaffDetail(+staffId);
  isLoading.value = false;

  if (!error && res) {
    const {
      name,
      name_kana,
      email,
      telephone,
      user_role,
      employee_code,
      last_logged_in,
      belongs,
      is_disable,
      workplaces
    } = res;

    staffDetails.value = [
      { key: "human_name", value: name || NULL_VALUE_DISPLAY },
      { key: "human_name_kana", value: name_kana || NULL_VALUE_DISPLAY },
      { key: "employee_code", value: employee_code || NULL_VALUE_DISPLAY },
      { key: "staff_email_detail", value: email || NULL_VALUE_DISPLAY },
      {
        key: "common_phone_field_name",
        value: telephone || NULL_VALUE_DISPLAY
      },
      { key: "type", value: belongs || NULL_VALUE_DISPLAY },
      { key: "user_role", value: user_role || NULL_VALUE_DISPLAY },
      {
        key: "staff_workplace",
        value: workplaces || NULL_VALUE_DISPLAY
      },
      { key: "last_login_time", value: last_logged_in || NULL_VALUE_DISPLAY }
    ];
    isAccountEnable.value = is_disable;
  }
};
const formatLabelWorkPlaceType = (type: number): string => {
  if (type === 1) {
    return i18n.global.t("collection_base");
  } else if (type === 2) {
    return i18n.global.t("partner");
  } else if (type === 3) {
    return i18n.global.t("customer");
  } else if (type === 4) {
    return i18n.global.t("destination");
  } else {
    return "";
  }
};
const handleClickGoBack = (): void => {
  router.push({ name: routeNames.staffManagement });
};

const handleClickDelete = (): void => {
  if (!staffId) return;

  messenger({
    title: "popup_msg_confirm_delete",
    message: "",
    type: MessengerType.Confirm,
    buttonOkTitle: "btn_delete",
    callback: async (isConfirm: boolean): Promise<void> => {
      if (!isConfirm) {
        return;
      }
      deleteStaff(+staffId);
    }
  });
};

const deleteStaff = async (id: number): Promise<void> => {
  isLoading.value = true;
  const isSuccess = await service.staff.deleteStaffByIds([id]);
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
    title: "common_msg_delete_successfully",
    message: "",
    type: MessengerType.Success,
    callback: (isConfirm: boolean): void => {
      isConfirm;
    }
  });
  router.push({ name: routeNames.staffManagement });
};

const displayItemValue = (key: string, value: string): string => {
  return key === "user_role" || key === "type" ? i18n.global.t(value) : value;
};
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>
.temporarily-disable {
  pointer-events: none !important;
}

.ant-spin-nested-loading {
  height: 100%;
}
.staff-detail__spin {
  height: 100vh;
  width: 100%;
}

.staff-detail {
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
    border-bottom: 1px solid $grey-3;
  }

  &__label {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: $neutral-400;
  }
  &__workplace {
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
  }
  &__value {
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    color: $neutral-600;
  }

  &__enable-account-btn {
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 18px;
    &__enable {
      color: $primary-400;
    }

    &__disable {
      color: $neutral-400;
    }
  }
}
</style>
