export interface CollectionItemResponseDTO {
	created_at?: Date;
  created_by?: number | string;
  updated_at?: Date;
  updated_by?: number | string | null;
  deleted_at?: Date | null;
  deleted_by?: number | string | null;
  id: number;
  tenant_id: number;
	collect_item_category_id: number;
  name: string;
	external_code: string;
	extension_code: string;
	tag_id: string;
  collect_item_category___name: string;
}
  