import * as auth from "./auth.service";
import * as localStorage from "./local-storage.service";
import * as language from "./language.service";
import * as vehicle from "./vehicle.service";
import * as container from "./container.service";
import * as vehicleType from "./vehicle-type.service";
import * as staff from "./staff.service";
import * as collectionBase from "./collection-base.service";
import * as customer from "./customer.service";
import * as constants from "./constants";
import * as customerManagement from "./customer-management.service";
import * as collectionPoint from "./collection-point.service"
export const service = {
  auth,
  localStorage,
  language,
  vehicle,
  container,
  vehicleType,
  staff,
  collectionBase,
  constants,
  customer,
  customerManagement,
  collectionPoint
};
