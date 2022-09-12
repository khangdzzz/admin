import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { requireLoginGuard } from "./guards/require-login.guard";
import { routeNames } from "./route-names";
import { ScreenLayout } from "./screen-layouts";
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: routeNames.default,
        redirect: {
            name: routeNames.home
        },
        meta: {
            layout: ScreenLayout.DEFAULT_LAYOUT
        }
    },
    {
        path: '/login',
        name: routeNames.login,
        component: () => import('@/modules/auth/pages/LoginPage.vue'),
        meta: {
            layout: ScreenLayout.AUTH_LAYOUT
        }
    },
    {
        path: '/home',
        name: routeNames.home,
        component: () => import('@/modules/auth/pages/HelloWorldPage.vue'),
        beforeEnter: requireLoginGuard,
        meta: {
            layout: ScreenLayout.DEFAULT_LAYOUT
        }
    }
]
export const router = createRouter({
    history: createWebHistory(),
    routes
})