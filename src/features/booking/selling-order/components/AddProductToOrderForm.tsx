import { Collapse, CollapseProps } from "antd";
import { useState } from "react";
import { IProduct } from "../../../../interfaces";
import FindProduct from "./FindProduct";
import SelectedProducts from "./SelectedProducts";

const AddProductToOrderForm: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);

  const items: CollapseProps["items"] = [
    {
      key: "add-product",
      label: "Danh sách sản phẩm",
      // extra: (
      //   <Switch
      //     checkedChildren="Có"
      //     unCheckedChildren="Không"
      //     defaultChecked={false}
      //     value={hasCreateCustomer}
      //     // disabled={viewOnly}
      //     // checked={isModuleChecked(module)}
      //     // onClick={(_, event) => event.stopPropagation()}
      //     onChange={(checked) => handleCheck(checked)}
      //   />
      // ),

      children: (
        <>
          <div className="mx-auto w-full p-0">
            <FindProduct
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
            />

            <SelectedProducts
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
            />
          </div>
        </>
      ),
    },
  ];

  console.log("selectedProducts", selectedProducts);

  return (
    <div className="">
      <Collapse items={items} />
    </div>
  );
};

export default AddProductToOrderForm;
