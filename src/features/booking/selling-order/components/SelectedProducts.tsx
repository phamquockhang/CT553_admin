import { DeleteOutlined } from "@ant-design/icons";
import { Table, Tooltip, InputNumber } from "antd";
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
  const removeFromInvoice = (productIdToRemove: number) => {
    setSelectedProductsDetails(
      selectedProductsDetails.filter(
        (product) => product.productId !== productIdToRemove,
      ),
    );
  };

  const handleQuantityChange = (
    productId: number,
    newQuantity: number | null,
  ) => {
    if (newQuantity === null || newQuantity < 1) return;

    setSelectedProductsDetails((prevDetails) =>
      prevDetails.map((product) =>
        product.productId === productId
          ? {
              ...product,
              quantity: newQuantity,
              totalPrice: product.unitPrice * newQuantity,
            }
          : product,
      ),
    );
  };

  const handleDirectChange = (
    productId: number,
    newQuantity: number | null,
  ) => {
    handleQuantityChange(productId, newQuantity);
  };

  const handleDeltaChange = (
    productId: number,
    oldQuantity: number,
    delta: number,
  ) => {
    let temp = oldQuantity + delta;
    temp = Math.round(temp * 10) / 10;
    const newQuantity = temp < 1 ? 1 : temp > 100 ? 100 : temp;
    handleQuantityChange(productId, newQuantity);
  };

  const selectedProductDetailColumns: ColumnsType<ISellingOrderDetail> = [
    {
      align: "center",
      title: "STT",
      dataIndex: "productId",
      key: "productId",
      render: (_, __, index) => <span>{index + 1}</span>,
      width: "1%",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      width: "18%",
    },
    {
      align: "right",
      title: "Đơn giá (VND)",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => <span>{price.toLocaleString()}</span>,
      width: "14%",
    },
    {
      align: "center",
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "1%",
      render: (_, record) => (
        <InputNumber
          size="large"
          min={1}
          max={100}
          className="centered-input"
          controls={false}
          addonBefore={
            <div
              onClick={() => {
                if (record.unit === "kg") {
                  handleDeltaChange(record.productId, record.quantity, -0.1);
                } else {
                  handleDeltaChange(record.productId, record.quantity, -1);
                }
              }}
              className="cursor-pointer px-3 py-1"
            >
              -
            </div>
          }
          addonAfter={
            <div
              onClick={() => {
                if (record.unit === "kg") {
                  handleDeltaChange(record.productId, record.quantity, 0.1);
                } else {
                  handleDeltaChange(record.productId, record.quantity, 1);
                }
              }}
              className="cursor-pointer px-3 py-1"
            >
              +
            </div>
          }
          style={{ width: 110 }}
          value={record.quantity}
          onChange={(value) => {
            if (typeof value === "number") {
              handleDirectChange(record.productId, value);
            } else {
              handleDirectChange(record.productId, 1);
            }
          }}
        />
      ),
    },
    {
      align: "center",
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      width: "9%",
    },
    {
      align: "right",
      title: "Thành tiền (VND)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => <span>{totalPrice.toLocaleString()}</span>,
      width: "16%",
    },
    {
      align: "center",
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Xóa">
          <DeleteOutlined
            onClick={() => removeFromInvoice(record.productId)}
            className="cursor-pointer text-xl text-[#ff4d4f]"
          />
        </Tooltip>
      ),
      width: "12%",
    },
  ];

  return (
    <div className="mt-6">
      <h3 className="mb-2 text-lg font-semibold">Sản phẩm đã chọn</h3>
      <Table
        columns={selectedProductDetailColumns}
        dataSource={selectedProductsDetails}
        pagination={false}
        rowKey="productId"
      />
    </div>
  );
};

export default SelectedProducts;
