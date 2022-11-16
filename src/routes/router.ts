import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { loginGuard } from "./guards/login.guard";
import { requireLoginGuard } from "./guards/require-login.guard";
import { routeNames } from "./route-names";
import { ScreenLayout } from "./screen-layouts";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: routeNames.default,
    redirect: {
      name: routeNames.dashboard
    }
  },
  {
    path: "/demo",
    name: routeNames.demo,
    component: () => import("@/modules/base/pages/SampleListPage.vue"),
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    }
  },
  {
    path: "/login",
    name: routeNames.login,
    component: () => import("@/modules/auth/pages/LoginPage.vue"),
    beforeEnter: loginGuard,
    meta: {
      layout: ScreenLayout.AUTH_LAYOUT
    }
  },
  {
    path: "/forgot-password",
    name: routeNames.forgotPassword,
    component: () => import("@/modules/auth/pages/ForgotPasswordPage.vue"),
    beforeEnter: loginGuard,
    meta: {
      layout: ScreenLayout.AUTH_LAYOUT
    }
  },
  {
    path: "/dashboard",
    name: routeNames.dashboard,
    component: () =>
      import("@/modules/collection-business/pages/CollectionBusiness.vue"),
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    }
  },
  {
    path: "/internal-dashboard",
    name: routeNames.internalDashboard,
    component: () =>
      import("@/modules/dashboard/pages/InternalDashboardPage.vue"),
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    }
  },
  {
    path: "/external-dashboard",
    name: routeNames.externalDashboard,
    component: () =>
      import("@/modules/dashboard/pages/ExternalDashboardPage.vue"),
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    }
  },
  {
    path: "/collection-business",
    name: routeNames.collectionBusiness,
    component: () =>
      import("@/modules/collection-business/pages/CollectionBusiness.vue"),
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    children: [
      {
        path: "real-time-management",
        name: routeNames.realTimeDynamics,
        component: () =>
          import("@/modules/vehicle-management/pages/RealTimeDynamics.vue")
      }
    ]
  },
  {
    path: "/product-manufacture",
    name: routeNames.productManufacture,
    component: () =>
      import("@/modules/product-manufacture/pages/productManufacture.vue"),
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    }
  },
  {
    path: "/traceability",
    name: routeNames.traceability,
    component: () => import("@/modules/traceability/pages/TheTraceability.vue"),
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    }
  },
  {
    path: "/customer-management",
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    children: [
      {
        path: "customer-list",
        name: routeNames.customerList,
        meta: {
          layout: ScreenLayout.DEFAULT_LAYOUT
        },
        component: () =>
          import("@/modules/customer-management/pages/CustomerList.vue")
      },
      {
        path: "create-new",
        name: routeNames.createNewCustomer,
        component: () =>
          import("@/modules/customer-management/pages/CreateCustomer.vue")
      },
      {
        path: ":id",
        name: routeNames.editCustomer,
        component: () =>
          import("@/modules/customer-management/pages/EditCustomer.vue")
      },
      {
        path: "detail/:id",
        name: routeNames.customerDetail,
        component: () =>
          import("@/modules/customer-management/pages/CustomerDetail.vue")
      }
    ]
  },
  {
    path: "/vehicle-management",
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    children: [
      {
        path: "real-time-dynamic",
        name: routeNames.realTimeDynamics,
        component: () =>
          import("@/modules/vehicle-management/pages/RealTimeDynamics.vue")
      },
      {
        path: "vehicle",
        name: routeNames.vehicle,
        component: () =>
          import("@/modules/vehicle-management/pages/VehicleList.vue")
      },
      {
        path: "create-vehicle/",
        name: routeNames.createVehicle,
        component: () =>
          import("@/modules/vehicle-management/pages/CreateVehicle.vue")
      },
      {
        path: "edit-vehicle/:id",
        name: routeNames.editVehicle,
        component: () =>
          import("@/modules/vehicle-management/pages/EditVehicle.vue")
      },
      {
        path: "vehicle-type",
        name: routeNames.vehicleType,
        component: () =>
          import("@/modules/vehicle-management/pages/VehicleType.vue")
      },
      {
        path: "create-new-vehicle-type",
        name: routeNames.createVehicleType,
        component: () =>
          import("@/modules/vehicle-management/pages/CreateNewVehicleType.vue")
      },
      {
        path: "edit-vehicle-type/:id",
        name: routeNames.editVehicleType,
        component: () =>
          import("@/modules/vehicle-management/pages/EditVehicleType.vue")
      }
    ]
  },
  {
    path: "/staff-management",
    beforeEnter: requireLoginGuard,
    redirect: {
      name: routeNames.staffManagement
    },
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    children: [
      {
        path: "",
        name: routeNames.staffManagement,
        component: () =>
          import("@/modules/staff-management/pages/StaffManagement.vue")
      },

      {
        path: "create-new-staff",
        name: routeNames.createNewStaff,
        component: () =>
          import("@/modules/staff-management/pages/StaffRegistration.vue")
      },
      {
        path: "detail/:id",
        name: routeNames.staffDetail,
        component: () =>
          import("@/modules/staff-management/pages/StaffDetailPage.vue")
      }
    ]
  },
  {
    path: "/collection-point-management",
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.collectionPointManagement
    },
    children: [
      {
        path: "detail/:id",
        name: routeNames.collectionPointDetail,
        component: () =>
          import(
            "@/modules/collection-point-management/pages/CollectionPointDetailPage.vue"
          )
      },
      {
        path: "list",
        name: routeNames.collectionPointManagement,
        component: () =>
          import(
            "@/modules/collection-point-management/pages/CollectionPointList.vue"
          )
      },
      {
        path: "create",
        name: routeNames.createCollectionPoint,
        component: () =>
          import(
            "@/modules/collection-point-management/pages/CreateCollectionPoint.vue"
          )
      },
      {
        path: "edit/:id",
        name: routeNames.editCollectionPoint,
        component: () =>
          import(
            "@/modules/collection-point-management/pages/EditCollectionPoint.vue"
          )
      }
    ]
  },
  {
    path: "/container",
    name: routeNames.container,
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.containerChild
    },
    children: [
      {
        name: routeNames.createNewContainer,
        path: "container/create-new",
        component: () =>
          import("@/modules/container/pages/CreateNewContainer.vue")
      },
      {
        name: routeNames.containerChild,
        path: "container",
        component: () => import("@/modules/container/pages/TheContainer.vue")
      },
      {
        name: routeNames.editContainer,
        path: "edit-container/:id",
        component: () => import("@/modules/container/pages/EditContainer.vue")
      },
      {
        name: routeNames.containerType,
        path: "container-type",
        component: () =>
          import("@/modules/container/pages/ContainerTypeList.vue")
      },
      {
        name: routeNames.createContainerType,
        path: "create-new-container-type",
        component: () =>
          import("@/modules/container/pages/CreateNewContainerType.vue")
      },
      {
        name: routeNames.editContainerType,
        path: "edit-container-type/:id",
        component: () =>
          import("@/modules/container/pages/EditContainerType.vue")
      },
      {
        name: routeNames.workingPlace,
        path: "working-place",
        component: () => import("@/modules/container/pages/WorkingPlace.vue")
      }
    ]
  },
  {
    path: "/tenant-setting",
    name: routeNames.tenantSetting,
    component: () => import("@/modules/setting/pages/TenantSettingPage.vue"),
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    }
  },
  {
    path: "/account-setting",
    name: routeNames.accountSetting,
    component: () => import("@/modules/setting/pages/AccountSettingPage.vue"),
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    }
  },
  //dummies route
  {
    path: "/collection-base-management",
    name: routeNames.collectionBaseManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    },
    children: [
      {
        path: "list",
        name: routeNames.listCollectionBase,
        component: () =>
          import("@/modules/staff-management/pages/CollectionBase.vue")
      },
      {
        path: "create-new",
        name: routeNames.createCollectionBase,
        component: () =>
          import("@/modules/staff-management/pages/CreateCollectionBase.vue")
      },
      {
        path: "edit/:id",
        name: routeNames.editCollectionBase,
        component: () =>
          import("@/modules/staff-management/pages/EditCollectionBase.vue")
      },
      {
        path: "detail/:id",
        name: routeNames.collectionBaseDetail,
        component: () =>
          import(
            "@/modules/staff-management/pages/CollectionBaseDetailPage.vue"
          )
      }
    ]
  },
  {
    path: "/partner-management",
    name: routeNames.partnerManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    }
  },
  {
    path: "/collection-management",
    name: routeNames.collectionManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    },
    children: [
      {
        path: "/realtime-management",
        name: routeNames.realTimeManagement,
        component: () =>
          import("@/modules/realtime-management/RealTimeManagement.vue")
      },
      {
        path: "/driver-location-tracking/:id",
        name: routeNames.driverLocationTracking,
        component: () =>
          import("@/modules/realtime-management/DriverLocationTracking.vue")
      },
      {
        path: "collection-history/list",
        name: routeNames.collectionHistory,
        component: () =>
          import("@/modules/collection-history/pages/CollectionHistoryList.vue")
      }
    ]
  },
  {
    path: "/collection-type-management",
    name: routeNames.collectionTypeManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    }
  },
  {
    path: "/unit-items",
    name: routeNames.unitItems,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    }
  },
  {
    path: "/unit-price",
    name: routeNames.unitPrice,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    }
  },
  {
    path: "/unit-price-update-plan",
    name: routeNames.unitPriceUpdatePlan,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    }
  },
  {
    path: "/landmark-management",
    name: routeNames.landmarkManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    }
  },
  {
    path: "/collection-order-management",
    name: routeNames.collectionOrderManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    }
  },
  {
    path: "/collection-base-management",
    name: routeNames.collectionBaseManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    },
    children: [
      {
        path: "list",
        name: routeNames.listCollectionBase,
        component: () =>
          import("@/modules/staff-management/pages/CollectionBase.vue")
      },
      {
        path: "create-new",
        name: routeNames.createCollectionBase,
        component: () =>
          import("@/modules/staff-management/pages/CreateCollectionBase.vue")
      },
      {
        path: "edit/:id",
        name: routeNames.editCollectionBase,
        component: () =>
          import("@/modules/staff-management/pages/EditCollectionBase.vue")
      },
      {
        path: "detail/:id",
        name: routeNames.collectionBaseDetail,
        component: () =>
          import(
            "@/modules/staff-management/pages/CollectionBaseDetailPage.vue"
          )
      }
    ]
  },
  {
    path: "/collection-route-management",
    name: routeNames.collectionRouteManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.listCollectionRoute
    },
    children: [
      {
        name: routeNames.listCollectionRoute,
        path: "list",
        component: () =>
          import(
            "@/modules/collection-route-management/pages/CollectionRouteList.vue"
          )
      },
      {
        name: routeNames.collectionRouteDetail,
        path: "detail/:id",
        component: () =>
          import(
            "@/modules/collection-route-management/pages/CollectionRouteDetail.vue"
          )
      },
      {
        path: "create",
        name: routeNames.createCollectionRouteOrder,
        component: () =>
          import(
            "@/modules/collection-route-management/pages/CreateCollectionRouteOrder.vue"
          )
      },
      {
        path: "edit/:id",
        name: routeNames.editCollectionRouteOrder,
        component: () =>
          import(
            "@/modules/collection-route-management/pages/EditCollectionRouteOrder.vue"
          )
      }
    ]
  },
  {
    path: "/delivery-management",
    name: routeNames.deliveryManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    }
  },
  {
    path: "/storage-management",
    name: routeNames.storageManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    }
  },
  {
    path: "/manufacture-category-management",
    name: routeNames.manufactureCategoryManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    }
  },
  {
    path: "/manufacture-task-management",
    name: routeNames.manufactureTaskManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    }
  },
  {
    path: "/manufacture-item-management",
    name: routeNames.manufactureItemManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    }
  },
  {
    path: "/role-management",
    name: routeNames.roleManagement,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.default
    }
  },
  {
    path: "/collection-route",
    name: routeNames.collectionRoute,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    },
    redirect: {
      name: routeNames.createRoute
    },
    children: [
      {
        path: ":routeId?/:mode/:id",
        name: routeNames.createRoute,
        component: () =>
          import("@/modules/collect-route/pages/CollectRouteDetail.vue")
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NOT_FOUND",
    redirect: {
      name: routeNames.default
    }
  }
];
export const router = createRouter({
  history: createWebHistory(),
  routes
});
