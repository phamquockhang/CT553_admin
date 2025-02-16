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

                    <div className="h- p-1 pb-2">
                      <p className="mb-3 font-semibold">
                        {product.productName}
                      </p>

                      <div className="flex justify-between text-xs">
                        <p>
                          Bán ra:
                          <span className="font-semibold text-blue-800">
                            {" "}
                            {product.sellingPrice.sellingPriceValue.toLocaleString()}{" "}
                          </span>
                          VNĐ/kg
                        </p>

                        {product.sellingPrice.sellingPriceFluctuation !==
                          undefined &&
                          product.sellingPrice.sellingPriceFluctuation > 0 && (
                            <p>
                              (
                              <span className="font-semibold text-yellow-600">
                                {"±" +
                                  product.sellingPrice.sellingPriceFluctuation.toLocaleString()}{" "}
                              </span>
                              VNĐ/con)
                            </p>
                          )}
                      </div>

                      <div className="flex justify-between text-xs">
                        <p>
                          Mua vào:
                          <span className="font-semibold text-green-700">
                            {" "}
                            {product.buyingPrice.buyingPriceValue.toLocaleString()}{" "}
                          </span>
                          VNĐ/kg
                        </p>
                        {product.buyingPrice.buyingPriceFluctuation !==
                          undefined &&
                          product.buyingPrice.buyingPriceFluctuation > 0 && (
                            <p>
                              (
                              <span className="font-semibold text-yellow-600">
                                {"±" +
                                  product.buyingPrice.buyingPriceFluctuation.toLocaleString()}{" "}
                              </span>
                              VNĐ/con)
                            </p>
                          )}
                      </div>
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
