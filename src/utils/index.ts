import {
  blue,
  green,
  grey,
  greyDark,
  orange,
  purple,
  red,
  yellow,
} from "@ant-design/colors";
import { SortOrder } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
  FileType,
  IDistrict,
  IProvince,
  IWard,
  OrderStatus,
} from "../interfaces";

export function useDynamicTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export function colorMethod(method: "GET" | "POST" | "PUT" | "DELETE") {
  switch (method) {
    case "POST":
      return blue[6];
    case "PUT":
      return orange[5];
    case "GET":
      return green[6];
    case "DELETE":
      return red[5];
    default:
      return grey[10];
  }
}

export function colorFilterIcon(filtered: boolean) {
  return filtered ? "#60C158" : "#fff";
}

export function colorSortUpIcon(sortOrder: SortOrder | undefined) {
  return sortOrder === "ascend" ? "#60C158" : "#fff";
}

export function colorSortDownIcon(sortOrder: SortOrder | undefined) {
  return sortOrder === "descend" ? "#60C158" : "#fff";
}

export function getActiveColor(active: boolean) {
  return active ? blue[7] : red[3];
}

export function getUniqueColorByString(str: string) {
  const colors = [
    "blue",
    "green",
    "orange",
    "red",
    "yellow",
    "pink",
    "purple",
    "cyan",
    "magenta",
    "geekblue",
    "volcano",
    "gold",
    "lime",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
}

export function getColorForTag(str: string) {
  if (str === OrderStatus.PENDING) return yellow[7];
  else if (str === OrderStatus.CONFIRMED) return purple[6];
  else if (str === OrderStatus.PREPARING) return orange[6];
  else if (str === OrderStatus.DELIVERING) return greyDark[6];
  else if (str === OrderStatus.DELIVERED) return green[6];
  else if (str === OrderStatus.COMPLETED) return blue[6];
  else if (str === OrderStatus.CANCELLED) return red[5];
}

export function translateSellingOrderStatus(status: string) {
  switch (status) {
    case OrderStatus.PENDING:
      return "Đang chờ xác nhận";
    case OrderStatus.CONFIRMED:
      return "Đã xác nhận";
    case OrderStatus.PREPARING:
      return "Đang chuẩn bị";
    case OrderStatus.DELIVERING:
      return "Đang giao hàng";
    case OrderStatus.DELIVERED:
      return "Đã giao hàng";
    case OrderStatus.COMPLETED:
      return "Hoàn thành";
    case OrderStatus.CANCELLED:
      return "Đã hủy";
    default:
      return status;
  }
}

export function groupBy<T, K>(
  list: T[],
  keyGetter: (item: T) => K,
): Map<K, T[]> {
  const map = new Map<K, T[]>();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export function getDefaultSortOrder(
  searchParams: URLSearchParams,
  columnKey: string,
): SortOrder | undefined {
  const sortBy = searchParams.get("sortBy");
  const direction = searchParams.get("direction");

  if (sortBy === columnKey) {
    return direction === "asc"
      ? "ascend"
      : direction === "desc"
        ? "descend"
        : undefined;
  }
  return undefined;
}

export function getSortDirection(sortOrder: string): string | undefined {
  return sortOrder === "ascend"
    ? "asc"
    : sortOrder === "descend"
      ? "desc"
      : undefined;
}

export function getDefaultFilterValue(
  searchParams: URLSearchParams,
  key: string,
): string[] | undefined {
  const value = searchParams.get(key);
  return value ? value.split(",") : undefined;
}

export function formatTimestamp(timestamp: string) {
  return dayjs(timestamp).format("DD-MM-YYYY HH:mm:ss");
}

export async function getBase64(file: FileType): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function getFormattedDuration(durationInMinutes: number): string {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  return minutes === 0 ? `${hours} giờ` : `${hours} giờ ${minutes} phút`;
}

export function formatCurrency(value: number | undefined): string {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function parseCurrency(value: string | undefined): number {
  return (value?.replace(/\$\s?|(,*)/g, "") as unknown as number) || 0;
}

export function isInDateRange(
  date: string,
  startDate: string,
  endDate: string,
): boolean {
  return dayjs(date).tz().isBetween(startDate, endDate, null, "[]");
}

export function getProvinceNameById(
  provinceId?: number,
  provinces?: IProvince[],
): string {
  return (
    provinces?.find((province) => province.ProvinceID === provinceId)
      ?.ProvinceName || ""
  );
}

export function getDistrictNameById(
  districtId?: number,
  districts?: IDistrict[],
): string {
  return (
    districts?.find((district) => district.DistrictID === districtId)
      ?.DistrictName || ""
  );
}

export function getWardNameById(wardCode?: string, wards?: IWard[]): string {
  return wards?.find((ward) => ward.WardCode === wardCode)?.WardName || "";
}

export function formatAddressName(
  provinceId?: number,
  districtId?: number,
  wardCode?: string,
  description?: string,
  provinces?: IProvince[],
  districts?: IDistrict[],
  wards?: IWard[],
): string {
  return `${description}, ${getWardNameById(wardCode, wards)}, ${getDistrictNameById(
    districtId,
    districts,
  )}, ${getProvinceNameById(provinceId, provinces)}`;
}
