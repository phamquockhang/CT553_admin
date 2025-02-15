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
import { FileType } from "../../../../interfaces";
import { getBase64 } from "../../../../utils";

interface FormItemAddProductProps {
  viewOnly?: boolean;

  fileList: Map<number, UploadFile[]>;
  setFileList: React.Dispatch<React.SetStateAction<Map<number, UploadFile[]>>>;

  fileListToUpdate: Map<number, UploadFile[]>;
  setFileListToUpdate: React.Dispatch<
    React.SetStateAction<Map<number, UploadFile[]>>
  >;

  publicIdImageListToKeep: Map<number, string[]>;
  setPublicIdImageListToKeep: React.Dispatch<
    React.SetStateAction<Map<number, string[]>>
  >;
}

const FormItemAddProduct: React.FC<FormItemAddProductProps> = ({
  viewOnly,
  fileList,
  setFileList,
  fileListToUpdate,
  setFileListToUpdate,
  publicIdImageListToKeep,
  setPublicIdImageListToKeep,
}) => {
  // const [fileList, setFileList] = useState<Map<number, UploadFile[]>>(
  //   new Map(),
  // );
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  async function handlePreview(file: UploadFile) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || file.preview || "");
    setPreviewOpen(true);
  }

  function handleRemove(key: number, file: UploadFile) {
    setFileListToUpdate((prev) => {
      const newFileListToUpdate = new Map(prev);
      if (newFileListToUpdate.get(key)?.length === 0) {
        newFileListToUpdate.delete(key);
      }
      return newFileListToUpdate;
    });

    setPublicIdImageListToKeep((prev) => {
      const newPublicIdImageListToKeep = new Map(prev);
      newPublicIdImageListToKeep.set(
        key,
        newPublicIdImageListToKeep
          .get(key)
          ?.filter((publicId) => publicId !== "CT553/" + file.name) ?? [],
      );

      return newPublicIdImageListToKeep;
    });

    setPublicIdImageListToKeep((prev) => {
      const newPublicIdImageListToKeep = new Map(prev);
      if (newPublicIdImageListToKeep.get(key)?.length === 0) {
        newPublicIdImageListToKeep.delete(key);
      }
      return newPublicIdImageListToKeep;
    });
  }

  return (
    <>
      <Form.List name="products">
        {(fields, { add, remove }) => (
          <div style={{ display: "flex", rowGap: 16, flexDirection: "column" }}>
            {fields.map((field) => (
              <Card
                className="border border-gray-300 shadow-md transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0px_0px_5px_1px_rgba(0,0,0,0.24)]"
                size="small"
                title={`Sản phẩm ${field.name + 1}`}
                key={field.key}
                extra={
                  viewOnly || fields.length === 1 ? null : (
                    <Popconfirm
                      title="Xóa sản phẩm"
                      description="Bạn có chắc muốn xóa sản phẩm này không?"
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => {
                        remove(field.name);

                        // when remove a product, remove its images from fileList, publicIdImageListToKeep and update fileList, publicIdImageListToKeep state from index this product to the end
                        const newFileList = new Map(fileList);
                        newFileList.delete(field.name);
                        const tempFileList = new Map(
                          Array.from(newFileList).map(([key, value]) => [
                            key > field.name ? key - 1 : key,
                            value,
                          ]),
                        );
                        setFileList(tempFileList);

                        const newFileListToUpdate = new Map(fileListToUpdate);
                        newFileListToUpdate.delete(field.name);
                        const tempFileListToUpdate = new Map(
                          Array.from(newFileListToUpdate).map(
                            ([key, value]) => [
                              key > field.name ? key - 1 : key,
                              value,
                            ],
                          ),
                        );
                        setFileListToUpdate(tempFileListToUpdate);

                        const newPublicIdImageListToKeep = new Map(
                          publicIdImageListToKeep,
                        );
                        newPublicIdImageListToKeep.delete(field.name);
                        const tempPublicIdImageListToKeep = new Map(
                          Array.from(newPublicIdImageListToKeep).map(
                            ([key, value]) => [
                              key > field.name ? key - 1 : key,
                              value,
                            ],
                          ),
                        );
                        setPublicIdImageListToKeep(tempPublicIdImageListToKeep);
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
                    {/* productName */}
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

                    {/* description */}
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

                  <Col span={11}>
                    {/* sellinPriceValue */}
                    <Form.Item
                      name={[field.name, "sellingPrice", "sellingPriceValue"]}
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
                        placeholder="Ví dụ: 250,000"
                        readOnly={viewOnly}
                      />
                    </Form.Item>

                    {/* sellinPriceFluctuation */}
                    <Form.Item
                      name={[
                        field.name,
                        "sellingPrice",
                        "sellingPriceFluctuation",
                      ]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập giá biến động bán ra",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        addonBefore="Biến động bán ra"
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
                      name={[field.name, "buyingPrice", "buyingPriceValue"]}
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
                      name={[
                        field.name,
                        "buyingPrice",
                        "buyingPriceFluctuation",
                      ]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập giá biến động mua vào",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        addonBefore="Biến động mua vào"
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
                    name={[field.name, "productImageFiles"]}
                    label="Hình ảnh (tối đa 3 ảnh)"
                    valuePropName="fileList"
                    rules={[
                      {
                        validator: () => {
                          if (
                            // (fileList.get(field.name) &&
                            //   fileList.get(field.name)?.length === 0) ||
                            !fileList.get(field.name)
                          ) {
                            return Promise.reject(
                              new Error("Vui lòng tải lên ít nhất 1 ảnh"),
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
                      fileList={fileList.get(field.name) || []}
                      beforeUpload={() => false}
                      onPreview={handlePreview}
                      onChange={(info) => {
                        //when remove a file, if the file list is empty, remove the key from fileList and publicIdImageListToKeep
                        if (info.fileList.length === 0) {
                          setFileList((prev) => {
                            const newFileList = new Map(prev);
                            newFileList.delete(field.name);
                            return newFileList;
                          });
                          setFileListToUpdate((prev) => {
                            const newFileListToUpdate = new Map(prev);
                            newFileListToUpdate.delete(field.name);
                            return newFileListToUpdate;
                          });
                          setPublicIdImageListToKeep((prev) => {
                            const newPublicIdImageListToKeep = new Map(prev);
                            newPublicIdImageListToKeep.delete(field.name);
                            return newPublicIdImageListToKeep;
                          });
                        } else {
                          setFileList((prev) => {
                            const newFileList = new Map(prev);
                            newFileList.set(field.name, info.fileList);
                            return newFileList;
                          });
                          setFileListToUpdate((prev) => {
                            const newFileListToUpdate = new Map(prev);
                            newFileListToUpdate.set(
                              field.name,
                              info.fileList.filter(
                                (file) => file.status !== "done",
                              ),
                            );
                            return newFileListToUpdate;
                          });
                        }
                      }}
                      onRemove={(file) => {
                        handleRemove(field.name, file);
                      }}
                      showUploadList={{
                        showRemoveIcon: !viewOnly,
                      }}
                    >
                      {(fileList.get(field.name)?.length ?? 0) < 3 && (
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

            {!viewOnly && (
              <Button type="dashed" onClick={() => add()} block>
                + Thêm sản phẩm
              </Button>
            )}
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
