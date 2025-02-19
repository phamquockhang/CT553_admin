import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { itemService, productService } from "../../../services";
import UpdateProductForm from "./components/UpdateProductForm";

interface UpdateProductProps {
  productId: number;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({ productId }) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const { data: productData, isLoading: isLoadingProductData } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productService.getProduct(productId),
  });

  const {
    data: itemsData,
    isLoading: isLoadingItemsData,
    isFetching: isFetchingItemsData,
  } = useQuery({
    queryKey: ["allItems"],
    queryFn: itemService.getAllItems,
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
        loading={isLoadingProductData}
        centered
        open={isOpenModal}
        width="60%"
        title={<span className="text-lg">Cập nhật thông tin sản phẩm</span>}
        destroyOnClose
        maskClosable={false}
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateProductForm
          onCancel={handleCloseModal}
          existingItems={itemsData?.payload}
          productToUpdate={productData?.payload}
          isLoadingItemsData={isLoadingItemsData || isFetchingItemsData}
        />
      </Modal>
    </>
  );
};

export default UpdateProduct;
