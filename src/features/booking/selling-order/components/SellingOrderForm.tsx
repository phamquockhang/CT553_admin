import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Select, Space, Tooltip } from "antd";
import toast from "react-hot-toast";
import { IoIosAlert } from "react-icons/io";
import {
  ISellingOrder,
  IOrderStatus,
  OrderStatus,
} from "../../../../interfaces";
import { sellingOrderService } from "../../../../services";
import { translateOrderStatus } from "../../../../utils";
import { useValidSellingOrderStatuses } from "../hooks/useValidSellingOrderStatuses";
import SellingOrderDetails from "./SellingOrderDetails";
import SellingOrderStatusHistory from "./SellingOrderStatusHistory";

interface SellingOrderFormProps {
  sellingOrderToUpdate?: ISellingOrder;
  onCancel: () => void;
  viewMode?: boolean;
}

const SellingOrderForm: React.FC<SellingOrderFormProps> = ({
  sellingOrderToUpdate,
  onCancel,
  viewMode = false,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const currentStatus = sellingOrderToUpdate?.orderStatus as OrderStatus;
  const optionsOrderStatus = useValidSellingOrderStatuses(currentStatus);

  const { mutate: updateOrderStatus } = useMutation({
    mutationFn: ({
      orderId,
      orderStatus,
    }: {
      orderId: string;
      orderStatus: IOrderStatus;
    }) => {
      return sellingOrderService.updateOrderStatus(orderId, orderStatus);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("selling_orders") ||
          query.queryKey.includes("selling_order"),
      });
      onCancel();
      toast.success(data.message || "Operation successful");
    },

    onError: (error) => {
      toast.error(error.message || "Operation failed");
    },
  });

  const handleSubmit = (values: ISellingOrder) => {
    if (values.orderStatus === currentStatus) {
      toast.error("Trạng thái chưa có thay đổi");
      return;
    }

    updateOrderStatus({
      orderId: values.sellingOrderId,
      orderStatus: {
        status: values.orderStatus,
      },
    });
  };

  const initialValues = {
    ...sellingOrderToUpdate,
    orderStatus: sellingOrderToUpdate
      ? translateOrderStatus(sellingOrderToUpdate.orderStatus)
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
        <Form.Item className="flex-1" label="Mã đơn hàng" name="sellingOrderId">
          <Input readOnly={true} />
        </Form.Item>

        <Form.Item
          className="flex-1"
          //   label="Trạng thái đơn hàng"
          label={
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                Trạng thái đơn hàng
                <span className="ml-2 text-red-500">
                  <Tooltip title="Trạng thái đơn hàng chỉ có thể cập nhật theo các trạng thái được đưa ra dựa vào trạng thái hiện tại và không thể  hoàn tác!!!">
                    <IoIosAlert />
                  </Tooltip>
                </span>
              </div>

              <SellingOrderStatusHistory
                history={sellingOrderToUpdate?.orderStatuses}
              />
            </div>
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
        <Form.Item
          className="flex-1"
          label="Tên khách hàng"
          name="customerName"
        >
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

      <SellingOrderDetails
        sellingOrderDetails={sellingOrderToUpdate?.sellingOrderDetails || []}
        totalAmount={sellingOrderToUpdate?.totalAmount}
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
              {sellingOrderToUpdate ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default SellingOrderForm;
