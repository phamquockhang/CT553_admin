import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Space } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IItem } from "../../../interfaces";
import { itemService } from "../../../services/booking";
import FormItemAddItem from "./components/FormItemAddItem";
import FormItemAddProduct from "./components/FormItemAddProduct";
import ProductsOfItem from "./components/ProductsOfItem";

interface UpdateItemFormProps {
  itemToUpdate?: IItem;
  onCancel: () => void;
  viewOnly?: boolean;
}

interface UpdateItemArgs {
  itemId: number;
  updatedItem: IItem;
}

const UpdateItemForm: React.FC<UpdateItemFormProps> = ({
  itemToUpdate,
  onCancel,
  viewOnly = false,
}) => {
  const [form] = Form.useForm<IItem>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (itemToUpdate) {
      form.setFieldsValue({
        ...itemToUpdate,
      });
    }
  }, [itemToUpdate, form]);

  console.log("form", form.getFieldsValue());

  const { mutate: createItem, isPending: isCreating } = useMutation({
    mutationFn: itemService.create,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("items");
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

  const { mutate: updateItem, isPending: isUpdating } = useMutation({
    mutationFn: ({ itemId, updatedItem }: UpdateItemArgs) => {
      return itemService.update(itemId, updatedItem);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("items");
        },
      });
      if (data && data.success) {
        // console.log("success", data.success);
        onCancel();
        form.resetFields();
        toast.success(data?.message || "Operation successful");
      } else if (data && !data.success) {
        // console.log("success", data.success);
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  function handleFinish(values: IItem) {
    if (itemToUpdate) {
      const updatedItem = {
        ...itemToUpdate,
        ...values,
        itemName: values.itemName,
        isActivated: values.isActivated,
      };
      updateItem({ itemId: itemToUpdate.itemId, updatedItem: updatedItem });
    } else {
      const newItem = {
        ...values,
        name: values.itemName,
        isActivated: values.isActivated,
      };
      createItem(newItem);
    }
  }

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      initialValues={{ active: true, products: [{}] }}
    >
      <FormItemAddItem viewOnly={viewOnly} />

      <FormItemAddProduct viewOnly={viewOnly} />

      <ProductsOfItem itemToUpdate={itemToUpdate} />

      {!viewOnly && (
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Space>
            <Button onClick={onCancel}>Hủy</Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
            >
              {itemToUpdate ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default UpdateItemForm;
