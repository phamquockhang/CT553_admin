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
};

// export const ROUTE_TYPE_TRANSLATION: Record<RouteType, string> = {
//   [RouteType.DOMESTIC]: "Nội địa",
//   [RouteType.INTERNATIONAL]: "Quốc tế",
// };

// export const PASSENGER_TYPE_TRANSLATION: Record<PassengerType, string> = {
//   [PassengerType.ADULT]: "Người lớn",
//   [PassengerType.CHILD]: "Trẻ em",
//   [PassengerType.INFANT]: "Em bé",
// };

// export const COUPON_TYPE_TRANSLATION: Record<CouponType, string> = {
//   [CouponType.AMOUNT]: "VND",
//   [CouponType.PERCENTAGE]: "%",
// };

export const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

export const PRIMARY_COLOR = "#003F8F";
