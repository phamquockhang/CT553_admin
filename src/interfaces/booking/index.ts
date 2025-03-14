export interface ISellingOrder {
  sellingOrderId: string;
  customerId?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
  totalAmount: number;
  usedScore: number;
  earnedScore: number;
  paymentStatus: string;
  orderStatus: string;
  orderStatuses: IOrderStatus[];
  sellingOrderDetails: ISellingOrderDetail[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IBriefSellingOrderStatus {
  orderStatus: string;
  paymentStatus: string;
}

export interface IOrderStatus {
  orderStatusId?: string;
  status: string;
  createdAt?: string;
}

export interface ISellingOrderDetail {
  sellingOrderDetailId?: number;
  productId: number;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SellingOrderFilterCriteria {
  orderStatus?: string;
  paymentStatus?: string;
}

export const POINT_VALUE = 1;
