import { AxiosInstance } from "axios";
import { createApiClient } from "../api-client";
import {
  ApiResponse,
  Page,
  PaginationParams,
  SortParams,
  ISellingOrder,
  SellingOrderFilterCriteria,
  IOrderStatus,
} from "../../interfaces";

interface ISellingOrderService {
  getSellingOrder(orderId: string): Promise<ApiResponse<ISellingOrder>>;
  getSellingOrders(
    pagination: PaginationParams,
    query: string,
    filter?: SellingOrderFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<ISellingOrder>>>;
  create(
    newSellingOrder: Omit<ISellingOrder, "sellingOrderId">,
  ): Promise<ApiResponse<void>>;
  updateOrderStatus(
    sellingOrderId: string,
    updatedOrderStatus: IOrderStatus,
  ): Promise<ApiResponse<void>>;
}

const apiClient: AxiosInstance = createApiClient("selling_orders");

class SellingOrderService implements ISellingOrderService {
  async getSellingOrder(
    sellingOrderId: string,
  ): Promise<ApiResponse<ISellingOrder>> {
    return await apiClient.get(`/${sellingOrderId}`);
  }

  async getSellingOrders(
    pagination: PaginationParams,
    query: string,
    filter?: SellingOrderFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<ISellingOrder>>> {
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
    newSellingOrder: Omit<ISellingOrder, "orderId">,
  ): Promise<ApiResponse<void>> {
    return await apiClient.post("", newSellingOrder);
  }

  async updateOrderStatus(
    sellingOrderId: string,
    updatedOrderStatus: IOrderStatus,
  ): Promise<ApiResponse<void>> {
    return await apiClient.put(`/${sellingOrderId}`, updatedOrderStatus);
  }
}

export const sellingOrderService = new SellingOrderService();
