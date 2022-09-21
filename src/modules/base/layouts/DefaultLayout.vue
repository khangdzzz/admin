<script setup lang="ts">
import { ref } from "vue";

import Logo from "@/assets/images/ImLogo.vue";
import SuitCase from "@/assets/images/ImSuitCase.vue";
import Manufacture from "@/assets/images/ImManufacture.vue";
import Trace from "@/assets/images/ImTrace.vue";
import GroupOfPeople from "@/assets/images/ImGroupOfPeople.vue";
import Truck from "@/assets/images/ImTruck.vue";
import Location from "@/assets/images/ImLocation.vue";
import Container from "@/assets/images/ImContainer.vue";
import Setting from "@/assets/images/ImSetting.vue";
import DoorArrowRight from "@/assets/images/ImDoorArrowRight.vue";
import ArrowUp from "@/assets/images/ImArrowUp.vue";
import { routeNames } from "@/routes/route-names";
import { router } from "@/routes";
import { service } from "@/services";

const user = ref<string>("");
const selectedKeys = ref<string[]>(["Collection business"]);
const openKeys = ref<string[]>([""]);

const menuItems = [
  {
    key: "Collection business",
    icon: SuitCase,
    title: "menu_lbl_collection_business",
    pathName: routeNames.collectionBusiness
  },
  {
    key: "Product manufacture",
    icon: Manufacture,
    title: "menu_lbl_product_manufacture",
    pathName: routeNames.productManufacture
  },
  {
    key: "Traceability",
    icon: Trace,
    title: "menu_lbl_traceability",
    pathName: routeNames.traceability
  },
  {
    key: "Customer management",
    icon: GroupOfPeople,
    title: "menu_lbl_customer_management",
    pathName: routeNames.customerManagement
  },
  {
    key: "Vehicle management",
    icon: Truck,
    title: "menu_lbl_vehicle_management",
    items: [
      {
        title: "menu_lbl_vehicle_management_item_realtime_dynamics",
        pathName: routeNames.realTimeDynamics
      },
      {
        title: "menu_lbl_vehicle_management_item_vehicle",
        pathName: routeNames.vehicle
      },
      {
        title: "menu_lbl_vehicle_management_item_vehicle_type",
        pathName: routeNames.vehicleType
      }
    ]
  },
  {
    key: "Collection base/ Staff management",
    icon: Location,
    title: "menu_lbl_collection_base_and_staff_management",
    pathName: routeNames.staffManagement
  },
  {
    key: "Container/ Working place management",
    icon: Container,
    title: "menu_lbl_container_and_working_place_management",
    items: [
      {
        title: "container_container",
        pathName: routeNames.containerChild
      },
      {
        title: "container_container_type",
        pathName: routeNames.containerType
      },
      {
        title: "container_working_place",
        pathName: routeNames.workingPlace
      }
    ]
  },
  {
    key: "Setting",
    icon: Setting,
    title: "menu_lbl_setting",
    pathName: routeNames.setting
  }
];

const onOpenChange = (keys: string[]): void => {
  openKeys.value = [keys[keys.length - 1]];
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
    <div class="default-layout__lhs-wrapper">
      <div
        class="default-layout__logo d-flex justify-center align-center"
        @click="goHome"
      >
        <Logo />
      </div>
      <a-divider class="m-0" />
      <div class="default-layout__greeting p-15">
        {{ $t("menu_lbl_hello", { name: user }) }}
      </div>
      <div
        class="default-layout__menu-wrapper d-flex flex-column justify-space-between"
      >
        <div class="default-layout__menu fill-height">
          <a-menu
            mode="inline"
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            @openChange="onOpenChange"
          >
            <span
              v-for="(subMenu, idx) in menuItems"
              :key="subMenu.title + idx"
              class="default-layout__menu-item-wrapper"
            >
              <a-sub-menu
                v-if="subMenu.items && subMenu.items.length > 0"
                :key="subMenu.title"
              >
                <template #icon>
                  <component
                    :is="subMenu.icon"
                    class="default-layout__icon"
                  ></component>
                </template>
                <template #title>
                  <span class="default-layout__menu-title">
                    {{ $t(subMenu.title) }}
                  </span>
                </template>
                <template #expandIcon>
                  <span class="default-layout__arrow-icon">
                    <ArrowUp />
                  </span>
                </template>
                <a-menu-item
                  v-for="subMenuItem in subMenu.items"
                  :key="subMenuItem.title"
                >
                  <router-link :to="{ name: subMenuItem.pathName }">
                    <span class="default-layout__sub-menu-title">
                      {{ $t(subMenuItem.title) }}
                    </span>
                  </router-link>
                </a-menu-item>
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
                  <span class="default-layout__menu-title">
                    {{ $t(subMenu.title) }}
                  </span>
                </router-link>
              </a-menu-item>
            </span>
          </a-menu>
        </div>
        <div class="d-flex justify-center align-center mb-20">
          <a-button
            type="text"
            class="default-layout__logout-btn d-flex align-center gap-10"
            @click="onLogout"
          >
            <template #icon>
              <DoorArrowRight />
            </template>
            {{ $t("menu_lbl_logout") }}
          </a-button>
        </div>
      </div>
    </div>
    <div class="default-layout__content-wrapper fill-width fill-height">
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
.default-layout {
  &__lhs-wrapper {
    width: 300px;
    height: 100%;
    background-color: #fff;
    box-shadow: 4px 2px 8px rgba(0, 0, 0, 0.02);
    z-index: 1;
  }

  &__logo {
    height: 90px;
    cursor: pointer;
  }

  &__greeting {
    height: 48px;
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    color: #3c3c3c;
  }

  &__menu-wrapper {
    height: calc(100% - 90px - 48px - 1px);
  }

  &__menu {
    overflow: auto;
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
      transition: transform 0.3s;
      transform: rotate(180deg);
    }

    &__expanded {
      svg {
        transition: transform 0.3s;
        transform: rotate(0deg);
      }
    }
  }

  &__logout-btn {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #999999;
  }

  &__content-wrapper {
    background-color: #f0f8fa;
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
        transition: background 0.3s !important;
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
        }
      }

      .default-layout__arrow-icon {
        display: flex;
        align-items: center;

        svg {
          transition: transform 0.3s;
          transform: rotate(180deg);
        }
      }

      &-open {
        .default-layout__arrow-icon {
          svg {
            transition: transform 0.3s;
            transform: rotate(0deg);
          }
        }
      }

      &-title {
        transition: background 0.3s !important;
        border-left: 3px solid transparent;
        padding-left: 12px !important;
        height: 48px;
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
