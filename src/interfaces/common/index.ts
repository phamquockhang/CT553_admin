import { GetProp } from "antd";
import { UploadProps } from "antd/lib";

export * from "./enums";
export * from "./constants";

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  error?: string;
  message?: string;
  payload?: T;
  data?: T;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface Page<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SortParams {
  sortBy?: string;
  direction?: string;
}

// export interface ElasticSortParams {
//   sort: string;
//   order: string;
// }

export interface TimeRange {
  startTime: string;
  endTime: string;
}

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
