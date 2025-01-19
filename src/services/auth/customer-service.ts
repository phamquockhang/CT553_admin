import { AxiosInstance } from "axios";
import {
  ApiResponse,
  ICustomer,
  Page,
  PaginationParams,
  SortParams,
  CustomerFilterCriteria,
} from "../../interfaces";
import { createApiClient } from "../api-client";

interface ICustomerService {
  getLoggedInCustomer(): Promise<ApiResponse<ICustomer>>;
  getCustomers(
    pagination: PaginationParams,
    query: string,
    filter?: CustomerFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<ICustomer>>>;
  getCustomerIdByEmail(email: string): Promise<ApiResponse<string>>;
  create(
    newCustomer: Omit<ICustomer, "customerId">,
  ): Promise<ApiResponse<ICustomer>>;
  update(
    customerId: string,
    updatedCustomer: ICustomer,
  ): Promise<ApiResponse<ICustomer>>;
  delete(customerId: string): Promise<ApiResponse<void>>;
}

const apiClient: AxiosInstance = createApiClient("customers");
class CustomerService implements ICustomerService {
  async getLoggedInCustomer(): Promise<ApiResponse<ICustomer>> {
    return await apiClient.get("/logged-in");
  }

  async getCustomers(
    pagination: PaginationParams,
    query: string,
    filter?: CustomerFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<ICustomer>>> {
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

  async getCustomerIdByEmail(email: string): Promise<ApiResponse<string>> {
    return await apiClient.get(`/customer_id/${email}`);
  }

  async create(
    newCustomer: Omit<ICustomer, "customerId">,
  ): Promise<ApiResponse<ICustomer>> {
    return await apiClient.post("", newCustomer);
  }

  async update(
    customerId: string,
    updatedCustomer: ICustomer,
  ): Promise<ApiResponse<ICustomer>> {
    return await apiClient.put(`/${customerId}`, updatedCustomer);
  }

  async delete(customerId: string): Promise<ApiResponse<void>> {
    return await apiClient.delete(`/${customerId}`);
  }
}

export const customerService = new CustomerService();
