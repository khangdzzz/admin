import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { loginGuard } from "./guards/login-guard";
import { requireLoginGuard } from "./guards/require-login.guard";
import { routeNames } from "./route-names";
import { ScreenLayout } from "./screen-layouts";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: routeNames.default,
    redirect: {
      name: routeNames.collectionBusiness
    }
  },
  {
    path: "/login",
    name: routeNames.login,
    component: () => import("@/modules/auth/pages/LoginPage.vue"),
    // beforeEnter: loginGuard,
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
    path: "/collection-business",
    name: routeNames.collectionBusiness,
    component: () =>
      import("@/modules/collection-business/pages/CollectionBusiness.vue"),
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    }
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
    name: routeNames.customerManagement,
    component: () =>
      import("@/modules/customer-management/pages/CustomerManagement.vue"),
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    }
  },
  {
    path: "/verhicle-management",
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
        path: "create-vehicle",
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
    name: routeNames.staffManagement,
    component: () =>
      import("@/modules/staff-management/pages/StaffManagement.vue"),
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    }
  },
  {
    path: "/container",
    name: routeNames.container,
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
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
    path: "/setting",
    name: routeNames.setting,
    component: () => import("@/modules/setting/pages/TheSetting.vue"),
    beforeEnter: requireLoginGuard,
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    }
  }
];
export const router = createRouter({
  history: createWebHistory(),
  routes
});
