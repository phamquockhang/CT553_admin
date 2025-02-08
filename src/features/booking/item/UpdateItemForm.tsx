import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Space, UploadFile } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IItem, IProduct } from "../../../interfaces";
import { itemService, productService } from "../../../services/booking";
import FormItemAddItem from "./components/FormItemAddItem";
import FormItemAddProduct from "./components/FormItemAddProduct";
import ProductsOfItem from "./components/ProductsOfItem";
import { productImageService } from "../../../services/booking/product-image-service";

interface UpdateItemFormProps {
  itemToUpdate?: IItem;
  onCancel: () => void;
  viewOnly?: boolean;
}

interface UpdateItemArgs {
  itemId: number;
  updatedItem: IItem;
}

interface UpdateProductArgs {
  productId: number;
  updatedProduct: IProduct;
}

const UpdateItemForm: React.FC<UpdateItemFormProps> = ({
  itemToUpdate,
  onCancel,
  viewOnly = false,
}) => {
  const [form] = Form.useForm<IItem>();
  const [fileList, setFileList] = useState<Map<number, UploadFile[]>>(
    new Map(),
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (itemToUpdate) {
      form.setFieldsValue({
        ...itemToUpdate,
      });
    }
  }, [itemToUpdate, form]);

  const { mutate: createItem, isPending: isCreatingItem } = useMutation({
    mutationFn: itemService.create,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("items");
        },
      });
      if (data && data.success) {
        onCancel();
        form.resetFields();
        toast.success(data?.message || "Operation successful");
      } else if (data && !data.success) {
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: updateItem, isPending: isUpdatingItem } = useMutation({
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

  const { mutate: createProduct, isPending: isCreatingProduct } = useMutation({
    mutationFn: productService.create,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("products");
        },
      });
      if (data && data.success) {
        onCancel();
        form.resetFields();
        // toast.success(data?.message || "Operation successful");
      } else if (data && !data.success) {
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: updateProduct, isPending: isUpdatingProduct } = useMutation({
    mutationFn: ({ productId, updatedProduct }: UpdateProductArgs) => {
      return productService.update(productId, updatedProduct);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("products");
        },
      });
      if (data && data.success) {
        onCancel();
        form.resetFields();
        toast.success(data?.message || "Operation successful");
      } else if (data && !data.success) {
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
    } else {
      const newItem = {
        itemName: values.itemName,
        isActivated: values.isActivated,
      };
      createItem(newItem, {
        onSuccess: (newItem) => {
          // create product and product image here
          const newProductList = values.products.map((product) => {
            return {
              productName: product.productName,
              description: product.description,
              isActivated: product.isActivated,
              itemId: newItem.payload?.itemId,
            };
          });
          newProductList.forEach((product) => {
            createProduct(product, {
              onSuccess: (newProduct) => {
                const productImages = Array.from(fileList.values()).flat();

                if (productImages) {
                  productImages.forEach((image) => {
                    const formData = new FormData();
                    formData.append(
                      "productImageFiles",
                      image.originFileObj as File,
                    );

                    console.log("formData", formData);

                    if (newProduct.payload?.productId !== undefined) {
                      productImageService
                        .create(newProduct.payload.productId, formData)
                        .then(() => {
                          queryClient.invalidateQueries({
                            predicate: (query) => {
                              return query.queryKey.includes("products");
                            },
                          });
                        })
                        .catch((error) => {
                          console.error("Error creating product image:", error);
                        });
                    }
                  });
                }
              },
            });
          });

          queryClient.invalidateQueries({
            predicate: (query) => {
              return query.queryKey.includes("items");
            },
          });
        },
      });
    }
  }

  console.log("form", form.getFieldsValue());

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      initialValues={{ active: true, products: [{}] }}
    >
      <FormItemAddItem viewOnly={viewOnly} />

      <FormItemAddProduct
        viewOnly={viewOnly}
        fileList={fileList}
        setFileList={setFileList}
      />

      <ProductsOfItem itemToUpdate={itemToUpdate} />

      {!viewOnly && (
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Space>
            <Button onClick={onCancel}>Hủy</Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={isCreatingItem || isUpdatingItem}
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
