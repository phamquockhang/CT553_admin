import { AxiosInstance } from "axios";
import {
  ApiResponse,
  INotification,
  Page,
  PaginationParams,
  SortParams,
  NotificationFilterCriteria,
} from "../../interfaces";
import { createApiClient } from "../api-client";

interface NotificationService {
  getNotifications(
    pagination: PaginationParams,
    query: string,
    filter?: NotificationFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<INotification>>>;
  readNotification(notificationId: string): Promise<ApiResponse<INotification>>;
}

const apiClient: AxiosInstance = createApiClient("notifications");

class NotificationServiceImpl implements NotificationService {
  async getNotifications(
    pagination: PaginationParams,
    query?: string,
    filter?: NotificationFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<INotification>>> {
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

  async readNotification(
    notificationId: string,
  ): Promise<ApiResponse<INotification>> {
    return await apiClient.put(`/${notificationId}`);
  }
}

export const notificationService = new NotificationServiceImpl();
