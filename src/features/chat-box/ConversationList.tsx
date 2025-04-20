import { Card, Empty, List, Spin } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { IConversation } from "../../interfaces";
import ConversationItem from "./ConversationItem";

dayjs.extend(relativeTime);

interface ConversationListProps {
  conversationData: IConversation[] | undefined;
  isLoadingConversations: boolean;
  error: Error | null;
  participantId: string | undefined;
  setVisible: (visible: boolean) => void;
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<IConversation | undefined>
  >;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversationData,
  isLoadingConversations,
  error,
  participantId,
  setVisible,
  setSelectedConversation,
}) => {
  const [conversations, setConversations] = useState<IConversation[]>([]);

  useEffect(() => {
    if (conversationData) {
      const filteredAndSortedConversations = conversationData
        .filter((conversation) => conversation.lastMessageContent)
        .sort((a, b) => {
          const aDate = dayjs(a.updatedAt);
          const bDate = dayjs(b.updatedAt);
          return bDate.isAfter(aDate) ? 1 : -1;
        });
      setConversations(filteredAndSortedConversations);
    } else {
      setConversations([]);
    }
  }, [conversationData]);

  // console.log("conversationData: ", conversationData);
  // console.log("Conversations: ", conversations);

  return (
    <Card
      title="Danh sách trò chuyện"
      className="mx-auto mt-2 w-full max-w-2xl rounded-2xl shadow-lg"
      extra={
        <div
          className="cursor-pointer p-1 transition-opacity hover:opacity-80"
          onClick={() => setVisible(false)}
        >
          <IoCloseOutline className="text-xl text-gray-600" />
        </div>
      }
    >
      <div className="scrollbar-thin scrollbar-thumb-gray-300 h-[415.6px] overflow-y-auto">
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
                onSelect={setSelectedConversation}
              />
            )}
          />
        )}
      </div>
    </Card>
  );
};

export default ConversationList;
