export interface IProvince {
  ProvinceID: number;
  ProvinceName: string;
  // CountryID: number;
  Code: string;
}

export interface IDistrict {
  DistrictID: number;
  DistrictName: string;
  // ProvinceID: number;
  Code: string;
}

export interface IWard {
  WardCode: string;
  WardName: string;
  // DistrictID: number;
  Code: string;
}

export interface IAddress {
  addressId?: number;
  provinceId: number;
  districtId: number;
  wardCode: string;
  description: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}
