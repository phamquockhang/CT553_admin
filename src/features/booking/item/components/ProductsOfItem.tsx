import { Col, Row } from "antd";
import { IItem } from "../../../../interfaces";

interface ProductsOfItemProps {
  itemToUpdate?: IItem;
}

const ProductsOfItem: React.FC<ProductsOfItemProps> = ({ itemToUpdate }) => {
  return (
    <div className="mb-2">
      <p className="mb-1 mt-4">Các sản phẩm</p>

      <Row>
        {itemToUpdate &&
          itemToUpdate.products &&
          itemToUpdate.products.length > 0 && (
            <>
              {itemToUpdate.products.map((product) => (
                <Col span={8} key={product.productId}>
                  <div className="m-1 overflow-hidden rounded-md border border-gray-300 bg-white">
                    <img
                      src={
                        product.productImages &&
                        product.productImages.length > 0 &&
                        product.productImages[0].imageUrl
                          ? product.productImages[0].imageUrl
                          : "https://placehold.co/400"
                      }
                      alt={product.productName}
                      className="h-36 w-full object-cover"
                    />

                    <div className="p-1">
                      <p>{product.productName}</p>
                      <p className="text-base font-semibold text-red-600">
                        250.000đ
                      </p>
                    </div>
                  </div>
                </Col>
              ))}
            </>
          )}
      </Row>
    </div>
  );
};

export default ProductsOfItem;
