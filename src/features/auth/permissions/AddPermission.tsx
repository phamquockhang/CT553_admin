import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import UpdateUserForm from "./UpdatePermissionForm";

const AddPermission: React.FC = () => {
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
        open={isOpenModal}
        width="50%"
        title={<span className="text-lg">Thêm quyền hạn</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateUserForm onCancel={handleCloseModal} />
      </Modal>
    </>
  );
};

export default AddPermission;
