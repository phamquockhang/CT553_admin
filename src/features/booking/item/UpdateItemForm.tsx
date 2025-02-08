import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Space, UploadFile } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ApiResponse, IItem, IProduct } from "../../../interfaces";
import {
  itemService,
  productImageService,
  productService,
} from "../../../services/booking";
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

  async function urlToUploadFile(url: string): Promise<UploadFile> {
    const response = await axios.get(url, { responseType: "blob" });
    const blob = response.data;
    const file = new File([blob], url.split("/").pop() || "image.jpg", {
      type: blob.type,
    });

    return {
      uid: url,
      name: file.name,
      status: "done",
      url: url,
      originFileObj: file,
    };
  }

  useEffect(() => {
    if (itemToUpdate) {
      form.setFieldsValue({
        ...itemToUpdate,
      });

      const fetchImages = async () => {
        const fileListMap = new Map();
        for (const [index, product] of itemToUpdate.products.entries()) {
          const productImages = await Promise.all(
            product.productImages.map(async (productImage) => {
              return await urlToUploadFile(productImage.imageUrl);
            }),
          );
          fileListMap.set(index, productImages);
        }
        setFileList(fileListMap);
      };

      fetchImages();
    }
  }, [itemToUpdate, form]);

  console.log("fileList", fileList);

  const { mutate: createItem, isPending: isCreatingItem } = useMutation({
    mutationFn: itemService.create,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("items");
        },
      });
      if (data && data.success) {
        // onCancel();
        // form.resetFields();
        // toast.success(data?.message || "Operation successful");
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
        // onCancel();
        // form.resetFields();
        // toast.success(data?.message || "Operation successful");
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
        // onCancel();
        // form.resetFields();
        // toast.success(data?.message || "Operation successful");
      } else if (data && !data.success) {
        // toast.error(data?.message || "Operation failed");
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
        // onCancel();
        // form.resetFields();
        // toast.success(data?.message || "Operation successful");
      } else if (data && !data.success) {
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: createProductImage, isPending: isCreatingProductImage } =
    useMutation({
      mutationFn: (formData: FormData) => {
        return productImageService.create(formData);
      },

      onSuccess: (data) => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey.includes("product_images");
          },
        });
        if (data && data.success) {
          onCancel();
          // form.resetFields();
          // toast.success(data?.message || "Operation successful");
        } else if (data && !data.success) {
          toast.error(data?.message || "Operation failed");
        }
      },

      onError: (error) => {
        console.log(error);
      },
    });

  const { mutate: updateProductImage, isPending: isUpdatingProductImage } =
    useMutation({
      mutationFn: ({
        productId,
        formData,
      }: {
        productId: number;
        formData: FormData;
      }) => {
        return productImageService.update(productId, formData);
      },

      onSuccess: (data) => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey.includes("product_images");
          },
        });
        if (data && data.success) {
          onCancel();
          // form.resetFields();
          // toast.success(data?.message || "Operation successful");
        } else if (data && !data.success) {
          toast.error(data?.message || "Operation failed");
        }
      },

      onError: (error) => {
        console.log(error);
      },
    });

  async function handleFinish(values: IItem) {
    if (itemToUpdate) {
      values.products.forEach(async (product, index) => {
        if (product.productId) {
          //
        }
        // new product
        else {
          const newProduct = {
            productName: product.productName,
            description: product.description,
            isActivated: product.isActivated,
            itemId: itemToUpdate.itemId,
          };

          await new Promise((resolve, reject) => {
            createProduct(newProduct, {
              onSuccess: (newProduct) => {
                resolve(newProduct);

                if (newProduct.payload) {
                  values.products[index] = newProduct.payload;
                }

                queryClient.invalidateQueries({
                  predicate: (query) => {
                    return query.queryKey.includes("items");
                  },
                });
              },
              onError: (error) => {
                reject(error);
              },
            });
          });
        }

        const productImages = fileList.get(index);

        console.log("productImages index", index);
        console.log("productImages", productImages);

        if (productImages) {
          const formData = new FormData();
          if (product.productId) {
            formData.append("productId", product.productId.toString());
          }
          for (const image of productImages) {
            formData.append("productImageFiles", image.originFileObj as File);
          }
          await new Promise((resolve, reject) => {
            updateProductImage(
              {
                productId: product.productId,
                formData,
              },
              {
                onSuccess: () => {
                  resolve(null);

                  queryClient.invalidateQueries({
                    predicate: (query) => {
                      return query.queryKey.includes("items");
                    },
                  });
                },
                onError: (error) => {
                  reject(error);
                },
              },
            );
          });
        }
      });

      const updatedItem = {
        ...itemToUpdate,
        ...values,
      };
      await new Promise((resolve, reject) => {
        updateItem(
          { itemId: itemToUpdate.itemId, updatedItem: updatedItem },
          {
            onSuccess: () => {
              resolve(null);
              queryClient.invalidateQueries({
                predicate: (query) => {
                  return query.queryKey.includes("items");
                },
              });
              toast.success("Cập nhật mặt hàng thành công");
            },
            onError: (error) => {
              reject(error);
            },
          },
        );
      });
    } else {
      const newItem = {
        itemName: values.itemName,
        isActivated: values.isActivated,
      };

      try {
        const createdItem = await new Promise<ApiResponse<IItem>>(
          (resolve, reject) => {
            createItem(newItem, {
              onSuccess: (newItem) => {
                resolve(newItem);

                queryClient.invalidateQueries({
                  predicate: (query) => {
                    return query.queryKey.includes("items");
                  },
                });
              },
              onError: (error) => {
                reject(error);
              },
            });
          },
        );

        const newProductList = values.products.map((product) => ({
          productName: product.productName,
          description: product.description,
          isActivated: product.isActivated,
          itemId: createdItem.payload?.itemId,
        }));

        console.log("newProductList", newProductList);

        for (const [index, product] of newProductList.entries()) {
          const createdProduct = await new Promise<ApiResponse<IProduct>>(
            (resolve, reject) => {
              createProduct(product, {
                onSuccess: (newProduct) => {
                  if (newProduct.success) {
                    resolve(newProduct);

                    queryClient.invalidateQueries({
                      predicate: (query) => {
                        return query.queryKey.includes("items");
                      },
                    });
                  }
                },
                onError: (error) => {
                  reject(error);
                },
              });
            },
          );

          const productImages = fileList.get(index);
          if (productImages) {
            const formData = new FormData();
            if (createdProduct.payload?.productId !== undefined) {
              formData.append(
                "productId",
                createdProduct.payload.productId.toString(),
              );
            }
            for (const image of productImages) {
              formData.append("productImageFiles", image.originFileObj as File);
            }
            await new Promise((resolve, reject) => {
              createProductImage(formData, {
                onSuccess: () => {
                  resolve(null);

                  queryClient.invalidateQueries({
                    predicate: (query) => {
                      return query.queryKey.includes("items");
                    },
                  });
                },
                onError: (error) => {
                  reject(error);
                },
              });
            });
          }
        }
        toast.success("Thêm mặt hàng thành công");
      } catch (error) {
        console.log(error);
      }
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
              loading={
                isCreatingItem ||
                isUpdatingItem ||
                isCreatingProduct ||
                isCreatingProductImage ||
                isUpdatingProductImage
              }
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
