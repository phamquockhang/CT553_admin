import { Button, Form, Input, Select, Space, Tooltip } from "antd";
import { IOrder, IOrderStatus, OrderStatus } from "../../../../interfaces";
import { translateOrderStatus } from "../../../../utils";
import OrderDetails from "./OrderDetails";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../../../services";
import toast from "react-hot-toast";
import { useValidOrderStatuses } from "../hooks/useValidOrderStatuses";
import { IoIosAlert } from "react-icons/io";

interface OrderFormProps {
  orderToUpdate?: IOrder;
  onCancel: () => void;
  viewMode?: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({
  orderToUpdate,
  onCancel,
  viewMode = false,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const currentStatus = orderToUpdate?.orderStatus as OrderStatus;
  const optionsOrderStatus = useValidOrderStatuses(currentStatus);

  const { mutate: updateOrderStatus } = useMutation({
    mutationFn: ({
      orderId,
      orderStatus,
    }: {
      orderId: string;
      orderStatus: IOrderStatus;
    }) => {
      return orderService.updateOrderStatus(orderId, orderStatus);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("orders") || query.queryKey.includes("order"),
      });
      onCancel();
      toast.success(data.message || "Operation successful");
    },

    onError: (error) => {
      toast.error(error.message || "Operation failed");
    },
  });

  const handleSubmit = (values: IOrder) => {
    if (values.orderStatus === currentStatus) {
      toast.error("Trạng thái chưa có thay đổi");
      return;
    }

    updateOrderStatus({
      orderId: values.orderId,
      orderStatus: {
        status: values.orderStatus,
      },
    });
  };

  const initialValues = {
    ...orderToUpdate,
    orderStatus: orderToUpdate
      ? translateOrderStatus(orderToUpdate.orderStatus)
      : undefined,
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <div className="flex gap-8">
        <Form.Item className="flex-1" label="Mã đơn hàng" name="orderId">
          <Input readOnly={true} />
        </Form.Item>

        <Form.Item
          className="flex-1"
          //   label="Trạng thái đơn hàng"
          label={
            <>
              Trạng thái đơn hàng
              <span className="ml-2 text-red-500">
                <Tooltip title="Trạng thái đơn hàng chỉ có thể cập nhật theo các trạng thái được đưa ra dựa vào trạng thái hiện tại và không thể  hoàn tác!!!">
                  <IoIosAlert />
                </Tooltip>
              </span>
            </>
          }
          name="orderStatus"
        >
          <Select disabled={viewMode}>
            {optionsOrderStatus.map(({ value, label }) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div className="flex gap-8">
        <Form.Item className="flex-1" label="Tên khách hàng" name="name">
          <Input readOnly={true} />
        </Form.Item>

        <Form.Item className="flex-1" label="Số điện thoại" name="phone">
          <Input readOnly={true} />
        </Form.Item>
      </div>

      <div className="flex gap-8">
        <Form.Item className="flex-1" label="Email" name="email">
          <Input readOnly={true} />
        </Form.Item>

        <Form.Item className="flex-1" label="Địa chỉ" name="address">
          <Input.TextArea rows={1} readOnly={true} />
        </Form.Item>
      </div>

      <div className="flex gap-8">
        <Form.Item className="flex-1" label="Ghi chú" name="note">
          <Input.TextArea rows={1} readOnly={true} />
        </Form.Item>
      </div>

      <OrderDetails
        orderDetails={orderToUpdate?.orderDetails || []}
        totalAmount={orderToUpdate?.totalAmount}
      />

      {!viewMode && (
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Space>
            <Button
              //   disabled={isCreatingOrder || isUpdatingOrder}
              onClick={onCancel}
            >
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              //   loading={
              //     isCreatingOrder || isUpdatingOrder
              //   }
            >
              {orderToUpdate ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default OrderForm;
