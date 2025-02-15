import { EditOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import UpdateItemForm from "./UpdateItemForm";
import { IItem } from "../../../interfaces";

interface UpdateItemProps {
  item: IItem;
}

const UpdateItem: React.FC<UpdateItemProps> = ({ item }) => {
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
        centered
        open={isOpenModal}
        width="60%"
        title={<span className="text-lg">Cập nhật thông tin mặt hàng</span>}
        destroyOnClose
        maskClosable={false}
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateItemForm itemToUpdate={item} onCancel={handleCloseModal} />
      </Modal>
    </>
  );
};

export default UpdateItem;
