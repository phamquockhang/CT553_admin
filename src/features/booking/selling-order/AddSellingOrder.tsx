import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import SellingOrderForm from "./components/SellingOrderForm";

const AddSellingOrder: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
        Thêm
      </Button>
      <Modal
        centered
        open={isOpenModal}
        width="60%"
        title={<span className="text-lg">Thêm hóa đơn bán hàng</span>}
        destroyOnClose
        maskClosable={false}
        onCancel={handleCloseModal}
        footer={null}
      >
        {/* <UpdateItemForm onCancel={handleCloseModal} /> */}
        <SellingOrderForm onCancel={handleCloseModal} />
      </Modal>
    </>
  );
};

export default AddSellingOrder;
