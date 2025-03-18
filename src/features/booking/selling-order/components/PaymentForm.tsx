import { InfoCircleOutlined } from "@ant-design/icons";
import { Alert, Checkbox, Form, FormInstance, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  DiscountType,
  ICustomer,
  ISellingOrderDetail,
  IVoucher,
  POINT_VALUE,
} from "../../../../interfaces";
import ValidVouchers from "./ValidVouchers";

const { Title, Text } = Typography;

interface PaymentFormProps {
  form: FormInstance;
  selectedProductsDetails: ISellingOrderDetail[];
  choosenCustomer?: ICustomer;
  useVoucher: IVoucher | undefined;
  setUseVoucher: React.Dispatch<React.SetStateAction<IVoucher | undefined>>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  form,
  selectedProductsDetails,
  choosenCustomer,
  useVoucher,
  setUseVoucher,
}) => {
  // console.log("choosenCustomer", choosenCustomer);
  const [basicOrderTotal, setBasicOrderTotal] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const maxPointsAvailable = choosenCustomer?.score?.newValue || 0;

  // Maximum usable points based on order value
  const [maxUsableScores, setMaxUsableScores] = useState(0);
  const [scoreDiscount, setScoreDiscount] = useState(0);
  const [finalAmountAfterScoreDiscount, setFinalAmountAfterScoreDiscount] =
    useState(0);

  const [voucherDiscount, setVoucherDiscount] = useState(0);

  useEffect(() => {
    const newBasicOrderTotal = selectedProductsDetails.reduce(
      (total, product) => total + product.totalPrice,
      0,
    );
    setBasicOrderTotal(newBasicOrderTotal);
    form.setFieldsValue({ totalAmount: newBasicOrderTotal });

    // Calculate maximum usable points based on order value
    const newMaxUsablePoints = Math.min(
      maxPointsAvailable,
      Math.floor(newBasicOrderTotal / POINT_VALUE),
    );
    setMaxUsableScores(newMaxUsablePoints);

    // Calculate discount and final amount when total amount or usePoints changes
    const calculatedScoreDiscount = newMaxUsablePoints * POINT_VALUE;
    if (usePoints) {
      setScoreDiscount(calculatedScoreDiscount);
      setFinalAmountAfterScoreDiscount(
        newBasicOrderTotal - calculatedScoreDiscount,
      );
    } else {
      setScoreDiscount(0);
      setFinalAmountAfterScoreDiscount(newBasicOrderTotal);
    }

    if (useVoucher) {
      if (usePoints) {
        if (useVoucher.discountType === DiscountType.PERCENTAGE) {
          const discountValueByPercentage =
            (newBasicOrderTotal - scoreDiscount) *
            (useVoucher.discountValue / 100);
          if (
            useVoucher.maxDiscount &&
            discountValueByPercentage > useVoucher.maxDiscount
          ) {
            setVoucherDiscount(useVoucher.maxDiscount);
          } else {
            setVoucherDiscount(discountValueByPercentage);
          }
        } else {
          setVoucherDiscount(useVoucher.discountValue);
        }
      } else {
        if (useVoucher.discountType === DiscountType.PERCENTAGE) {
          const discountValueByPercentage =
            newBasicOrderTotal * (useVoucher.discountValue / 100);
          if (
            useVoucher.maxDiscount &&
            discountValueByPercentage > useVoucher.maxDiscount
          ) {
            setVoucherDiscount(useVoucher.maxDiscount);
          } else {
            setVoucherDiscount(discountValueByPercentage);
          }
        } else {
          setVoucherDiscount(useVoucher.discountValue);
        }
      }
    } else {
      setVoucherDiscount(0);
    }
  }, [
    selectedProductsDetails,
    maxPointsAvailable,
    usePoints,
    form,
    useVoucher,
    scoreDiscount,
  ]);

  useEffect(() => {
    // Update form values when discount changes
    form.setFieldsValue({
      usedScore: usePoints ? maxUsableScores : 0,
    });
  }, [maxUsableScores, usePoints, form]);

  const handleUsePointsChange = (checked: boolean) => {
    setUsePoints(checked);

    if (checked) {
      const calculatedDiscount = maxUsableScores * POINT_VALUE;
      setScoreDiscount(calculatedDiscount);
      setFinalAmountAfterScoreDiscount(basicOrderTotal - calculatedDiscount);
    } else {
      setScoreDiscount(0);
      setFinalAmountAfterScoreDiscount(basicOrderTotal);
    }
  };

  // Format the points for display
  const formattedUsablePoints = maxUsableScores.toLocaleString();
  const formattedAvailablePoints = maxPointsAvailable.toLocaleString();
  const discountValue = (maxUsableScores * POINT_VALUE).toLocaleString();

  // Check if we're using partial points
  const isPartialPointsUsage = maxUsableScores < maxPointsAvailable;

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
                disabled={!maxPointsAvailable || maxUsableScores === 0}
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

        <ValidVouchers
          totalAmount={basicOrderTotal}
          useVoucher={useVoucher}
          setUseVoucher={setUseVoucher}
        />
      </div>

      <div className="border-t pt-4">
        <Form.Item className="mb-0" name="totalAmount">
          <div className="flex justify-between">
            <Text>
              Tổng tiền hàng{" "}
              <span className="font-normal italic">(trước VAT):</span>
            </Text>
            <Text>{basicOrderTotal.toLocaleString()} VND</Text>
          </div>
        </Form.Item>

        {usePoints && (
          <Form.Item className="mb-0" name="discountAmount">
            <div className="flex justify-between">
              <Text>Giảm giá từ điểm:</Text>
              <Text className="text-red-500">
                -{scoreDiscount.toLocaleString()} VND
              </Text>
            </div>
          </Form.Item>
        )}

        {useVoucher && (
          <Form.Item className="mb-0">
            <div className="flex justify-between">
              <Text>Giảm giá từ voucher:</Text>
              <Text className="text-red-500">
                -{voucherDiscount.toLocaleString()} VND
              </Text>
            </div>
          </Form.Item>
        )}

        <Form.Item className="m-0 font-semibold" name="finalAmount">
          <div className="flex justify-between">
            <Text>
              Thành tiền <span className="font-normal italic">(sau VAT):</span>
            </Text>
            <Text>
              {(
                finalAmountAfterScoreDiscount - voucherDiscount
              ).toLocaleString()}{" "}
              VND
            </Text>
          </div>
        </Form.Item>
      </div>

      {/* <Form.Item className="hidden" name="usePoints">
        {usePoints}
      </Form.Item> */}

      <Form.Item className="hidden" name="usedScore">
        {usePoints ? maxUsableScores : 0}
      </Form.Item>
    </div>
  );
};

export default PaymentForm;
