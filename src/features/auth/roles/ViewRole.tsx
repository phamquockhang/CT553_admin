import { EyeOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { type IRole } from "../../../interfaces";
import UpdateRoleForm from "./UpdateRoleForm";

interface ViewRoleProps {
  role: IRole;
}

const ViewRole: React.FC<ViewRoleProps> = ({ role }) => {
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
        open={isOpenModal}
        width="50%"
        title={<span className="text-lg">Xem thông tin vai trò</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateRoleForm
          roleToUpdate={role}
          onCancel={handleCloseModal}
          viewOnly
        />
      </Modal>
    </>
  );
};

export default ViewRole;
