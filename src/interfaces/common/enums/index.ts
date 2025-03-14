//PERMISSIONS
export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum Module {
  ROLES = "ROLE",
  PERMISSIONS = "PERMISSION",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
  ITEMS = "ITEM",
  PRODUCTS = "PRODUCT",
  SELLING_ORDERS = "SELLING ORDER",
  BUYING_ORDERS = "BUYING ORDER",
  ORDER_STATUS = "ORDER STATUS",
  CART = "CART",
  ADDRESS = "ADDRESS",
  SCORE = "SCORE",
  PRODUCT_IMAGES = "PRODUCT IMAGE",
  SELLING_PRICES = "SELLING PRICE",
  BUYING_PRICES = "BUYING PRICE",
  WEIGHTS = "WEIGHT",
  PAYMENT_METHODS = "PAYMENT METHOD",
  TRANSACTIONS = "TRANSACTION",
}

export enum RoleName {
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  DELIVERING = "DELIVERING",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  COD = "COD",
  PENDING = "PENDING",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  SUCCESS = "SUCCESS",
  EXPIRED = "EXPIRED",
}

export enum whenCreate_PaymentStatus {
  COD = "COD",
  SUCCESS = "SUCCESS",
}

export enum TransactionStatus {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}
