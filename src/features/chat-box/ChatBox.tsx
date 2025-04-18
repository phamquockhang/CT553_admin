import { Client } from "@stomp/stompjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Input } from "antd";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isToday from "dayjs/plugin/isToday";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoCloseOutline, IoSend } from "react-icons/io5";
import SockJS from "sockjs-client";
import Loading from "../../common/components/Loading";
import { IMessage, PaginationParams } from "../../interfaces";
import { messageService } from "../../services";
import { useLoggedInUser } from "../auth/hooks/useLoggedInUser";

dayjs.extend(isToday);
dayjs.extend(isSameOrBefore);

const WebSocketURL = import.meta.env.VITE_WEBSOCKET_URL as string;

interface ChatBoxProps {
  setVisible: (visible: boolean) => void;
  conversationId: string;
  setSelectedConversationId: (conversationId: string | null) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  setVisible,
  conversationId,
  setSelectedConversationId,
}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 30,
  });
  const [input, setInput] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const stompClient = useRef<Client | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useLoggedInUser();
  const senderId = user?.staffId;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (shouldScrollToBottom && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldScrollToBottom]);

  const { data: existedMessages, isLoading } = useQuery({
    queryKey: ["messages", pagination, conversationId],
    queryFn: () => messageService.getMessages(pagination, conversationId),
    select: (data) => data.payload?.data,
    enabled: hasMore,
  });

  useEffect(() => {
    if (existedMessages && existedMessages.length > 0) {
      setMessages((prev) => {
        const newMessages = existedMessages.filter(
          (newMsg) => !prev.some((msg) => msg.messageId === newMsg.messageId),
        );
        const updatedMessages = [...newMessages, ...prev];
        const sortedMessages = updatedMessages.sort((a, b) =>
          dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? -1 : 1,
        );
        if (pagination.page > 1) {
          setShouldScrollToBottom(false);
        }
        return sortedMessages;
      });
      if (existedMessages.length < pagination.pageSize) {
        setHasMore(false);
      }
    }
  }, [existedMessages, pagination.page, pagination.pageSize]);

  useEffect(() => {
    const socket = new SockJS(WebSocketURL);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/topic/messages/${conversationId}`, (message) => {
          const messageObj: IMessage = JSON.parse(message.body);
          setShouldScrollToBottom(true);
          setMessages((prev) =>
            prev.some((msg) => msg.messageId === messageObj.messageId)
              ? prev
              : [...prev, messageObj].sort((a, b) =>
                  dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? -1 : 1,
                ),
          );
        });
      },
      onStompError: (error) => {
        console.error("WebSocket error:", error);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate().catch((error) => {
        console.error("Error during client deactivation:", error);
      });
    };
  }, [conversationId]);

  const sendMessage = () => {
    if (stompClient.current?.connected && input.trim()) {
      const messagePayload = {
        conversationId,
        senderId,
        receiverId: "44ec8f26-0e4e-4111-9ead-b7ff85a91cc2", // TODO: Lấy từ dữ liệu conversation
        content: input,
        status: "SENT",
        sentAt: new Date().toISOString(),
      };
      stompClient.current.publish({
        destination: `/app/chat.sendMessage`,
        body: JSON.stringify(messagePayload),
      });
      setInput("");
      setShouldScrollToBottom(true);
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("conversations");
        },
      });
    }
  };

  useEffect(() => {
    if (!input && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0 && !isLoading && hasMore) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  useEffect(() => {
    setMessages([]);
    setPagination({ page: 1, pageSize: 30 });
    setHasMore(true);
    setShouldScrollToBottom(true);
  }, [conversationId]);

  return (
    <Card
      title={
        <div className="flex gap-2">
          <IoMdArrowRoundBack
            className="cursor-pointer text-xl text-black hover:opacity-80"
            onClick={() => setSelectedConversationId(null)}
          />
          Tin nhắn
        </div>
      }
      className="mx-auto mt-2 max-h-full w-full max-w-2xl rounded-2xl shadow"
      extra={
        <div className="flex items-center gap-2">
          <div className="cursor-pointer" onClick={() => setVisible(false)}>
            <IoCloseOutline className="text-xl text-black hover:opacity-80" />
          </div>
        </div>
      }
    >
      <div
        className="scrollbar-hide flex h-96 flex-col gap-1 overflow-y-auto rounded-none bg-gray-50 p-1"
        onScroll={handleScroll}
      >
        {isLoading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Loading />
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isSender = msg.senderId === senderId;
              const prevMsg = messages[index - 1];
              const isDifferentDay =
                index === 0 ||
                !dayjs(msg.createdAt).isSame(dayjs(prevMsg?.createdAt), "day");

              const isLastSenderMessage =
                isSender &&
                (index === messages.length - 1 ||
                  messages[index + 1]?.senderId !== senderId);

              const renderStatus = (status: string) => {
                switch (status) {
                  case "SENT":
                    return "✓ Đã gửi";
                  case "DELIVERED":
                    return "✓✓ Đã nhận";
                  case "SEEN":
                    return "✓✓ Đã xem";
                  default:
                    return "";
                }
              };

              return (
                <div key={msg.messageId || index}>
                  {isDifferentDay && (
                    <div className="mb-2 mt-2 border-t border-t-slate-300 text-center text-xs text-gray-400">
                      {dayjs(msg.createdAt).isToday()
                        ? "Hôm nay"
                        : dayjs(msg.createdAt).format("DD/MM/YYYY HH:mm")}
                    </div>
                  )}

                  <div
                    className={`flex flex-col ${
                      isSender ? "items-end" : "items-start"
                    } `}
                  >
                    <div
                      className={`inline-block min-w-16 max-w-60 rounded-md px-4 py-2 ${
                        isSender
                          ? "bg-blue-900 text-white"
                          : "bg-gray-200 text-black"
                      } break-words`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {msg.content}
                      </div>

                      {isLastSenderMessage && (
                        <div className="mt-1 text-xs font-thin">
                          {dayjs(msg.createdAt).format("HH:mm")}
                        </div>
                      )}
                    </div>

                    {isLastSenderMessage && (
                      <div className="mt-1 rounded-md bg-gray-400 px-1 text-xs text-white">
                        {renderStatus(msg.status)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2 transition-all duration-1000">
        <div className="flex flex-1 flex-col justify-end">
          <Input.TextArea
            // ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Aa"
            autoSize={{ minRows: 1, maxRows: 5 }}
            maxLength={255}
            className="bg-transparent text-black placeholder-gray-400"
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
        </div>

        <div className="mt-1 text-right text-xs text-gray-500">
          {input.length}/255
        </div>

        <IoSend
          onClick={() => {
            if (!input.trim()) return;
            sendMessage();
          }}
          className={`cursor-pointer text-xl text-blue-800 ${
            !input.trim() ? "text-blue-900/60" : "hover:opacity-80"
          }`}
        />
      </div>
    </Card>
  );
};

export default ChatBox;
