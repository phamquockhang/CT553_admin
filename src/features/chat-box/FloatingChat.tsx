import { MessageOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { FloatButton } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IConversation, Module, PERMISSIONS } from "../../interfaces";
import { conversationService } from "../../services";
import Access from "../auth/Access";
import { useLoggedInUser } from "../auth/hooks/useLoggedInUser";
import ChatBox from "./ChatBox";
import ConversationList from "./ConversationList";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WebSocketURL = import.meta.env.VITE_WEBSOCKET_URL as string;

const FloatingChat = () => {
  const [visible, setVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<
    IConversation | undefined
  >(undefined);
  const [, setClient] = useState<Client | null>(null);

  const { user } = useLoggedInUser();
  const participantId = user?.staffId;

  const {
    data: conversationData,
    isLoading: isLoadingConversations,
    error,
    refetch,
  } = useQuery({
    queryKey: ["conversations", participantId],
    queryFn: () => conversationService.getConversations(participantId || ""),
    select: (data) => data.payload,
    enabled: !!participantId,
  });

  useEffect(() => {
    const socket = new SockJS(WebSocketURL);
    const refetchConversationClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket - For Conversations");
        refetchConversationClient.subscribe(
          `/topic/conversations/${participantId}`,
          (message) => {
            console.log("Received message:", message.body);
            console.log("REFETCHING CONVERSATION");
            refetch();
          },
        );
      },
      onStompError: (error) => {
        console.error("WebSocket error:", error);
      },
    });

    refetchConversationClient.activate();
    setClient(refetchConversationClient);

    return () => {
      refetchConversationClient.deactivate().catch((error) => {
        console.error("Error during client deactivation:", error);
      });
    };
  }, [participantId, refetch]);

  if (user?.email !== "supporter@gmail.com") return null;

  return (
    <Access
      permission={PERMISSIONS[Module.CONVERSATIONS].GET_PAGINATION}
      hideChildren
    >
      {!visible && (
        <FloatButton
          icon={<MessageOutlined />}
          type="primary"
          style={{ right: 24, bottom: 24 }}
          onClick={() => setVisible(true)}
        />
      )}

      {visible && !selectedConversation && (
        <motion.div
          className="fixed bottom-10 right-6 z-50 w-[400px] max-w-[90%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <ConversationList
            conversationData={conversationData}
            isLoadingConversations={isLoadingConversations}
            error={error}
            participantId={participantId}
            setVisible={setVisible}
            setSelectedConversation={setSelectedConversation}
          />
        </motion.div>
      )}

      {visible && selectedConversation && (
        <motion.div
          className="fixed bottom-10 right-6 z-50 w-[400px] max-w-[90%]"
          initial={{ opacity: 0.1, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <ChatBox
            setVisible={setVisible}
            conversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
            refetch={refetch}
          />
        </motion.div>
      )}
    </Access>
  );
};

export default FloatingChat;
