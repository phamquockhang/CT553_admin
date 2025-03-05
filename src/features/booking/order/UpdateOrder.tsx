import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { IOrder } from "../../../interfaces";
import { orderService } from "../../../services";
import OrderForm from "./components/OrderForm";

interface UpdateOrderProps {
  order: IOrder;
}

const UpdateOrder: React.FC<UpdateOrderProps> = ({ order }) => {
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
      <Tooltip title="Cập nhật trạng thái đơn hàng">
        <EditOutlined
          className="table-icon text-xl text-[#ffa500]"
          onClick={handleOpenModal}
        />
      </Tooltip>
      <Modal
        loading={isOrderLoading}
        centered
        open={isOpenModal}
        width="60%"
        title={<span className="text-lg">Cập nhật trạng thái đơn hàng</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <OrderForm orderToUpdate={orderData} onCancel={handleCloseModal} />
      </Modal>
    </>
  );
};

export default UpdateOrder;
