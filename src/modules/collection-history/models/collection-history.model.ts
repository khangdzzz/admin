export interface CollectionHistoryModel {
  createdAt?: string;
  createdBy?: number | string;
  updatedAt?: string;
  updatedBy?: number | string | null;
  deletedAt?: string | null;
  deletedBy?: number | string | null;
  id: number;
  collectDate: string;
  tenantId: number;
  workplaceId?: number;
  isConfirm: number;
  userName: string;
  userId?: number;
  vehicleName: string;
  vehiclePlateNumber?: number;
  collectItemName: string;
  collectPointId: string;
  customerId?: string;
  packingWeight: string;
  weight: string;
  quantity: number;
  workplaceName?: string;
  unit?: string;
  customerName: string;
}
