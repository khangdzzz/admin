export interface CreateVehicleTypeInputDto {
    tenant_id: number;
    name: string;
}

export interface CreateVehicleTypeResponseDto {
    created_at: string;
    updated_at: string;
    id: number;
    name: string;
    tenant_id: number;
}