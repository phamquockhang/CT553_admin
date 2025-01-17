import { Dayjs } from "dayjs";

export interface IStaff {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  password?: string;
  // country: ICountry;
  isActivated: boolean;
  dob: string | Dayjs;
  role: IRole;
  createdAt: string;
  updatedAt?: string;
}

export interface StaffFilterCriteria {
  isActivated?: string;
}

export interface ICustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  password?: string;
  // country: ICountry;
  isActivated: boolean;
  dob: string | Dayjs;
  role: IRole;
  createdAt: string;
  updatedAt?: string;
}

export interface CustomerFilterCriteria {
  isActivated?: string;
}

export interface IPermission {
  permissionId: number;
  name: string;
  apiPath: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  module: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PermissionFilterCriteria {
  method?: string;
  module?: string;
}

export interface IRole {
  roleId: number;
  name: string;
  description: string;
  isActivated: boolean;
  permissions: IPermission[];
  createdAt: string;
  updatedAt?: string;
}

export interface RoleFilterCriteria {
  isActivated?: string;
}

export interface IAuthRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
}
