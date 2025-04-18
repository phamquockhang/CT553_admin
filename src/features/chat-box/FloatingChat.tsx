import { MessageOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { motion } from "framer-motion";
import { useState } from "react";
import { Module, PERMISSIONS } from "../../interfaces";
import Access from "../auth/Access";
import { useLoggedInUser } from "../auth/hooks/useLoggedInUser";
import ChatBox from "./ChatBox";
import ConversationList from "./ConversationList";

const FloatingChat = () => {
  const [visible, setVisible] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const { user } = useLoggedInUser();

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

      {visible && !selectedConversationId && (
        <motion.div
          className="fixed right-6 top-20 z-50 w-[400px] max-w-[90%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <ConversationList
            setVisible={setVisible}
            setSelectedConversationId={setSelectedConversationId}
          />
        </motion.div>
      )}

      {visible && selectedConversationId && (
        <motion.div
          className="fixed right-6 top-20 z-50 w-[400px] max-w-[90%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <ChatBox
            setVisible={setVisible}
            conversationId={selectedConversationId}
            setSelectedConversationId={setSelectedConversationId}
          />
        </motion.div>
      )}
    </Access>
  );
};

export default FloatingChat;
