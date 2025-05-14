import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { DiscountType, IVoucher } from "../../../../interfaces";
import {
  translateDiscountType,
  translateVoucherStatus,
} from "../../../../utils";
import { useValidVoucherStatuses, useVoucherService } from "../hooks";

interface ViewVoucherFormProps {
  voucherToUpdate?: IVoucher;
  onCancel: () => void;
}

const UpdateVoucherForm: React.FC<ViewVoucherFormProps> = ({
  voucherToUpdate,
  onCancel,
}) => {
  console.log("voucherToUpdate", voucherToUpdate);
  const [form] = Form.useForm<IVoucher>();
  const queryClient = useQueryClient();
  const { updateVoucher, isUpdatingVoucher, isCreatingVoucher } =
    useVoucherService();

  useEffect(() => {
    if (voucherToUpdate) {
      form.setFieldsValue({
        ...voucherToUpdate,
        discountType: voucherToUpdate.discountType,
      });
    }
  }, [voucherToUpdate, form]);

  const discountType = Form.useWatch("discountType", form);
  const usedCount = Form.useWatch("usedCount", form);

  const voucherStatusOption = useValidVoucherStatuses(
    voucherToUpdate?.status,
  ).map((status) => (
    <Select.Option key={status} value={status}>
      {translateVoucherStatus(status)}
    </Select.Option>
  ));
  const discountTypeOption = Object.values(DiscountType).map((type) => (
    <Select.Option key={type} value={type}>
      {translateDiscountType(type)}
    </Select.Option>
  ));

  async function handleFinish(values: IVoucher) {
    if (voucherToUpdate) {
      const updatedValues = {
        ...values,
        voucherId: voucherToUpdate.voucherId,
        startDate: values.dateRange ? values?.dateRange[0] : "",
        endDate: values.dateRange ? values?.dateRange[1] : "",
      };

      console.log("updatedValues", updatedValues);

      updateVoucher(
        {
          voucherId: voucherToUpdate.voucherId,
          updatedVoucher: updatedValues,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              predicate: (query) => {
                return (
                  query.queryKey.includes("vouchers") ||
                  query.queryKey.includes("voucher")
                );
              },
            });

            onCancel();
          },
          onError: () => {
            toast.error("Failed to update voucher");
          },
        },
      );
    }
  }

  const usedPercentage = parseFloat(
    (
      ((voucherToUpdate?.usedCount ?? 0) / (voucherToUpdate?.usageLimit ?? 1)) *
      100
    ).toFixed(2),
  );

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      <div className="flex gap-8">
        <Form.Item name="voucherCode" className="flex-1" label="Mã Voucher">
          <Input disabled />
        </Form.Item>

        <Form.Item name="status" className="flex-1" label="Trạng thái">
          <Select>{voucherStatusOption}</Select>
        </Form.Item>
      </div>

      <div className="flex gap-8">
        <Form.Item className="flex-1" name="discountType" label="Loại giảm giá">
          <Select disabled>{discountTypeOption}</Select>
        </Form.Item>

        <Form.Item className="flex-1" name="discountValue" label="Giá trị giảm">
          <InputNumber
            className="w-full"
            disabled
            min={0}
            max={discountType === DiscountType.PERCENTAGE ? 100 : undefined}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            addonAfter={discountType === DiscountType.PERCENTAGE ? "%" : "VND"}
          />
        </Form.Item>
      </div>

      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          name="minOrderValue"
          label="Giá trị đơn hàng tối thiểu"
        >
          <InputNumber
            className="w-full"
            disabled
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            addonAfter="VND"
          />
        </Form.Item>

        <Form.Item className="flex-1" name="maxDiscount" label="Giảm tối đa">
          <InputNumber
            className="w-full"
            disabled
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            addonAfter="VND"
            // placeholder="Không có"
          />
        </Form.Item>
      </div>

      <Form.Item
        className="flex-1"
        name="dateRange"
        label="Thời gian áp dụng"
        // rules={[{ required: true, message: "Vui lòng chọn khoảng thời gian" }]}
        getValueProps={(value: [string, string]) => ({
          value: value ? [dayjs(value[0]), dayjs(value[1])] : undefined,
        })}
        normalize={(value: [Dayjs, Dayjs]) =>
          value
            ? [
                value[0].tz().format("YYYY-MM-DD"),
                value[1].tz().format("YYYY-MM-DD"),
              ]
            : undefined
        }
        initialValue={[
          dayjs(voucherToUpdate?.startDate),
          dayjs(voucherToUpdate?.endDate),
        ]}
      >
        <DatePicker.RangePicker
          disabled
          className="w-full"
          format="DD/MM/YYYY"
        />
      </Form.Item>

      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          name="usageLimit"
          label="Giới hạn sử dụng"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng giới hạn" },
          ]}
        >
          <InputNumber
            className="w-full"
            //   min={1}
            min={usedCount}
            addonAfter="lượt"
          />
        </Form.Item>

        <Form.Item
          className="flex-1"
          name="usedCount"
          label={`Đã sử dụng: ${usedPercentage}%`}
        >
          <InputNumber className="w-full" disabled addonAfter="lượt" />
        </Form.Item>
      </div>

      <Form.Item className="text-right">
        <Space>
          <Button
            disabled={isCreatingVoucher || isUpdatingVoucher}
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreatingVoucher || isUpdatingVoucher}
          >
            {voucherToUpdate ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UpdateVoucherForm;
