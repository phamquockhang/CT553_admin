import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Col, Form, Input, Row, Space, Switch } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Loading from "../../../common/components/Loading";
import { IRole } from "../../../interfaces";
import { permissionService, roleService } from "../../../services";
import RolePermissions from "./RolePermissions";

interface UpdateRoleFormProps {
  roleToUpdate?: IRole;
  onCancel: () => void;
  viewOnly?: boolean;
}

interface UpdateRoleArgs {
  roleId: number;
  updatedRole: IRole;
}

const UpdateRoleForm: React.FC<UpdateRoleFormProps> = ({
  roleToUpdate,
  onCancel,
  viewOnly = false,
}) => {
  const [form] = Form.useForm<IRole>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: permissionService.getAllPermissions,
  });

  const { mutate: createRole, isPending: isCreating } = useMutation({
    mutationFn: roleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("roles");
        },
      });
    },
  });

  const { mutate: updateRole, isPending: isUpdating } = useMutation({
    mutationFn: ({ updatedRole }: UpdateRoleArgs) =>
      roleService.update(updatedRole),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("roles");
        },
      });
    },
  });

  useEffect(() => {
    if (roleToUpdate) {
      form.setFieldsValue({
        ...roleToUpdate,
        permissions: roleToUpdate.permissions.map((permission) => ({
          permissionId: permission.permissionId,
        })),
      });
    }
  }, [roleToUpdate, form]);

  function handleFinish(values: IRole) {
    if (roleToUpdate) {
      const updatedRole = {
        ...roleToUpdate,
        ...form.getFieldsValue(true),
      };
      updateRole(
        { roleId: roleToUpdate.roleId, updatedRole },
        {
          onSuccess: () => {
            toast.success("Cập nhật vai trò thành công");
            onCancel();
            form.resetFields();
          },
          onError: () => {
            toast.error("Cập nhật vai trò thất bại");
          },
        },
      );
    } else {
      if (data?.payload) {
        const newRole = {
          ...values,
          roleName: values.name.toUpperCase(),
          permissions: form.getFieldValue("permissions"),
        };

        createRole(newRole, {
          onSuccess: () => {
            toast.success("Thêm mới vai trò thành công");
            onCancel();
            form.resetFields();
          },
          onError: () => {
            toast.error("Thêm mới vai trò thất bại");
          },
        });
      }
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Form
      onFinish={handleFinish}
      form={form}
      layout="vertical"
      initialValues={{ permissions: [], active: true }}
    >
      <Row>
        <Col span={15}>
          <Form.Item
            label="Tên vai trò"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên vai trò" }]}
          >
            <Input readOnly={viewOnly} className="uppercase" />
          </Form.Item>
        </Col>
        <Col span={8} offset={1}>
          <Form.Item
            label="Trạng thái"
            name="isActivated"
            valuePropName="checked"
          >
            <Switch
              disabled={viewOnly}
              checkedChildren="ACTIVE"
              unCheckedChildren="INACTIVE"
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea readOnly={viewOnly} rows={2} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Card className="mb-5" title="Quyền hạn của vai trò" size="small">
            <RolePermissions
              form={form}
              roleToUpdate={roleToUpdate}
              permissions={data?.payload || []}
              viewOnly={viewOnly}
            />
          </Card>
        </Col>
      </Row>

      {!viewOnly && (
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
            >
              {roleToUpdate ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default UpdateRoleForm;
