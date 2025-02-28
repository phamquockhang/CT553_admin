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
} from "../../../../interfaces";
import { useProductService } from "../../hooks";
import UpdateProductDetailsForm from "./UpdateProductDetailsForm";

interface UpdateProductFormProps {
  existingItems?: IItem[];
  isLoadingItemsData?: boolean;

  productToUpdate?: IProduct;

  onCancel: () => void;
}

const UpdateProductForm: React.FC<UpdateProductFormProps> = ({
  existingItems,
  isLoadingItemsData,
  productToUpdate,
  onCancel,
}) => {
  const [form] = Form.useForm<IProduct>();
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
    updateProduct,
    isUpdatingProduct,
    createBuyingPrice,
    createSellingPrice,
    createWeight,
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

  async function handleFinish(values: IProduct) {
    if (productToUpdate) {
      const modifiedProduct = {
        ...productToUpdate,
        ...values,
      };

      if (
        modifiedProduct.productName !== productToUpdate.productName ||
        modifiedProduct.productUnit !== productToUpdate.productUnit ||
        modifiedProduct.description !== productToUpdate.description ||
        modifiedProduct.isActivated !== productToUpdate.isActivated ||
        modifiedProduct.buyingPrice.buyingPriceValue !==
          productToUpdate.buyingPrice.buyingPriceValue ||
        modifiedProduct.buyingPrice.buyingPriceFluctuation !==
          productToUpdate.buyingPrice.buyingPriceFluctuation ||
        modifiedProduct.sellingPrice.sellingPriceValue !==
          productToUpdate.sellingPrice.sellingPriceValue ||
        modifiedProduct.sellingPrice.sellingPriceFluctuation !==
          productToUpdate.sellingPrice.sellingPriceFluctuation ||
        modifiedProduct.weight.weightValue !==
          productToUpdate.weight.weightValue ||
        fileListToUpdate.get(0) ||
        publicIdImageListToKeep.get(0)?.length !==
          productToUpdate.productImages.length
      ) {
        toast.loading("Đang cập nhật sản phẩm: " + values.productName);

        const updatedProduct = await new Promise<ApiResponse<IProduct>>(
          (resolve, reject) => {
            updateProduct(
              {
                productId: productToUpdate.productId,
                updatedProduct: modifiedProduct,
              },
              {
                onSuccess: (updatedProduct) => {
                  resolve(updatedProduct);
                },
                onError: (error) => {
                  reject(error);
                },
              },
            );
          },
        );

        // if (updatedProduct.success && updatedProduct.payload) {
        if (
          modifiedProduct.buyingPrice.buyingPriceValue !==
            productToUpdate.buyingPrice.buyingPriceValue ||
          modifiedProduct.buyingPrice.buyingPriceFluctuation !==
            productToUpdate.buyingPrice.buyingPriceFluctuation ||
          modifiedProduct.sellingPrice.sellingPriceValue !==
            productToUpdate.sellingPrice.sellingPriceValue ||
          modifiedProduct.sellingPrice.sellingPriceFluctuation !==
            productToUpdate.sellingPrice.sellingPriceFluctuation ||
          modifiedProduct.weight.weightValue !==
            productToUpdate.weight.weightValue
        ) {
          if (
            modifiedProduct.buyingPrice.buyingPriceValue !==
              productToUpdate.buyingPrice.buyingPriceValue ||
            modifiedProduct.buyingPrice.buyingPriceFluctuation !==
              productToUpdate.buyingPrice.buyingPriceFluctuation
          ) {
            const newBuyingPrice = {
              buyingPriceValue: values.buyingPrice.buyingPriceValue,
              buyingPriceFluctuation:
                values.buyingPrice.buyingPriceFluctuation || 0,
            };
            await new Promise((resolve, reject) => {
              createBuyingPrice(
                {
                  productId: productToUpdate.productId,
                  newBuyingPrice: newBuyingPrice,
                },
                {
                  onSuccess: (createdBuyingPrice) => {
                    resolve(createdBuyingPrice);
                  },
                  onError: (error) => {
                    reject(error);
                  },
                },
              );
            });
          }

          if (
            modifiedProduct.sellingPrice.sellingPriceValue !==
              productToUpdate.sellingPrice.sellingPriceValue ||
            modifiedProduct.sellingPrice.sellingPriceFluctuation !==
              productToUpdate.sellingPrice.sellingPriceFluctuation
          ) {
            const newSellingPrice = {
              sellingPriceValue: values.sellingPrice.sellingPriceValue,
              sellingPriceFluctuation:
                values.sellingPrice.sellingPriceFluctuation || 0,
            };
            await new Promise((resolve, reject) => {
              createSellingPrice(
                {
                  productId: productToUpdate.productId,
                  newSellingPrice: newSellingPrice,
                },
                {
                  onSuccess: (createdSellingPrice) => {
                    resolve(createdSellingPrice);
                  },
                  onError: (error) => {
                    reject(error);
                  },
                },
              );
            });
          }

          if (
            modifiedProduct.weight.weightValue !==
            productToUpdate.weight.weightValue
          ) {
            const newWeight = {
              weightValue: values.weight.weightValue,
            };

            await new Promise((resolve, reject) => {
              createWeight(
                {
                  productId: productToUpdate.productId,
                  newWeight: newWeight,
                },
                {
                  onSuccess: (createdWeight) => {
                    resolve(createdWeight);
                  },
                  onError: (error) => {
                    reject(error);
                  },
                },
              );
            });
          }
        }

        const productImagesToUpdate = fileListToUpdate.get(0);
        const publicIdImagesToKeep = publicIdImageListToKeep.get(0);
        if (
          (productImagesToUpdate?.length ?? 0) > 0 ||
          productImagesToUpdate ||
          publicIdImagesToKeep?.length !== productToUpdate.productImages.length
        ) {
          console.log("productImagesToUpdate", productImagesToUpdate);
          console.log("publicIdImagesToKeep", publicIdImagesToKeep);
          const formData = new FormData();
          if (productToUpdate.productId) {
            formData.append("productId", productToUpdate.productId.toString());
          }

          if (productImagesToUpdate && productImagesToUpdate.length > 0) {
            for (const image of productImagesToUpdate) {
              formData.append("productImageFiles", image.originFileObj as File);
            }
          } else {
            formData.append("productImageFiles", new Blob());
          }

          if (publicIdImagesToKeep?.length !== 0 && publicIdImagesToKeep) {
            for (const publicId of publicIdImagesToKeep) {
              formData.append("publicIdOfImageFiles", publicId);
            }
          } else {
            formData.append("publicIdOfImageFiles", "");
          }

          await new Promise((resolve, reject) => {
            updateProductImage(
              {
                productId: productToUpdate.productId,
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
        toast.dismiss();

        queryClient.invalidateQueries({
          predicate: (query) => {
            return (
              query.queryKey.includes("items") ||
              query.queryKey.includes("item") ||
              query.queryKey.includes("allItems") ||
              query.queryKey.includes("products") ||
              query.queryKey.includes("product")
            );
          },
        });
        onCancel();
        // form.resetFields();
        toast.success(updatedProduct.message || "Operation successful");
      } else {
        toast.error("Không có thay đổi nào được thực hiện");
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
          options={existingItems?.map((item) => ({
            label: item.itemName,
            value: item.itemId,
          }))}
        />
      </Form.Item>

      <UpdateProductDetailsForm
        form={form}
        fileList={fileList}
        setFileList={setFileList}
        setFileListToUpdate={setFileListToUpdate}
        setPublicIdImageListToKeep={setPublicIdImageListToKeep}
      />

      <Form.Item className="mt-5 text-right" wrapperCol={{ span: 24 }}>
        <Space>
          <Button
            disabled={isUpdatingProduct || isUpdatingProductImage}
            onClick={onCancel}
          >
            Hủy
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={isUpdatingProduct || isUpdatingProductImage}
          >
            Cập nhật
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UpdateProductForm;
