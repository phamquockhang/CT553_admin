import { useQuery } from "@tanstack/react-query";
import { Modal, Steps, Tooltip } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { FaHistory, FaHourglassStart, FaShippingFast } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { FcCancel, FcShipped } from "react-icons/fc";
import { MdPending } from "react-icons/md";
import { TbPackageExport } from "react-icons/tb";
import { IOrderStatus, OrderStatus } from "../../../../interfaces";
import { orderService } from "../../../../services";
import { getColorForTag, translateOrderStatus } from "../../../../utils";

interface OrderStatusHistoryProps {
  history?: IOrderStatus[];
  orderId?: string;
}

const OrderStatusHistory: React.FC<OrderStatusHistoryProps> = ({
  history,
  orderId,
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { data: orderData, isLoading: isOrderLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrder(orderId ? orderId : ""),
    select: (data) => data.payload,
    enabled: !!orderId, // Fetch data only when orderId is available
  });

  const orderStatusHistory = history || orderData?.orderStatuses;

  return (
    <div className="relative">
      <Tooltip title="Lịch sử thay đổi trạng thái đơn hàng">
        <FaHistory
          onClick={() => setIsOpenModal(true)}
          className="cursor-pointer text-lg text-green-800"
        />
      </Tooltip>

      <Modal
        // centered
        // loading={orderId !== undefined && isOrderLoading}
        open={isOpenModal}
        width="80%"
        title={<span className="text-lg font-semibold">Lịch sử đơn hàng</span>}
        destroyOnClose
        onCancel={() => setIsOpenModal(false)}
        footer={null}
        className="rounded-lg p-0 shadow-lg"
      >
        <div className="max-h-96 overflow-y-auto px-2 py-2">
          <Steps
            direction="horizontal"
            size="small"
            current={orderStatusHistory && orderStatusHistory.length - 1} // Bước cuối cùng là trạng thái hiện tại
          >
            {orderStatusHistory?.map(({ orderStatusId, status, createdAt }) => (
              <Steps.Step
                key={orderStatusId}
                title={
                  <span className="font-medium text-gray-800">
                    {translateOrderStatus(status)}
                  </span>
                }
                description={
                  <span className="text-sm text-gray-500">
                    {dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </span>
                }
                icon={
                  status === OrderStatus.PENDING ? (
                    // <MdPending className="text-green-500" />
                    <MdPending color={getColorForTag(status)} />
                  ) : status === OrderStatus.CONFIRMED ? (
                    <TbPackageExport color={getColorForTag(status)} />
                  ) : status === OrderStatus.PREPARING ? (
                    <FaHourglassStart color={getColorForTag(status)} />
                  ) : status === OrderStatus.DELIVERING ? (
                    <FaShippingFast color={getColorForTag(status)} />
                  ) : status === OrderStatus.DELIVERED ? (
                    <FcShipped color={getColorForTag(status)} />
                  ) : status === OrderStatus.COMPLETED ? (
                    <FaCircleCheck color={getColorForTag(status)} />
                  ) : (
                    <FcCancel color={getColorForTag(status)} />
                  )
                }
              />
            ))}
          </Steps>
        </div>
      </Modal>
    </div>
  );
};

export default OrderStatusHistory;
