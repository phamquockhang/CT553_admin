import { useQuery } from "@tanstack/react-query";
import { Table, TableProps } from "antd";
import { IOrderDetail } from "../../../../interfaces";
import { productService } from "../../../../services";

interface OrderDetailsProps {
  orderDetails: IOrderDetail[];
  totalAmount?: number;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderDetails,
  totalAmount,
}) => {
  const productsId = orderDetails.map((orderDetail) => orderDetail.productId);

  const { data } = useQuery({
    queryKey: ["productsInOrderDetail"],
    queryFn: async () => {
      if (!productsId || productsId.length === 0) return [];
      return await Promise.all(
        productsId.map((id) => productService.getProduct(id)),
      );
    },
    enabled: productsId?.length > 0,
  });
  const products = data ? data.flatMap((result) => result.payload || []) : [];

  //   console.log(products);

  orderDetails = orderDetails.map((orderDetail) => {
    const product = products.find(
      (product) => product.productId === orderDetail.productId,
    );
    return {
      ...product,
      ...orderDetail,
    };
  });

  const columns: TableProps<IOrderDetail>["columns"] = [
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
            {value} {record.productUnit}
          </span>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold">Chi tiết đơn hàng</h3>
      <Table
        className="shadow-md"
        dataSource={orderDetails || []}
        columns={columns}
        rowKey="orderDetailId"
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

export default OrderDetails;
