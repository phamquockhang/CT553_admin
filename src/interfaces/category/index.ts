import { UploadFile } from "antd";

export interface IItem {
  itemId: number;
  itemName: string;
  isActivated: boolean;
  products: IProduct[];
  createdAt: string;
  updatedAt?: string;
}

export interface IBriefItem {
  itemId: number;
  itemName: string;
  isActivated: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemFilterCriteria {
  isActivated?: string;
}

export interface IProduct {
  productId: number;
  productName: string;
  productUnit: string;
  description: string;
  isActivated: boolean;
  itemId: number;
  productImages: IProductImage[];
  buyingPrice: IBuyingPrice;
  sellingPrice: ISellingPrice;
  weight: IWeight;
  productImageFiles?: UploadFile[];
  createdAt: string;
  updatedAt?: string;
}

export interface IBriefProduct {
  productId: number;
  productName: string;
  description: string;
  isActivated: boolean;
  itemId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilterCriteria {
  isActivated?: string;
  itemId?: string;
}

export interface IProductImage {
  productImageId: number;
  publicId: string;
  imageUrl: string;
  productId: number;
  createdAt: string;
}

export interface IBuyingPrice {
  buyingPriceId: string;
  buyingPriceValue: number;
  buyingPriceFluctuation?: number;
  isCurrent?: boolean;
  createdAt?: string;
}

export interface ISellingPrice {
  sellingPriceId: string;
  sellingPriceValue: number;
  sellingPriceFluctuation?: number;
  isCurrent?: boolean;
  createdAt?: string;
}

export interface IWeight {
  weightId: string;
  weightValue: number;
  isCurrent?: boolean;
  createdAt?: string;
}
