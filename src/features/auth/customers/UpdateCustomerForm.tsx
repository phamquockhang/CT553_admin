import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Switch,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../../common/components/Loading";
import { ICustomer } from "../../../interfaces";
import { scoreService } from "../../../services";
import { addressPublicApiService } from "../../../services/address/address-publicApi-service";
import { addressService } from "../../../services/address/address-service";
import { customerService } from "../../../services/auth/customer-service";
import { formatAddressName } from "../../../utils";

interface UpdateCustomerFormProps {
  userToUpdate?: ICustomer;
  onCancel: () => void;
  viewOnly?: boolean;
}

const genderOptions = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
];

interface UpdateUserArgs {
  userId: string;
  updatedUser: ICustomer;
}

const UpdateUserForm: React.FC<UpdateCustomerFormProps> = ({
  userToUpdate,
  onCancel,
  viewOnly = false,
}) => {
  const [form] = Form.useForm<ICustomer>();
  const queryClient = useQueryClient();
  const [provinceId, setProvinceId] = useState<number>();
  const [districtId, setDistrictId] = useState<number>();
  const [wardCode, setWardCode] = useState<string>();

  useEffect(() => {
    if (userToUpdate) {
      form.setFieldsValue({
        ...userToUpdate,
      });
    }
  }, [userToUpdate, form]);

  const { mutate: createCustomer, isPending: isCreating } = useMutation({
    mutationFn: customerService.create,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("customers");
        },
      });
      toast.success(data.message || "Operation successful");

      onCancel();
      form.resetFields();
    },

    onError: (error: { response?: { data?: { message?: string } } }) => {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred");
      }
    },
  });

  const { mutate: updateCustomer, isPending: isUpdating } = useMutation({
    mutationFn: ({ userId, updatedUser }: UpdateUserArgs) => {
      return customerService.update(userId, updatedUser);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("customers");
        },
      });
      toast.success(data.message || "Operation successful");

      onCancel();
      form.resetFields();
    },

    onError: (error: { response?: { data?: { message?: string } } }) => {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred");
      }
    },
  });

  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    return current && dayjs(current).isAfter(dayjs().endOf("day"));
  };

  function handleFinish(values: ICustomer) {
    if (userToUpdate) {
      const updatedUser = {
        ...userToUpdate,
        ...values,
      };
      updateCustomer({ userId: userToUpdate.customerId, updatedUser });
    } else {
      const newUser = {
        ...values,
      };
      createCustomer(newUser);
    }
  }

  const { data: scoreData, isLoading: isLoadingScore } = useQuery({
    queryKey: ["scores", userToUpdate?.customerId],
    queryFn: async () => {
      const res = await scoreService.getCurrentScoreByCustomerId(
        userToUpdate?.customerId || "",
      );
      if (res && res.success) {
        return res;
      }
    },
  });

  const { data: addressData, isLoading: isLoadingAddress } = useQuery({
    queryKey: ["addresses", userToUpdate?.customerId],
    queryFn: async () => {
      const res = await addressService.getDefaultAddressByCustomerId(
        userToUpdate?.customerId || "",
      );
      if (res && res.success) {
        return res;
      }
    },
  });

  const { data: provinceData, isLoading: isLoadingProvince } = useQuery({
    queryKey: ["province"],
    queryFn: async () => {
      const response = await addressPublicApiService.getProvinces();
      return response.data;
    },
  });

  const provinceOptions = provinceData?.map((province) => ({
    value: province.ProvinceID,
    label: province.ProvinceName,
  }));

  const { data: districtData, isLoading: isLoadingDistrict } = useQuery({
    queryKey: [
      "district",
      userToUpdate ? addressData?.payload?.provinceId : provinceId,
    ],
    queryFn: async () => {
      const response = await addressPublicApiService.getDistricts(
        addressData?.payload?.provinceId,
      );
      return response.data;
    },
  });

  console.log("provinceId", provinceId);
  console.log("districtId", districtId);
  console.log("wardCode", wardCode);

  const districtOptions = districtData?.map((district) => ({
    value: district.DistrictID,
    label: district.DistrictName,
  }));

  const { data: wardData, isLoading: isLoadingWard } = useQuery({
    queryKey: [
      "ward",
      userToUpdate ? addressData?.payload?.districtId : districtId,
    ],
    queryFn: async () => {
      const response = await addressPublicApiService.getWards(
        addressData?.payload?.districtId,
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (userToUpdate) {
      setProvinceId(addressData?.payload?.provinceId);
      setDistrictId(addressData?.payload?.districtId);
      setWardCode(addressData?.payload?.wardCode);
    }
  }, [provinceId, districtId, wardCode]);

  const wardOptions = wardData?.map((ward) => ({
    value: ward.WardCode,
    label: ward.WardName,
  }));

  const formattedAddress = formatAddressName(
    addressData?.payload?.provinceId,
    addressData?.payload?.districtId,
    addressData?.payload?.wardCode,
    addressData?.payload?.description,
    provinceData,
    districtData,
    wardData,
  );

  if (
    isLoadingScore ||
    isLoadingAddress ||
    isLoadingProvince ||
    isLoadingDistrict ||
    isLoadingWard
  ) {
    return <Loading />;
  }

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      initialValues={{ active: true }}
    >
      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          label="Họ"
          name="lastName"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập họ",
            },
            {
              // vietnamese name has anccent characters
              pattern:
                /^[a-zA-ZăâđêôơưàảãáạăằẳẵắặâầẩẫấậèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵĂÂĐÊÔƠƯÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚOỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ\s]+$/,
              message: "Họ không chứa ký tự đặc biệt",
            },
          ]}
        >
          <Input
            readOnly={userToUpdate != undefined || viewOnly}
            placeholder="Họ, ví dụ PHẠM"
          />
        </Form.Item>

        <Form.Item
          className="flex-1"
          label="Tên đệm & tên"
          name="firstName"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên đệm & tên",
            },
            {
              pattern:
                /^[a-zA-ZăâđêôơưàảãáạăằẳẵắặâầẩẫấậèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵĂÂĐÊÔƠƯÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚOỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ\s]+$/,
              message: "Tên đệm & tên không chứa ký tự đặc biệt",
            },
          ]}
        >
          <Input
            readOnly={userToUpdate != undefined || viewOnly}
            placeholder="Tên đệm & tên, ví dụ VAN A"
          />
        </Form.Item>
      </div>

      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          label="Ngày sinh"
          name="dob"
          rules={[
            {
              required: true,
              message: "Ngày sinh không hợp lệ",
            },
          ]}
          getValueProps={(value: string) => ({
            value: value && dayjs(value),
          })}
          normalize={(value: Dayjs) => value && value.tz().format("YYYY-MM-DD")}
        >
          <DatePicker
            disabled={userToUpdate != undefined || viewOnly}
            className="w-full"
            format="DD/MM/YYYY"
            disabledDate={disabledDate}
            placeholder="Chọn ngày sinh"
          />
        </Form.Item>

        <Form.Item
          className="flex-1"
          label="Giới tính"
          name="gender"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn giới tính",
            },
          ]}
        >
          <Radio.Group
            disabled={userToUpdate != undefined || viewOnly}
            className="space-x-4"
            options={genderOptions}
          />
        </Form.Item>
      </div>

      <div className="flex gap-8">
        <Form.Item className="flex-1" label=" ">
          <p className="flex-1">
            Điểm tích lũy:{" "}
            <span className="font-semibold text-blue-800">
              {isLoadingScore
                ? "0"
                : scoreData?.success
                  ? scoreData.payload?.newValue
                  : "0"}
            </span>
          </p>
        </Form.Item>

        <Form.Item
          className="flex-1"
          label="Trạng thái"
          name="isActivated"
          valuePropName="checked"
        >
          <Switch
            defaultValue={true}
            disabled={viewOnly}
            checkedChildren="ACTIVE"
            unCheckedChildren="INACTIVE"
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
              required: true,
              message: "Vui lòng nhập email",
            },
            {
              type: "email",
              message: "Email không hợp lệ",
            },
          ]}
        >
          <Input
            readOnly={userToUpdate != undefined || viewOnly}
            placeholder="Email"
          />
        </Form.Item>

        {!userToUpdate && (
          <Form.Item
            className="flex-1"
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu",
              },
              {
                min: 6,
                message: "Mật khẩu phải chứa ít nhất 6 ký tự",
              },
            ]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
        )}
      </div>

      <div className="flex gap-8">
        {userToUpdate ? (
          <Form.Item className="flex-1" label="Địa chỉ">
            <Input
              readOnly={userToUpdate != undefined || viewOnly}
              value={
                addressData?.payload?.description
                  ? formattedAddress
                  : "Chưa cập nhật địa chỉ"
              }
            />
          </Form.Item>
        ) : (
          <>
            <Form.Item
              className="flex-1"
              label="Tỉnh/Thành phố"
              name="provinceId"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn tỉnh/thành phố",
                },
              ]}
            >
              <Select
                disabled={userToUpdate != undefined || viewOnly}
                placeholder="Chọn tỉnh/thành phố"
                options={provinceOptions}
                onSelect={(value) => {
                  setProvinceId(value as number);
                }}
              />
            </Form.Item>

            <Form.Item
              className="flex-1"
              label="Quận/Huyện"
              name="districtId"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn quận/huyện",
                },
              ]}
            >
              <Select
                disabled={userToUpdate != undefined || viewOnly}
                placeholder="Chọn quận/huyện"
                options={districtOptions}
                onSelect={(value) => {
                  setDistrictId(value as number);
                }}
              />
            </Form.Item>

            <Form.Item
              className="flex-1"
              label="Phường/Xã"
              name="wardCode"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn phường/xã",
                },
              ]}
            >
              <Select
                disabled={userToUpdate != undefined || viewOnly}
                placeholder="Chọn phường/xã"
                options={wardOptions}
                onSelect={(value) => {
                  setWardCode(value as string);
                }}
              />
            </Form.Item>
          </>
        )}
      </div>

      {!viewOnly && (
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Space>
            <Button onClick={onCancel}>Hủy</Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
            >
              {userToUpdate ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default UpdateUserForm;
