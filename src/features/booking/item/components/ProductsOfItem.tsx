import { Col, Row } from "antd";
import { IItem } from "../../../../interfaces";

interface ProductsOfItemProps {
  itemToUpdate?: IItem;
}

const ProductsOfItem: React.FC<ProductsOfItemProps> = ({ itemToUpdate }) => {
  return (
    <div className="mb-2">
      {itemToUpdate &&
        itemToUpdate.products &&
        itemToUpdate.products.length > 0 && (
          <p className="mb-1 mt-4">Các sản phẩm</p>
        )}

      <Row>
        {itemToUpdate &&
          itemToUpdate.products &&
          itemToUpdate.products.length > 0 && (
            <>
              {itemToUpdate.products.map((product) => (
                <Col span={8} key={product.productId}>
                  <div className="m-1 overflow-hidden rounded-md border border-gray-300 bg-white transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0px_0px_5px_1px_rgba(0,0,0,0.24)]">
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
                      <p className="font-semibold">{product.productName}</p>

                      <p>
                        Bán ra:
                        <span className="font-semibold text-blue-800">
                          {" "}
                          {product.sellingPrice.sellingPriceValue.toLocaleString()}{" "}
                        </span>
                        VNĐ/kg (
                        <span className="font-semibold text-blue-800">
                          {product.sellingPrice.sellingPriceFluctuation.toLocaleString()}{" "}
                        </span>
                        VNĐ/con)
                      </p>

                      <p>
                        Mua vào:
                        <span className="font-semibold text-green-700">
                          {" "}
                          {product.buyingPrice.buyingPriceValue.toLocaleString()}{" "}
                        </span>
                        VNĐ/kg (
                        <span className="font-semibold text-green-700">
                          {product.buyingPrice.buyingPriceFluctuation.toLocaleString()}{" "}
                        </span>
                        VNĐ/con)
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
