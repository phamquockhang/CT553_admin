import { PlusOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Tooltip,
  Upload,
} from "antd";
import { UploadFile } from "antd/lib";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { FileType, IProduct, IProductImage } from "../../../../interfaces";
import { getBase64 } from "../../../../utils";

interface ViewProductFormProps {
  productToView: IProduct;
  viewOnly?: boolean;
}

const ViewProductForm: React.FC<ViewProductFormProps> = ({
  productToView,
  viewOnly = true,
}) => {
  const [form] = Form.useForm<IProduct>();
  const [fileList, setFileList] = useState<Map<number, UploadFile[]>>(
    new Map(),
  );
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  async function handlePreview(file: UploadFile) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || file.preview || "");
    setPreviewOpen(true);
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
    if (productToView) {
      form.setFieldsValue({
        ...productToView,
      });

      const fetchImages = async () => {
        const fileListMap = new Map();
        const productImages = await Promise.all(
          productToView.productImages.map(async (productImage) => {
            return await urlToUploadFile(productImage);
          }),
        );
        fileListMap.set(0, productImages);
        setFileList(fileListMap);
      };
      fetchImages();

      //   const fetchPublicIdImageToKeep = async () => {
      //     const publicIdImageMap = new Map();
      //     const publicIdImages = productToUpdate.productImages.map(
      //       (productImage) => productImage.publicId,
      //     );
      //     publicIdImageMap.set(0, publicIdImages);

      //     setPublicIdImageListToKeep(publicIdImageMap);
      //   };
      //   fetchPublicIdImageToKeep();
    }
  }, [productToView, form]);

  console.log("form", form.getFieldsValue());
  // console.log("fileList", fileList);
  // console.log("fileListToUpdate", fileListToUpdate);
  // console.log("publicIdImageToKeep", publicIdImageListToKeep);

  return (
    <Form
      layout="vertical"
      form={form}
      // onFinish={handleFinish}
      // initialValues={{ products: [{}] }}
    >
      <Row className="flex justify-between">
        <Col span={11}>
          {/* productName */}
          <Form.Item
            name={"productName"}
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
                name={"productUnit"}
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
                  onChange={() => {
                    form.setFieldsValue({
                      //   products: fields.map((field) => ({
                      //     ...form.getFieldValue(["products", field.name]),
                      //   })),
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
            name={"description"}
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
                form.getFieldValue(["productUnit"]) ? (
                  `VNĐ/${form.getFieldValue(["productUnit"])}`
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
          name={"productImageFiles"}
          label="Hình ảnh (tối đa 3 ảnh)"
          valuePropName="fileList"
          rules={[
            {
              validator: () => {
                if (
                  // (fileList.get(field.name) &&
                  //   fileList.get(field.name)?.length === 0) ||
                  fileList.get(0)?.length === 0 ||
                  !fileList.get(0)
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
            fileList={fileList.get(0) || []}
            beforeUpload={() => false}
            onPreview={handlePreview}
            showUploadList={{
              showRemoveIcon: !viewOnly,
            }}
          >
            {(fileList.get(0)?.length ?? 0) < 3 && (
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
    </Form>
  );
};
export default ViewProductForm;
