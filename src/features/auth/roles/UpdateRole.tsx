import { EditOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { type IRole } from "../../../interfaces";
import UpdateRoleForm from "./UpdateRoleForm";

interface UpdateRoleProps {
  role: IRole;
}

const UpdateRole: React.FC<UpdateRoleProps> = ({ role }) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  return (
    <>
      <Tooltip title="Chỉnh sửa">
        <EditOutlined
          className="table-icon text-xl text-[#ffa500]"
          onClick={handleOpenModal}
        />
      </Tooltip>
      <Modal
        open={isOpenModal}
        width="50%"
        title={<span className="text-lg">Chỉnh sửa vai trò</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateRoleForm roleToUpdate={role} onCancel={handleCloseModal} />
      </Modal>
    </>
  );
};

export default UpdateRole;
