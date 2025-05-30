import { Module } from "../enums";

export const PERMISSIONS = {
  [Module.STAFF]: {
    GET_PAGINATION: { method: "GET", apiPath: "/api/v1/staffs" },
    // GET_LOGGED_IN: { method: "GET", apiPath: "/api/v1/auth/login/staff" },
    GET_BY_ID: { method: "GET", apiPath: "/api/v1/staffs/{id}" },
    CREATE: { method: "POST", apiPath: "/api/v1/staffs" },
    UPDATE: { method: "PUT", apiPath: "/api/v1/staffs/{id}" },
    DELETE: { method: "DELETE", apiPath: "/api/v1/staffs/{id}" },
    CHANGE_PASSWORD: {
      method: "PUT",
      apiPath: "/api/v1/staff/{id}/change-password",
    },
  },
  [Module.CUSTOMER]: {
    GET_PAGINATION: { method: "GET", apiPath: "/api/v1/customers" },
    GET_BY_ID: { method: "GET", apiPath: "/api/v1/customers/{id}" },
    CREATE: { method: "POST", apiPath: "/api/v1/customers" },
    UPDATE: { method: "PUT", apiPath: "/api/v1/customers/{id}" },
    DELETE: { method: "DELETE", apiPath: "/api/v1/customers/{id}" },
  },
  [Module.ROLES]: {
    GET_PAGINATION: { method: "GET", apiPath: "/api/v1/roles" },
    GET_BY_ID: { method: "GET", apiPath: "/api/v1/roles/{id}" },
    CREATE: { method: "POST", apiPath: "/api/v1/roles" },
    UPDATE: { method: "PUT", apiPath: "/api/v1/roles/{id}" },
    DELETE: { method: "DELETE", apiPath: "/api/v1/roles/{id}" },
  },
  [Module.PERMISSIONS]: {
    GET_PAGINATION: { method: "GET", apiPath: "/api/v1/permissions" },
    GET_BY_ID: { method: "GET", apiPath: "/api/v1/permissions/{id}" },
    CREATE: { method: "POST", apiPath: "/api/v1/permissions" },
    UPDATE: { method: "PUT", apiPath: "/api/v1/permissions/{id}" },
    DELETE: { method: "DELETE", apiPath: "/api/v1/permissions/{id}" },
  },
  [Module.ITEMS]: {
    GET_PAGINATION: { method: "GET", apiPath: "/api/v1/items" },
    GET_BY_ID: { method: "GET", apiPath: "/api/v1/items/{id}" },
    CREATE: { method: "POST", apiPath: "/api/v1/items" },
    UPDATE: { method: "PUT", apiPath: "/api/v1/items/{id}" },
    DELETE: { method: "DELETE", apiPath: "/api/v1/items/{id}" },
  },
  [Module.PRODUCTS]: {
    GET_PAGINATION: { method: "GET", apiPath: "/api/v1/products" },
    GET_BY_ID: { method: "GET", apiPath: "/api/v1/products/{id}" },
    CREATE: { method: "POST", apiPath: "/api/v1/products" },
    UPDATE: { method: "PUT", apiPath: "/api/v1/products/{id}" },
    DELETE: { method: "DELETE", apiPath: "/api/v1/products/{id}" },
  },
  [Module.SELLING_ORDERS]: {
    GET_PAGINATION: { method: "GET", apiPath: "/api/v1/selling_orders" },
    GET_BY_ID: { method: "GET", apiPath: "/api/v1/selling_orders/{id}" },
    CREATE: { method: "POST", apiPath: "/api/v1/selling_orders" },
    UPDATE: { method: "PUT", apiPath: "/api/v1/selling_orders/{id}" },
  },
  [Module.TRANSACTIONS]: {
    GET_PAGINATION: { method: "GET", apiPath: "/api/v1/transactions" },
    GET_BY_ID: { method: "GET", apiPath: "/api/v1/transactions/{id}" },
    CREATE: { method: "POST", apiPath: "/api/v1/transactions" },
  },
  [Module.VOUCHERS]: {
    GET_PAGINATION: { method: "GET", apiPath: "/api/v1/vouchers" },
    GET_BY_ID: { method: "GET", apiPath: "/api/v1/vouchers/{id}" },
    CREATE: { method: "POST", apiPath: "/api/v1/vouchers" },
    UPDATE: { method: "PUT", apiPath: "/api/v1/vouchers/{id}" },
    DELETE: { method: "DELETE", apiPath: "/api/v1/vouchers/{id}" },
  },
  [Module.CONVERSATIONS]: {
    GET_PAGINATION: { method: "GET", apiPath: "/api/v1/conversations" },
    GET_BY_ID: { method: "GET", apiPath: "/api/v1/conversations/{id}" },
    CREATE: { method: "POST", apiPath: "/api/v1/conversations" },
    UPDATE: { method: "PUT", apiPath: "/api/v1/conversations/{id}" },
    DELETE: { method: "DELETE", apiPath: "/api/v1/conversations/{id}" },
  },
  [Module.MESSAGES]: {
    GET_PAGINATION: { method: "GET", apiPath: "/api/v1/messages" },
    GET_BY_ID: { method: "GET", apiPath: "/api/v1/messages/{id}" },
    CREATE: { method: "POST", apiPath: "/api/v1/messages" },
    UPDATE: { method: "PUT", apiPath: "/api/v1/messages/{id}" },
    DELETE: { method: "DELETE", apiPath: "/api/v1/messages/{id}" },
  },
};

export const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

export const PRIMARY_COLOR = "#003F8F";
