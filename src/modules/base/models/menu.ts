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
  qaAttr?: string;
}

const sideMenuItems: SideMenuItems[] = [
  {
    key: "Dashboard",
    icon: IcDashboard,
    title: "menu_lbl_dashboard",
    pathName: routeNames.dashboard,
    qaAttr: "qa_menu_dashboard",
    requireUserType: [
      UserType.TenantAdmin,
      UserType.CollectionBaseAdmin,
      UserType.Consignee,
      UserType.SystemAdmin,
      UserType.Dischanger
    ],
    items: [
      {
        title: "menu_lbl_dashboard_internal",
        pathName: routeNames.internalDashboard,
        requireUserType: [UserType.TenantAdmin],
        qaAttr: "qa_menu_dashboard_internal"
      },
      {
        title: "menu_lbl_dashboard_extenal",
        pathName: routeNames.externalDashboard,
        requireUserType: [UserType.TenantAdmin],
        qaAttr: "qa_menu_dashboard_external"
      }
    ]
  },
  {
    key: "Collection business",
    icon: SuitCase,
    title: "menu_lbl_collection_business",
    pathName: routeNames.collectionBusiness,
    qaAttr: "qa_menu_collection_business",
    requireUserType: [
      UserType.TenantAdmin,
      UserType.CollectionBaseAdmin,
      UserType.Consignee
    ],
    items: [
      {
        title: "menu_lbl_collection_history",
        pathName: routeNames.collectionHistory,
        requireUserType: [],
        qaAttr: "qa_menu_collection_history"
      },
      {
        title: "menu_lbl_realtime_management",
        pathName: routeNames.realTimeDynamics,
        requireUserType: [],
        qaAttr: "qa_menu_realtime_management"
      }
    ]
  },
  {
    key: "Product manufacture",
    icon: Manufacture,
    title: "menu_lbl_product_manufacture",
    pathName: routeNames.productManufacture,
    requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin],
    qaAttr: "qa_menu_manufacture_manegement",
    items: [
      {
        title: "menu_lbl_manufacture_history",
        pathName: routeNames.productManufacture,
        qaAttr: "qa_menu_manufacture_history",
        requireUserType: []
      }
    ]
  },

  {
    key: "Master data",
    icon: GroupOfPeople,
    title: "menu_lbl_master_data",
    qaAttr: "qa_menu_master_data",
    requireUserType: [
      UserType.TenantAdmin,
      UserType.CollectionBaseAdmin,
      UserType.Consignee
    ],
    items: [
      {
        title: "menu_lbl_staff_management",
        pathName: routeNames.staffManagement,
        qaAttr: "qa_menu_staff_management",
        requireUserType: []
      },
      {
        title: "menu_lbl_collection_base_management",
        pathName: routeNames.listCollectionBase,
        qaAttr: "qa_menu_collection_base_management",
        requireUserType: [UserType.TenantAdmin]
      },
      {
        title: "menu_lbl_partner_management",
        pathName: routeNames.partnerManagement,
        qaAttr: "qa_menu_partner_management",
        requireUserType: [UserType.TenantAdmin]
      },
      {
        title: "menu_lbl_customer_management",
        pathName: routeNames.customerList,
        qaAttr: "qa_menu_customer_management",
        requireUserType: [UserType.TenantAdmin]
      },
      {
        title: "menu_lbl_collection_point_management",
        pathName: routeNames.collectionPointManagement,
        qaAttr: "qa_menu_collection_point_management",
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_vehicle_type_management",
        pathName: routeNames.vehicleType,
        qaAttr: "qa_menu_vehicle_type_management",
        requireUserType: [UserType.TenantAdmin]
      },
      {
        title: "menu_lbl_vehicle_management",
        pathName: routeNames.vehicle,
        qaAttr: "qa_menu_vehicle_management",
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_container_type_management",
        pathName: routeNames.containerType,
        qaAttr: "qa_menu_container_type_management",
        requireUserType: [UserType.TenantAdmin]
      },
      {
        title: "menu_lbl_container_management",
        pathName: routeNames.container,
        qaAttr: "qa_menu_container_management",
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_collection_management",
        pathName: routeNames.collectionManagement,
        qaAttr: "qa_menu_collection_management",
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_collection_type_management",
        pathName: routeNames.collectionTypeManagement,
        qaAttr: "qa_menu_collection_type_management",
        requireUserType: [UserType.TenantAdmin]
      },
      {
        title: "menu_lbl_unit_price",
        pathName: routeNames.unitPrice,
        qaAttr: "qa_menu_unit_price",
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_unit_price_update_plan",
        pathName: routeNames.unitPriceUpdatePlan,
        qaAttr: "qa_menu_unit_price_update_plan",
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_landmark_management",
        pathName: routeNames.landmarkManagement,
        qaAttr: "qa_menu_landmark_management",
        requireUserType: []
      },
      {
        title: "menu_lbl_collection_order_management",
        pathName: routeNames.collectionOrderManagement,
        qaAttr: "qa_menu_collection_order_management",
        requireUserType: []
      },
      {
        title: "menu_lbl_collection_route_management",
        pathName: routeNames.collectionRouteManagement,
        qaAttr: "qa_menu_collection_route_management",
        requireUserType: []
      },
      {
        title: "menu_lbl_delivery_management",
        pathName: routeNames.deliveryManagement,
        qaAttr: "qa_menu_delivery_management",
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_storage_management",
        pathName: routeNames.storageManagement,
        qaAttr: "qa_menu_storage_management",
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_manufacture_task_management",
        pathName: routeNames.manufactureTaskManagement,
        qaAttr: "qa_menu_manufacture_task_management",
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_manufacture_category_management",
        pathName: routeNames.manufactureCategoryManagement,
        qaAttr: "qa_menu_manufacture_category_management",
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_manufacture_item_management",
        pathName: routeNames.manufactureItemManagement,
        qaAttr: "qa_menu_manufacture_item_management",
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_role_management",
        pathName: routeNames.roleManagement,
        qaAttr: "qa_menu_role_management",
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
    qaAttr: "qa_menu_setting",
    requireUserType: [
      UserType.TenantAdmin,
      UserType.CollectionBaseAdmin,
      UserType.Consignee,
      UserType.SystemAdmin,
      UserType.Dischanger
    ],
    items: [
      {
        title: "menu_lbl_tenant_setting",
        pathName: routeNames.tenantSetting,
        qaAttr: "qa_menu_tenant_setting",
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      },
      {
        title: "menu_lbl_account_setting",
        pathName: routeNames.accountSetting,
        qaAttr: "qa_menu_account_setting",
        requireUserType: [UserType.TenantAdmin, UserType.CollectionBaseAdmin]
      }
    ]
  }
];

export default sideMenuItems;
