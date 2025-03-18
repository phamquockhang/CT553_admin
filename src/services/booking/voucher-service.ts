import { AxiosInstance } from "axios";
import {
  ApiResponse,
  IBriefVoucher,
  IVoucher,
  Page,
  PaginationParams,
  SortParams,
  VoucherFilterCriteria,
} from "../../interfaces";
import { createApiClient } from "../api-client";

interface IVoucherService {
  getVoucher(voucherId: number): Promise<ApiResponse<IVoucher>>;
  getVouchers(
    pagination: PaginationParams,
    query: string,
    filter?: VoucherFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<IVoucher>>>;
  create(newVoucher: IBriefVoucher): Promise<ApiResponse<void>>;
  update(
    voucherId: number,
    updatedVoucher: IVoucher,
  ): Promise<ApiResponse<void>>;
}

const apiClient: AxiosInstance = createApiClient("vouchers");

class VoucherService implements IVoucherService {
  async getVoucher(voucherId: number): Promise<ApiResponse<IVoucher>> {
    return await apiClient.get(`/${voucherId}`);
  }

  async getVouchers(
    pagination: PaginationParams,
    query: string,
    filter?: VoucherFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<IVoucher>>> {
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

  async create(newVoucher: IBriefVoucher): Promise<ApiResponse<void>> {
    return await apiClient.post("", newVoucher);
  }

  async update(
    voucherId: number,
    updatedVoucher: IVoucher,
  ): Promise<ApiResponse<void>> {
    return await apiClient.put(`/${voucherId}`, updatedVoucher);
  }
}

export const voucherService = new VoucherService();
