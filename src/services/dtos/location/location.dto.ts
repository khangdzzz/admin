export interface PostalAddressResponseDTO {
  id: number;
  national: string;
  local_gov_code: string;
  old_postal_code: string;
  postal_code: string;
  full_address: string;
  prefecture: string;
  prefecture_kana: string;
  city_kana: string;
  town_kana: string;
  city: string;
  town: string;
  rep_mt_two: string;
  include_street: string;
  include_city_block: string;
  have_same_postal: string;
  updated: string;
}

export interface GetLatLongResponseDTO {
  lat: string;
  lon: string;
  display_name: string;
}
