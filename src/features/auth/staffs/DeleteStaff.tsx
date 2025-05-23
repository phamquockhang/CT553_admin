import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import toast from "react-hot-toast";
import { staffService } from "../../../services";

interface DeleteStaffProps {
  userId: string;
}

const DeleteStaff: React.FC<DeleteStaffProps> = ({ userId }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: staffService.delete,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("staffs"),
      });

      toast.success(data.message || "Operation successful");
    },
  });

  function handleConfirmDelete(): void {
    deleteUser(userId);
  }

  return (
    <Popconfirm
      title="Xóa nhân viên này?"
      description="Bạn có chắc muốn xóa nhân viên này không?"
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true, loading: isDeleting }}
      onConfirm={handleConfirmDelete}
    >
      <Tooltip title="Xóa">
        <DeleteOutlined className="text-xl text-[#ff4d4f]" />
      </Tooltip>
    </Popconfirm>
  );
};

export default DeleteStaff;
