import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { service } from "@/services";
import { routeNames } from "@/routes/route-names";

export function loginGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext): void {
    if (service.localStorage.getAccessToken()) {
        next({ name: routeNames.home });
    } else {
        next();
    }
}