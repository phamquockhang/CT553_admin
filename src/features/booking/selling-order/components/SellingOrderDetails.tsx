import { Table, TableProps } from "antd";
import { ISellingOrderDetail } from "../../../../interfaces";

interface SellingOrderDetailsProps {
  sellingOrderDetails: ISellingOrderDetail[];
  totalAmount?: number;
}

const SellingOrderDetails: React.FC<SellingOrderDetailsProps> = ({
  sellingOrderDetails,
  totalAmount,
}) => {
  const columns: TableProps<ISellingOrderDetail>["columns"] = [
    {
      title: "Mã sản phẩm",
      align: "center",
      dataIndex: "productId",
      key: "productId",
      width: "15%",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (value, record) => {
        return (
          <span>
            {record.quantity} {record.unit}
          </span>
        );
      },
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "right",
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "right",
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold">Chi tiết đơn hàng</h3>
      <Table
        className="shadow-md"
        dataSource={sellingOrderDetails || []}
        columns={columns}
        rowKey="sellingOrderDetailId"
        pagination={false}
      />
      <div className="my-4 flex justify-end">
        <h3 className="text-lg font-semibold">
          Tổng tiền: {totalAmount?.toLocaleString()} VND
        </h3>
      </div>
    </div>
  );
};

export default SellingOrderDetails;
