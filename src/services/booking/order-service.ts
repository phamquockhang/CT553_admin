import { AxiosInstance } from "axios";
import {
  ApiResponse,
  IBriefSellingOrderStatus,
  ISellingOrder,
  ISellingOrderStatistics,
  TimeRange,
  Page,
  PaginationParams,
  SellingOrderFilterCriteria,
  SortParams,
} from "../../interfaces";
import { createApiClient } from "../api-client";

interface ISellingOrderService {
  getSellingOrder(orderId: string): Promise<ApiResponse<ISellingOrder>>;
  getSellingOrders(
    pagination: PaginationParams,
    query: string,
    filter?: SellingOrderFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<ISellingOrder>>>;
  getSellingOrderStatistics(
    timeRange: TimeRange,
  ): Promise<ApiResponse<ISellingOrderStatistics>>;
  create(
    newSellingOrder: Omit<ISellingOrder, "sellingOrderId">,
  ): Promise<ApiResponse<void>>;
  updateOrderStatus(
    sellingOrderId: string,
    updatedOrderStatus: IBriefSellingOrderStatus,
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

  async getSellingOrderStatistics(
    timeRange: TimeRange,
  ): Promise<ApiResponse<ISellingOrderStatistics>> {
    return await apiClient.get("/selling-order-statistics", {
      params: timeRange,
    });
  }

  async create(
    newSellingOrder: Omit<ISellingOrder, "sellingOrderId">,
  ): Promise<ApiResponse<void>> {
    return await apiClient.post("", newSellingOrder);
  }

  async updateOrderStatus(
    sellingOrderId: string,
    updatedOrderStatus: IBriefSellingOrderStatus,
  ): Promise<ApiResponse<void>> {
    return await apiClient.put(`/${sellingOrderId}`, updatedOrderStatus);
  }
}

export const sellingOrderService = new SellingOrderService();
