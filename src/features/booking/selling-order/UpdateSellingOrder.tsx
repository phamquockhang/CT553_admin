import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { sellingOrderService } from "../../../services";
import SellingOrderForm from "./components/SellingOrderForm";

interface UpdateSellingOrderProps {
  sellingOrderId: string;
}

const UpdateSellingOrder: React.FC<UpdateSellingOrderProps> = ({
  sellingOrderId,
}) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const { data: orderData, isLoading: isOrderLoading } = useQuery({
    queryKey: ["selling_order", sellingOrderId],
    queryFn: () => sellingOrderService.getSellingOrder(sellingOrderId),
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
        <SellingOrderForm
          sellingOrderToUpdate={orderData}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default UpdateSellingOrder;
