import { ISellingOrder } from "../booking";

export interface ITransaction {
  transactionId: string;
  sellingOrder: ISellingOrder;
  paymentMethod: IPaymentMethod;
  status: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionFilterCriteria {
  status?: string;
  paymentMethodId?: string;
}

export interface IOverviewTransaction {
  transactionId: string;
  sellingOrder: IBriefSellOrder;
  paymentMethod: IPaymentMethod;
  status: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBriefSellOrder {
  sellingOrderId: string;
  customerName: string;
  orderStatus: string;
}

export interface IPaymentMethod {
  paymentMethodId: string;
  paymentMethodName: string;
  createdAt: string;
}
