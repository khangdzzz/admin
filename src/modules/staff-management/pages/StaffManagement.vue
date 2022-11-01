<template>
  <div class="fill-height d-flex flex-column">
    <ListSearchHeader
      ref="searchHeader"
      :title="$t('staff')"
      :colTitle="3"
      :colAction="21"
      v-model:model-value.sync="searchString"
      @onChange="handleSearchChange"
    >
      <template #action>
        <a-button
          class="btn-action color-btn-delete"
          ghost
          type="primary"
          v-if="selectedKeys.length > 0"
          @click="(event: MouseEvent) => deleteStaff(event, undefined)"
        >
          <template #icon>
            <IcTrash class="btn-icon" :color="'#F54E4E'" />
          </template>
          {{ $t("delete_btn") }}
        </a-button>
        <a-button class="btn-action" type="primary">
          <template #icon>
            <img src="@/assets/icons/ic_import.svg" class="btn-icon" />
          </template>
          {{ $t("import_btn") }}
        </a-button>
        <a-button class="btn-action" type="primary">
          <template #icon>
            <img src="@/assets/icons/ic_export.svg" class="btn-icon" />
          </template>
          {{ $t("export_btn") }}
        </a-button>
        <a-button type="primary" class="btn-add-new" @click="onCreate">
          <template #icon>
            <img src="@/assets/icons/ic_plus.svg" class="btn-icon" />
          </template>
          {{ $t("add_new_type_btn") }}
        </a-button>
      </template>
    </ListSearchHeader>
    <div class="staff-management__table-container mx-30 mb-30">
      <NoData
        :value="searchString"
        :is-loading="isLoading"
        @onClick="handleBackToList"
        v-if="isLoading || !data || !data.length"
      />

      <a-table
        :customRow="customRow"
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        v-if="!isLoading && data && data.length > 0"
        :scroll="{ y: 700 }"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'employeeCode'">
            <div @click="changeSortEmployeeCode()" class="headerTitle">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortEmployeeCode" />
            </div>
          </template>
          <template v-if="column.key === 'name'">
            <div @click="changeSortName()" class="headerTitle">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortStaffName" />
            </div>
          </template>
          <template v-if="column.key === 'email'">
            <div @click="changeSortEmail()" class="headerTitle">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortEmail" />
            </div>
          </template>
          <template v-if="column.key === 'userRole'">
            <div @click="changeSortUserRole()" class="headerTitle">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortUserRole" />
            </div>
          </template>
          <template v-if="column.key === 'workplace'">
            <div @click="changeSortCollectionBase()" class="headerTitle">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortWorkPlace" />
            </div>
          </template>
          <template v-if="column.key === 'lastLoggedIn'">
            <div @click="changeSortLastLoginTime()" class="headerTitle">
              <span>{{ $t(column.title) }}</span>
              <SortView class="mx-12" :sort="sortLastLoginTime" />
            </div>
          </template>
        </template>

        <template #bodyCell="{ column, record, text }">
          <template
            v-if="
              column.dataIndex === 'userRole' ||
              column.dataIndex === 'workplace'
            "
          >
            <span>{{ text ? $t(text) : NULL_VALUE_DISPLAY }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <div class="d-flex">
              <div
                :class="
                  record.isDisabled
                    ? 'user-enable-status-disabled'
                    : 'user-enable-status'
                "
              >
                <div class="indicator"></div>
              </div>
              <img
                class="actionIcon"
                src="@/assets/icons/ic_btn_edit.svg"
                @click="(event) => editStaff(event, record.id)"
              />
              <img
                class="actionIcon"
                src="@/assets/icons/ic_btn_delete.svg"
                @click="(event) => deleteStaff(event, record.id)"
              />
            </div>
          </template>
          <template v-else>
            <span>{{ text || NULL_VALUE_DISPLAY }}</span>
          </template>
        </template>
      </a-table>
      <ThePagination
        :isShowPagination="!isLoading && data && !!data.length"
        :currentPage="pageOption.currentPage"
        :pageSize="pageOption.pageSize"
        :total="pageOption.total"
        :isShowPrevBtn="isShowPrevBtn()"
        :isShowNextBtn="isShowNextBtn()"
        @onShowSizeChange="onShowSizeChange"
        @onChange="onChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
//#region import
import IcTrash from "@/assets/icons/IcTrash.vue";
import { i18n } from "@/i18n";
import ListSearchHeader from "@/modules/base/components/ListSearchHeader.vue";
import NoData from "@/modules/base/components/NoData.vue";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { MessengerType } from "@/modules/base/models/messenger-type.enum";
import HeaderRef from "@/modules/base/models/search-header.model";
import SortView from "@/modules/common/components/SortView.vue";
import ThePagination from "@/modules/common/components/ThePagination.vue";
import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { Staff } from "@/modules/staff-management/models";
import { routeNames, router } from "@/routes";
import { service } from "@/services";
import { NULL_VALUE_DISPLAY } from "@/utils/constants";
import { debounce } from "lodash";
import { computed, inject, onMounted, reactive, ref, watch } from "vue";

//#endregion

//#region props

//#endregion

//#region variables
const messenger: (param: MessengerParamModel) => void =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inject("messenger")!;

const searchString = ref<string>("");
const isLoading = ref<boolean>(false);
const searchHeader = ref<HeaderRef | null>(null);

const sortEmployeeCode = ref<Sort>(Sort.None);
const sortStaffName = ref<Sort>(Sort.None);
const sortEmail = ref<Sort>(Sort.None);
const sortUserRole = ref<Sort>(Sort.None);
const sortWorkPlace = ref<Sort>(Sort.None);
const sortLastLoginTime = ref<Sort>(Sort.None);

const columns = [
  {
    title: "staff_employee_code",
    dataIndex: "employeeCode",
    key: "employeeCode",
    width: "10%"
  },
  {
    title: "human_name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "staff_email",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "staff_user_role",
    dataIndex: "userRole",
    key: "userRole"
  },
  {
    title: "staff_workplace_type",
    dataIndex: "workplace",
    key: "workplace"
  },

  {
    title: "staff_last_login_time",
    dataIndex: "lastLoggedIn",
    key: "lastLoggedIn",
    maxWidth: 160
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    width: "160px"
  }
];
const data = ref<Staff[]>([]);
const pageOption = reactive<Pagination<Staff>>({
  currentPage: 1,
  pageSize: 20,
  total: 0
});
//#endregion

//#region hooks
onMounted(() => {
  fetchListStaff();
});
//#endregion

//#region function
const fetchListStaff = async (): Promise<void> => {
  const sort = {
    sortEmployeeCode: sortEmployeeCode.value,
    sortStaffName: sortStaffName.value,
    sortEmail: sortEmail.value,
    sortUserRole: sortUserRole.value,
    sortWorkPlace: sortWorkPlace.value,
    sortLastLoginTime: sortLastLoginTime.value
  };

  isLoading.value = true;
  const res = await service.staff.getlistStaff(
    Number(pageOption.currentPage),
    Number(pageOption.pageSize),
    sort,
    searchString.value
  );
  isLoading.value = false;
  if (res) {
    data.value = res.results || [];
    pageOption.currentPage = res.currentPage || 0;
    pageOption.total = res.total;
  }
};
const onCreate = (): void => {
  router.push({ name: routeNames.createNewStaff });
};
const selectedKeys = ref<number[]>([]);

const isShowPrevBtn = (): boolean => {
  const isFirtPage = pageOption.currentPage === 1;
  if (totalPages() === 1 || isFirtPage) return false;

  return true;
};

const isShowNextBtn = (): boolean => {
  const isLastPage =
    pageOption.currentPage ===
    Math.ceil(Number(pageOption.total) / Number(pageOption?.pageSize));

  if (totalPages() === 1 || isLastPage) return false;
  return true;
};

const totalPages = (): number => {
  return Math.ceil(Number(pageOption.total) / Number(pageOption.pageSize));
};

const onShowSizeChange = (current: number, pageSize: number): void => {
  pageOption.currentPage = current;
  pageOption.pageSize = pageSize;
  fetchListStaff();
};

const onChange = (pageNumber: number): void => {
  pageOption.currentPage = pageNumber;
  fetchListStaff();
};
const handleBackToList = (): void => {
  if (searchHeader.value) {
    isLoading.value = true;
    searchHeader.value.clearInput();
  }
};
const resetSort = (): void => {
  sortEmployeeCode.value = Sort.None;
  sortStaffName.value = Sort.None;
  sortEmail.value = Sort.None;
  sortUserRole.value = Sort.None;
  sortWorkPlace.value = Sort.None;
  sortLastLoginTime.value = Sort.None;
};
const calculateNextSortStatus = (currentSort: Sort): Sort => {
  switch (currentSort) {
    case Sort.Asc:
      return Sort.Desc;
    case Sort.Desc:
      return Sort.None;
    default:
      return Sort.Asc;
  }
};

const changeSortEmployeeCode = (): void => {
  const backupSortEmployeeCode = sortEmployeeCode.value;
  resetSort();
  sortEmployeeCode.value = calculateNextSortStatus(backupSortEmployeeCode);
  fetchListStaff();
};
const changeSortName = (): void => {
  const backupSortName = sortStaffName.value;
  resetSort();
  sortStaffName.value = calculateNextSortStatus(backupSortName);
  fetchListStaff();
};
const changeSortEmail = (): void => {
  const backupSortEmail = sortEmail.value;
  resetSort();
  sortEmail.value = calculateNextSortStatus(backupSortEmail);
  fetchListStaff();
};
const changeSortUserRole = (): void => {
  const backupSortUserRole = sortUserRole.value;
  resetSort();
  sortUserRole.value = calculateNextSortStatus(backupSortUserRole);
  fetchListStaff();
};
const changeSortCollectionBase = (): void => {
  const backupSortWorkPlace = sortWorkPlace.value;
  resetSort();
  sortWorkPlace.value = calculateNextSortStatus(backupSortWorkPlace);
  fetchListStaff();
};
const changeSortLastLoginTime = (): void => {
  const backupSortLastLoginTime = sortLastLoginTime.value;
  resetSort();
  sortLastLoginTime.value = calculateNextSortStatus(backupSortLastLoginTime);
  fetchListStaff();
};

const customRow = (
  record: Staff
): { onClick: (_event: PointerEvent) => void } => {
  return {
    onClick: (_event: PointerEvent): void => {
      _event.stopPropagation();
      router.push({
        name: routeNames.staffDetail,
        params: {
          id: record.id
        }
      });
    }
  };
};

const editStaff = (e: MouseEvent, id: number): void => {
  if (e && e.stopPropagation) e.stopPropagation();
  console.log("editStaff: ", id);
  // router.push({name: routeNames.editStaff, params: { id: staff.id}});
};

const deleteStaff = (e: MouseEvent, id?: number): void => {
  if (e && e.stopPropagation) e.stopPropagation();
  messenger({
    title: "popup_msg_confirm_delete",
    message: "",
    type: MessengerType.Confirm,
    buttonOkTitle: "btn_delete",
    callback: async (isConfirm: boolean): Promise<void> => {
      if (!isConfirm) {
        return;
      }

      if (!selectedKeys.value?.length && !id) {
        return;
      }
      const selectedVehicleIds = id ? [id] : selectedKeys.value;
      onDeleteStaff(selectedVehicleIds);
    }
  });
};

const onDeleteStaff = async (deleteIds: number[]): Promise<void> => {
  if (!deleteIds.length) {
    return;
  }
  isLoading.value = true;
  const isSuccess = await service.staff.deleteStaffByIds(deleteIds);
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
    title:
      deleteIds.length > 1
        ? i18n.global.t("common_msg_delete_multiple_successfully", {
            number: deleteIds.length
          })
        : "common_msg_delete_successfully",
    message: "",
    type: MessengerType.Success,
    callback: (isConfirm: boolean): void => {
      isConfirm;
      fetchListStaff();
    }
  });
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  searchString.value = "";
};

const changeStaffActiveStatus = (
  $event: MouseEvent,
  id: number,
  isUserDisabled: boolean
): void => {
  if ($event.stopPropagation) $event.stopPropagation();
  messenger({
    title: isUserDisabled
      ? "staff_confirm_enable_staff"
      : "staff_confirm_disable_staff",
    message: "",
    type: MessengerType.Confirm,
    buttonOkTitle: "common_confirm",
    callback: async (isConfirm: boolean): Promise<void> => {
      if (!isConfirm) {
        return;
      }
      onChangeUserActiveStatus(id, !isUserDisabled);
    }
  });
};

const onChangeUserActiveStatus = async (
  id: number,
  willBeDisabled: boolean
): Promise<void> => {
  await service.staff.changeUserActiveStatus(id, willBeDisabled);
};

const handleSearchChange = (currentSearchValue: string): void => {
  searchString.value = currentSearchValue;
};

const onSearchChange = debounce((): void => {
  pageOption.currentPage = 1;
  selectedKeys.value = [];
  fetchListStaff();
}, 500);
//#endregion

//#region computed
const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedKeys.value,
    onChange: (keys: number[]): void => {
      selectedKeys.value = keys;
    },
    columnWidth: "50px"
  };
});
//#endregion

//#region reactive
watch(searchString, onSearchChange);
//#endregion
</script>

<style lang="scss" scoped>
.staff-management {
  &__table-container {
    flex-grow: 1;
    background-color: $white;
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
    border-radius: 10px;
    .headerTitle {
      font-size: 14px;
    }
    .actionIcon {
      margin-left: 20px;
      cursor: pointer;
    }
    .ant-table-cell {
      text-align: center;
    }

    .user-enable-status {
      width: 38px;
      height: 20px;
      background-color: $primary;
      border-radius: 10px;
      padding: 2px;
      position: relative;
      .indicator {
        position: absolute;
        width: 16px;
        height: 16px;
        right: 2px;
        border-radius: 8px;
        background-color: white;
      }
    }

    .user-enable-status-disabled {
      width: 38px;
      height: 20px;
      background-color: $neutral-200;
      border-radius: 10px;
      padding: 2px;
      position: relative;
      .indicator {
        position: absolute;
        width: 16px;
        height: 16px;
        left: 2px;
        border-radius: 8px;
        background-color: white;
      }
    }
  }

  &__action-icon {
    margin-left: 20px;
  }
  .btn {
    font-weight: 600;
    font-size: 18px;
    width: 120px;
    height: 48px;
    margin-left: 15px;
    padding: 0 15px 0 15px;

    .btn-icon {
      margin-right: 10px;
    }
  }
}

:deep() {
  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: $grey-2;
    border-color: rgba(0, 0, 0, 0.03);
  }
}
</style>
