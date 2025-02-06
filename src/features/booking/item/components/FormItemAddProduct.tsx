import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Tooltip,
  Upload,
} from "antd";
import { UploadFile } from "antd/lib";
import { useState } from "react";
import { FileType, PRIMARY_COLOR } from "../../../../interfaces";
import { getBase64 } from "../../../../utils";

interface FormItemAddProductProps {
  viewOnly?: boolean;
  //   fileList: Map<number, UploadFile[]>;
  //   setFileList: React.Dispatch<React.SetStateAction<Map<number, UploadFile[]>>>;
}

const FormItemAddProduct: React.FC<FormItemAddProductProps> = ({
  viewOnly,
  //   fileList,
  //   setFileList,
}) => {
  // use Map instead of array to store multiple file lists
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

  return (
    <>
      <Form.List name="products">
        {(fields, { add, remove }) => (
          <div style={{ display: "flex", rowGap: 16, flexDirection: "column" }}>
            {fields.map((field) => (
              <Card
                size="small"
                title={`Sản phẩm ${field.name + 1}`}
                key={field.key}
                className="border border-gray-300 shadow-md transition-all duration-200 hover:shadow-[0px_0px_5px_1px_rgba(0,0,0,0.24)]"
                extra={
                  viewOnly ? null : (
                    <Popconfirm
                      title="Xóa sản phẩm"
                      description="Bạn có chắc muốn xóa sản phẩm này không?"
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => {
                        remove(field.name);

                        // when remove a product, remove its images from fileList and update fileList state from index this product to the end
                        const newFileList = new Map(fileList);
                        newFileList.delete(field.name);
                        for (let i = field.name; i < fields.length; i++) {
                          newFileList.set(i, fileList.get(i + 1) || []);
                        }
                        setFileList(newFileList);

                        console.log("newFileList", newFileList);
                      }}
                    >
                      <Tooltip title="Xóa">
                        <DeleteOutlined className="text-xl text-[#ff4d4f]" />
                      </Tooltip>
                    </Popconfirm>
                  )
                }
              >
                <Row className="flex justify-between">
                  <Col span={11}>
                    <Form.Item
                      name={[field.name, "productName"]}
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

                    <Form.Item
                      name={[field.name, "sellingPriceValue"]}
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
                        addonAfter="VNĐ/kg"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        // parser={(value) =>
                        //   value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                        // }
                        placeholder="Giá bán ra, ví dụ: 250,000"
                      />
                    </Form.Item>

                    <Form.Item
                      name={[field.name, "buyingPriceValue"]}
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
                        placeholder="Giá mua vào, ví dụ: 200,000"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={11}>
                    <Form.Item
                      name={[field.name, "description"]}
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
                        rows={6}
                        placeholder="Mô tả sản phẩm, ví dụ: Tôm sú hàng 2 có kích thước 15-24 con/kg"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Form.Item
                    name="productImages"
                    label="Hình ảnh"
                    valuePropName="fileList"
                    rules={[
                      {
                        validator: () => {
                          if (fileList && fileList.size < 1) {
                            return Promise.reject(
                              new Error("Vui lòng tải ảnh lên"),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    getValueFromEvent={(e) =>
                      Array.isArray(e) ? e : e && e.fileList
                    }
                  >
                    <Upload
                      maxCount={3}
                      disabled={viewOnly}
                      listType="picture-card"
                      //   fileList={Array.from(fileList.values()).flat()}
                      //   fileList={Array.from(fileList.values())
                      //     .flat()
                      //     .map((file, index) => ({
                      //       ...file,
                      //       uid: `${file.name}-${index}`,
                      //     }))}
                      fileList={fileList.get(field.name) || []}
                      beforeUpload={() => false}
                      onPreview={handlePreview}
                      onChange={(info) => {
                        setFileList((prev) => {
                          const newFileList = new Map(prev);
                          newFileList.set(field.name, info.fileList);
                          console.log("newFileList", newFileList);
                          return newFileList;
                        });
                      }}
                      showUploadList={{
                        showRemoveIcon: !viewOnly,
                      }}
                    >
                      {(fileList.get(field.name)?.length ?? 0) < 3 && (
                        <button
                          style={{ border: 0, background: "none" }}
                          type="button"
                        >
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                        </button>
                      )}
                    </Upload>

                    {previewImage && (
                      <Image
                        wrapperStyle={{ display: "none" }}
                        preview={{
                          visible: previewOpen,
                          onVisibleChange: (visible) => setPreviewOpen(visible),
                          afterOpenChange: (visible) =>
                            !visible && setPreviewImage(""),
                        }}
                        src={previewImage}
                      />
                    )}
                  </Form.Item>
                </Row>
              </Card>
            ))}

            <Button type="dashed" onClick={() => add()} block>
              + Thêm sản phẩm
            </Button>
          </div>
        )}
      </Form.List>

      {/* <Form.Item noStyle shouldUpdate>
        {() => (
          <Typography>
            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
          </Typography>
        )}
      </Form.Item> */}
    </>
  );
};

export default FormItemAddProduct;
