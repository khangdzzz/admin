<script setup lang="ts">
import { onMounted, ref } from "vue";

import Logo from "@/assets/images/ImLogo.vue";
import LogoSignature from "@/assets/images/ImLogoSignature.vue";
import DoorArrowRight from "@/assets/images/ImDoorArrowRight.vue";
import ArrowUp from "@/assets/images/ImArrowUp.vue";
import { routeNames } from "@/routes/route-names";
import { router } from "@/routes";
import { service } from "@/services";
import { UserType } from "../models/user-type.enum";
import sideMenuItem, { SideMenuItems } from "../models/menu";

type menuItem = {
  pathName: string;
  title: string;
  requireUserType: UserType[];
};

const user = ref<string>("");
const selectedKeys = ref<string[]>(["menu_lbl_dashboard_internal"]);
const openKeys = ref<string[]>([""]);
const userTypeName = ref();
const collapsed = ref<boolean>(false);

if (service.localStorage.getAccessToken()) {
  const userInfo = await service.auth.getCurrentUserInformation();
  user.value = userInfo?.fullName || "";
  userTypeName.value = userInfo?.userType;
}

onMounted(async () => {
  const userInfo = await service.auth.getCurrentUserInformation();
  userTypeName.value = userInfo?.userType;
  if (router?.currentRoute?.value?.name) {
    selectedKeys.value = [router.currentRoute.value.name.toString()];
  }
});

const onOpenChange = (keys: string[]): void => {
  openKeys.value = [keys[keys.length - 1]];
};

const isHasPermission = (listUserType: UserType[] | undefined): boolean => {
  if (!listUserType?.length) {
    return true;
  }

  return listUserType.includes(userTypeName.value);
};

const handleClickMenuWhenCollapsed = (item: SideMenuItems): void => {
  if (collapsed.value) {
    collapsed.value = false;
    openKeys.value = [item.title];
  }
};

//Todo: Teddy need to fix this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isShowExpand = (menuItem: any): boolean => {
  let numberOfItems = 0;
  menuItem?.map((item: menuItem) => {
    if (isHasPermission(item.requireUserType)) {
      numberOfItems++;
    }
  });
  return numberOfItems > 0;
};

const onLogout = (): void => {
  service.auth.logout();
  router.push({ name: routeNames.login });
};

const goHome = (): void => {
  router.push({ name: routeNames.collectionBusiness });
};
</script>

<template>
  <div class="default-layout fill-height d-flex">
    <div
      :class="[
        'default-layout__lhs-wrapper',
        collapsed ? 'default-layout__lhs-wrapper__collapsed' : ''
      ]"
    >
      <div
        class="default-layout__logo d-flex justify-center align-center gap-18"
        @click="goHome"
      >
        <!-- fake div to center Logo when collapsed -->
        <div v-if="collapsed"></div>
        <div>
          <Logo textColor="#07a0b8" logoColor="#090909" />
        </div>
        <div
          :class="[
            'default-layout__logo__signature d-flex align-flex-end',
            collapsed ? 'default-layout__logo__signature__collapsed' : ''
          ]"
        >
          <LogoSignature textColor="#07a0b8" signatureColor="#090909" />
        </div>
      </div>
      <a-divider class="m-0" />
      <div
        :class="[
          'default-layout__greeting p-15',
          collapsed ? 'default-layout__greeting__collapsed' : ''
        ]"
        v-if="$t"
      >
        {{ $t("menu_lbl_hello", { name: user }) }}
      </div>
      <div
        :class="[
          'default-layout__menu-wrapper d-flex flex-column justify-space-between',
          collapsed ? 'default-layout__menu-wrapper__collapsed' : ''
        ]"
      >
        <div class="default-layout__menu fill-height">
          <a-menu
            mode="inline"
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            :inline-collapsed="collapsed"
            @openChange="onOpenChange"
          >
            <div
              v-for="(subMenu, idx) in sideMenuItem"
              :key="subMenu.title + idx"
            >
              <span
                v-if="isHasPermission(subMenu.requireUserType)"
                class="default-layout__menu-item-wrapper"
                @click="handleClickMenuWhenCollapsed(subMenu)"
              >
                <a-sub-menu
                  v-if="
                    subMenu.items &&
                    subMenu.items.length > 0 &&
                    isShowExpand(subMenu.items)
                  "
                  :key="subMenu.title"
                >
                  <template #icon>
                    <component
                      :is="subMenu.icon"
                      class="default-layout__icon"
                    ></component>
                  </template>
                  <template #title v-if="!collapsed">
                    <span class="default-layout__menu-title" v-if="$t">
                      {{ $t(subMenu.title) }}
                    </span>
                  </template>
                  <template #expandIcon>
                    <span class="default-layout__arrow-icon">
                      <ArrowUp />
                    </span>
                  </template>
                  <div v-show="!collapsed">
                    <span
                      v-for="subMenuItem in subMenu.items"
                      :key="subMenuItem.title"
                    >
                      <a-menu-item
                        :key="subMenuItem.pathName"
                        v-if="isHasPermission(subMenuItem.requireUserType)"
                      >
                        <router-link :to="{ name: subMenuItem.pathName }">
                          <span
                            class="default-layout__sub-menu-title"
                            v-if="$t"
                          >
                            {{ $t(subMenuItem.title) }}
                          </span>
                        </router-link>
                      </a-menu-item>
                    </span>
                  </div>
                </a-sub-menu>
                <a-menu-item v-else :key="subMenu.key">
                  <template #icon>
                    <div class="d-flex align-center">
                      <component
                        :is="subMenu.icon"
                        class="default-layout__icon"
                      ></component>
                    </div>
                  </template>
                  <router-link :to="{ name: subMenu.pathName }">
                    <span
                      class="default-layout__menu-title"
                      v-if="$t || !collapsed"
                    >
                      {{ $t(subMenu.title) }}
                    </span>
                  </router-link>
                </a-menu-item>
              </span>
            </div>
          </a-menu>
        </div>
        <div
          :class="[
            'd-flex justify-space-between align-center default-layout__logout-content',
            collapsed ? 'default-layout__logout-content__collapsed' : ''
          ]"
        >
          <div
            :class="[
              'default-layout__logout-btn-wrapper d-flex justify-center align-center',
              collapsed ? 'default-layout__logout-btn-wrapper__collapsed' : ''
            ]"
          >
            <a-button
              type="text"
              class="default-layout__logout-btn-wrapper__logout-btn d-flex align-center justify-center gap-10"
              @click="onLogout"
              v-if="$t"
            >
              <template #icon>
                <DoorArrowRight />
              </template>
              <span v-if="!collapsed">
                {{ $t("menu_lbl_logout") }}
              </span>
            </a-button>
          </div>
          <div
            :class="[
              'default-layout__toggle-menu-btn-wrapper d-flex justify-center align-center',
              collapsed
                ? 'default-layout__toggle-menu-btn-wrapper__collapsed'
                : ''
            ]"
          >
            <a-button
              type="text"
              shape="round"
              :class="[
                'default-layout__toggle-menu-btn-wrapper__toggle-btn d-flex align-center justify-center',
                collapsed
                  ? 'default-layout__toggle-menu-btn-wrapper__toggle-btn__close'
                  : ''
              ]"
              @click="collapsed = !collapsed"
            >
              <ArrowUp />
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <div class="default-layout__content-wrapper fill-height">
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
$transition-time: 0.3s;
.default-layout {
  &__lhs-wrapper {
    width: 300px;
    height: 100%;
    background-color: #fff;
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
    z-index: 1;
    transition: width $transition-time;

    &__collapsed {
      width: 52px !important;
    }
  }

  &__logo {
    height: 90px;
    cursor: pointer;

    &__signature {
      height: 56px;

      svg {
        transition: opacity, width $transition-time;
      }

      &__collapsed {
        svg {
          width: 0;
          opacity: 0;
        }
      }
    }
  }

  &__greeting {
    min-width: 300px;
    height: 48px;
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    color: #3c3c3c;
    transition: opacity $transition-time;

    &__collapsed {
      min-width: 0;
      transition: opacity 0.15s !important;
      opacity: 0 !important;
    }
  }

  &__menu-wrapper {
    height: calc(100% - 90px - 48px - 1px);

    &__collapsed {
      padding-top: 12px;
    }
  }

  &__menu {
    overflow-y: auto;
    overflow-x: hidden;
    .ant-menu-root {
      border: none !important;
    }
  }

  &__menu-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #3c3c3c;
  }

  &__sub-menu-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #999999;
  }

  &__icon {
    color: #999999;
  }

  &__menu-item-wrapper {
    &:hover {
      .default-layout {
        &__icon {
          color: #07a0b8;
        }

        &__menu-title {
          color: #07a0b8;
        }
      }
    }
  }

  &__expand-icon {
    svg {
      transition: transform $transition-time;
      transform: rotate(180deg);
    }

    &__expanded {
      svg {
        transition: transform $transition-time;
        transform: rotate(0deg);
      }
    }
  }

  &__logout-btn-wrapper {
    height: 58px;

    &__collapsed {
      width: 52px;
    }

    &__logout-btn {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      color: #999999;
      border: none;

      &:focus {
        background-color: transparent;
      }

      &:hover {
        color: $primary;
      }
    }
  }

  &__content-wrapper {
    background-color: #f0f8fa;
    overflow: auto;
    flex-grow: 1;
  }

  &__logout-content {
    box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.06);

    &__collapsed {
      flex-direction: column;
    }
  }

  &__toggle-menu-btn-wrapper {
    width: 52px;
    height: 58px;
    border-left: 1px solid $neutral-100;

    &__collapsed {
      border-top: 1px solid $neutral-100;
    }

    &__toggle-btn {
      transform: rotate(-90deg);
      border: none;

      &:focus {
        background-color: transparent;
      }

      &:hover {
        color: $primary;
      }

      &__close {
        transform: rotate(90deg) !important;
      }
    }
  }
}

:deep(.default-layout__menu-item-wrapper) {
  .default-layout__menu-title {
    &:hover {
      color: #07a0b8;
    }
  }

  .ant-menu {
    &-item-active {
      .default-layout__sub-menu-title {
        color: #07a0b8;
      }
    }

    &-sub {
      .ant-menu {
        &-item-selected {
          border-left: 3px solid transparent;
          background-color: #fff;

          .ant-menu {
            &-title-content {
              background: #f7f7f7;
              border-radius: 8px;
            }
          }
        }

        &-title-content {
          padding-left: 34px;
        }
      }
    }

    &-item {
      height: 48px !important;
      border-left: 3px solid transparent;
      padding-left: 12px !important;
      line-height: 20px !important;
      white-space: normal;

      &::after {
        transition: background $transition-time !important;
      }

      &-selected {
        border-left: 3px solid #07a0b8;

        &::after {
          border-right: none !important;
        }

        .default-layout {
          &__menu-title {
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 20px;
            color: #07a0b8;
          }

          &__sub-menu-title {
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 20px;
            color: #07a0b8;
          }

          &__icon {
            color: #07a0b8;
          }
        }
      }
    }

    &-submenu {
      .ant-menu {
        &-sub {
          background-color: #fff;
        }

        &-title-content {
          height: 48px;
          display: flex;
          align-items: center;
          padding-right: 10px;
        }
      }

      .default-layout__arrow-icon {
        display: flex;
        align-items: center;

        svg {
          transition: transform $transition-time;
          transform: rotate(180deg);
        }
      }

      &-open {
        .default-layout__arrow-icon {
          svg {
            transition: transform $transition-time;
            transform: rotate(0deg);
          }
        }
      }

      &-title {
        transition: background $transition-time !important;
        border-left: 3px solid transparent;
        padding-left: 12px !important;
        height: 48px;
        padding-right: 18px;
        white-space: normal;
      }

      &-selected {
        .default-layout {
          &__menu-title {
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 20px;
            color: #07a0b8;
          }

          &__icon {
            color: #07a0b8;
          }
        }
      }
    }
  }
}
</style>
