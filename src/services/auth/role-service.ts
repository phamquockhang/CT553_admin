import { ApiResponse, IRole, Page, PaginationParams } from "../../interfaces";
import { createApiClient } from "../api-client";

interface IRoleService {
  getRoles(pagination: PaginationParams): Promise<ApiResponse<Page<IRole>>>;
  getAllRoles(): Promise<ApiResponse<IRole[]>>;
  create(newRole: Omit<IRole, "roleId">): Promise<ApiResponse<IRole>>;
  update(roleId: number, updatedRole: IRole): Promise<ApiResponse<IRole>>;
}

const apiClient = createApiClient("roles");

class RoleService implements IRoleService {
  async getRoles(
    pagination: PaginationParams,
  ): Promise<ApiResponse<Page<IRole>>> {
    return (await apiClient.get("", { params: pagination })).data;
  }

  async getAllRoles(): Promise<ApiResponse<IRole[]>> {
    return (await apiClient.get("/all")).data;
  }

  async create(newRole: Omit<IRole, "roleId">): Promise<ApiResponse<IRole>> {
    return (await apiClient.post("", newRole)).data;
  }

  async update(
    roleId: number,
    updatedRole: IRole,
  ): Promise<ApiResponse<IRole>> {
    return (await apiClient.put(`/${roleId}`, updatedRole)).data;
  }
}

export const roleService = new RoleService();
