import { Table, Tooltip } from "antd";
import { IProduct } from "../../../../interfaces";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined } from "@ant-design/icons";
import React from "react";

interface SelectedProductsProps {
  selectedProducts: IProduct[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
}

const SelectedProducts: React.FC<SelectedProductsProps> = ({
  selectedProducts,
  setSelectedProducts,
}) => {
  const removeFromInvoice = (productIdToRemove: number) => {
    setSelectedProducts(
      selectedProducts.filter(
        (product) => product.productId !== productIdToRemove,
      ),
    );
  };

  const selectedColumns: ColumnsType<IProduct> = [
    { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
    {
      align: "right",
      title: "Đơn giá (VND)",
      dataIndex: ["sellingPrice", "sellingPriceValue"],
      key: "sellingPrice.sellingPriceValue",
      render: (price) => {
        return <span>{price.toLocaleString()}</span>;
      },
    },
    {
      align: "right",
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      align: "center",
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Tooltip title="Xóa">
            <DeleteOutlined
              onClick={() => removeFromInvoice(record.productId)}
              className="text-xl text-[#ff4d4f]"
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="mt-6">
        <h3 className="mb-2 text-lg font-semibold">Sản phẩm đã chọn</h3>
        <Table
          columns={selectedColumns}
          dataSource={selectedProducts}
          pagination={false}
        />
      </div>
    </>
  );
};

export default SelectedProducts;
