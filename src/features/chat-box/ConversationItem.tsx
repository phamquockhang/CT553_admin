import { Avatar, List } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IConversation } from "../../interfaces";
import { useUserInfomation } from "./hooks";

dayjs.extend(relativeTime);

interface ConversationItemProps {
  conversation: IConversation;
  participantId: string | undefined;
  onSelect: React.Dispatch<React.SetStateAction<IConversation | undefined>>;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  participantId,
  onSelect,
}) => {
  const customerId =
    conversation.participantId1 === participantId
      ? conversation.participantId2
      : conversation.participantId1;

  const { getUserInfomation } = useUserInfomation(customerId);

  return (
    <List.Item
      className="cursor-pointer px-4 py-3 transition-colors hover:bg-gray-50"
      onClick={() => onSelect(conversation)}
    >
      <List.Item.Meta
        avatar={
          <Avatar alt="avatar" size={48} className="border bg-blue-800">
            {getUserInfomation?.firstName?.charAt(0)?.toUpperCase() ||
              customerId.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <span className="font-medium text-gray-800">
            {"Khách hàng " +
              getUserInfomation?.lastName +
              " " +
              getUserInfomation?.firstName}
          </span>
        }
        description={
          <div className="flex justify-between">
            <span className="line-clamp-1 text-gray-500">
              {conversation.lastMessageContent || "Chưa có tin nhắn"}
            </span>
            <span className="text-xs text-gray-400">
              {conversation.updatedAt
                ? dayjs(conversation.updatedAt).fromNow()
                : dayjs(conversation.createdAt).fromNow()}
            </span>
          </div>
        }
      />
    </List.Item>
  );
};

export default ConversationItem;
