import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Radio,
  Space,
  Switch,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IStaff, RoleName } from "../../../interfaces";
import { staffService } from "../../../services";

interface UpdateStaffFormProps {
  userToUpdate?: IStaff;
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
  updatedUser: IStaff;
}

const UpdateUserForm: React.FC<UpdateStaffFormProps> = ({
  userToUpdate,
  onCancel,
  viewOnly = false,
}) => {
  const [form] = Form.useForm<IStaff>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userToUpdate) {
      form.setFieldsValue({
        ...userToUpdate,
      });
    }
  }, [userToUpdate, form]);

  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: staffService.create,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("staffs");
        },
      });
      if (data && data.success) {
        console.log("success", data.success);
        onCancel();
        form.resetFields();
        toast.success(data?.message || "Operation successful");
      } else if (data && !data.success) {
        console.log("success", data.success);
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: ({ userId, updatedUser }: UpdateUserArgs) => {
      return staffService.update(userId, updatedUser);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("staffs");
        },
      });
      if (data && data.success) {
        console.log("success", data.success);
        onCancel();
        form.resetFields();
        toast.success(data?.message || "Operation successful");
      } else if (data && !data.success) {
        console.log("success", data.success);
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    return current && dayjs(current).isAfter(dayjs().endOf("day"));
  };

  function handleFinish(values: IStaff) {
    if (userToUpdate) {
      const updatedUser = {
        ...userToUpdate,
        ...values,
      };
      updateUser({ userId: userToUpdate.staffId, updatedUser });
      console.log("updatedUser", updatedUser);
    } else {
      const newUser = {
        ...values,
      };
      createUser(newUser);
    }
  }

  // if (isRolesLoading) {
  //   return <Loading />;
  // }

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
          <Input readOnly={viewOnly} placeholder="Họ, ví dụ PHẠM" />
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
          <Input readOnly={viewOnly} placeholder="Tên đệm & tên, ví dụ VAN A" />
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
            disabled={viewOnly}
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
            disabled={viewOnly}
            className="space-x-4"
            options={genderOptions}
          />
        </Form.Item>
      </div>

      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          label="Trạng thái"
          name="isActivated"
          valuePropName="checked"
        >
          <Switch
            defaultValue={true}
            disabled={viewOnly || userToUpdate?.role.name === RoleName.MANAGER}
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
