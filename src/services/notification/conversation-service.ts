import { AxiosInstance } from "axios";
import { ApiResponse, IConversation } from "../../interfaces";
import { createApiClient } from "../api-client";

interface ConversationService {
  getConversations(
    participantId: string,
  ): Promise<ApiResponse<IConversation[]>>;
}

const apiClient: AxiosInstance = createApiClient("conversations");

class ConversationServiceImpl implements ConversationService {
  async getConversations(
    participantId: string,
  ): Promise<ApiResponse<IConversation[]>> {
    return await apiClient.get("", {
      params: {
        participantId,
      },
    });
  }
}

export const conversationService = new ConversationServiceImpl();
