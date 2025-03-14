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
import { sellingOrderService } from "../../../../services";
import { getColorOrderStatus, translateOrderStatus } from "../../../../utils";

interface SellingOrderStatusHistoryProps {
  history?: IOrderStatus[];
  sellingOrderId?: string;
}

const SellingOrderStatusHistory: React.FC<SellingOrderStatusHistoryProps> = ({
  history,
  sellingOrderId,
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { data: orderData } = useQuery({
    queryKey: ["selling_order", sellingOrderId],
    queryFn: () =>
      sellingOrderService.getSellingOrder(sellingOrderId ? sellingOrderId : ""),
    select: (data) => data.payload,
    enabled: !!sellingOrderId, // Fetch data only when orderId is available
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
                    <MdPending color={getColorOrderStatus(status)} />
                  ) : status === OrderStatus.CONFIRMED ? (
                    <TbPackageExport color={getColorOrderStatus(status)} />
                  ) : status === OrderStatus.PREPARING ? (
                    <FaHourglassStart color={getColorOrderStatus(status)} />
                  ) : status === OrderStatus.DELIVERING ? (
                    <FaShippingFast color={getColorOrderStatus(status)} />
                  ) : status === OrderStatus.DELIVERED ? (
                    <FcShipped color={getColorOrderStatus(status)} />
                  ) : status === OrderStatus.COMPLETED ? (
                    <FaCircleCheck color={getColorOrderStatus(status)} />
                  ) : (
                    <FcCancel color={getColorOrderStatus(status)} />
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

export default SellingOrderStatusHistory;
