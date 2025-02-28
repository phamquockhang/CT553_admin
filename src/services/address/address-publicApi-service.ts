import { ApiResponse, IDistrict, IProvince, IWard } from "../../interfaces";

const addressHost =
  "https://online-gateway.ghn.vn/shiip/public-api/master-data";

const requestInit = {
  headers: {
    "Content-Type": "application/json",
    Token: "6dafe670-d575-11ef-868e-aa314df30790",
  },
};

interface IAddressPublicApiService {
  getProvinces(): Promise<ApiResponse<IProvince[]>>;
  getDistricts(provinceId?: number): Promise<ApiResponse<IDistrict[]>>;
  getWards(districtId?: number): Promise<ApiResponse<IWard[]>>;
}

class AddressPublicApiService implements IAddressPublicApiService {
  async getProvinces(): Promise<ApiResponse<IProvince[]>> {
    return (await fetch(`${addressHost}/province`, requestInit)).json();
  }

  async getDistricts(provinceId?: number): Promise<ApiResponse<IDistrict[]>> {
    return (
      await fetch(
        `${addressHost}/district?province_id=${provinceId}`,
        requestInit,
      )
    ).json();
  }

  async getWards(districtId?: number): Promise<ApiResponse<IWard[]>> {
    return (
      await fetch(`${addressHost}/ward?district_id=${districtId}`, requestInit)
    ).json();
  }
}

export const addressPublicApiService = new AddressPublicApiService();
