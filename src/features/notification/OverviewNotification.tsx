import { useState, useEffect } from "react";
import { Popover, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/vi";
import { Howl } from "howler";
import { motion } from "framer-motion";
import { useNotification } from "./hooks/useNotification";
import { useNavigate } from "react-router";

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
  const { notificationData } = useNotification();
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
    if (notificationData && notificationData?.length > previousCount) {
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
            className={`flex items-start space-x-3 rounded-lg p-3 transition hover:bg-gray-200 ${
              notification.isRead
                ? "bg-gray-0 cursor-not-allowed hover:opacity-50"
                : "cursor-pointer bg-blue-100/80 hover:bg-blue-200"
            } `}
            onClick={() => {
              if (!notification.isRead) {
                navigate(
                  `/selling-orders/${notification.sellingOrderId}?mode=update`,
                );
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
        {notificationData?.length === 0 ||
          (!notificationData && (
            <div className="flex h-32 items-center justify-center">
              <p className="text-gray-500">Không có thông báo mới</p>
              <BellOutlined className="text-2xl text-gray-500" />
            </div>
          ))}
      </div>
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
        <Badge count={notificationData?.length}>
          <BellOutlined className="text-xl" />
        </Badge>
      </motion.div>
    </Popover>
  );
};

export default OverviewNotification;
