import { AxiosInstance } from "axios";
import {
  ApiResponse,
  ITransaction,
  Page,
  PaginationParams,
  SortParams,
  TransactionFilterCriteria,
} from "../../interfaces";
import { createApiClient } from "../api-client";

interface TransactionService {
  getTransactions(
    pagination: PaginationParams,
    query: string,
    filter?: TransactionFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<ITransaction>>>;
}

const apiClient: AxiosInstance = createApiClient("transactions");

class TransactionServiceImpl implements TransactionService {
  async getTransactions(
    pagination: PaginationParams,
    query: string,
    filter?: TransactionFilterCriteria,
    sort?: SortParams,
  ): Promise<ApiResponse<Page<ITransaction>>> {
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
}

export const transactionService = new TransactionServiceImpl();
