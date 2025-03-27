import { Badge, Tooltip } from "antd";
import { motion } from "framer-motion";
import { Howl } from "howler";
import { useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { useSellingOrderStatistics } from "../statistic/hooks/useSellingOrderStatistics";

const notificationSound = new Howl({
  src: ["/src/assets/sound/notify_v1.0.mp3"],
  volume: 0.5,
});

const Notification: React.FC = () => {
  const { sellingOrderStatisticsData } = useSellingOrderStatistics();
  const [hasNotification, setHasNotification] = useState(false);
  const [previousOrderCount, setPreviousOrderCount] = useState(0);

  useEffect(() => {
    if (
      sellingOrderStatisticsData &&
      sellingOrderStatisticsData?.totalNewOrders > previousOrderCount
    ) {
      setHasNotification(true);
      notificationSound.play(); // Phát âm thanh khi có đơn hàng mới
    }
    setPreviousOrderCount(sellingOrderStatisticsData?.totalNewOrders || 0);
  }, [
    sellingOrderStatisticsData,
    sellingOrderStatisticsData?.totalNewOrders,
    previousOrderCount,
  ]);

  return (
    <Tooltip title="Thông báo mới">
      <motion.div
        className="flex cursor-pointer items-center gap-1"
        animate={hasNotification ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onAnimationComplete={() => setHasNotification(false)}
      >
        <Badge count={sellingOrderStatisticsData?.totalNewOrders}>
          <IoIosNotifications
            className="text-2xl text-blue-900"
            onClick={() => notificationSound.play()} // Click vào sẽ phát lại âm thanh
          />
        </Badge>
      </motion.div>
    </Tooltip>
  );
};

export default Notification;
