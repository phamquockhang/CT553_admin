import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import toast from "react-hot-toast";
import { productService } from "../../../services";

interface DeleteProductProps {
  productId: number;
  setIsDeleting: (isDeleting: boolean) => void;
}

const DeleteProduct: React.FC<DeleteProductProps> = ({
  productId,
  setIsDeleting,
}) => {
  const queryClient = useQueryClient();

  const { mutate: deleteUser } = useMutation({
    mutationFn: productService.delete,

    onSuccess: (data) => {
      setIsDeleting(false);

      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("items") ||
          query.queryKey.includes("item") ||
          query.queryKey.includes("allItems") ||
          query.queryKey.includes("products") ||
          query.queryKey.includes("product"),
      });

      toast.success(data.message || "Operation successful");
    },
  });

  function handleConfirmDelete(): void {
    setIsDeleting(true);
    deleteUser(productId);
  }

  return (
    <Popconfirm
      title="Xóa sản phẩm này?"
      description={
        <span>
          Bạn có chắc muốn xóa sản phẩm này?
          <p className="text-red-500">
            Lưu ý: Xóa sản phẩm sẽ không thể khôi phục.
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

export default DeleteProduct;
