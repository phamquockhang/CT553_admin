import { DeleteOutlined } from "@ant-design/icons";
import { Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import { ISellingOrderDetail } from "../../../../interfaces";

interface SelectedProductsProps {
  selectedProductsDetails: ISellingOrderDetail[];
  setSelectedProductsDetails: React.Dispatch<
    React.SetStateAction<ISellingOrderDetail[]>
  >;
}

const SelectedProducts: React.FC<SelectedProductsProps> = ({
  selectedProductsDetails,
  setSelectedProductsDetails,
}) => {
  // console.log("totalAmount", form.getFieldValue("totalAmount"));

  const removeFromInvoice = (productIdToRemove: number) => {
    setSelectedProductsDetails(
      selectedProductsDetails.filter(
        (product) => product.productId !== productIdToRemove,
      ),
    );
  };

  const selectedProductDetailColumns: ColumnsType<ISellingOrderDetail> = [
    {
      align: "center",
      title: "STT",
      dataIndex: "productId",
      key: "productId",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
    {
      align: "right",
      title: "Đơn giá (VND)",
      dataIndex: "unitPrice",
      key: "unitPrice",
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
      align: "right",
      title: "Thành tiền (VND)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => {
        return <span>{totalPrice.toLocaleString()}</span>;
      },
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
          columns={selectedProductDetailColumns}
          dataSource={selectedProductsDetails}
          pagination={false}
        />
      </div>
    </>
  );
};

export default SelectedProducts;
