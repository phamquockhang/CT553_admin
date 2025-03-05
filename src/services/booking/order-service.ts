import { AxiosInstance } from "axios";
import { createApiClient } from "../api-client";
import {
  ApiResponse,
  Page,
  PaginationParams,
  SortParams,
  IOrder,
  OrderFilterCriteria,
  IOrderStatus,
} from "../../interfaces";

interface IOrderService {
  getOrder(orderId: string): Promise<ApiResponse<IOrder>>;
  getOrders(
    pagination: PaginationParams,
    query: string,
    filter?: OrderFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<IOrder>>>;
  create(newOrder: Omit<IOrder, "orderId">): Promise<ApiResponse<void>>;
  updateOrderStatus(
    orderId: string,
    updatedOrderStatus: IOrderStatus,
  ): Promise<ApiResponse<void>>;
}

const apiClient: AxiosInstance = createApiClient("orders");

class OrderService implements IOrderService {
  async getOrder(orderId: string): Promise<ApiResponse<IOrder>> {
    return await apiClient.get(`/${orderId}`);
  }

  async getOrders(
    pagination: PaginationParams,
    query: string,
    filter?: OrderFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<IOrder>>> {
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

  async create(newOrder: Omit<IOrder, "orderId">): Promise<ApiResponse<void>> {
    return await apiClient.post("", newOrder);
  }

  async updateOrderStatus(
    orderId: string,
    updatedOrderStatus: IOrderStatus,
  ): Promise<ApiResponse<void>> {
    return await apiClient.put(`/${orderId}`, updatedOrderStatus);
  }
}

export const orderService = new OrderService();
