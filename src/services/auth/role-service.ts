import {
  ApiResponse,
  IRole,
  Page,
  PaginationParams,
  RoleFilterCriteria,
  SortParams,
} from "../../interfaces";
import { createApiClient } from "../api-client";

interface IRoleService {
  getRoles(
    pagination: PaginationParams,
    query: string,
    filter?: RoleFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<IRole>>>;
  getAllRoles(): Promise<ApiResponse<IRole[]>>;
  create(newRole: Omit<IRole, "roleId">): Promise<ApiResponse<IRole>>;
  update(updatedRole: IRole): Promise<ApiResponse<IRole>>;
}

const apiClient = createApiClient("roles");

class RoleService implements IRoleService {
  async getRoles(
    pagination: PaginationParams,
    query: string,
    filter?: RoleFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<IRole>>> {
    return (
      await apiClient.get("", {
        params: {
          ...pagination,
          ...filter,
          query,
          sortBy: sort?.sortBy !== "" ? sort?.sortBy : undefined,
          direction: sort?.direction !== "" ? sort?.direction : undefined,
        },
      })
    ).data;
  }

  async getAllRoles(): Promise<ApiResponse<IRole[]>> {
    return (await apiClient.get("/all")).data;
  }

  async create(newRole: Omit<IRole, "roleId">): Promise<ApiResponse<IRole>> {
    return (await apiClient.post("", newRole)).data;
  }

  async update(updatedRole: IRole): Promise<ApiResponse<IRole>> {
    return (await apiClient.put(`/${updatedRole.roleId}`, updatedRole)).data;
  }
}

export const roleService = new RoleService();
