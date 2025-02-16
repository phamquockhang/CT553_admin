import { PlusOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Space,
  Tooltip,
  Upload,
  UploadFile,
} from "antd";
import { UploadProps } from "antd/lib";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillQuestionCircle } from "react-icons/ai";
import {
  ApiResponse,
  FileType,
  IProduct,
  IProductImage,
} from "../../../interfaces";
import { getBase64 } from "../../../utils";
import { useProductService } from "../hooks";

interface UpdateProductFormProps {
  productToUpdate?: IProduct;
  onCancel: () => void;
  viewOnly?: boolean;
}

const UpdateProductForm: React.FC<UpdateProductFormProps> = ({
  productToUpdate,
  onCancel,
  viewOnly = false,
}) => {
  const [form] = Form.useForm<IProduct>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileListToUpdate, setFileListToUpdate] = useState<UploadFile[]>([]);
  const [publicIdImageListToKeep, setPublicIdImageListToKeep] = useState<
    string[]
  >([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
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

  async function handlePreview(file: UploadFile) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || file.preview || "");
    setPreviewOpen(true);
  }

  const handleUploadChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);

    setFileListToUpdate(() => {
      const newFileListToUpdate: UploadFile[] = [];
      fileList.filter((item) => {
        if (item.status !== "done") {
          newFileListToUpdate.push(item);
        }
      });
      return newFileListToUpdate;
    });
  };

  function handleRemove(file: UploadFile) {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);

    if (fileListToUpdate) {
      const newFileListToUpdate = fileListToUpdate.filter(
        (item) => item.uid !== file.uid,
      );
      setFileListToUpdate(newFileListToUpdate);
    }

    if (publicIdImageListToKeep) {
      const newPublicIdImageListToKeep = publicIdImageListToKeep.filter(
        (publicId) => publicId !== "CT553/" + file.name,
      );
      setPublicIdImageListToKeep(newPublicIdImageListToKeep);
    }
  }

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
        const filePromises = productToUpdate.productImages.map((productImage) =>
          urlToUploadFile(productImage),
        );

        const files = await Promise.all(filePromises);

        setFileList(files);
      };
      fetchImages();

      const fetchPublicIdImageToKeep = async () => {
        const publicIdImages = productToUpdate.productImages.map(
          (productImage) => productImage.publicId,
        );

        setPublicIdImageListToKeep(publicIdImages);
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
      const updatedProduct = await new Promise<ApiResponse<IProduct>>(
        (resolve, reject) => {
          updateProduct(
            {
              productId: productToUpdate.itemId,
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

      if (updatedProduct.success) {
        const newBuyingPrice = {
          buyingPriceValue: productToUpdate.buyingPrice.buyingPriceValue,
          buyingPriceFluctuation:
            productToUpdate.buyingPrice.buyingPriceFluctuation || 0,
        };
        const newSellingPrice = {
          sellingPriceValue: productToUpdate.sellingPrice.sellingPriceValue,
          sellingPriceFluctuation:
            productToUpdate.sellingPrice.sellingPriceFluctuation || 0,
        };
        const newWeight = {
          weightValue: productToUpdate.weight.weightValue,
        };

        await new Promise((resolve) => {
          createBuyingPrice({
            productId: productToUpdate.productId,
            newBuyingPrice: newBuyingPrice,
          });
          createSellingPrice({
            productId: productToUpdate.productId,
            newSellingPrice: newSellingPrice,
          });
          createWeight({
            productId: productToUpdate.productId,
            newWeight: newWeight,
          });

          resolve(null);
        });

        if (fileListToUpdate || publicIdImageListToKeep) {
          const formData = new FormData();
          if (productToUpdate.productId) {
            formData.append("productId", productToUpdate.productId.toString());
          }

          if (fileListToUpdate && fileListToUpdate.length > 0) {
            for (const image of fileListToUpdate) {
              formData.append("productImageFiles", image.originFileObj as File);
            }
          } else {
            formData.append("productImageFiles", new Blob());
          }

          if (publicIdImageListToKeep) {
            for (const publicId of publicIdImageListToKeep) {
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

        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey.includes("products");
          },
        });
        onCancel();
        // form.resetFields();
        toast.success(updatedProduct.message || "Operation successful");
      }
    } else {
      const newProduct = {
        productName: values.productName,
        productUnit: values.productUnit,
        description: values.description,
        isActivated: values.isActivated,
        // itemId: createdItem.payload?.itemId,
      };

      const createdProduct = await new Promise<ApiResponse<IProduct>>(
        (resolve, reject) => {
          createProduct(newProduct, {
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
          newBuyingPrice: values.buyingPrice,
        });

        createSellingPrice({
          productId: createdProduct.payload.productId,
          newSellingPrice: values.sellingPrice,
        });

        createWeight({
          productId: createdProduct.payload.productId,
          newWeight: values.weight,
        });
      }

      if (fileList) {
        const formData = new FormData();
        if (createdProduct.payload?.productId !== undefined) {
          formData.append(
            "productId",
            createdProduct.payload.productId.toString(),
          );
        }
        for (const image of fileList) {
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

      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("products");
        },
      });
      onCancel();
      form.resetFields();
      toast.success(createdProduct.message || "Operation successful");
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
      // initialValues={{ products: [{}] }}
    >
      <Row className="flex justify-between">
        <Col span={11}>
          {/* productName */}
          <Form.Item
            // name={"productName"}
            name={["productName"]}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên sản phẩm",
              },
              {
                // vietnamese name has anccent characters
                pattern:
                  /^[0-9a-zA-ZăâđêôơưàảãáạăằẳẵắặâầẩẫấậèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵĂÂĐÊÔƠƯÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚOỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ\s]+$/,
                message: "Tên sản phẩm không chứa ký tự đặc biệt",
              },
            ]}
          >
            <Input
              allowClear
              readOnly={viewOnly}
              placeholder="Tên sản phẩm, ví dụ: Tôm sú hàng 2, Tôm sú hàng 3, ..."
            />
          </Form.Item>

          <Row className="flex justify-between">
            <Col span={14}>
              {/* productUnit */}
              <Form.Item
                className="flex-1"
                // name={"productUnit"}
                name={["productUnit"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đơn vị sản phẩm",
                  },
                  {
                    // vietnamese name has anccent characters
                    pattern:
                      /^[0-9a-zA-ZăâđêôơưàảãáạăằẳẵắặâầẩẫấậèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵĂÂĐÊÔƠƯÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚOỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ\s]+$/,
                    message: "Đơn vị sản phẩm không chứa ký tự đặc biệt",
                  },
                ]}
              >
                <Input
                  allowClear
                  addonAfter={
                    <Tooltip title="Đơn vị áp dụng khi tính giá bán cho sản phẩm này">
                      <AiFillQuestionCircle />
                    </Tooltip>
                  }
                  // onChange={(e) => {
                  //   form.setFieldsValue({
                  //     productUnit: e.target.value,
                  //   });
                  // }}

                  onChange={() => {
                    form.setFieldsValue({
                      productUnit: form.getFieldValue("productUnit"),
                    });
                  }}
                  readOnly={viewOnly}
                  placeholder="Ví dụ: con, kg, thùng, ..."
                />
              </Form.Item>
            </Col>

            <Col span={9}>
              {/* productWeight*/}
              <Form.Item
                className="flex-1"
                name={["weight", "weightValue"]}
                rules={[
                  {
                    required: true,
                    message:
                      "Vui lòng nhập tổng khối lượng sản phẩm còn lại trong kho",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  addonAfter={
                    <Tooltip title="Tổng khối lượng sản phẩm còn lại trong kho (theo kg)">
                      <AiFillQuestionCircle />
                    </Tooltip>
                  }
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  // parser={(value) =>
                  //   value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                  // }
                  placeholder="Ví dụ: 250"
                  readOnly={viewOnly}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* description */}
          <Form.Item
            name="description"
            rules={[
              {
                // vietnamese name has anccent characters
                pattern:
                  /^[-/0-9a-zA-ZăâđêôơưàảãáạăằẳẵắặâầẩẫấậèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵĂÂĐÊÔƠƯÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚOỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ\s]+$/,
                message: "Mô tả sản phẩm không chứa ký tự đặc biệt",
              },
            ]}
          >
            <Input.TextArea
              allowClear
              readOnly={viewOnly}
              rows={3}
              placeholder="Mô tả sản phẩm, ví dụ: Tôm sú hàng 2 có kích thước 15-24 con/kg"
            />
          </Form.Item>
        </Col>

        <Col span={11}>
          {/* sellingPriceValue */}
          <Form.Item
            name={["sellingPrice", "sellingPriceValue"]}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá bán ra",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              addonBefore="Bán ra"
              // addonAfter="VNĐ/kg"
              addonAfter={
                form.getFieldValue("productUnit") ? (
                  `VNĐ/${form.getFieldValue("productUnit")}`
                ) : (
                  <Tooltip
                    title="Vui lòng nhập đơn vị sản phẩm trước"
                    className="cursor-pointer"
                  >
                    <p className="text-red-500">VNĐ/null</p>
                  </Tooltip>
                )
              }
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              // parser={(value) =>
              //   value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              // }
              placeholder="Ví dụ: 250,000"
              readOnly={viewOnly}
            />
          </Form.Item>

          {/* sellingPriceFluctuation */}
          <Form.Item
            name={["sellingPrice", "sellingPriceFluctuation"]}
            rules={
              [
                // {
                //   required: true,
                //   message: "Vui lòng nhập giá biến động bán ra",
                // },
              ]
            }
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              addonBefore="Biến động giá bán ra (nếu cần)"
              addonAfter="VNĐ/con"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              // parser={(value) =>
              //   value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              // }
              placeholder="Ví dụ: 10,000"
              readOnly={viewOnly}
            />
          </Form.Item>

          {/* buyingPriceValue */}
          <Form.Item
            name={["buyingPrice", "buyingPriceValue"]}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá mua vào",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              addonBefore="Mua vào"
              addonAfter="VNĐ/kg"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              // parser={(value) =>
              //   value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              // }
              placeholder="Ví dụ: 200,000"
              readOnly={viewOnly}
            />
          </Form.Item>

          {/* buyingPriceFluctuation */}
          <Form.Item
            name={["buyingPrice", "buyingPriceFluctuation"]}
            rules={
              [
                // {
                //   required: true,
                //   message: "Vui lòng nhập giá biến động mua vào",
                // },
              ]
            }
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              addonBefore="Biến động giá mua vào (nếu cần)"
              addonAfter="VNĐ/con"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              // parser={(value) =>
              //   value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              // }
              placeholder="Ví dụ: 10,000"
              readOnly={viewOnly}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Form.Item
          // name="productImageFiles"
          name="productImageFiles"
          label="Hình ảnh (tối đa 3 ảnh)"
          valuePropName="fileList"
          rules={[
            {
              validator: () => {
                if (
                  // (fileList.get(field.name) &&
                  //   fileList.get(field.name)?.length === 0) ||
                  fileList.length === 0 ||
                  !fileList
                ) {
                  return Promise.reject(
                    new Error("Vui lòng tải lên ít nhất 1 ảnh"),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload
            accept="image/*"
            maxCount={3}
            disabled={viewOnly}
            listType="picture-card"
            fileList={fileList || []}
            beforeUpload={() => false}
            onPreview={handlePreview}
            onChange={handleUploadChange}
            onRemove={(file) => {
              handleRemove(file);
            }}
            showUploadList={{
              showRemoveIcon: !viewOnly,
            }}
          >
            {(fileList?.length ?? 0) < 3 && (
              <button
                className={`${viewOnly ? "cursor-not-allowed" : ""}`}
                style={{ border: 0, background: "none" }}
                type="button"
                disabled={viewOnly}
              >
                <PlusOutlined />
                <div className="mt-2">Tải ảnh lên</div>
              </button>
            )}
          </Upload>

          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </Form.Item>
      </Row>

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
