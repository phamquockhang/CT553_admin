import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Select, Space, UploadFile } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ApiResponse,
  IItem,
  IProduct,
  IProductImage,
} from "../../../interfaces";
import { useProductService } from "../hooks";
import FormItemAddProduct from "../item/components/FormItemAddProduct";

interface UpdateProductFormProps {
  existingItems?: IItem[];
  isLoadingItemsData: boolean;
  productToUpdate?: IProduct;
  onCancel: () => void;
  viewOnly?: boolean;
}

const UpdateProductForm: React.FC<UpdateProductFormProps> = ({
  existingItems,
  isLoadingItemsData,
  productToUpdate,
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
  const {
    createProduct,
    isCreatingProduct,
    updateProduct,
    isUpdatingProduct,
    createBuyingPrice,
    createSellingPrice,
    createWeight,
    createProductImage,
    isCreatingProductImage,
    updateProductImage,
    isUpdatingProductImage,
  } = useProductService();

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
    if (productToUpdate) {
      form.setFieldsValue({
        ...productToUpdate,
      });

      const fetchImages = async () => {
        const fileListMap = new Map();
        const productImages = await Promise.all(
          productToUpdate.productImages.map(async (productImage) => {
            return await urlToUploadFile(productImage);
          }),
        );
        fileListMap.set(0, productImages);
        setFileList(fileListMap);
      };
      fetchImages();

      const fetchPublicIdImageToKeep = async () => {
        const publicIdImageMap = new Map();
        const publicIdImages = productToUpdate.productImages.map(
          (productImage) => productImage.publicId,
        );
        publicIdImageMap.set(0, publicIdImages);

        setPublicIdImageListToKeep(publicIdImageMap);
      };
      fetchPublicIdImageToKeep();
    }
  }, [productToUpdate, form]);

  async function handleFinish(values: IItem) {
    if (productToUpdate) {
      const modifiedItem = {
        ...productToUpdate,
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
          const newBuyingPrice = {
            buyingPriceValue: product.buyingPrice.buyingPriceValue,
            buyingPriceFluctuation:
              product.buyingPrice.buyingPriceFluctuation || 0,
          };
          const newSellingPrice = {
            sellingPriceValue: product.sellingPrice.sellingPriceValue,
            sellingPriceFluctuation:
              product.sellingPrice.sellingPriceFluctuation || 0,
          };
          const newWeight = {
            weightValue: product.weight.weightValue,
          };

          await new Promise((resolve) => {
            createBuyingPrice({
              productId: product.productId,
              newBuyingPrice: newBuyingPrice,
            });
            createSellingPrice({
              productId: product.productId,
              newSellingPrice: newSellingPrice,
            });
            createWeight({
              productId: product.productId,
              newWeight: newWeight,
            });

            resolve(null);
          });

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
            return (
              query.queryKey.includes("items") ||
              query.queryKey.includes("item") ||
              query.queryKey.includes("allItems") ||
              query.queryKey.includes("products")
            );
          },
        });
        onCancel();
        // form.resetFields();
        toast.success(updatedItem.message || "Operation successful");
      }
    } else {
      toast.loading("Đang thêm sản phẩm...");
      try {
        const newProductList = values.products.map((product) => ({
          productName: product.productName,
          productUnit: product.productUnit,
          description: product.description,
          isActivated: product.isActivated,
          itemId: values.itemId,
        }));

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

          if (createdProduct.success && createdProduct.payload) {
            createBuyingPrice({
              productId: createdProduct.payload.productId,
              newBuyingPrice: values.products[index].buyingPrice,
            });

            createSellingPrice({
              productId: createdProduct.payload.productId,
              newSellingPrice: values.products[index].sellingPrice,
            });

            createWeight({
              productId: createdProduct.payload.productId,
              newWeight: values.products[index].weight,
            });
          }

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
                },
                onError: (error) => {
                  reject(error);
                },
              });
            });
          }
          toast.remove();
        }

        queryClient.invalidateQueries({
          predicate: (query) => {
            return (
              query.queryKey.includes("items") ||
              query.queryKey.includes("item") ||
              query.queryKey.includes("allItems") ||
              query.queryKey.includes("products")
            );
          },
        });

        onCancel();
        form.resetFields();
        toast.success("Thêm sản phẩm thành công");
      } catch (error) {
        console.log(error);
      }
    }
  }

  console.log("form", form.getFieldsValue());
  // console.log("fileList", fileList);
  // console.log("fileListToUpdate", fileListToUpdate);
  // console.log("publicIdImageToKeep", publicIdImageListToKeep);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      initialValues={{ products: [{}] }}
    >
      <Form.Item
        label="Thuộc mặt hàng"
        name="itemId"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn mặt hàng",
          },
        ]}
      >
        <Select
          allowClear
          placeholder="Chọn mặt hàng"
          loading={isLoadingItemsData}
          disabled={viewOnly}
          options={existingItems?.map((item) => ({
            label: item.itemName,
            value: item.itemId,
          }))}
        />
      </Form.Item>

      <FormItemAddProduct
        form={form}
        viewOnly={viewOnly}
        fileList={fileList}
        setFileList={setFileList}
        fileListToUpdate={fileListToUpdate}
        setFileListToUpdate={setFileListToUpdate}
        publicIdImageListToKeep={publicIdImageListToKeep}
        setPublicIdImageListToKeep={setPublicIdImageListToKeep}
      />

      {!viewOnly && (
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Space>
            <Button
              disabled={
                isCreatingProduct ||
                isUpdatingProduct ||
                isCreatingProductImage ||
                isUpdatingProductImage
              }
              onClick={onCancel}
            >
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={
                isCreatingProduct ||
                isUpdatingProduct ||
                isCreatingProductImage ||
                isUpdatingProductImage
              }
            >
              {productToUpdate ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default UpdateProductForm;
