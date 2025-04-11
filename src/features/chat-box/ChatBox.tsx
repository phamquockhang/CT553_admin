import { Client } from "@stomp/stompjs";
import { Card } from "antd";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { IMessage } from "../../interfaces";
import { useLoggedInUser } from "../auth/hooks/useLoggedInUser";

const WebSocketURL = import.meta.env.VITE_WEBSOCKET_URL as string;

const ChatBox = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const stompClient = useRef<Client | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Add a ref for the textarea

  const conversationId = "8b505166-398c-42d3-8d4b-71232bf56f54";
  const { user } = useLoggedInUser();
  const senderId = user?.staffId;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socket = new SockJS(WebSocketURL);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/topic/messages/${conversationId}`, (message) => {
          const messageObj = JSON.parse(message.body);
          setMessages((prev) => [...prev, messageObj]);
        });
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate().catch((error) => {
        console.error("Error during client deactivation:", error);
      });
    };
  }, []);

  const sendMessage = () => {
    if (stompClient.current?.connected && input.trim()) {
      const messagePayload = {
        conversationId,
        senderId,
        receiverId: "44ec8f26-0e4e-4111-9ead-b7ff85a91cc2",
        content: input,
        status: "SENT",
        sentAt: new Date().toISOString(),
      };
      stompClient.current.publish({
        destination: `/app/chat.sendMessage`,
        body: JSON.stringify(messagePayload),
      });
      setInput("");
    }
  };

  // Handle textarea height adjustment
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set new height based on content
  };

  // Reset textarea height when input is cleared
  useEffect(() => {
    if (!input && textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height when input is cleared
    }
  }, [input]);

  return (
    <Card
      title="Tin nhắn"
      className="mx-auto mt-4 max-h-[538px] w-full max-w-2xl rounded-2xl shadow"
    >
      <div className="flex h-96 flex-col gap-3 overflow-y-auto rounded-md bg-gray-50 p-4">
        {messages.map((msg, index) => {
          const isSender = msg.senderId === senderId;
          return (
            <div
              key={index}
              className={`flex flex-col ${
                isSender ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`inline-block max-w-xs rounded-xl px-4 py-2 ${
                  isSender ? "bg-blue-100" : "bg-gray-200"
                } break-words`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              <div
                className={`mt-1 text-xs text-gray-500 ${
                  isSender ? "text-right" : "text-left"
                }`}
              >
                {new Date(msg.createdAt ?? msg.createdAt).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  },
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-2 flex items-end gap-2 rounded-xl border border-blue-900 px-4 py-2">
        {/* Wrap the textarea in a flex-col container to control its growth direction */}
        <div className="flex flex-1 flex-col justify-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Aa"
            className="max-h-32 flex-1 resize-none overflow-y-auto bg-transparent text-black placeholder-gray-400 transition-all duration-200 focus:outline-none"
            rows={1}
            style={{ lineHeight: "1.5", minHeight: "1.5rem" }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={sendMessage}
          className="text-white hover:opacity-80 disabled:opacity-50"
          disabled={!input.trim()}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 text-blue-900"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </Card>
  );
};

export default ChatBox;
