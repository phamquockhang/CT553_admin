import { EyeOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { IProduct } from "../../../interfaces";
import ViewProductForm from "./components/ViewProductForm";

interface ViewProductProps {
  product: IProduct;
}

const ViewProduct: React.FC<ViewProductProps> = ({ product }) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <Tooltip title="Xem chi tiết">
        <EyeOutlined
          className="table-icon text-xl text-[#1677FF]"
          onClick={handleOpenModal}
        />
      </Tooltip>
      <Modal
        centered
        open={isOpenModal}
        width="60%"
        title={<span className="text-lg">Xem thông tin sản phẩm</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <ViewProductForm productToView={product} />
      </Modal>
    </>
  );
};

export default ViewProduct;
