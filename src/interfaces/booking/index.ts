import { Dayjs } from "dayjs";
import { DiscountType, VoucherStatus } from "../common";

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
  usedVoucher?: IUsedVoucher;
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

export interface IVoucher {
  voucherId: number;
  voucherCode: string;
  status: VoucherStatus;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string | Dayjs;
  endDate: string | Dayjs;
  usageLimit: number;
  usedCount: number;
  usedVoucher?: IUsedVoucher[];
  createdAt?: string;
  updatedAt?: string;

  dateRange?: [string | Dayjs, string | Dayjs];
}

export interface IBriefVoucher {
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string | Dayjs;
  endDate: string | Dayjs;
  usageLimit: number;
}

export interface VoucherFilterCriteria {
  status?: string;
  discountType?: string;
}

export interface IUsedVoucher {
  usedVoucherId: number;
  voucherCode: string;
  sellingOrderId: string;
  discountAmount: number;
  createdAt: string;
}

export interface ISellingOrderStatistics {
  totalRevenue: number;
  totalNewOrders: number;
  totalDeliveringOrders: number;
  totalDeliveredOrders: number;
  totalCancelledOrders: number;
}

export const POINT_VALUE = 1;
