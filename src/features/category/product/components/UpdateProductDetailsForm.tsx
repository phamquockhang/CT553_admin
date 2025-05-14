import { PlusOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  FormInstance,
  Image,
  Input,
  InputNumber,
  Row,
  Tooltip,
  Upload,
} from "antd";
import { UploadFile } from "antd/lib";
import { useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { FileType, IProduct } from "../../../../interfaces";
import { getBase64 } from "../../../../utils";

interface UpdateProductDetailsFormProps {
  form: FormInstance<IProduct>;

  fileList: Map<number, UploadFile[]>;
  setFileList: React.Dispatch<React.SetStateAction<Map<number, UploadFile[]>>>;

  setFileListToUpdate: React.Dispatch<
    React.SetStateAction<Map<number, UploadFile[]>>
  >;

  setPublicIdImageListToKeep: React.Dispatch<
    React.SetStateAction<Map<number, string[]>>
  >;
}

const UpdateProductDetailsForm: React.FC<UpdateProductDetailsFormProps> = ({
  form,
  fileList,
  setFileList,
  setFileListToUpdate,
  setPublicIdImageListToKeep,
}) => {
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
      <Row className="flex justify-between">
        <Col span={11}>
          {/* productName */}
          <Form.Item
            name="productName"
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
              placeholder="Tên sản phẩm, ví dụ: Tôm sú hàng 2, Tôm sú hàng 3, ..."
            />
          </Form.Item>

          <Row className="flex justify-between">
            <Col span={14}>
              {/* productUnit */}
              <Form.Item
                className="flex-1"
                name="productUnit"
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
                  //   onChange={() => {
                  //     form.setFieldsValue({
                  //       products: fields.map((field) => ({
                  //         ...form.getFieldValue(["products", field.name]),
                  //       })),
                  //     });
                  //   }}
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
                  className="right-input"
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
                  placeholder="Ví dụ: 250"
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
              className="right-input"
              style={{ width: "100%" }}
              min={0}
              addonBefore="Bán ra"
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
              className="right-input"
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
              className="right-input"
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
              className="right-input"
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
            listType="picture-card"
            fileList={fileList.get(0) || []}
            beforeUpload={() => false}
            onPreview={handlePreview}
            onChange={(info) => {
              //when remove a file, if the file list is empty, remove the key from fileList and publicIdImageListToKeep
              if (info.fileList.length === 0) {
                setFileList((prev) => {
                  const newFileList = new Map(prev);
                  newFileList.delete(0);
                  return newFileList;
                });
                setFileListToUpdate((prev) => {
                  const newFileListToUpdate = new Map(prev);
                  newFileListToUpdate.delete(0);
                  return newFileListToUpdate;
                });
                setPublicIdImageListToKeep((prev) => {
                  const newPublicIdImageListToKeep = new Map(prev);
                  newPublicIdImageListToKeep.delete(0);
                  return newPublicIdImageListToKeep;
                });
              } else {
                setFileList((prev) => {
                  const newFileList = new Map(prev);
                  newFileList.set(0, info.fileList);
                  return newFileList;
                });
                setFileListToUpdate((prev) => {
                  const newFileListToUpdate = new Map(prev);
                  newFileListToUpdate.set(
                    0,
                    info.fileList.filter((file) => file.status !== "done"),
                  );
                  return newFileListToUpdate;
                });
              }
            }}
            onRemove={(file) => {
              handleRemove(0, file);
            }}
          >
            {(fileList.get(0)?.length ?? 0) < 3 && (
              <button style={{ border: 0, background: "none" }} type="button">
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
    </>
  );
};

export default UpdateProductDetailsForm;
