// import { useState } from "react";
// import { MessageOutlined } from "@ant-design/icons";
// import { FloatButton } from "antd";
// import ChatBox from "./ChatBox";
// import { motion } from "framer-motion";

// const FloatingChat = () => {
//   const [visible, setVisible] = useState(false);

//   return (
//     <>
//       {!visible && (
//         <FloatButton
//           icon={<MessageOutlined />}
//           type="primary"
//           style={{ right: 24, bottom: 24 }}
//           onClick={() => setVisible(true)}
//         />
//       )}

//       {visible && (
//         <motion.div
//           className="fixed right-6 top-20 z-50 w-[400px] max-w-[90%]"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 20 }}
//           transition={{ duration: 0.3 }}
//         >
//           <ChatBox setVisible={setVisible} />
//         </motion.div>
//       )}
//     </>
//   );
// };

// export default FloatingChat;

import { useState } from "react";
import { MessageOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import ChatBox from "./ChatBox";
// import ConversationList from "./ConversationList"; // Component mới để hiển thị danh sách các đoạn chat
import { motion } from "framer-motion";
import ConversationList from "./ConversationList";

const FloatingChat = () => {
  const [visible, setVisible] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  return (
    <>
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
    </>
  );
};

export default FloatingChat;
