import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import toast from "react-hot-toast";
import { itemService } from "../../../services";

interface DeleteItemProps {
  itemId: string;
}

const DeleteItem: React.FC<DeleteItemProps> = ({ itemId }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: itemService.delete,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("items"),
      });

      toast.success(data.message || "Operation successful");
    },
  });

  function handleConfirmDelete(): void {
    deleteUser(itemId);
  }

  return (
    <Popconfirm
      title="Xóa mặt hàng này?"
      description="Bạn có chắc muốn xóa mặt hàng này?"
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

export default DeleteItem;
