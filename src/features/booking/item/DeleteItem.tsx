import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import toast from "react-hot-toast";
import { itemService } from "../../../services";

interface DeleteItemProps {
  itemId: number;
  setIsDeleting: (isDeleting: boolean) => void;
}

const DeleteItem: React.FC<DeleteItemProps> = ({ itemId, setIsDeleting }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteUser } = useMutation({
    mutationFn: itemService.delete,

    onSuccess: (data) => {
      setIsDeleting(false);

      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("items"),
      });

      toast.success(data.message || "Operation successful");
    },
  });

  function handleConfirmDelete(): void {
    setIsDeleting(true);
    deleteUser(itemId);
  }

  return (
    <Popconfirm
      title="Xóa mặt hàng này?"
      description={
        <span>
          Bạn có chắc muốn xóa mặt hàng này?
          <p className="text-red-500">
            Lưu ý: Xóa mặt hàng sẽ xóa tất cả các sản phẩm liên quan và không
            thể khôi phục.
          </p>
        </span>
      }
      okText="Xóa"
      cancelText="Hủy"
      // okButtonProps={{ danger: true, loading: isDeleting }}
      okButtonProps={{ danger: true }}
      onConfirm={handleConfirmDelete}
    >
      <Tooltip title="Xóa">
        <DeleteOutlined className="text-xl text-[#ff4d4f]" />
      </Tooltip>
    </Popconfirm>
  );
};

export default DeleteItem;
