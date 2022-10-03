import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { service } from "@/services";
import { routeNames } from "@/routes/route-names";
import { UserType } from "@/modules/base/models/user-type.enum";

export function loginGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  if (service.localStorage.getAccessToken()) {
    let nextRoute = routeNames.collectionBusiness;
    const userRole: UserType = (service.localStorage.getItem("USER_TYPE_KEY") ||
      UserType.DischargerCustomer) as UserType;
    switch (userRole) {
      case UserType.TenantAdmin:
        nextRoute = routeNames.internalDashboard;
        break;
      default:
        break;
    }
    next({ name: nextRoute });
  } else {
    next();
  }
}
