import { Card, Col, Collapse, CollapseProps, Form, Input, Switch } from "antd";
import { FormInstance } from "antd/lib";
import { ICustomer } from "../../../../interfaces";
import AddCustomer from "../../../auth/customers/AddCustomer";
import AddAddress from "../../../auth/customers/components/AddAddress";
import FindCustomer from "./FindCustomer";

interface AddCustomerToOrderFormProps {
  form: FormInstance<any>;
  hasCreateCustomer: boolean;
  setHasCreateCustomer: React.Dispatch<React.SetStateAction<boolean>>;

  setChoosenCustomer: React.Dispatch<
    React.SetStateAction<ICustomer | undefined>
  >;
  setFormattedAddress: React.Dispatch<React.SetStateAction<string | undefined>>;

  provinceId: number | undefined;
  setProvinceId: React.Dispatch<React.SetStateAction<number | undefined>>;
  districtId: number | undefined;
  setDistrictId: React.Dispatch<React.SetStateAction<number | undefined>>;
  wardCode: string | undefined;
  setWardCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  description: string | undefined;
  setDescription: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const AddCustomerToOrderForm: React.FC<AddCustomerToOrderFormProps> = ({
  form,
  hasCreateCustomer,
  setChoosenCustomer,

  setFormattedAddress,
  setHasCreateCustomer,

  provinceId,
  setProvinceId,
  districtId,
  setDistrictId,
  wardCode,
  setWardCode,
  description,
  setDescription,
}) => {
  const handleCheck = (checked: boolean) => {
    setHasCreateCustomer(checked);
  };

  const items: CollapseProps["items"] = [
    {
      key: "createCustomer",
      label: "Có lưu lại thông tin khách hàng không?",
      extra: (
        <Switch
          checkedChildren="Có"
          unCheckedChildren="Không"
          defaultChecked={false}
          value={hasCreateCustomer}
          // disabled={viewOnly}
          // checked={isModuleChecked(module)}
          // onClick={(_, event) => event.stopPropagation()}
          onChange={(checked) => handleCheck(checked)}
        />
      ),

      children: (
        <>
          <Col key={`1`} span={24}>
            <Card size="small">
              <div className="mb-4 flex justify-between gap-8">
                <FindCustomer
                  viewMode={!hasCreateCustomer}
                  setChoosenCustomer={setChoosenCustomer}
                />

                <AddCustomer />
              </div>
              <div className="flex gap-8">
                <Form.Item
                  className="flex-1"
                  label="Tên khách hàng"
                  name="customerName"
                  rules={[
                    {
                      required: hasCreateCustomer,
                      message: "Vui lòng nhập tên khách hàng",
                    },
                  ]}
                >
                  <Input
                    disabled={!hasCreateCustomer}
                    // readOnly={!hasCreateCustomer}
                    placeholder="Nhập tên khách hàng"
                  />
                </Form.Item>

                <Form.Item
                  className="flex-1"
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    {
                      required: hasCreateCustomer,
                      message: "Vui lòng nhập số điện thoại",
                    },
                    {
                      pattern: new RegExp("^(0|\\+84)\\d{9,10}$", "g"),
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    disabled={!hasCreateCustomer}
                    // readOnly={!hasCreateCustomer}
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Item>
              </div>

              <div className="flex gap-8">
                <Form.Item
                  className="flex-1"
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: hasCreateCustomer,
                      message: "Vui lòng nhập email",
                    },
                    {
                      type: "email",
                      message: "Email không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    disabled={!hasCreateCustomer}
                    // readOnly={!hasCreateCustomer}
                    placeholder="Nhập email"
                  />
                </Form.Item>
              </div>

              <h1 className="mb-1 text-lg font-semibold">Địa chỉ giao hàng</h1>
              <AddAddress
                viewMode={!hasCreateCustomer}
                form={form}
                provinceId={provinceId}
                setProvinceId={setProvinceId}
                districtId={districtId}
                setDistrictId={setDistrictId}
                wardCode={wardCode}
                setWardCode={setWardCode}
                description={description}
                setDescription={setDescription}
                setFormattedAddress={setFormattedAddress}
              />

              <div className="flex gap-8">
                <Form.Item className="flex-1" label="Ghi chú" name="note">
                  <Input.TextArea
                    disabled={!hasCreateCustomer}
                    // readOnly={!hasCreateCustomer}
                    rows={1}
                    placeholder="Nhập ghi chú"
                  />
                </Form.Item>
              </div>
            </Card>
          </Col>
        </>
      ),
    },
  ];

  return <Collapse items={items} />;
};

export default AddCustomerToOrderForm;
