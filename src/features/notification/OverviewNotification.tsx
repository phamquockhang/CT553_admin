import { BellOutlined } from "@ant-design/icons";
import { Client } from "@stomp/stompjs";
import { Badge, Button, Popover } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { motion } from "framer-motion";
import { Howl } from "howler";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { useLoggedInUser } from "../auth/hooks/useLoggedInUser";
import { useNotification } from "./hooks/useNotification";

const WebSocketURL = import.meta.env.VITE_WEBSOCKET_URL as string;

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.locale("vi");

dayjs.updateLocale("vi", {
  relativeTime: {
    future: "trong %s",
    past: "%s trước",
    s: "%d giây",
    m: "1 phút",
    mm: "%d phút",
    h: "1 giờ",
    hh: "%d giờ",
    d: "1 ngày",
    dd: "%d ngày",
    M: "1 tháng",
    MM: "%d tháng",
    y: "1 năm",
    yy: "%d năm",
  },
});

const notificationSound = new Howl({
  src: ["/src/assets/sound/notify_v1.0.mp3"],
  volume: 0.5,
});

const OverviewNotification: React.FC = () => {
  const { notificationData, notificationMeta, refetch } = useNotification();
  const { user } = useLoggedInUser();
  const [, setClient] = useState<Client | null>(null);
  const [visible, setVisible] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [previousCount, setPreviousCount] = useState(
    notificationData?.length || 0,
  );
  const [timestamps, setTimestamps] = useState(
    () => notificationData?.map((n) => dayjs(n.createdAt)) || [],
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.staffId) return;

    const socket = new SockJS(WebSocketURL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket - For Notifications");
        stompClient.subscribe(
          `/topic/notifications/${user.staffId}`,
          (message) => {
            console.log("🔔 Nhận thông báo mới:", message.body);
            setHasNotification(true);
            refetch(); // Gọi lại API để cập nhật danh sách thông báo
          },
        );
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [user, refetch]);

  useEffect(() => {
    if (notificationData && notificationData.length > previousCount) {
      setHasNotification(true);
      notificationSound.play();
    }
    setPreviousCount(notificationData ? notificationData.length : 0);
  }, [previousCount, notificationData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamps(notificationData?.map((n) => dayjs(n.createdAt)) || []);
    }, 1000);
    return () => clearInterval(interval);
  }, [notificationData]);

  const content = (
    <div className="w-[400px] rounded-lg bg-white p-0">
      <h3 className="mb-2 text-lg font-semibold">Thông báo</h3>
      <div className="max-h-[500px] space-y-3 overflow-auto">
        {notificationData?.map((notification, index) => (
          <div
            key={notification.notificationId}
            className={`flex items-start space-x-3 rounded-lg p-3 transition ${
              notification.isRead
                ? "bg-gray-0 cursor-not-allowed hover:opacity-50"
                : "cursor-pointer bg-blue-100/80 hover:bg-blue-200"
            }`}
            onClick={() => {
              if (!notification.isRead) {
                navigate(
                  `/selling-orders/${notification.sellingOrderId}?mode=update`,
                );
                setVisible(false);
              }
            }}
          >
            <div className="flex-1">
              <p className="text-sm font-medium">
                Đơn hàng
                <span className="font-bold">
                  {" "}
                  {notification.sellingOrderId}{" "}
                </span>
                mới
              </p>
              <p className="text-xs text-gray-500">
                {timestamps[index]?.fromNow()}
              </p>
            </div>
            {!notification.isRead && (
              <span className="h-3 w-3 rounded-full bg-blue-800" />
            )}
          </div>
        ))}
        {notificationData?.length === 0 && (
          <div className="flex h-32 items-center justify-center">
            <p className="text-gray-500">Không có thông báo mới</p>
            <BellOutlined className="text-2xl text-gray-500" />
          </div>
        )}
      </div>

      {notificationMeta && notificationMeta?.total > 10 && (
        <div className="mt-3 flex justify-center border-t pt-3">
          <Button
            type="primary"
            className="w-full"
            onClick={() => {
              setVisible(false);
              navigate("/notifications");
            }}
          >
            Xem thêm
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
      placement="bottomRight"
    >
      <motion.div
        className="flex cursor-pointer items-center gap-1"
        animate={hasNotification ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onAnimationComplete={() => setHasNotification(false)}
      >
        <Badge count={notificationMeta && notificationMeta?.total}>
          <BellOutlined className="text-xl" />
        </Badge>
      </motion.div>
    </Popover>
  );
};

export default OverviewNotification;
