import { Collapse, CollapseProps } from "antd";
import { ISellingOrderDetail } from "../../../../interfaces";
import FindProduct from "./FindProduct";
import SelectedProducts from "./SelectedProducts";

interface AddProductToOrderFormProps {
  selectedProductsDetails: ISellingOrderDetail[];
  setSelectedProductsDetails: React.Dispatch<
    React.SetStateAction<ISellingOrderDetail[]>
  >;
}

const AddProductToOrderForm: React.FC<AddProductToOrderFormProps> = ({
  selectedProductsDetails,
  setSelectedProductsDetails,
}) => {
  const items: CollapseProps["items"] = [
    {
      key: "add-product",
      label: "Danh sách sản phẩm",
      extra: (
        <>
          <div className="flex items-center">
            <div className="text-sm text-gray-500">
              {selectedProductsDetails.length} sản phẩm
            </div>
          </div>
        </>
      ),

      children: (
        <>
          <div className="mx-auto w-full p-0">
            <FindProduct
              selectedProductsDetails={selectedProductsDetails}
              setSelectedProductsDetails={setSelectedProductsDetails}
            />

            <SelectedProducts
              selectedProductsDetails={selectedProductsDetails}
              setSelectedProductsDetails={setSelectedProductsDetails}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="">
      <Collapse items={items} />
    </div>
  );
};

export default AddProductToOrderForm;
