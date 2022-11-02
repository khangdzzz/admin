<template>
  <a-row
    type="flex"
    justify="center"
    align="middle"
    class="create-staff-container"
  >
    <a-spin
      :spinning="isFetching"
      :tip="$t('common_loading')"
      class="staff-detail__spin"
    >
      <div
        class="create-staff fill-height fill-width d-flex justify-center align-center"
      >
        <a-card class="create-staff__card px-20 py-30">
          <div
            class="create-staff__title d-flex mb-30 justify-center align-center"
          >
            {{ $t("add_new_staff") }}
          </div>
          <a-form :model="formState" ref="createStaffRef">
            <FloatingLabelInput
              place-holder="staff_employee_code"
              label="staff_employee_code"
              control-name="employeeCode"
              v-model:value="formState.employeeCode"
              :rules="[
                {
                  max: 50,
                  message: $t('max_length_input', { maxLength: 50 }),
                  trigger: ['blur', 'change']
                }
              ]"
            ></FloatingLabelInput>
            <div class="d-flex gap-20">
              <FloatingLabelInput
                place-holder="human_name"
                label="human_name"
                control-name="name"
                v-model:value="formState.name"
                :required="true"
                :rules="[
                  {
                    required: true,
                    message: $t('please_enter_input', {
                      fieldName: $t('name')
                    }),
                    trigger: ['blur', 'change']
                  },
                  {
                    max: 50,
                    message: $t('max_length_input', { maxLength: 50 }),
                    trigger: ['blur', 'change']
                  }
                ]"
                class="fill-width"
              ></FloatingLabelInput>
              <FloatingLabelInput
                place-holder="human_name_kana"
                label="human_name_kana"
                control-name="nameKana"
                v-model:value="formState.nameKana"
                class="fill-width"
                :rules="[
                  {
                    max: 50,
                    message: $t('max_length_input', { maxLength: 50 }),
                    trigger: ['blur', 'change']
                  }
                ]"
              ></FloatingLabelInput>
            </div>
            <FloatingLabelInput
              place-holder="staff_email"
              label="staff_email"
              control-name="email"
              v-model:value="formState.email"
              :required="true"
              :rules="[
                {
                  validator: validator.validateEmail,
                  trigger: ['blur', 'change']
                }
              ]"
            ></FloatingLabelInput>
            <FloatingLabelInput
              place-holder="common_phone_field_label"
              label="common_phone_field_label"
              control-name="telephone"
              v-model:value="formState.telephone"
              :rules="[
                {
                  validator: validator.validatePhone,
                  trigger: ['blur', 'change']
                }
              ]"
            ></FloatingLabelInput>

            <div
              class="d-flex align-center gap-4 pt-10 align-flex-start radio"
              v-if="userStore.user?.userType !== UserType.SystemAdmin"
            >
              <div class="create-staff__type-selector-title">
                {{ $t("type") }}
                <span class="create-staff__require-mark">*</span>
              </div>
              <div class="d-flex gap-16">
                <a-radio-group
                  v-model:value="optionValue.type"
                  :disabled="isCollectionBaseAdmin"
                >
                  <a-radio
                    class="create-staff__radio-title"
                    :class="
                      currentLanguage === 'en'
                        ? 'en-title-margin'
                        : 'ja-title-margin'
                    "
                    v-for="item in optionValue.typeOptions"
                    :value="item.value"
                    :key="item.value"
                    >{{ $t(item.text) }}</a-radio
                  >
                </a-radio-group>
              </div>
            </div>

            <div
              class="d-flex align-center gap-4 align-flex-start radio mb-6"
              v-if="optionValue.userRoleOptions?.length"
            >
              <div class="create-staff__type-selector-title">
                {{ $t("user_role") }}
                <span class="create-staff__require-mark">*</span>
              </div>
              <div class="d-flex gap-32">
                <a-radio-group
                  v-model:value="optionValue.userRole"
                  :disabled="optionValue.type === TypeOptions.DESTINATION"
                >
                  <a-radio
                    class="create-staff__radio-title"
                    :class="
                      currentLanguage === 'en'
                        ? 'en-title-margin'
                        : 'ja-title-margin'
                    "
                    v-for="item in optionValue.userRoleOptions"
                    :value="item.value"
                    :key="item.value"
                    >{{ $t(item.text) }}</a-radio
                  >
                </a-radio-group>
              </div>
            </div>
            <FloatingLabelMultipleSelect
              place-holder="staff_workplace"
              label="staff_workplace"
              control-name="workPlace"
              :required="true"
              v-if="modeSelectWorkPlace === 'multiple'"
              :options="optionValue.workPlaceOptions"
              v-model:value="formState.workplaces"
            ></FloatingLabelMultipleSelect>
            <FloatingLabelSelect
              place-holder="staff_workplace"
              label="staff_workplace"
              :required="true"
              control-name="workPlace"
              v-if="modeSelectWorkPlace === 'single'"
              :options="optionValue.workPlaceOptions"
              v-model:value="formState.workplaces"
            ></FloatingLabelSelect>
          </a-form>
          <div class="d-flex justify-center align-center gap-20 mt-10">
            <a-button
              class="create-staff__btn-style create-staff__cancel-btn"
              type="secondary"
              :disabled="isLoading"
              @click="handleCancel"
            >
              {{ $t("btn_cancel") }}
            </a-button>
            <a-button
              class="create-staff__btn-style create-staff__submit-btn"
              type="primary"
              :loading="isLoading"
              :disabled="!isValidated"
              @click="handleSubmit"
            >
              {{ $t("btn_submit") }}
            </a-button>
          </div>
          <a-modal
            v-model:visible="visibleModalSuccess"
            width="420px"
            :closable="false"
            class="custom-modal"
            centered
            :footer="null"
            :maskClosable="false"
          >
            <div class="modal-content">
              <img src="@/assets/icons/ic_success.png" class="modal-icon" />
              <h3 class="modal-title mb-10">
                {{ $t("common_msg_create_successfully") }}
              </h3>
              <p class="modal-message mb-10 mt-0">
                {{ $t("email") }}: {{ staffEmail }}
              </p>
              <p class="modal-message mb-10 mt-0">
                {{ $t("login_password") }}: {{ staffPassword }}
                <img
                  class="ic-clipboard"
                  src="@/assets/icons/ic_clipboard.png"
                  @click="handleCopy"
                />
              </p>
              <a-button
                type="primary"
                class="btn-ok mt-10"
                @click="handleCloseModal"
              >
                OK
              </a-button>
            </div>
          </a-modal>
        </a-card>
      </div>
    </a-spin>
  </a-row>
</template>

<script setup lang="ts">
//#region import
import { i18n } from "@/i18n";
import FloatingLabelInput from "@/modules/base/components/FloatingLabelInput.vue";
import FloatingLabelMultipleSelect from "@/modules/base/components/FloatingLabelMultipleSelect.vue";
import FloatingLabelSelect from "@/modules/base/components/FloatingLabelSelect.vue";
import validator from "@/modules/base/components/validator/validator";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import { UserType } from "@/modules/base/models/user-type.enum";
import { router, routeNames } from "@/routes";
import { service } from "@/services";
import { commonStore } from "@/stores";
import { inject, onMounted, reactive, ref, watch } from "vue";
import { TypeOptions, UserRoleOptions } from "../models/create-new-staff.model";
import radioOptions from "./create-new-staff-variables";

interface FormState {
  employeeCode: string;
  name: string;
  nameKana: string;
  email: string;
  telephone: string;
  workplaces: string[] | string | undefined;
}
interface options {
  text: string;
  value: string | number;
  workPlaceType?: number[];
  baseType?: number[];
}
interface selects {
  label: string;
  value: string;
  content: string;
  workPlaceType: number;
  baseType?: number[];
  tenantId?: number;
}
//#endregion

//#region props
//#endregion

//#region variables
const isValidated = ref<boolean>(false);
const isFetching = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const listWorkPlace = ref();
const createStaffRef = ref();
const currentLanguage = ref<string>(service.language.getCurrentLanguage());
const formState = reactive<FormState>({
  employeeCode: "",
  name: "",
  nameKana: "",
  email: "",
  telephone: "",
  workplaces: []
});
const modeSelectWorkPlace = ref<string>("");
const userStore = commonStore();
const messenger: (
  param: MessengerParamModel
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
) => void = inject("messenger")!;
const staffPassword = ref<string>("");
const staffEmail = ref<string>("");
const visibleModalSuccess = ref<boolean>(false);
const isCollectionBaseAdmin = ref<boolean>(false);
const optionValue = reactive<{
  type: number;
  userRole: UserRoleOptions | undefined;
  workPlace: string;
  typeOptions: options[];
  userRoleOptions: options[];
  workPlaceOptions: selects[];
  userType: string | undefined;
}>({
  type: 0,
  userRole: undefined,
  workPlace: "",
  typeOptions: radioOptions.typeOptions,
  userRoleOptions: [],
  workPlaceOptions: [],
  userType: ""
});

//#endregion

//#region hooks
onMounted(() => {
  if (userStore.user?.userType === UserType.CollectionBaseAdmin) {
    optionValue.typeOptions = radioOptions.typeOptions.filter(
      (item) => item.value === TypeOptions.TENANT
    );
    optionValue.type = TypeOptions.TENANT;
    isCollectionBaseAdmin.value = true;
  }
  getListWorkPlace();
});
//#endregion

//#region function
const getListWorkPlace = async (): Promise<void> => {
  isFetching.value = true;
  const res = await service.staff.getListWorkPlace();
  isFetching.value = false;
  if (res) {
    listWorkPlace.value = res.results?.map((item) => {
      return {
        value: item.id,
        content: handleFormatLabelSelect(Number(item.workPlaceType)),
        label: item.name,
        workPlaceType: item.workPlaceType,
        baseType: item.baseType,
        tenantId: item.tenantId
      };
    });
  }
};
const filterWorkPlaceByType = async (role: any): Promise<void> => {
  const filter = await listWorkPlace.value?.filter(
    (item: selects) =>
      role.workPlaceType?.includes(item.workPlaceType) &&
      (role.baseType?.includes(item.baseType) || role.baseType.length === 0) &&
      item.tenantId === userStore.user?.tenantId
  );
  optionValue.workPlaceOptions = filter;
};

const handleClearInput = (): void => {
  createStaffRef.value.resetFields();
};
const handleCopy = (): void => {
  navigator.clipboard.writeText(staffPassword.value);
};
const handleFormatLabelSelect = (type: number): string => {
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
const handleCloseModal = (): void => {
  visibleModalSuccess.value = false;
  handleClearInput();
  router.push({ name: routeNames.staffManagement });
};
const handleCancel = (): void => {
  handleClearInput();
  router.push({ name: routeNames.staffManagement });
};
const handleSubmit = async (): Promise<void> => {
  let workPlaceValue = undefined;
  const workPlaceForm = formState.workplaces;
  if (workPlaceForm) {
    if (Array.isArray(workPlaceForm)) {
      workPlaceValue = workPlaceForm;
    } else {
      workPlaceValue = [workPlaceForm];
    }
  } else {
    workPlaceValue = undefined;
  }
  staffPassword.value = service.staff.randomPassword();
  const data = {
    employee_code: formState.employeeCode,
    name: formState.name,
    name_kana: formState.nameKana,
    email: formState.email,
    telephone: formState.telephone || null,
    belongs: optionValue.type,
    user_role: optionValue.userRole,
    workplace_ids: workPlaceValue,
    password: staffPassword.value
  };
  isLoading.value = true;
  const res = await service.staff.createStaff(data);
  isLoading.value = false;
  if (res.res) {
    visibleModalSuccess.value = true;
    staffEmail.value = res.res.email;
  } else {
    messenger({
      title: "popup_create_fail_title",
      message: "",
      type: MessengerType.Error
    });
  }
};
const setUserRoleOptions = (): void => {
  if (userStore.user?.userType === UserType.TenantAdmin) {
    switch (optionValue.type) {
      case TypeOptions.TENANT:
        optionValue.userRoleOptions = radioOptions.userRoleByTenantAdmim;
        break;
      case TypeOptions.PARTNER:
        optionValue.userRoleOptions = radioOptions.userRoleByPartner;
        break;
      case TypeOptions.CUSTOMER:
        optionValue.userRoleOptions = radioOptions.userRoleByCustomer;
        break;
      case TypeOptions.DESTINATION:
        optionValue.userRoleOptions = radioOptions.userRoleByDestination;
        break;
      default:
        optionValue.userRoleOptions = [];
    }
  } else if (userStore.user?.userType === UserType.CollectionBaseAdmin) {
    if (optionValue.type) {
      optionValue.userRoleOptions = radioOptions.userRoleByTenantAdmim.filter(
        (item) => item.value !== UserRoleOptions.TENANT_ADMIN
      );
    } else {
      optionValue.userRoleOptions = [];
    }
  }
};
const handleValidateFields = (
  value: string,
  maxLength: number,
  isRequire: boolean
): boolean => {
  const valueLength = value?.length || 0;
  if (valueLength > maxLength) {
    return false;
  }
  return isRequire ? valueLength > 0 : true;
};
const handleSelectWorkPlace = (): void => {
  const hideWorkPlaceField =
    !optionValue.type ||
    !optionValue.userRole ||
    (optionValue.type === TypeOptions.TENANT &&
      optionValue.userRole === UserRoleOptions.TENANT_ADMIN);

  const showSelectMultiple =
    optionValue.type === TypeOptions.TENANT &&
    optionValue.userRole &&
    [
      UserRoleOptions.COLLECTION_BASE_ADMIN,
      UserRoleOptions.DRIVER,
      UserRoleOptions.DRIVER_MANUFACTURING_STAFF,
      UserRoleOptions.MANUFACTURING_STAFF
    ].includes(optionValue.userRole);

  if (hideWorkPlaceField) {
    modeSelectWorkPlace.value = "none";
  } else if (showSelectMultiple) {
    modeSelectWorkPlace.value = "multiple";
  } else {
    modeSelectWorkPlace.value = "single";
  }
};
//#endregion

//#region computed
//#endregion

//#region reactive
watch(
  () => optionValue.type,
  () => {
    optionValue.userRole = undefined;
    if (optionValue.type === TypeOptions.DESTINATION) {
      optionValue.userRole = UserRoleOptions.CONSIGNEE;
    }
    setUserRoleOptions();
    handleSelectWorkPlace();
    formState.workplaces = undefined;
  },
  { deep: true, immediate: true }
);
watch(
  () => optionValue.userRole,
  () => {
    if (optionValue.userRole) {
      const userRole = optionValue.userRoleOptions?.find((item) => {
        return item.value === optionValue.userRole;
      });

      filterWorkPlaceByType(userRole);
      handleSelectWorkPlace();
    }

    formState.workplaces = undefined;
  },
  { deep: true, immediate: true }
);
watch([optionValue, formState], () => {
  if (userStore.user?.userType === UserType.SystemAdmin) {
    optionValue.type = 0;
    optionValue.userRole = 1;
    if (
      handleValidateFields(formState.name, 50, true) &&
      handleValidateFields(formState.employeeCode, 50, false) &&
      handleValidateFields(formState.nameKana, 50, false) &&
      validator.checkPhoneFormat(formState.telephone, false) &&
      validator.checkEmailFormat(formState.email, true)
    ) {
      isValidated.value = true;
    }
  } else {
    if (
      handleValidateFields(formState.name, 50, true) &&
      handleValidateFields(formState.employeeCode, 50, false) &&
      handleValidateFields(formState.nameKana, 50, false) &&
      validator.checkPhoneFormat(formState.telephone, false) &&
      validator.checkEmailFormat(formState.email, true) &&
      optionValue.userRole &&
      (formState.workplaces ||
        Number.isInteger(formState.workplaces) ||
        optionValue.userRole === UserRoleOptions.TENANT_ADMIN) &&
      optionValue.type
    ) {
      isValidated.value = true;
    } else {
      isValidated.value = false;
    }
  }
});
//#endregion
</script>

<style lang="scss" scoped>
.create-staff-container {
  height: 100vh;
}
.radio {
  width: 660px;
}
.ic-clipboard {
  margin-left: 17px;
  cursor: pointer;
}
.create-staff {
  &__card {
    width: 100%;
    max-width: 660px;
    border-radius: 10px;
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
    background-color: $white;
    overflow-x: hidden;
  }

  &__title {
    font-style: normal;
    color: $neutral-600;
    @include text(600, 22px, 28px);
  }

  &__require-mark {
    color: $red-1;
  }

  &__type-selector-title {
    font-style: normal;
    color: $neutral-600;
    min-width: 123px;
    @include text(600, 16px, 20px);
  }

  &__radio-title {
    font-style: normal;
    color: $neutral-600;
    min-width: 233px;
    margin-bottom: 26px;
    @include text(400, 18px, 100%);
  }

  &__btn-style {
    width: 180px;
    height: 48px;
    font-style: normal;
    @include text(600, 18px, 100%);
  }

  &__cancel-btn {
    background-color: $white;
    color: $primary;
    border: 1px solid $primary;
  }

  &__staff-type {
    &__container {
      display: grid;
      grid-template-areas: "leftSide leftSide leftSide rightSide rightSide rightSide";
    }

    &__right-side {
      grid-area: rightSide;
    }

    &__left-side {
      grid-area: leftSide;
    }

    &__radio-title {
      width: 110px;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      color: $neutral-600;
      span {
        color: $red-500;
      }
    }
  }
}

:deep() {
  .create-staff {
    &__card {
      .ant-card-body {
        padding: 0;
      }
    }
  }
  .create-staff__radio-title {
    align-items: center;
  }
  .ja-title-margin {
    margin-left: 20px;
  }
  .en-title-margin:nth-child(even) {
    margin-left: 32px;
  }
  .form-create-staff {
    .ant-form-item {
      margin-right: 0px;
      margin-bottom: 20px;
      .ant-form-item-control {
        .ant-form-item-control-input {
          .ant-form-item-control-input-content {
            .multiple {
              height: 80px !important;
            }
            .input-item {
              padding: 0px 12px;
              width: 620px;
            }
            .ant-select-multiple {
              .ant-select-selector {
                .ant-select-selection-item {
                  top: 10px;
                  padding: 0px 10px 0px 20px;
                  border: 1px solid #07a0b8;
                  border-radius: 38px;
                }
              }
            }
            .inline {
              width: 300px !important;
            }
          }
        }
      }
    }
  }
}
</style>
