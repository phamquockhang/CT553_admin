import { AxiosInstance } from "axios";
import { ApiResponse } from "../../interfaces";
import { createApiClient } from "../api-client";
import { IAddress } from "../../interfaces/address";

interface IAddressService {
  getAllAddressesByCustomerId(
    customerId: string,
  ): Promise<ApiResponse<IAddress[]>>;
  getDefaultAddressByCustomerId(
    customerId: string,
  ): Promise<ApiResponse<IAddress>>;
  create(
    customerId: string,
    newAddress: IAddress,
  ): Promise<ApiResponse<IAddress>>;
}

const apiClient: AxiosInstance = createApiClient("addresses");
class AddressService implements IAddressService {
  async getAllAddressesByCustomerId(
    customerId: string,
  ): Promise<ApiResponse<IAddress[]>> {
    return (await apiClient.get(`/${customerId}`)).data;
  }

  async getDefaultAddressByCustomerId(
    customerId: string,
  ): Promise<ApiResponse<IAddress>> {
    return await apiClient.get(`/default/${customerId}`);
  }

  async create(
    customerId: string,
    newAddress: IAddress,
  ): Promise<ApiResponse<IAddress>> {
    return await apiClient.post(`/${customerId}`, newAddress);
  }
}

export const addressService = new AddressService();
