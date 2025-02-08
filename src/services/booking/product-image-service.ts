import { AxiosInstance } from "axios";
import { ApiResponse, IProductImage } from "../../interfaces";
import { createApiClient } from "../api-client";

interface IProductImageService {
  create(
    productId: number,
    newProductImage: FormData,
  ): Promise<ApiResponse<IProductImage>>;
  update(
    productId: number,
    updatedProductImage: FormData,
  ): Promise<ApiResponse<IProductImage>>;
}

const apiClient: AxiosInstance = createApiClient("productImages");

class ProductImageService implements IProductImageService {
  async create(
    productId: number,
    newProductImage: FormData,
  ): Promise<ApiResponse<IProductImage>> {
    return await apiClient.post(`/${productId}`, newProductImage);
  }

  async update(
    productId: number,
    updatedProductImage: FormData,
  ): Promise<ApiResponse<IProductImage>> {
    return await apiClient.put(`/${productId}`, updatedProductImage);
  }
}

export const productImageService = new ProductImageService();
