import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import toast from "react-hot-toast";
import { customerService } from "../../../services/auth/customer-service";

interface DeleteCustomerProps {
  userId: string;
}

const DeleteCustomer: React.FC<DeleteCustomerProps> = ({ userId }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: customerService.delete,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("customers"),
      });

      toast.success(data.message || "Operation successful");
    },
  });

  function handleConfirmDelete(): void {
    deleteUser(userId);
  }

  return (
    <Popconfirm
      title="Xóa khách hàng này?"
      description="Bạn có chắc muốn xóa khách hàng này?"
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

export default DeleteCustomer;
