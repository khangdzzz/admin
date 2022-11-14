export interface CollectionItemModel {
  key?: number;
  id?: number;
  name: string;
  category?: string;
  externalCode?: string;
  lastUpdate?: string;
}


export interface CollectionItem {
  key?: number;
  id?: number;
  created_at?: Date;
  created_by?: number | string;
  updated_at?: Date;
  updated_by?: number | string | null;
  deleted_at?: Date | null;
  deleted_by?: number | string | null;
  tenant_id: number;
	collect_item_category_id: number;
  name: string;
	external_code: string;
	extension_code: string;
	tag_id: string;
  collect_item_category___name: string;
}