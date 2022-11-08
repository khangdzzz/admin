import * as auth from "./auth.service";
import * as localStorage from "./local-storage.service";
import * as language from "./language.service";
import * as vehicle from "./vehicle.service";
import * as container from "./container.service";
import * as vehicleType from "./vehicle-type.service";
import * as staff from "./staff.service";
import * as collectionBase from "./collection-base.service";
import * as collectionPoint from "./collection-point.service";
import * as customer from "./customer.service";
import * as constants from "./constants";
import * as customerManagement from "./customer-management.service";
import * as collectionRoute from "./collection-route.service";
import * as collectRoute from "./collect-route.service";
import * as location from "./location.service";
import * as collectionHistory from "./collection-history.service";
export const service = {
  auth,
  localStorage,
  language,
  vehicle,
  container,
  vehicleType,
  staff,
  collectionBase,
  collectionPoint,
  constants,
  customer,
  customerManagement,
  collectionRoute,
  location,
  collectRoute,
  collectionHistory
};
