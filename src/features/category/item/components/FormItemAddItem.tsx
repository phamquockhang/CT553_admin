import { Form, Input, Switch } from "antd";

interface FormItemAddItemProps {
  viewOnly?: boolean;
}

const FormItemAddItem: React.FC<FormItemAddItemProps> = ({ viewOnly }) => {
  return (
    <div className="flex gap-8">
      <Form.Item
        className="flex-1"
        label="Tên mặt hàng"
        name="itemName"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên mặt hàng",
          },
          {
            // vietnamese name has anccent characters
            pattern:
              /^[0-9a-zA-ZăâđêôơưàảãáạăằẳẵắặâầẩẫấậèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵĂÂĐÊÔƠƯÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚOỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ\s]+$/,
            message: "Tên mặt hàng không chứa ký tự đặc biệt",
          },
        ]}
      >
        <Input
          allowClear
          readOnly={viewOnly}
          placeholder="Tên mặt hàng, ví dụ: Tôm sú, Tôm càng xanh, ..."
        />
      </Form.Item>

      <Form.Item
        className="flex-1"
        label="Trạng thái"
        name="isActivated"
        valuePropName="checked"
      >
        <Switch
          defaultValue={true}
          disabled={viewOnly}
          checkedChildren="ACTIVE"
          unCheckedChildren="INACTIVE"
        />
      </Form.Item>
    </div>
  );
};

export default FormItemAddItem;
