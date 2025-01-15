import { EyeOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import UpdateUserForm from "./UpdateStaffForm";
import { IStaff } from "../../interfaces";

interface ViewUserProps {
  user: IStaff;
}

const ViewStaff: React.FC<ViewUserProps> = ({ user }) => {
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
        title={<span className="text-lg">Xem thông tin người dùng</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateUserForm
          userToUpdate={user}
          onCancel={handleCloseModal}
          viewOnly
        />
      </Modal>
    </>
  );
};

export default ViewStaff;
