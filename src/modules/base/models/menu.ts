import { routeNames } from "@/routes";
import IcDashboard from "@/assets/images/ImDashboard.vue";
import SuitCase from "@/assets/images/ImSuitCase.vue";
import Manufacture from "@/assets/images/ImManufacture.vue";
import GroupOfPeople from "@/assets/images/ImGroupOfPeople.vue";
import Setting from "@/assets/images/ImSetting.vue";
import { UserType } from "./user-type.enum";
import { Component } from "vue";

export interface SideMenuItems {
  key?: string;
  icon?: Component;
  title: string;
  pathName?: string;
  requireUserType?: UserType[];
  items?: SideMenuItems[];
}

const sideMenuItems: SideMenuItems[] = [
  {
    key: "Dashboard",
    icon: IcDashboard,
    title: "menu_lbl_dashboard",
    pathName: routeNames.dashboard,
    requireUserType: [
      UserType.TenantAdmin,
      UserType.CollectionBaseAdmin,
      UserType.PartnerAdmin,
      UserType.SystemAdmin,
      UserType.DischargerCustomer
    ],
    items: [
      {
        title: "menu_lbl_dashboard_internal",
        pathName: routeNames.internalDashboard,
        requireUserType: [UserType.TenantAdmin]
      },
      {
        title: "menu_lbl_dashboard_extenal",
        pathName: routeNames.externalDashboard,
        requireUserType: [UserType.TenantAdmin]
      }
    ]
  },
  {
    key: "Collection business",
    icon: SuitCase,
    title: "menu_lbl_collection_business",
    pathName: routeNames.collectionBusiness,
    requireUserType: [
      UserType.TenantAdmin,
      UserType.CollectionBaseAdmin,
      UserType.PartnerAdmin
    ],
    items: [
      {
        title: "menu_lbl_collection_history",
        pathName: routeNames.collectionHistory,
        requireUserType: []
      },
      {
        title: "menu_lbl_realtime_management",
        pathName: routeNames.realTimeDynamics,
        requireUserType: []
      }
    ]
  },
  {
    key: "Product manufacture",
    icon: Manufacture,
    title: "menu_lbl_product_manufacture",
    pathName: routeNames.productManufacture,
    requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin],
    items: [
      {
        title: "menu_lbl_manufacture_history",
        pathName: routeNames.productManufacture,
        requireUserType: []
      }
    ]
  },

  {
    key: "Master data",
    icon: GroupOfPeople,
    title: "menu_lbl_master_data",
    requireUserType: [
      UserType.TenantAdmin,
      UserType.CollectionBaseAdmin,
      UserType.PartnerAdmin
    ],
    items: [
      {
        title: "menu_lbl_staff_management",
        pathName: routeNames.staffManagement,
        requireUserType: []
      },
      {
        title: "menu_lbl_collection_base_management",
        pathName: routeNames.listCollectionBase,
        requireUserType: [UserType.TenantAdmin]
      },
      {
        title: "menu_lbl_partner_management",
        pathName: routeNames.partnerManagement,
        requireUserType: [UserType.TenantAdmin]
      },
      {
        title: "menu_lbl_customer_management",
        pathName: routeNames.customerManagement,
        requireUserType: [UserType.TenantAdmin]
      },
      {
        title: "menu_lbl_store_management",
        pathName: routeNames.storeManagment,
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_vehicle_type_management",
        pathName: routeNames.vehicleType,
        requireUserType: [UserType.TenantAdmin]
      },
      {
        title: "menu_lbl_vehicle_management",
        pathName: routeNames.vehicle,
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_container_type_management",
        pathName: routeNames.containerType,
        requireUserType: [UserType.TenantAdmin]
      },
      {
        title: "menu_lbl_container_management",
        pathName: routeNames.container,
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_collection_management",
        pathName: routeNames.collectionManagement,
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_collection_type_management",
        pathName: routeNames.collectionTypeManagement,
        requireUserType: [UserType.TenantAdmin]
      },
      {
        title: "menu_lbl_unit_price",
        pathName: routeNames.unitPrice,
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_unit_price_update_plan",
        pathName: routeNames.unitPriceUpdatePlan,
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_landmark_management",
        pathName: routeNames.landmarkManagement,
        requireUserType: []
      },
      {
        title: "menu_lbl_collection_order_management",
        pathName: routeNames.collectionOrderManagement,
        requireUserType: []
      },
      {
        title: "menu_lbl_collection_route_management",
        pathName: routeNames.collectionRouteManagement,
        requireUserType: []
      },
      {
        title: "menu_lbl_delivery_management",
        pathName: routeNames.deliveryManagement,
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_storage_management",
        pathName: routeNames.storageManagement,
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_manufacture_task_management",
        pathName: routeNames.manufactureTaskManagement,
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_manufacture_category_management",
        pathName: routeNames.manufactureCategoryManagement,
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_manufacture_item_management",
        pathName: routeNames.manufactureItemManagement,
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_role_management",
        pathName: routeNames.roleManagement,
        requireUserType: [UserType.TenantAdmin]
      }
    ]
  },
  {
    key: "SystemAdminStaff",
    icon: GroupOfPeople,
    title: "menu_lbl_staff_management",
    pathName: routeNames.staffManagement,
    requireUserType: [UserType.SystemAdmin]
  },
  {
    key: "SystemAdminTenant",
    icon: GroupOfPeople,
    title: "menu_lbl_tenant_management",
    pathName: routeNames.staffManagement,
    requireUserType: [UserType.SystemAdmin]
  },
  {
    key: "Setting",
    icon: Setting,
    title: "menu_lbl_setting",
    pathName: routeNames.tenantSetting,
    requireUserType: [
      UserType.TenantAdmin,
      UserType.CollectionBaseAdmin,
      UserType.PartnerAdmin,
      UserType.SystemAdmin,
      UserType.DischargerCustomer
    ],
    items: [
      {
        title: "menu_lbl_tenant_setting",
        pathName: routeNames.tenantSetting,
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_account_setting",
        pathName: routeNames.accountSetting,
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      }
    ]
  }
];

export default sideMenuItems;
