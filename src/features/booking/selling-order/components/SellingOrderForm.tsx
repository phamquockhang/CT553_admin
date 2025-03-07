import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Collapse,
  CollapseProps,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoIosAlert } from "react-icons/io";
import {
  ICustomer,
  IOrderStatus,
  ISellingOrder,
  OrderStatus,
  PaidStatus,
} from "../../../../interfaces";
import { sellingOrderService } from "../../../../services";
import { translateOrderStatus } from "../../../../utils";
import AddCustomer from "../../../auth/customers/AddCustomer";
import AddAddress from "../../../auth/customers/components/AddAddress";
import { useValidSellingOrderStatuses } from "../hooks/useValidSellingOrderStatuses";
import AddProductToOrderForm from "./AddProductToOrderForm";
import FindCustomer from "./FindCustomer";
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
  const [hasCreateCustomer, setHasCreateCustomer] = useState<boolean>(false);
  const [choosenCustomer, setChoosenCustomer] = useState<
    ICustomer | undefined
  >();

  const [provinceId, setProvinceId] = useState<number>();
  const [districtId, setDistrictId] = useState<number>();
  const [wardCode, setWardCode] = useState<string>();
  const [description, setDescription] = useState<string>();

  const [formattedAddress, setFormattedAddress] = useState<string>();

  const address = choosenCustomer?.addresses.find(
    (address) => address.isDefault,
  );

  const currentStatus = sellingOrderToUpdate?.orderStatus as OrderStatus;
  const optionsOrderStatus = useValidSellingOrderStatuses(currentStatus);

  const { mutate: createSellingOrder } = useMutation({
    mutationFn: (newSellingOrder: Omit<ISellingOrder, "sellingOrderId">) => {
      return sellingOrderService.create(newSellingOrder);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("selling_orders") ||
          query.queryKey.includes("selling_order"),
      });
      // onCancel();

      if (data.success) toast.success(data.message || "Operation successful");
      else if (!data.success) toast.error(data.message || "Operation failed");
    },

    onError: (error) => {
      toast.error(error.message || "Operation failed");
    },
  });

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

      if (data.success) toast.success(data.message || "Operation successful");
      else if (!data.success) toast.error(data.message || "Operation failed");
    },

    onError: (error) => {
      toast.error(error.message || "Operation failed");
    },
  });

  const handleSubmit = (values: ISellingOrder) => {
    if (sellingOrderToUpdate) {
      if (values.orderStatus === translateOrderStatus(currentStatus)) {
        toast.error("Trạng thái chưa có thay đổi");
        return;
      }

      console.log("Updating with values", values);

      updateOrderStatus({
        orderId: values.sellingOrderId,
        orderStatus: {
          status: values.orderStatus,
        },
      });
    } else {
      const newValues = {
        ...values,
        orderStatus: OrderStatus.COMPLETED,
        paymentStatus: PaidStatus.PAID,

        customerName: hasCreateCustomer ? values.customerName : "Khách lẻ",
        phone: hasCreateCustomer ? values.phone : undefined,
        email: hasCreateCustomer ? values.email : undefined,
        address: hasCreateCustomer ? formattedAddress : "Không có",
        note: hasCreateCustomer ? values.note : undefined,

        description: undefined,
        provinceId: undefined,
        districtId: undefined,
        wardCode: undefined,
      };

      console.log("hasCreateCustomer", hasCreateCustomer);
      console.log("Creating with values", newValues);

      createSellingOrder(newValues);
    }
  };

  const handleCheck = (checked: boolean) => {
    setHasCreateCustomer(checked);
  };

  useEffect(() => {
    if (choosenCustomer) {
      form.setFieldsValue({
        customerName: `${choosenCustomer.lastName} ${choosenCustomer.firstName}`,
        // phone: choosenCustomer.phone,
        email: choosenCustomer.email,
        provinceId: address?.provinceId || undefined,
        districtId: address?.districtId || undefined,
        wardCode: address?.wardCode || undefined,
        description: address?.description || undefined,
      });
      setProvinceId(address?.provinceId);
      setDistrictId(address?.districtId);
      setWardCode(address?.wardCode);
      setDescription(address?.description);
    }
  }, [choosenCustomer, form, address]);

  const initialValues = {
    ...sellingOrderToUpdate,
    orderStatus: sellingOrderToUpdate
      ? translateOrderStatus(sellingOrderToUpdate.orderStatus)
      : OrderStatus.COMPLETED,
  };

  const items: CollapseProps["items"] = [
    {
      key: "createCustomer",
      label: "Có lưu lại thông tin khách hàng không?",
      extra: (
        <Switch
          checkedChildren="Có"
          unCheckedChildren="Không"
          defaultChecked={false}
          value={hasCreateCustomer}
          // disabled={viewOnly}
          // checked={isModuleChecked(module)}
          // onClick={(_, event) => event.stopPropagation()}
          onChange={(checked) => handleCheck(checked)}
        />
      ),

      children: (
        <>
          <Col key={`1`} span={24}>
            <Card size="small">
              <div className="mb-4 flex justify-between gap-8">
                <FindCustomer
                  viewMode={!hasCreateCustomer}
                  setChoosenCustomer={setChoosenCustomer}
                />

                <AddCustomer />
              </div>
              <div className="flex gap-8">
                <Form.Item
                  className="flex-1"
                  label="Tên khách hàng"
                  name="customerName"
                  rules={[
                    {
                      required: hasCreateCustomer,
                      message: "Vui lòng nhập tên khách hàng",
                    },
                  ]}
                >
                  <Input
                    disabled={!hasCreateCustomer}
                    // readOnly={!hasCreateCustomer}
                    placeholder="Nhập tên khách hàng"
                  />
                </Form.Item>

                <Form.Item
                  className="flex-1"
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    {
                      required: hasCreateCustomer,
                      message: "Vui lòng nhập số điện thoại",
                    },
                    {
                      pattern: new RegExp("^(0|\\+84)\\d{9,10}$", "g"),
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    disabled={!hasCreateCustomer}
                    // readOnly={!hasCreateCustomer}
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Item>
              </div>

              <div className="flex gap-8">
                <Form.Item
                  className="flex-1"
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: hasCreateCustomer,
                      message: "Vui lòng nhập email",
                    },
                    {
                      type: "email",
                      message: "Email không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    disabled={!hasCreateCustomer}
                    // readOnly={!hasCreateCustomer}
                    placeholder="Nhập email"
                  />
                </Form.Item>
              </div>

              <h1 className="mb-1 text-lg font-semibold">Địa chỉ giao hàng</h1>
              <AddAddress
                viewMode={!hasCreateCustomer}
                form={form}
                provinceId={provinceId}
                setProvinceId={setProvinceId}
                districtId={districtId}
                setDistrictId={setDistrictId}
                wardCode={wardCode}
                setWardCode={setWardCode}
                description={description}
                setDescription={setDescription}
                setFormattedAddress={setFormattedAddress}
              />

              <div className="flex gap-8">
                <Form.Item className="flex-1" label="Ghi chú" name="note">
                  <Input.TextArea
                    disabled={!hasCreateCustomer}
                    // readOnly={!hasCreateCustomer}
                    rows={1}
                    placeholder="Nhập ghi chú"
                  />
                </Form.Item>
              </div>
            </Card>
          </Col>
        </>
      ),
    },
  ];

  // console.log("choosenCustomer", choosenCustomer);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      {!sellingOrderToUpdate && (
        <>
          <Collapse className="mb-6" items={items} />

          <AddProductToOrderForm />
        </>
      )}

      {sellingOrderToUpdate && (
        <>
          <div className="flex gap-8">
            <Form.Item
              className="flex-1"
              label="Mã đơn hàng"
              name="sellingOrderId"
            >
              <Input
                readOnly={viewMode || sellingOrderToUpdate ? true : false}
              />
            </Form.Item>

            <Form.Item
              className="flex-1"
              //   label="Trạng thái đơn hàng"
              label={
                sellingOrderToUpdate ? (
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
                ) : (
                  "Trạng thái đơn hàng"
                )
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
              <Input
                readOnly={viewMode || sellingOrderToUpdate ? true : false}
              />
            </Form.Item>

            <Form.Item className="flex-1" label="Số điện thoại" name="phone">
              <Input
                readOnly={viewMode || sellingOrderToUpdate ? true : false}
              />
            </Form.Item>
          </div>

          <div className="flex gap-8">
            <Form.Item className="flex-1" label="Email" name="email">
              <Input
                readOnly={viewMode || sellingOrderToUpdate ? true : false}
              />
            </Form.Item>

            <Form.Item className="flex-1" label="Địa chỉ" name="address">
              <Input.TextArea
                rows={1}
                readOnly={viewMode || sellingOrderToUpdate ? true : false}
              />
            </Form.Item>
          </div>

          <div className="flex gap-8">
            <Form.Item className="flex-1" label="Ghi chú" name="note">
              <Input.TextArea
                rows={1}
                readOnly={viewMode || sellingOrderToUpdate ? true : false}
              />
            </Form.Item>
          </div>

          <SellingOrderDetails
            sellingOrderDetails={
              sellingOrderToUpdate?.sellingOrderDetails || []
            }
            totalAmount={sellingOrderToUpdate?.totalAmount}
          />
        </>
      )}

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
