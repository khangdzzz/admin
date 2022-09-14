<script setup lang="ts">
import { ref } from "vue";
import { MenuItem } from "../model/nav-menu-item.model";

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

const user = ref<string>("username");
const selectedKeys = ref<string[]>(["Collection business"]);
const openKeys = ref<string[]>([""]);

const menuItems = [
  {
    key: "Collection business",
    icon: SuitCase,
    title: "Collection business",
    pathName: routeNames.collectionBusiness
  },
  {
    key: "Product manufacture",
    icon: Manufacture,
    title: "Product manufacture",
    pathName: routeNames.productManufacture
  },
  {
    key: "Traceability",
    icon: Trace,
    title: "Traceability",
    pathName: routeNames.traceability
  },
  {
    key: "Customer management",
    icon: GroupOfPeople,
    title: "Customer management",
    pathName: routeNames.customerManagement
  },
  {
    key: "Vehicle management",
    icon: Truck,
    title: "Vehicle management",
    items: [
      {
        title: "Real-time dynamics",
        pathName: routeNames.realTimeDynamics
      },
      {
        title: "Vehicle",
        pathName: routeNames.vehicle
      },
      {
        title: "Vehicle type",
        pathName: routeNames.vehicleType
      }
    ]
  },
  {
    key: "Collection base/ Staff management",
    icon: Location,
    title: "Collection base/ Staff management",
    pathName: routeNames.staffManagement
  },
  {
    key: "Container/ Working place management",
    icon: Container,
    title: "Container/ Working place management",
    pathName: routeNames.container
  },
  {
    key: "Setting",
    icon: Setting,
    title: "Setting",
    pathName: routeNames.setting
  }
];

const isSubMenuActive = (key: string, items: MenuItem[] | null): boolean => {
  const parsedSelectedKeys = JSON.parse(JSON.stringify(selectedKeys.value));

  if (items) {
    return items.some((item) => parsedSelectedKeys.includes(item.title));
  }

  return parsedSelectedKeys.includes(key);
};

const isSubMenuOpen = (key: string): boolean => {
  const parsedOpenKeys = JSON.parse(JSON.stringify(openKeys.value));

  return parsedOpenKeys.includes(key);
};
</script>

<template>
  <div class="default-layout fill-height d-flex">
    <div class="default-layout__lhs-wrapper">
      <div class="default-layout__logo d-flex justify-center align-center">
        <Logo />
      </div>
      <a-divider class="m-0" />
      <div class="default-layout__greeting p-15">Hello, {{ user }}</div>
      <div
        class="default-layout__menu-wrapper d-flex flex-column justify-space-between"
      >
        <div class="default-layout__menu fill-height">
          <a-menu
            mode="inline"
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
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
                    :color="
                      isSubMenuActive(subMenu.title, subMenu.items)
                        ? '#07A0B8'
                        : ''
                    "
                    class="default-layout__icon"
                  ></component>
                </template>
                <template #title>
                  <span class="default-layout__menu-title">
                    {{ subMenu.title }}
                  </span>
                </template>
                <template #expandIcon>
                  <span
                    :class="
                      isSubMenuOpen(subMenu.key)
                        ? 'default-layout__expand-icon__expanded'
                        : 'default-layout__expand-icon'
                    "
                  >
                    <ArrowUp />
                  </span>
                </template>
                <a-menu-item
                  v-for="subMenuItem in subMenu.items"
                  :key="subMenuItem.title"
                >
                  <router-link :to="{ name: subMenuItem.pathName }">
                    <span class="default-layout__sub-menu-title">
                      {{ subMenuItem.title }}
                    </span>
                  </router-link>
                </a-menu-item>
              </a-sub-menu>
              <a-menu-item v-else :key="subMenu.key">
                <template #icon>
                  <component
                    :is="subMenu.icon"
                    :color="
                      isSubMenuActive(subMenu.title, null) ? '#07A0B8' : ''
                    "
                    class="default-layout__icon"
                  ></component>
                </template>
                <router-link :to="{ name: subMenu.pathName }">
                  <span class="default-layout__menu-title">
                    {{ subMenu.title }}
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
          >
            <template #icon>
              <DoorArrowRight />
            </template>
            Log out
          </a-button>
        </div>
      </div>
    </div>
    <div class="default-layout__content-wrapper fill-width fill-height">
      <router-view/>
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
    height: calc(100% - 90px - 48px);
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

    &-item {
      height: 48px !important;
      border-left: 3px solid transparent;
    }

    &-item-selected {
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
      }
    }

    &-submenu {
      .ant-menu-sub {
        background-color: #fff;
      }
    }

    &-submenu-selected {
      .default-layout__menu-title {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 20px;
        color: #07a0b8;
      }
    }
  }
}
</style>
