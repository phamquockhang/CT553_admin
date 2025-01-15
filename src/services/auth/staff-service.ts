import { AxiosInstance } from "axios";
import {
  ApiResponse,
  IStaff,
  Page,
  PaginationParams,
  SortParams,
} from "../../interfaces";
import { createApiClient } from "../api-client";

interface IStaffService {
  getLoggedInStaff(): Promise<ApiResponse<IStaff>>;
  getStaffs(
    pagination: PaginationParams,
    query: string,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<IStaff>>>;
  create(newStaff: Omit<IStaff, "staffId">): Promise<ApiResponse<IStaff>>;
  update(staffId: string, updatedStaff: IStaff): Promise<ApiResponse<IStaff>>;
  delete(staffId: string): Promise<ApiResponse<void>>;
}

const apiClient: AxiosInstance = createApiClient("staffs");
class StaffService implements IStaffService {
  async getLoggedInStaff(): Promise<ApiResponse<IStaff>> {
    return (await apiClient.get("/logged-in")).data;
  }

  async getStaffs(
    pagination: PaginationParams,
    query: string,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<IStaff>>> {
    return (
      await apiClient.get("", {
        params: {
          ...pagination,
          query,
          sortBy: sort?.sortBy !== "" ? sort?.sortBy : undefined,
          direction: sort?.direction !== "" ? sort?.direction : undefined,
        },
      })
    ).data;
  }

  async create(
    newStaff: Omit<IStaff, "staffId">,
  ): Promise<ApiResponse<IStaff>> {
    return (await apiClient.post("", newStaff)).data;
  }

  async update(
    staffId: string,
    updatedStaff: IStaff,
  ): Promise<ApiResponse<IStaff>> {
    return (await apiClient.put(`/${staffId}`, updatedStaff)).data;
  }

  async delete(staffId: string): Promise<ApiResponse<void>> {
    return (await apiClient.delete(`/${staffId}`)).data;
  }
}

export const staffService = new StaffService();
