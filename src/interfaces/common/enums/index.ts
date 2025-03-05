//PERMISSIONS
export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum Module {
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
  ROLES = "ROLE",
  PERMISSIONS = "PERMISSION",
  ITEMS = "ITEM",
  PRODUCTS = "PRODUCT",
  ORDERS = "ORDER",
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

export enum PaidStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
}
