import { AxiosInstance } from "axios";
import { ApiResponse, IBuyingPrice, ISellingPrice } from "../../interfaces";
import { createApiClient } from "../api-client";

interface IProductPriceService {
  getAllBuyingPrice(productId: number): Promise<ApiResponse<IBuyingPrice[]>>;
  getAllSellingPrice(productId: number): Promise<ApiResponse<ISellingPrice[]>>;
  createBuyingPrice(
    productId: number,
    newBuyingPrice: Omit<IBuyingPrice, "buyingPriceId">,
  ): Promise<ApiResponse<IBuyingPrice>>;
  createSellingPrice(
    productId: number,
    newSellingPrice: Omit<ISellingPrice, "sellingPriceId">,
  ): Promise<ApiResponse<ISellingPrice>>;
}

const buyingPriceApiClient: AxiosInstance = createApiClient("buying_prices");
const sellingPriceApiClient: AxiosInstance = createApiClient("selling_prices");

class ProductPriceService implements IProductPriceService {
  async getAllBuyingPrice(
    productId: number,
  ): Promise<ApiResponse<IBuyingPrice[]>> {
    return await buyingPriceApiClient.get(`/${productId}`);
  }

  async getAllSellingPrice(
    productId: number,
  ): Promise<ApiResponse<ISellingPrice[]>> {
    return await sellingPriceApiClient.get(`/${productId}`);
  }

  async createBuyingPrice(
    productId: number,
    newBuyingPrice: Omit<IBuyingPrice, "buyingPriceId">,
  ): Promise<ApiResponse<IBuyingPrice>> {
    return await buyingPriceApiClient.post(`/${productId}`, newBuyingPrice);
  }

  async createSellingPrice(
    productId: number,
    newSellingPrice: Omit<ISellingPrice, "sellingPriceId">,
  ): Promise<ApiResponse<ISellingPrice>> {
    return await sellingPriceApiClient.post(`/${productId}`, newSellingPrice);
  }
}

export const productPriceService = new ProductPriceService();
