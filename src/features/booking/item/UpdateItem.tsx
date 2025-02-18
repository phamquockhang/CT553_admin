import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { itemService } from "../../../services";
import UpdateItemForm from "./UpdateItemForm";

interface UpdateItemProps {
  itemId: number;
}

const UpdateItem: React.FC<UpdateItemProps> = ({ itemId }) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => itemService.getItem(itemId),
  });

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
        loading={isLoading}
        centered
        open={isOpenModal}
        width="60%"
        title={<span className="text-lg">Cập nhật thông tin mặt hàng</span>}
        destroyOnClose
        maskClosable={false}
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateItemForm
          itemToUpdate={data?.payload}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default UpdateItem;
