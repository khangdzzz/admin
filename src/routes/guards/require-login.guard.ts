import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { service } from "@/services";
import { routeNames } from "@/routes/route-names";

export function requireLoginGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext): void {
    if (service.localStorage.getAccessToken()) {
        next()
    } else {
        next({ name: routeNames.login })
    }
}