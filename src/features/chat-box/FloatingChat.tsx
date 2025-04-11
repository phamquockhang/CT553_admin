import { useState } from "react";
import { MessageOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import ChatBox from "./ChatBox"; // Component ChatBox bạn đã có

const FloatingChat = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Nút nổi góc phải */}
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24 }}
        onClick={() => setVisible(!visible)}
      />

      {/* ChatBox hiển thị dạng overlay khi bật */}
      {visible && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[90%]">
          <ChatBox />
        </div>
      )}
    </>
  );
};

export default FloatingChat;
