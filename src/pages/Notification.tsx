import { BellOutlined } from "@ant-design/icons";
import { Pagination, Spin } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router";
import { useNotification } from "../features/notification/hooks/useNotification";
import { useDynamicTitle } from "../utils";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const NotificationsPage: React.FC = () => {
  useDynamicTitle("Thông báo");

  const { notificationData, notificationMeta, isLoading, setPage } =
    useNotification();
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-4 shadow-lg">
      <h2 className="mb-4 text-2xl font-semibold">Thông báo</h2>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div className="space-y-3">
          {notificationData && notificationData?.length > 0 ? (
            notificationData.map((notification) => (
              <div
                key={notification.notificationId}
                className={`flex cursor-pointer items-start space-x-3 rounded-lg p-3 transition hover:bg-gray-200 ${
                  notification.isRead ? "bg-gray-100" : "bg-blue-100"
                }`}
                onClick={() => {
                  navigate(
                    `/selling-orders/${notification.sellingOrderId}?mode=update`,
                  );
                }}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Đơn hàng{" "}
                    <span className="font-bold">
                      {notification.sellingOrderId}
                    </span>{" "}
                    mới
                  </p>
                  <p className="text-xs text-gray-500">
                    {dayjs(notification.createdAt).fromNow()}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="h-3 w-3 rounded-full bg-blue-800" />
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center py-10">
              <BellOutlined className="text-4xl text-gray-400" />
              <p className="mt-2 text-gray-500">Không có thông báo nào</p>
            </div>
          )}
        </div>
      )}
      {notificationMeta && notificationMeta?.pages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            current={notificationMeta.page}
            pageSize={notificationMeta.pageSize}
            total={notificationMeta.total}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
