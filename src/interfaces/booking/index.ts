export interface IOrder {
  orderId: string;
  customerId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  orderStatuses: IOrderStatus[];
  orderDetails: IOrderDetail[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IOrderStatus {
  orderStatusId?: string;
  status: string;
  createdAt?: string;
}

export interface IOrderDetail {
  orderDetailId: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderFilterCriteria {
  orderStatus?: string;
  paymentStatus?: string;
}
