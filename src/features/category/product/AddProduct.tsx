import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal } from "antd";
import { useState } from "react";
import { itemService } from "../../../services";
import AddProductForm from "./components/AddProductForm";

const AddProduct: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["allItems"],
    queryFn: itemService.getAllItems,
  });

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
        Thêm
      </Button>
      <Modal
        centered
        open={isOpenModal}
        width="60%"
        title={<span className="text-lg">Thêm sản phẩm</span>}
        destroyOnClose
        maskClosable={false}
        onCancel={handleCloseModal}
        footer={null}
      >
        <AddProductForm
          onCancel={handleCloseModal}
          existingItems={data?.payload}
          isLoadingItemsData={isLoading || isFetching}
        />
      </Modal>
    </>
  );
};

export default AddProduct;
