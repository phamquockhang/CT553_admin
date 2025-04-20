export interface IMessage {
  messageId: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  status: string;
  content: string;
  createdAt: string;
}

export interface IConversation {
  conversationId: string;
  participantId1: string;
  participantId2: string;
  lastMessageContent?: string;
  createdAt: string;
  updatedAt?: string;
}
