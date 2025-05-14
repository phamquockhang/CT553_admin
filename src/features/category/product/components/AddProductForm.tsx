import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Select, Space, UploadFile } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiResponse, IItem, IProduct } from "../../../../interfaces";
import { useProductService } from "../../hooks";
import FormItemAddProduct from "../../item/components/FormItemAddProduct";

interface AddProductFormProps {
  existingItems?: IItem[];
  isLoadingItemsData?: boolean;
  onCancel: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  existingItems,
  isLoadingItemsData,
  onCancel,
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
    createBuyingPrice,
    createSellingPrice,
    createWeight,
    createProductImage,
    isCreatingProductImage,
  } = useProductService();

  async function handleFinish(values: IItem) {
    try {
      const newProductList = values.products.map((product) => ({
        productName: product.productName,
        productUnit: product.productUnit,
        description: product.description,
        isActivated: product.isActivated,
        itemId: values.itemId,
      }));

      toast.loading("Đang thêm sản phẩm...");
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
      }
      toast.remove();

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
      form.resetFields();
      toast.success("Thêm sản phẩm thành công");
    } catch (error) {
      console.log(error);
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
          options={existingItems?.map((item) => ({
            label: item.itemName,
            value: item.itemId,
          }))}
        />
      </Form.Item>

      <FormItemAddProduct
        form={form}
        fileList={fileList}
        setFileList={setFileList}
        fileListToUpdate={fileListToUpdate}
        setFileListToUpdate={setFileListToUpdate}
        publicIdImageListToKeep={publicIdImageListToKeep}
        setPublicIdImageListToKeep={setPublicIdImageListToKeep}
      />

      <Form.Item className="mt-5 text-right" wrapperCol={{ span: 24 }}>
        <Space>
          <Button
            disabled={isCreatingProduct || isCreatingProductImage}
            onClick={onCancel}
          >
            Hủy
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={isCreatingProduct || isCreatingProductImage}
          >
            Thêm mới
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddProductForm;
