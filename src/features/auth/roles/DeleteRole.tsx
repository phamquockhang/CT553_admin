import { Popconfirm, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface DeleteRoleProps {
  roleId: number;
}

const DeleteRole: React.FC<DeleteRoleProps> = ({ roleId }) => {
  return (
    <Popconfirm
      title="Xóa vai trò"
      description="Bạn có chắc muốn xóa vai trò này không?"
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
      onConfirm={() => console.log(`Delete role with ID: ${roleId}`)}
    >
      <Tooltip title="Xóa">
        <DeleteOutlined className="text-xl text-[#ff4d4f]" />
      </Tooltip>
    </Popconfirm>
  );
};

export default DeleteRole;
