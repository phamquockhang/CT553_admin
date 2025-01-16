import { EditOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import UpdateUserForm from "./UpdatePermissionForm";
import { IStaff } from "../../../interfaces";

interface UpdateStaffProps {
  user: IStaff;
}

const UpdateStaff: React.FC<UpdateStaffProps> = ({ user }) => {
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
        title={<span className="text-lg">Cập nhật thông tin nhân viên</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateUserForm userToUpdate={user} onCancel={handleCloseModal} />
      </Modal>
    </>
  );
};

export default UpdateStaff;
