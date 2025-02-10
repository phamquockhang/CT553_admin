import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Space, UploadFile } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ApiResponse,
  IItem,
  IProduct,
  IProductImage,
} from "../../../interfaces";
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
  const [fileListToUpdate, setFileListToUpdate] = useState<
    Map<number, UploadFile[]>
  >(new Map());
  const [publicIdImageListToKeep, setPublicIdImageListToKeep] = useState<
    Map<number, string[]>
  >(new Map());
  const queryClient = useQueryClient();

  async function urlToUploadFile(
    productImage: IProductImage,
  ): Promise<UploadFile> {
    const response = await axios.get(productImage.imageUrl, {
      responseType: "blob",
    });
    const blob = response.data;
    const file = new File(
      [blob],
      productImage.publicId.split("/")[
        productImage.publicId.split("/").length - 1
      ],
      {
        type: blob.type,
      },
    );

    return {
      uid: productImage.productImageId.toString(),
      name: file.name,
      status: "done",
      url: productImage.imageUrl,
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
              return await urlToUploadFile(productImage);
            }),
          );
          fileListMap.set(index, productImages);
        }
        setFileList(fileListMap);
      };
      fetchImages();

      const fetchPublicIdImageToKeep = async () => {
        const publicIdImageMap = new Map();
        for (const [index, product] of itemToUpdate.products.entries()) {
          const publicIdImages = product.productImages.map(
            (productImage) => productImage.publicId,
          );
          publicIdImageMap.set(index, publicIdImages);
        }
        setPublicIdImageListToKeep(publicIdImageMap);
      };
      fetchPublicIdImageToKeep();
    }
  }, [itemToUpdate, form]);

  const { mutate: createItem, isPending: isCreatingItem } = useMutation({
    mutationFn: itemService.create,

    onSuccess: (data) => {
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

  async function handleFinish(values: IItem) {
    if (itemToUpdate) {
      for (const [index, product] of values.products.entries()) {
        // create new product
        if (!product.productId) {
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
              },
              onError: (error) => {
                reject(error);
              },
            });
          });
        }
      }

      const modifiedItem = {
        ...itemToUpdate,
        ...values,
        products: values.products,
      };
      const updatedItem = await new Promise<ApiResponse<IItem>>(
        (resolve, reject) => {
          updateItem(
            { itemId: itemToUpdate.itemId, updatedItem: modifiedItem },
            {
              onSuccess: (updatedItem) => {
                resolve(updatedItem);
              },
              onError: (error) => {
                reject(error);
              },
            },
          );
        },
      );

      if (updatedItem.success) {
        for (const [index, product] of values.products.entries()) {
          // values.products.forEach(async (product, index) => {
          const productImagesToUpdate = fileListToUpdate.get(index);
          const publicIdImagesToKeep = publicIdImageListToKeep.get(index);
          if (productImagesToUpdate || publicIdImagesToKeep) {
            const formData = new FormData();
            if (product.productId) {
              formData.append("productId", product.productId.toString());
            }

            if (productImagesToUpdate && productImagesToUpdate.length > 0) {
              for (const image of productImagesToUpdate) {
                formData.append(
                  "productImageFiles",
                  image.originFileObj as File,
                );
              }
            } else {
              formData.append("productImageFiles", new Blob());
            }

            if (publicIdImagesToKeep) {
              for (const publicId of publicIdImagesToKeep) {
                formData.append("publicIdOfImageFiles", publicId);
              }
            } else {
              formData.append("publicIdOfImageFiles", "");
            }

            await new Promise((resolve, reject) => {
              updateProductImage(
                {
                  productId: product.productId,
                  formData,
                },
                {
                  onSuccess: (updatedProductImage) => {
                    resolve(updatedProductImage);
                  },
                  onError: (error) => {
                    reject(error);
                  },
                },
              );
            });
          }
        }

        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey.includes("items");
          },
        });
        onCancel();
        // form.resetFields();
        toast.success(updatedItem.message || "Operation successful");
      }
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
              },
              onError: (error) => {
                reject(error);
              },
            });
          },
        );

        if (createdItem.success) {
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
                    resolve(newProduct);
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
                formData.append(
                  "productImageFiles",
                  image.originFileObj as File,
                );
              }

              await new Promise((resolve, reject) => {
                createProductImage(formData, {
                  onSuccess: () => {
                    resolve(null);
                  },
                  onError: (error) => {
                    reject(error);
                  },
                });
              });
            }
          }

          queryClient.invalidateQueries({
            predicate: (query) => {
              return query.queryKey.includes("items");
            },
          });
          onCancel();
          form.resetFields();
          toast.success(createdItem.message || "Operation successful");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  // console.log("form", form.getFieldsValue());
  // console.log("fileList", fileList);
  // console.log("fileListToUpdate", fileListToUpdate);
  // console.log("publicIdImageToKeep", publicIdImageListToKeep);

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
        fileListToUpdate={fileListToUpdate}
        setFileListToUpdate={setFileListToUpdate}
        publicIdImageListToKeep={publicIdImageListToKeep}
        setPublicIdImageListToKeep={setPublicIdImageListToKeep}
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
