import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, Row, Space, Switch } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IItem } from "../../../interfaces";
import { itemService } from "../../../services/booking";

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

  function handleFinish(values: IItem) {
    if (itemToUpdate) {
      const updatedItem = {
        ...itemToUpdate,
        ...values,
      };
      updateItem({ itemId: itemToUpdate.itemId, updatedItem: updatedItem });
      console.log("updatedUser", updatedItem);
    } else {
      const newItem = {
        ...values,
      };
      createItem(newItem);
    }
  }

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
          label="Tên mặt hàng"
          name="name"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên mặt hàng",
            },
            {
              // vietnamese name has anccent characters
              pattern:
                /^[0-9a-zA-ZăâđêôơưàảãáạăằẳẵắặâầẩẫấậèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵĂÂĐÊÔƠƯÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚOỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ\s]+$/,
              message: "Tên mặt hàng không chứa ký tự đặc biệt",
            },
          ]}
        >
          <Input
            readOnly={viewOnly}
            placeholder="Tên mặt hàng, ví dụ: Tôm, Cua, ..."
          />
        </Form.Item>

        <Form.Item
          className="flex-1"
          label="Trạng thái"
          name="isActivated"
          valuePropName="checked"
        >
          <Switch
            defaultValue={true}
            disabled={viewOnly}
            checkedChildren="ACTIVE"
            unCheckedChildren="INACTIVE"
          />
        </Form.Item>
      </div>

      <Row>
        <p>Các sản phẩm</p>
      </Row>

      <Row>
        {itemToUpdate &&
          itemToUpdate.products &&
          itemToUpdate.products.length > 0 && (
            <>
              {itemToUpdate.products.map((product) => (
                <Col span={8} key={product.productId}>
                  <div className="m-1 overflow-hidden rounded-md border border-gray-300 bg-white">
                    <img
                      src={
                        product.productImages &&
                        product.productImages.length > 0 &&
                        product.productImages[0].imageUrl
                          ? product.productImages[0].imageUrl
                          : "https://placehold.co/400"
                      }
                      alt={product.name}
                      className="h-36 w-full object-cover"
                    />

                    <div className="p-1">
                      <p>{product.name}</p>
                      <p className="text-base font-semibold text-red-600">
                        250.000đ
                      </p>
                    </div>
                  </div>
                </Col>
              ))}
            </>
          )}
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
              {itemToUpdate ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default UpdateItemForm;
