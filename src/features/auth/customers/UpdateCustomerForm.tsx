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
import {
  addressPublicApiService,
  addressService,
  customerService,
  scoreService,
} from "../../../services";
import { formatAddressName } from "../../../utils";
import { IAddress } from "../../../interfaces/address";

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
  const [description, setDescription] = useState<string>();

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
      if (data && data.success) {
        toast.success(data?.message || "Operation successful");
        onCancel();
        form.resetFields();
      } else if (data && !data.success)
        toast.error(data?.message || "Operation failed");
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: createAddress } = useMutation({
    mutationFn: ({
      customerId,
      newAddress,
    }: {
      customerId: string;
      newAddress: IAddress;
    }) => {
      return addressService.create(customerId, newAddress);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("addresses");
        },
      });
    },

    onError: (error) => {
      console.log(error);
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
      if (data && data.success) {
        toast.success(data?.message || "Operation successful");
        onCancel();
        form.resetFields();
      } else if (data && !data.success)
        toast.error(data?.message || "Operation failed");
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    return current && dayjs(current).isAfter(dayjs().endOf("day"));
  };

  // const { data: customerIdByEmail } = useQuery({
  //   queryKey: ["customerId", form.getFieldValue("email")],
  //   queryFn: ({ queryKey }) =>
  //     customerService.getCustomerIdByEmail(queryKey[1]),
  // });

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
      createCustomer(newUser, {
        onSuccess: (newCustomer) => {
          // if (newCustomer && newCustomer.success) {
          if (provinceId && districtId && wardCode && description) {
            createAddress({
              // customerId: customerIdByEmail?.payload || "",
              customerId: newCustomer.payload?.customerId || "",
              newAddress: {
                provinceId,
                districtId,
                wardCode,
                description,
                isDefault: true,
              },
            });
          }
          // }
        },
      });
    }
  }

  const { data: scoreData, isLoading: isLoadingScore } = useQuery({
    queryKey: ["scores", userToUpdate?.customerId],
    queryFn: async () => {
      if (userToUpdate) {
        const res = await scoreService.getCurrentScoreByCustomerId(
          userToUpdate?.customerId || "",
        );
        if (res && res.success) {
          return res;
        }
      }
    },
  });

  const { data: addressData, isLoading: isLoadingAddress } = useQuery({
    queryKey: ["addresses", userToUpdate?.customerId],
    queryFn: async () => {
      if (userToUpdate) {
        const res = await addressService.getDefaultAddressByCustomerId(
          userToUpdate?.customerId || "",
        );
        if (res && res.success) {
          return res;
        }
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
        userToUpdate ? addressData?.payload?.provinceId : provinceId,
      );
      return response.data;
    },
  });

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
        userToUpdate ? addressData?.payload?.districtId : districtId,
      );
      return response.data;
    },
  });

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

  if (isLoadingScore || isLoadingAddress) {
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
        {userToUpdate && (
          <Form.Item className="flex-1" label=" ">
            <p className="flex-1">
              Điểm tích lũy:{" "}
              <span className={`font-semibold text-[#003F8F]`}>
                {isLoadingScore
                  ? "0"
                  : scoreData?.success
                    ? scoreData.payload?.newValue
                    : "0"}
              </span>
            </p>
          </Form.Item>
        )}

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

      {userToUpdate ? (
        <div className="flex gap-8">
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
        </div>
      ) : (
        <>
          <div className="flex gap-8">
            <Form.Item
              className="flex-1"
              label="Tỉnh/Thành phố"
              name="provinceId"
              rules={[
                {
                  required: provinceId ? true : false,
                  message: "Vui lòng chọn tỉnh/thành phố",
                },
              ]}
            >
              <Select
                loading={isLoadingProvince}
                allowClear
                showSearch
                placeholder="Chọn tỉnh/thành phố"
                options={provinceOptions}
                filterOption={(input, option) =>
                  (
                    option?.label
                      ?.normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase() ?? ""
                  ).indexOf(
                    input
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase(),
                  ) >= 0
                }
                onSelect={(value: number) => {
                  if (value !== provinceId) {
                    setProvinceId(value);
                    setDistrictId(undefined);
                    setWardCode(undefined);
                    form.setFieldsValue({
                      districtId: undefined,
                      wardCode: undefined,
                    });
                  }
                }}
                onClear={() => {
                  setProvinceId(undefined);
                  setDistrictId(undefined);
                  setWardCode(undefined);
                  form.setFieldsValue({
                    districtId: undefined,
                    wardCode: undefined,
                  });
                }}
              />
            </Form.Item>

            <Form.Item
              className="flex-1"
              label="Quận/Huyện"
              name="districtId"
              rules={[
                {
                  required: provinceId ? true : false,
                  message: "Vui lòng chọn quận/huyện",
                },
              ]}
            >
              <Select
                loading={isLoadingDistrict}
                allowClear
                showSearch
                placeholder="Chọn quận/huyện"
                options={districtOptions}
                filterOption={(input, option) =>
                  (
                    option?.label
                      ?.normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase() ?? ""
                  ).indexOf(
                    input
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase(),
                  ) >= 0
                }
                onSelect={(value: number) => {
                  if (value !== districtId) {
                    setDistrictId(value);
                    setWardCode(undefined);
                    form.setFieldsValue({
                      wardCode: undefined,
                    });
                  }
                }}
                onClear={() => {
                  setDistrictId(undefined);
                  setWardCode(undefined);
                  form.setFieldsValue({
                    wardCode: undefined,
                  });
                }}
              />
            </Form.Item>
          </div>

          <div className="flex gap-8">
            <Form.Item
              className="flex-1"
              label="Phường/Xã"
              name="wardCode"
              rules={[
                {
                  required: provinceId ? true : false,
                  message: "Vui lòng chọn phường/xã",
                },
              ]}
            >
              <Select
                loading={isLoadingWard}
                allowClear
                showSearch
                placeholder="Chọn phường/xã"
                options={wardOptions}
                filterOption={(input, option) =>
                  (
                    option?.label
                      ?.normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase() ?? ""
                  ).indexOf(
                    input
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase(),
                  ) >= 0
                }
                onSelect={(value: string) => {
                  setWardCode(value);
                }}
              />
            </Form.Item>

            <Form.Item
              className="flex-1"
              label="Địa chỉ chi tiết"
              name="description"
              rules={[
                {
                  required: provinceId ? true : false,
                  message: "Vui lòng nhập địa chỉ chi tiết",
                },
              ]}
            >
              <Input
                allowClear
                placeholder="Địa chỉ chi tiết"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>
          </div>
        </>
      )}
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
