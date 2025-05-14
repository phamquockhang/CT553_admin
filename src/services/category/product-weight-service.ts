import { AxiosInstance } from "axios";
import { ApiResponse, IWeight } from "../../interfaces";
import { createApiClient } from "../api-client";

interface IProductWeightService {
  getAllWeightOfProduct(productId: number): Promise<ApiResponse<IWeight[]>>;
  createWeightOfProduct(
    productId: number,
    newWeight: Omit<IWeight, "weightId">,
  ): Promise<ApiResponse<IWeight>>;
}

const apiClient: AxiosInstance = createApiClient("weights");

class ProductWeightService implements IProductWeightService {
  async getAllWeightOfProduct(
    productId: number,
  ): Promise<ApiResponse<IWeight[]>> {
    return await apiClient.get(`/${productId}`);
  }

  async createWeightOfProduct(
    productId: number,
    newWeight: Omit<IWeight, "weightId">,
  ): Promise<ApiResponse<IWeight>> {
    return await apiClient.post(`/${productId}`, newWeight);
  }
}

export const productWeightService = new ProductWeightService();
