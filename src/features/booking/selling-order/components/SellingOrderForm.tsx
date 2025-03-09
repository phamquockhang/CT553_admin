import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Select, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoIosAlert } from "react-icons/io";
import {
  IBriefSellingOrderStatus,
  ICustomer,
  ISellingOrder,
  ISellingOrderDetail,
  OrderStatus,
  PaidStatus,
} from "../../../../interfaces";
import { sellingOrderService } from "../../../../services";
import {
  revertOrderStatus,
  revertPaymentStatus,
  translateOrderStatus,
  translatePaymentStatus,
} from "../../../../utils";
import { useValidSellingOrderStatuses } from "../hooks/useValidSellingOrderStatuses";
import AddCustomerToOrderForm from "./AddCustomerToOrderForm";
import AddProductToOrderForm from "./AddProductToOrderForm";
import PaymentForm from "./PaymentForm";
import SellingOrderDetails from "./SellingOrderDetails";
import SellingOrderStatusHistory from "./SellingOrderStatusHistory";
import { useValidPaymentStatuses } from "../hooks/useValidPaymentStatuses";

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
  const [isSaveCustomer, setIsSaveCustomer] = useState<boolean>(false);
  const [choosenCustomer, setChoosenCustomer] = useState<
    ICustomer | undefined
  >();
  const [selectedProductsDetails, setSelectedProductsDetails] = useState<
    ISellingOrderDetail[]
  >([]);

  const [provinceId, setProvinceId] = useState<number>();
  const [districtId, setDistrictId] = useState<number>();
  const [wardCode, setWardCode] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [formattedAddress, setFormattedAddress] = useState<string>();

  const address = choosenCustomer?.addresses.find(
    (address) => address.isDefault,
  );

  const { mutate: createSellingOrder, isPending: isCreatingOrder } =
    useMutation({
      mutationFn: (newSellingOrder: Omit<ISellingOrder, "sellingOrderId">) => {
        return sellingOrderService.create(newSellingOrder);
      },

      onSuccess: (data) => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.includes("selling_orders") ||
            query.queryKey.includes("selling_order") ||
            query.queryKey.includes("customers"),
        });
        onCancel();

        if (data.success) toast.success(data.message || "Operation successful");
        else if (!data.success) toast.error(data.message || "Operation failed");
      },

      onError: (error) => {
        toast.error(error.message || "Operation failed");
      },
    });

  const { mutate: updateOrderStatus, isPending: isUpdatingOrder } = useMutation(
    {
      mutationFn: ({
        sellingOrderId,
        sellingOrderStatus,
      }: {
        sellingOrderId: string;
        sellingOrderStatus: IBriefSellingOrderStatus;
      }) => {
        return sellingOrderService.updateOrderStatus(
          sellingOrderId,
          sellingOrderStatus,
        );
      },

      onSuccess: (data) => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.includes("selling_orders") ||
            query.queryKey.includes("selling_order") ||
            query.queryKey.includes("customers"),
        });
        onCancel();

        if (data.success) toast.success(data.message || "Operation successful");
        else if (!data.success) toast.error(data.message || "Operation failed");
      },

      onError: (error) => {
        toast.error(error.message || "Operation failed");
      },
    },
  );

  const handleSubmit = (values: ISellingOrder) => {
    if (sellingOrderToUpdate) {
      if (
        values.orderStatus === translateOrderStatus(currentOrderStatus) &&
        values.paymentStatus === translatePaymentStatus(currentPaymentStatus)
      ) {
        toast.error("Trạng thái chưa có thay đổi");
        return;
      }

      const newSellingOrderStatus = {
        orderStatus: revertOrderStatus(values.orderStatus as string),
        paymentStatus: revertPaymentStatus(values.paymentStatus as string),
      };

      console.log("Updating with values", newSellingOrderStatus);

      updateOrderStatus({
        sellingOrderId: values.sellingOrderId,
        sellingOrderStatus: newSellingOrderStatus,
      });
    } else {
      if (!selectedProductsDetails || selectedProductsDetails.length === 0) {
        toast.error("Vui lòng chọn sản phẩm");
      } else {
        const newValues = {
          ...values,
          orderStatus: values.orderStatus as OrderStatus,
          paymentStatus: values.paymentStatus as PaidStatus,

          customerId: isSaveCustomer ? choosenCustomer?.customerId : undefined,
          customerName: isSaveCustomer ? values.customerName : "Khách lẻ",
          phone: isSaveCustomer ? values.phone : undefined,
          email: isSaveCustomer ? values.email : undefined,
          address: isSaveCustomer ? formattedAddress : undefined,
          note: isSaveCustomer ? values.note : undefined,

          sellingOrderDetails: selectedProductsDetails.map((product) => ({
            sellingOrderDetailId: undefined,
            productId: product.productId,
            productName: product.productName,
            unit: product.unit,
            quantity: product.quantity,
            unitPrice: product.unitPrice,
            totalPrice: product.totalPrice,
          })),

          description: undefined,
          provinceId: undefined,
          districtId: undefined,
          wardCode: undefined,
        };

        console.log("Creating with values", newValues);

        createSellingOrder(newValues);
      }
    }
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
    paymentStatus: sellingOrderToUpdate
      ? translatePaymentStatus(sellingOrderToUpdate.paymentStatus)
      : PaidStatus.PAID,
  };

  const currentOrderStatus = sellingOrderToUpdate?.orderStatus as OrderStatus;
  const optionsOrderStatus = useValidSellingOrderStatuses(currentOrderStatus);

  const currentPaymentStatus =
    sellingOrderToUpdate?.paymentStatus as PaidStatus;
  const optionsPaymentStatus = useValidPaymentStatuses(currentPaymentStatus);

  // console.log("selectedProductsDetails", selectedProductsDetails);
  // console.log("sellingOrderToUpdate", sellingOrderToUpdate);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      {!sellingOrderToUpdate && (
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex gap-8">
            <Form.Item
              className="flex-1"
              label="Trạng thái đơn hàng"
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

            <Form.Item
              className="flex-1"
              //   label="Trạng thái đơn hàng"
              label="Trạng thái thanh toán"
              name="paymentStatus"
            >
              <Select disabled={viewMode}>
                {optionsPaymentStatus.map(({ value, label }) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <AddCustomerToOrderForm
            form={form}
            isSaveCustomer={isSaveCustomer}
            setIsSaveCustomer={setIsSaveCustomer}
            setChoosenCustomer={setChoosenCustomer}
            setFormattedAddress={setFormattedAddress}
            provinceId={provinceId}
            setProvinceId={setProvinceId}
            districtId={districtId}
            setDistrictId={setDistrictId}
            wardCode={wardCode}
            setWardCode={setWardCode}
            description={description}
            setDescription={setDescription}
          />

          <AddProductToOrderForm
            selectedProductsDetails={selectedProductsDetails}
            setSelectedProductsDetails={setSelectedProductsDetails}
          />

          <PaymentForm
            form={form}
            selectedProductsDetails={selectedProductsDetails}
            choosenCustomer={isSaveCustomer ? choosenCustomer : undefined}
          />
        </div>
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
          </div>

          <div className="flex gap-8">
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

            <Form.Item
              className="flex-1"
              //   label="Trạng thái đơn hàng"
              label="Trạng thái thanh toán"
              name="paymentStatus"
            >
              <Select disabled={viewMode}>
                {optionsPaymentStatus.map(({ value, label }) => (
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

          <SellingOrderDetails sellingOrder={sellingOrderToUpdate} />
        </>
      )}

      {!viewMode && (
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Space>
            <Button
              disabled={isCreatingOrder || isUpdatingOrder}
              onClick={onCancel}
            >
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={isCreatingOrder || isUpdatingOrder}
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
