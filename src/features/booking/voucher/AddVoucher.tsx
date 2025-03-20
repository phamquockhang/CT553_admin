import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import AddVoucherForm from "./components/AddVoucherForm";

const AddVoucher: React.FC = () => {
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
        width="50%"
        title={<span className="text-lg">Thêm mã giảm giá</span>}
        destroyOnClose
        maskClosable={false}
        onCancel={handleCloseModal}
        footer={null}
      >
        <AddVoucherForm onCancel={handleCloseModal} />
      </Modal>
    </>
  );
};

export default AddVoucher;
