import { EyeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { sellingOrderService } from "../../../services";
import SellingOrderForm from "./components/SellingOrderForm";

interface ViewOrderProps {
  sellingOrderId: string;
}

const ViewSellingOrder: React.FC<ViewOrderProps> = ({ sellingOrderId }) => {
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
        <SellingOrderForm
          sellingOrderToUpdate={orderData}
          onCancel={handleCloseModal}
          viewMode
        />
      </Modal>
    </>
  );
};

export default ViewSellingOrder;
