import { useQuery } from "@tanstack/react-query";
import { Card, Empty, List, Spin } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { IConversation } from "../../interfaces";
import { conversationService } from "../../services";
import { useLoggedInUser } from "../auth/hooks/useLoggedInUser";
import ConversationItem from "./ConversationItem";

dayjs.extend(relativeTime);

interface ConversationListProps {
  setVisible: (visible: boolean) => void;
  setSelectedConversationId: (conversationId: string | null) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  setVisible,
  setSelectedConversationId,
}) => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const { user } = useLoggedInUser();
  const participantId = user?.staffId;

  const {
    data: conversationData,
    isLoading: isLoadingConversations,
    error,
  } = useQuery({
    queryKey: ["conversations", participantId],
    queryFn: () => conversationService.getConversations(participantId || ""),
    select: (data) => data.payload,
    enabled: !!participantId,
  });

  useEffect(() => {
    if (conversationData) {
      setConversations(conversationData);
    }
  }, [conversationData]);

  return (
    <Card
      title="Danh sách trò chuyện"
      className="mx-auto mt-4 w-full max-w-2xl rounded-2xl shadow-lg"
      extra={
        <div
          className="cursor-pointer p-1 transition-opacity hover:opacity-80"
          onClick={() => setVisible(false)}
        >
          <IoCloseOutline className="text-xl text-gray-600" />
        </div>
      }
    >
      <div className="scrollbar-thin scrollbar-thumb-gray-300 h-96 overflow-y-auto">
        {isLoadingConversations ? (
          <div className="flex h-full items-center justify-center">
            <Spin tip="Đang tải..." />
          </div>
        ) : error ? (
          <Empty description="Lỗi khi tải danh sách trò chuyện" />
        ) : conversations.length === 0 ? (
          <Empty description="Chưa có cuộc trò chuyện nào" />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={conversations}
            renderItem={(conversation) => (
              <ConversationItem
                conversation={conversation}
                participantId={participantId}
                onSelect={setSelectedConversationId}
              />
            )}
          />
        )}
      </div>
    </Card>
  );
};

export default ConversationList;
