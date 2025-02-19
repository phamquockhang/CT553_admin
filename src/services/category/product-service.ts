import { AxiosInstance } from "axios";
import { createApiClient } from "../api-client";
import {
  ApiResponse,
  IBriefProduct,
  IProduct,
  ProductFilterCriteria,
  Page,
  PaginationParams,
  SortParams,
} from "../../interfaces";

interface IProductService {
  getProduct(productId: number): Promise<ApiResponse<IProduct>>;
  getProducts(
    pagination: PaginationParams,
    query: string,
    filter?: ProductFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<IProduct>>>;
  create(
    newProduct: Omit<IBriefProduct, "productId">,
  ): Promise<ApiResponse<IProduct>>;
  update(
    productId: number,
    updatedProduct: IBriefProduct,
  ): Promise<ApiResponse<IProduct>>;
  delete(productId: number): Promise<ApiResponse<void>>;
}

const apiClient: AxiosInstance = createApiClient("products");

class ProductService implements IProductService {
  async getProduct(productId: number): Promise<ApiResponse<IProduct>> {
    return await apiClient.get(`/${productId}`);
  }

  async getProducts(
    pagination: PaginationParams,
    query: string,
    filter?: ProductFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<IProduct>>> {
    return await apiClient.get("", {
      params: {
        ...pagination,
        ...filter,
        query,
        sortBy: sort?.sortBy !== "" ? sort?.sortBy : undefined,
        direction: sort?.direction !== "" ? sort?.direction : undefined,
      },
    });
  }

  async create(
    newProduct: Omit<IBriefProduct, "productId">,
  ): Promise<ApiResponse<IProduct>> {
    return await apiClient.post("", newProduct);
  }

  async update(
    productId: number,
    updatedProduct: IBriefProduct,
  ): Promise<ApiResponse<IProduct>> {
    return await apiClient.put(`/${productId}`, updatedProduct);
  }

  async delete(productId: number): Promise<ApiResponse<void>> {
    return await apiClient.delete(`/${productId}`);
  }
}

export const productService = new ProductService();
