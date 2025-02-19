import { AxiosInstance } from "axios";
import { ApiResponse, IProductImage } from "../../interfaces";
import { createApiClient } from "../api-client";

interface IProductImageService {
  create(formData: FormData): Promise<ApiResponse<IProductImage[]>>;
  update(
    productId: number,
    formData: FormData,
  ): Promise<ApiResponse<IProductImage>>;
}

const apiClient: AxiosInstance = createApiClient("product_images");

class ProductImageService implements IProductImageService {
  async create(formData: FormData): Promise<ApiResponse<IProductImage[]>> {
    return await apiClient.post("", formData);
  }

  async update(
    productId: number,
    formData: FormData,
  ): Promise<ApiResponse<IProductImage>> {
    return await apiClient.put(`/${productId}`, formData);
  }
}

export const productImageService = new ProductImageService();
