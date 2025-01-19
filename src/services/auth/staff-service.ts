import { AxiosInstance } from "axios";
import {
  ApiResponse,
  IStaff,
  Page,
  PaginationParams,
  SortParams,
  StaffFilterCriteria,
} from "../../interfaces";
import { createApiClient } from "../api-client";

interface IStaffService {
  getLoggedInStaff(): Promise<ApiResponse<IStaff>>;
  getStaffs(
    pagination: PaginationParams,
    query: string,
    filter?: StaffFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<IStaff>>>;
  create(newStaff: Omit<IStaff, "staffId">): Promise<ApiResponse<IStaff>>;
  update(staffId: string, updatedStaff: IStaff): Promise<ApiResponse<IStaff>>;
  delete(staffId: string): Promise<ApiResponse<void>>;
}

const apiClient: AxiosInstance = createApiClient("staffs");
class StaffService implements IStaffService {
  async getLoggedInStaff(): Promise<ApiResponse<IStaff>> {
    return await apiClient.get("/logged-in");
  }

  async getStaffs(
    pagination: PaginationParams,
    query: string,
    filter?: StaffFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<IStaff>>> {
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
    newStaff: Omit<IStaff, "staffId">,
  ): Promise<ApiResponse<IStaff>> {
    return await apiClient.post("", newStaff);
  }

  async update(
    staffId: string,
    updatedStaff: IStaff,
  ): Promise<ApiResponse<IStaff>> {
    return await apiClient.put(`/${staffId}`, updatedStaff);
  }

  async delete(staffId: string): Promise<ApiResponse<void>> {
    return await apiClient.delete(`/${staffId}`);
  }
}

export const staffService = new StaffService();
