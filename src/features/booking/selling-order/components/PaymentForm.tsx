import { InfoCircleOutlined } from "@ant-design/icons";
import { Checkbox, Form, FormInstance, Tooltip, Typography, Alert } from "antd";
import { useEffect, useState } from "react";
import {
  ICustomer,
  ISellingOrderDetail,
  POINT_VALUE,
} from "../../../../interfaces";

const { Title, Text } = Typography;

interface PaymentFormProps {
  form: FormInstance;
  selectedProductsDetails: ISellingOrderDetail[];
  choosenCustomer?: ICustomer;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  form,
  selectedProductsDetails,
  choosenCustomer,
}) => {
  console.log("choosenCustomer", choosenCustomer);
  const [totalAmount, setTotalAmount] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const maxPointsAvailable = choosenCustomer?.score?.newValue || 0;

  // Maximum usable points based on order value
  const [maxUsablePoints, setMaxUsablePoints] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    const newTotalAmount = selectedProductsDetails.reduce(
      (total, product) => total + product.totalPrice,
      0,
    );
    setTotalAmount(newTotalAmount);
    form.setFieldsValue({ totalAmount: newTotalAmount });

    // Calculate maximum usable points based on order value
    const newMaxUsablePoints = Math.min(
      maxPointsAvailable,
      Math.floor(newTotalAmount / POINT_VALUE),
    );
    setMaxUsablePoints(newMaxUsablePoints);

    // Calculate discount and final amount when total amount or usePoints changes
    if (usePoints) {
      const calculatedDiscount = newMaxUsablePoints * POINT_VALUE;
      setDiscountAmount(calculatedDiscount);
      setFinalAmount(newTotalAmount - calculatedDiscount);
    } else {
      setDiscountAmount(0);
      setFinalAmount(newTotalAmount);
    }
  }, [selectedProductsDetails, maxPointsAvailable, usePoints, form]);

  useEffect(() => {
    // Update form values when discount changes
    form.setFieldsValue({
      totalAmount: finalAmount,
      usedScore: usePoints ? maxUsablePoints : 0,
    });
  }, [finalAmount, maxUsablePoints, usePoints, form]);

  const handleUsePointsChange = (checked: boolean) => {
    setUsePoints(checked);

    if (checked) {
      const calculatedDiscount = maxUsablePoints * POINT_VALUE;
      setDiscountAmount(calculatedDiscount);
      setFinalAmount(totalAmount - calculatedDiscount);
    } else {
      setDiscountAmount(0);
      setFinalAmount(totalAmount);
    }
  };

  // Format the points for display
  const formattedUsablePoints = maxUsablePoints.toLocaleString();
  const formattedAvailablePoints = maxPointsAvailable.toLocaleString();
  const discountValue = (maxUsablePoints * POINT_VALUE).toLocaleString();

  // Check if we're using partial points
  const isPartialPointsUsage = maxUsablePoints < maxPointsAvailable;

  return (
    <div className="rounded-md border border-gray-200 p-4">
      <Title level={4} className="mb-4">
        Thanh toán
      </Title>

      <div className="mb-4">
        {choosenCustomer && (
          <>
            <div className="mb-2 flex justify-between">
              <Text>Điểm tích lũy hiện có:</Text>
              <Text strong>{formattedAvailablePoints} điểm</Text>
            </div>

            <Form.Item className="mb-2">
              <Checkbox
                checked={usePoints}
                onChange={(e) => handleUsePointsChange(e.target.checked)}
                disabled={!maxPointsAvailable || maxUsablePoints === 0}
              >
                Sử dụng điểm để giảm giá
              </Checkbox>
            </Form.Item>
          </>
        )}

        {usePoints && (
          <div className="mb-4 pl-6">
            {isPartialPointsUsage ? (
              <Alert
                className="mb-3"
                type="info"
                showIcon
                message={`Với đơn hàng này, hệ thống sẽ sử dụng ${formattedUsablePoints}/${formattedAvailablePoints} điểm (tương đương ${discountValue} VND).`}
              />
            ) : (
              <Alert
                className="mb-3"
                type="info"
                showIcon
                message={`Hệ thống sẽ sử dụng toàn bộ ${formattedUsablePoints} điểm của bạn (tương đương ${discountValue} VND).`}
              />
            )}

            <div className="flex items-center">
              <Text>
                Điểm sử dụng: <Text strong>{formattedUsablePoints} điểm</Text>
              </Text>
              <Tooltip
                title={`${formattedUsablePoints} điểm = ${discountValue} VND`}
              >
                <InfoCircleOutlined className="ml-2 text-blue-500" />
              </Tooltip>
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <Form.Item className="mb-0" name="totalAmount">
          <div className="flex justify-between">
            <Text>Tổng tiền hàng:</Text>
            <Text>{totalAmount.toLocaleString()} VND</Text>
          </div>
        </Form.Item>

        {usePoints && (
          <Form.Item className="mb-0" name="discountAmount">
            <div className="flex justify-between">
              <Text>Giảm giá từ điểm:</Text>
              <Text className="text-red-500">
                -{discountAmount.toLocaleString()} VND
              </Text>
            </div>
          </Form.Item>
        )}

        <Form.Item className="m-0 font-semibold" name="finalAmount">
          <div className="flex justify-between">
            <Text>Thành tiền:</Text>
            <Text>{finalAmount.toLocaleString()} VND</Text>
          </div>
        </Form.Item>
      </div>

      {/* <Form.Item className="hidden" name="usePoints">
        {usePoints}
      </Form.Item> */}

      <Form.Item className="hidden" name="usedScore">
        {usePoints ? maxUsablePoints : 0}
      </Form.Item>
    </div>
  );
};

export default PaymentForm;
