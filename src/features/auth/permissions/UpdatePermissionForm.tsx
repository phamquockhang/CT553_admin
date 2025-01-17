import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IPermission, Method, Module } from "../../../interfaces";
import { permissionService } from "../../../services";

interface UpdatePermissionFormProps {
  permissionToUpdate?: IPermission;
  onCancel: () => void;
  viewOnly?: boolean;
}

const methodOptions = Object.values(Method).map((method: string) => ({
  value: method,
  label: method,
}));

const moduleOptions = Object.values(Module).map((module: string) => ({
  value: module,
  label: module,
}));

interface UpdatePermissionArgs {
  updatedPermission: IPermission;
}

const UpdatePermissionForm: React.FC<UpdatePermissionFormProps> = ({
  permissionToUpdate,
  onCancel,
}) => {
  const [form] = Form.useForm<IPermission>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (permissionToUpdate) {
      form.setFieldsValue({
        ...permissionToUpdate,
      });
    }
  }, [permissionToUpdate, form]);

  const { mutate: createPermission, isPending: isCreating } = useMutation({
    mutationFn: permissionService.create,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("permissions");
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

  const { mutate: updatePermission, isPending: isUpdating } = useMutation({
    mutationFn: ({ updatedPermission }: UpdatePermissionArgs) => {
      return permissionService.update(updatedPermission);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("permissions");
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

  function handleFinish(values: IPermission) {
    if (permissionToUpdate) {
      const updatedPermission = {
        ...permissionToUpdate,
        ...values,
        // firstName: values.firstName.toUpperCase(),
        // lastName: values.lastName.toUpperCase(),
      };
      updatePermission({
        updatedPermission: updatedPermission,
      });
    } else {
      const newPermission = {
        ...values,
        // firstName: values.firstName.toUpperCase(),
        // lastName: values.lastName.toUpperCase(),
      };
      createPermission(newPermission);
    }
  }

  // if (isRolesLoading) {
  //   return <Loading />;
  // }

  return (
    <Form onFinish={handleFinish} layout="vertical" form={form}>
      <Row>
        <Col span={24}>
          <Form.Item
            label="Tên quyền hạn"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên quyền hạn không được để trống",
              },
            ]}
          >
            <Input placeholder="Ví dụ: Lấy danh sách nhân viên..." />
          </Form.Item>
          <Form.Item
            label="Đường dẫn API"
            name="apiPath"
            rules={[
              {
                required: true,
                message: "Đường dẫn API không được để trống",
              },
            ]}
          >
            <Input placeholder="Ví dụ: /api/v1/staffs" />
          </Form.Item>
          <Form.Item
            label="Phương thức"
            name="method"
            rules={[
              { required: true, message: "Phương thức không được để trống" },
            ]}
          >
            <Select
              allowClear
              options={methodOptions}
              placeholder="Chọn phương thức"
            />
          </Form.Item>
          <Form.Item
            label="Module"
            name="module"
            rules={[{ required: true, message: "Module không được để trống" }]}
          >
            <Select
              allowClear
              options={moduleOptions}
              placeholder="Chọn module"
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
        <Space>
          <Button onClick={onCancel}>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating || isUpdating}
          >
            {permissionToUpdate ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UpdatePermissionForm;
