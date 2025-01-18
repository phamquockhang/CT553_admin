import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import UpdateRoleForm from "./UpdateRoleForm";

const AddRole: React.FC = () => {
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
        title={<span className="text-lg">Thêm vai trò</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateRoleForm onCancel={handleCloseModal} />
      </Modal>
    </>
  );
};

export default AddRole;
