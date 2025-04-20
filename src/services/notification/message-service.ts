import { AxiosInstance } from "axios";
import {
  ApiResponse,
  IMessage,
  Page,
  PaginationParams,
} from "../../interfaces";
import { createApiClient } from "../api-client";

interface MessageService {
  getMessages(
    pagination: PaginationParams,
    conversationId: string,
  ): Promise<ApiResponse<Page<IMessage>>>;
  readMessage(messageId: string): Promise<ApiResponse<IMessage>>;
}

const apiClient: AxiosInstance = createApiClient("messages");

class MessageServiceImpl implements MessageService {
  async getMessages(
    pagination: PaginationParams,
    conversationId: string,
  ): Promise<ApiResponse<Page<IMessage>>> {
    return await apiClient.get("", {
      params: {
        ...pagination,
        conversationId,
      },
    });
  }

  async readMessage(messageId: string): Promise<ApiResponse<IMessage>> {
    return await apiClient.put(`/${messageId}`);
  }
}

export const messageService = new MessageServiceImpl();
