import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  InputNumber,
  Select,
  Space,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { DiscountType, IVoucher } from "../../../../interfaces";
import { translateDiscountType } from "../../../../utils";
import { useVoucherService } from "../hooks";

interface AddVoucherFormProps {
  onCancel: () => void;
}

const AddVoucherForm: React.FC<AddVoucherFormProps> = ({ onCancel }) => {
  const [form] = Form.useForm<IVoucher>();
  const queryClient = useQueryClient();
  const { createVoucher, isUpdatingVoucher, isCreatingVoucher } =
    useVoucherService();

  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    return current && dayjs(current).isBefore(dayjs().endOf("day"));
  };

  const discountType = Form.useWatch("discountType", form);

  const discountTypeOption = Object.values(DiscountType).map((type) => (
    <Select.Option key={type} value={type}>
      {translateDiscountType(type)}
    </Select.Option>
  ));

  async function handleFinish(values: IVoucher) {
    const createdValues = {
      discountType: values.discountType,
      discountValue: values.discountValue,
      minOrderValue: values.minOrderValue,
      ...(values.maxDiscount !== undefined && {
        maxDiscount: values.maxDiscount,
      }),
      startDate: values.dateRange ? values?.dateRange[0] : "",
      endDate: values.dateRange ? values?.dateRange[1] : "",
      usageLimit: values.usageLimit,
    };

    console.log("createdValues", createdValues);

    createVoucher(createdValues, {
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
    });
  }

  const initialValues = {
    // status: VoucherStatus.ACTIVE,
    discountType: DiscountType.PERCENTAGE,
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      <div className="flex gap-8">
        <Form.Item className="flex-1" name="discountType" label="Loại giảm giá">
          <Select placeholder="Chọn loại giảm giá">{discountTypeOption}</Select>
        </Form.Item>

        <Form.Item
          className="flex-1"
          name="discountValue"
          label="Giá trị giảm"
          rules={[
            { required: true, message: "Vui lòng nhập giá trị giảm giá" },
          ]}
        >
          <InputNumber
            className="w-full"
            min={0}
            max={discountType === DiscountType.PERCENTAGE ? 100 : undefined}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            addonAfter={discountType === DiscountType.PERCENTAGE ? "%" : "VND"}
            placeholder="Nhập giá trị giảm giá"
          />
        </Form.Item>
      </div>

      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          name="minOrderValue"
          label="Giá trị đơn hàng tối thiểu"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập giá trị đơn hàng tối thiểu",
            },
          ]}
        >
          <InputNumber
            className="w-full"
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            addonAfter="VND"
            placeholder="Nhập giá trị đơn hàng tối thiểu"
          />
        </Form.Item>

        <Form.Item className="flex-1" name="maxDiscount" label="Giảm tối đa">
          <InputNumber
            className="w-full"
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            addonAfter="VND"
            placeholder="Nhập giá trị giảm tối đa (nếu cần)"
          />
        </Form.Item>
      </div>

      <Form.Item
        className="flex-1"
        name="dateRange"
        label="Thời gian áp dụng"
        rules={[{ required: true, message: "Vui lòng chọn khoảng thời gian" }]}
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
      >
        <DatePicker.RangePicker
          className="w-full"
          format="DD/MM/YYYY"
          disabledDate={disabledDate}
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
          <InputNumber className="w-1/3" min={1} addonAfter="lượt" />
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
            Thêm mới
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddVoucherForm;
