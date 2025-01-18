import { AxiosInstance } from "axios";
import { ApiResponse, IScore } from "../../interfaces";
import { createApiClient } from "../api-client";

interface IScoreService {
  getAllScoresByCustomerId(customerId: string): Promise<ApiResponse<IScore>>;
  getCurrentScoreByCustomerId(customerId: string): Promise<ApiResponse<IScore>>;
  create(customerId: string, newScore: IScore): Promise<ApiResponse<IScore>>;
}

const apiClient: AxiosInstance = createApiClient("scores");
class ScoreService implements IScoreService {
  async getAllScoresByCustomerId(
    customerId: string,
  ): Promise<ApiResponse<IScore>> {
    return (await apiClient.get(`/${customerId}`)).data;
  }

  async getCurrentScoreByCustomerId(
    customerId: string,
  ): Promise<ApiResponse<IScore>> {
    return (await apiClient.get(`/current/${customerId}`))?.data;
  }

  async create(
    customerId: string,
    newScore: IScore,
  ): Promise<ApiResponse<IScore>> {
    return (await apiClient.post(`/${customerId}`, newScore)).data;
  }
}

export const scoreService = new ScoreService();
