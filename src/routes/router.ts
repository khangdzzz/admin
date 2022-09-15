import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { requireLoginGuard } from "./guards/require-login.guard";
import { routeNames } from "./route-names";
import { ScreenLayout } from "./screen-layouts";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: routeNames.default,
    redirect: {
      name: routeNames.home
    },
    meta: {
      layout: ScreenLayout.DEFAULT_LAYOUT
    }
  },
  {
    path: "/login",
    name: routeNames.login,
    component: () => import("@/modules/auth/pages/LoginPage.vue"),
    meta: {
      layout: ScreenLayout.AUTH_LAYOUT
    }
  },
  {
    path: "/forgot-password",
    name: routeNames.forgotPassword,
    component: () => import("@/modules/auth/pages/ForgotPasswordPage.vue"),
    meta: {
      layout: ScreenLayout.AUTH_LAYOUT
    }
  },
  {
    path: "/home",
    name: routeNames.home,
    component: () => import("@/modules/auth/pages/HelloWorldPage.vue"),
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
    beforeEnter: requireLoginGuard
  },
  {
    path: "/product-manufacture",
    name: routeNames.productManufacture,
    component: () =>
      import("@/modules/product-manufacture/pages/productManufacture.vue"),
    beforeEnter: requireLoginGuard
  },
  {
    path: "/traceability",
    name: routeNames.traceability,
    component: () => import("@/modules/traceability/pages/TheTraceability.vue"),
    beforeEnter: requireLoginGuard
  },
  {
    path: "/customer-management",
    name: routeNames.customerManagement,
    component: () =>
      import("@/modules/customer-management/pages/CustomerManagement.vue"),
    beforeEnter: requireLoginGuard
  },
  {
    path: "/verhicle-management",
    beforeEnter: requireLoginGuard,
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
          import("@/modules/vehicle-management/pages/TheVehicle.vue")
      },
      {
        path: "vehicle-type",
        name: routeNames.vehicleType,
        component: () =>
          import("@/modules/vehicle-management/pages/VehicleType.vue")
      }
    ]
  },
  {
    path: "/staff-management",
    name: routeNames.staffManagement,
    component: () =>
      import("@/modules/staff-management/pages/StaffManagement.vue"),
    beforeEnter: requireLoginGuard
  },
  {
    path: "/container",
    name: routeNames.container,
    component: () => import("@/modules/container/pages/TheContainer.vue"),
    beforeEnter: requireLoginGuard
  },
  {
    path: "/setting",
    name: routeNames.setting,
    component: () => import("@/modules/setting/pages/TheSetting.vue"),
    beforeEnter: requireLoginGuard
  }
];
export const router = createRouter({
  history: createWebHistory(),
  routes
});
