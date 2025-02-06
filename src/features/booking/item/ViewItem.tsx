import { EyeOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import UpdateItemForm from "./UpdateItemForm";
import { IItem } from "../../../interfaces";

interface ViewItemProps {
  item: IItem;
}

const ViewItem: React.FC<ViewItemProps> = ({ item }) => {
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
        title={<span className="text-lg">Xem thông tin mặt hàng</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateItemForm
          itemToUpdate={item}
          onCancel={handleCloseModal}
          viewOnly
        />
      </Modal>
    </>
  );
};

export default ViewItem;
