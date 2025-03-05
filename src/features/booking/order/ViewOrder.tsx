import { EyeOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { IOrder } from "../../../interfaces";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../../services";
import OrderForm from "./components/OrderForm";

interface ViewOrderProps {
  order: IOrder;
}

const ViewOrder: React.FC<ViewOrderProps> = ({ order }) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const { data: orderData, isLoading: isOrderLoading } = useQuery({
    queryKey: ["order", order.orderId],
    queryFn: () => orderService.getOrder(order.orderId),
    select: (data) => data.payload,
  });

  return (
    <>
      <Tooltip title="Xem chi tiết">
        <EyeOutlined
          className="table-icon text-xl text-[#1677FF]"
          onClick={handleOpenModal}
        />
      </Tooltip>
      <Modal
        loading={isOrderLoading}
        centered
        open={isOpenModal}
        width="60%"
        title={<span className="text-lg">Xem chi tiết đơn hàng</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <OrderForm
          orderToUpdate={orderData}
          onCancel={handleCloseModal}
          viewMode
        />
      </Modal>
    </>
  );
};

export default ViewOrder;
