import { Table, TableProps, Typography } from "antd";
import {
  ISellingOrder,
  ISellingOrderDetail,
  PaymentStatus,
} from "../../../../interfaces";
const { Text } = Typography;

interface SellingOrderDetailsProps {
  // sellingOrderDetails: ISellingOrderDetail[];
  // totalAmount?: number;
  sellingOrder: ISellingOrder;
}

const SellingOrderDetails: React.FC<SellingOrderDetailsProps> = ({
  // sellingOrderDetails,
  // totalAmount,
  sellingOrder,
}) => {
  const {
    usedScore,
    earnedScore,
    paymentStatus,
    sellingOrderDetails,
    totalAmount,
  } = sellingOrder;

  const totalPrice = sellingOrderDetails.reduce(
    (total, product) => total + product.totalPrice,
    0,
  );

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
      render: (_, record) => {
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

      <div className="border-t pt-4">
        <div className="flex justify-between">
          <Text>
            Tổng tiền hàng{" "}
            <span className="font-normal italic">(trước VAT):</span>
          </Text>
          <Text>{totalPrice.toLocaleString()} VND</Text>
        </div>

        {usedScore > 0 && (
          <div className="flex justify-between">
            <Text>Giảm giá từ điểm:</Text>
            <Text className="text-red-500">
              -{usedScore.toLocaleString()} VND
            </Text>
          </div>
        )}

        <div className="flex justify-between text-lg font-semibold">
          <Text>
            Thành tiền <span className="font-normal italic">(sau VAT):</span>
          </Text>
          <Text className="">{totalAmount.toLocaleString()} VND</Text>
        </div>

        <div className="flex justify-between text-lg font-semibold">
          <Text>Đã thanh toán:</Text>
          <Text>
            {paymentStatus === PaymentStatus.SUCCESS
              ? totalAmount.toLocaleString() + " VND"
              : 0 + " VND"}
          </Text>
        </div>

        {earnedScore > 0 && (
          <div className="flex justify-between text-lg font-semibold">
            <Text>Điểm tích lũy cộng thêm:</Text>
            <Text>{earnedScore.toLocaleString()} điểm </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellingOrderDetails;
