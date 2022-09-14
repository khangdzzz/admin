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

const user = ref<string>("username");
const selectedKeys = ref<string[]>(["Collection business"]);
const openKeys = ref<string[]>([""]);

const menuItems = [
  {
    key: "Collection business",
    icon: SuitCase,
    title: "Collection business"
  },
  {
    key: "Product manufacture",
    icon: Manufacture,
    title: "Product manufacture"
  },
  {
    key: "Traceability",
    icon: Trace,
    title: "Traceability"
  },
  {
    key: "Customer management",
    icon: GroupOfPeople,
    title: "Customer management"
  },
  {
    key: "Vehicle management",
    icon: Truck,
    title: "Vehicle management",
    items: [
      {
        title: "Real-time dynamics"
      },
      {
        title: "Vehicle"
      },
      {
        title: "Vehicle type"
      }
    ]
  },
  {
    key: "Collection base/ Staff management",
    icon: Location,
    title: "Collection base/ Staff management"
  },
  {
    key: "Container/ Working place management",
    icon: Container,
    title: "Container/ Working place management"
  },
  {
    key: "Setting",
    icon: Setting,
    title: "Setting"
  }
];

const onOpenChange = (keys: string[]): void => {
  openKeys.value = [keys[keys.length - 1]];
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
                    {{ subMenu.title }}
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
                  <span class="default-layout__sub-menu-title">
                    {{ subMenuItem.title }}
                  </span>
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
                <span class="default-layout__menu-title">
                  {{ subMenu.title }}
                </span>
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
      <v-slot></v-slot>
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
