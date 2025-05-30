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
  DiscountType,
  FileType,
  IDistrict,
  IProvince,
  IWard,
  OrderStatus,
  PaymentStatus,
  TransactionStatus,
  VoucherStatus,
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

export function getColorOrderStatus(status: string) {
  switch (status) {
    case OrderStatus.PENDING:
      return yellow[7];
    case OrderStatus.CONFIRMED:
      return purple[6];
    case OrderStatus.PREPARING:
      return orange[6];
    case OrderStatus.DELIVERING:
      return greyDark[6];
    case OrderStatus.DELIVERED:
      return green[6];
    case OrderStatus.COMPLETED:
      return blue[7];
    case OrderStatus.CANCELLED:
      return red[5];
    default:
      return grey[10];
  }
}

export function getColorPaymentStatus(status: string) {
  switch (status) {
    case PaymentStatus.COD:
      return "green";
    case PaymentStatus.PENDING:
      return "yellow";
    case PaymentStatus.CANCELLED:
      return "red";
    case PaymentStatus.EXPIRED:
      return "gray";
    case PaymentStatus.FAILED:
      return "orange";
    case PaymentStatus.SUCCESS:
      return "blue";
    default:
      return "gray";
  }
}

export function getColorTransactionStatus(status: string) {
  switch (status) {
    case TransactionStatus.PENDING:
      return yellow[7];
    case TransactionStatus.SUCCESS:
      return blue[7];
    case TransactionStatus.FAILED:
      return orange[6];
    case TransactionStatus.CANCELLED:
      return red[6];
    case TransactionStatus.EXPIRED:
      return greyDark[6];
    case TransactionStatus.COD_PENDING:
      return green[6];
    default:
      return grey[10];
  }
}

export function getColorVoucherStatus(status: string) {
  switch (status) {
    case VoucherStatus.INACTIVE:
      return "orange";
    case VoucherStatus.ACTIVE:
      return "blue";
    case VoucherStatus.OUT_OF_USES:
      return "green";
    case VoucherStatus.EXPIRED:
      return "gold";
    case VoucherStatus.DISABLED:
      return "red";
    default:
      return "gray";
  }
}

export function getColorDiscountType(discountType: string) {
  switch (discountType) {
    case DiscountType.AMOUNT:
      return blue[7];
    case DiscountType.PERCENTAGE:
      return green[6];
    default:
      return "gray";
  }
}

export function translateOrderStatus(status: string) {
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

export function revertOrderStatus(status: string) {
  switch (status) {
    case "Đang chờ xác nhận":
      return OrderStatus.PENDING;
    case "Đã xác nhận":
      return OrderStatus.CONFIRMED;
    case "Đang chuẩn bị":
      return OrderStatus.PREPARING;
    case "Đang giao hàng":
      return OrderStatus.DELIVERING;
    case "Đã giao hàng":
      return OrderStatus.DELIVERED;
    case "Hoàn thành":
      return OrderStatus.COMPLETED;
    case "Đã hủy":
      return OrderStatus.CANCELLED;
    default:
      return status;
  }
}

export function translateVoucherStatus(status: string) {
  switch (status) {
    case VoucherStatus.INACTIVE:
      return "Chưa kích hoạt";
    case VoucherStatus.ACTIVE:
      return "Đang kích hoạt";
    case VoucherStatus.OUT_OF_USES:
      return "Đã hết lượt sử dụng";
    case VoucherStatus.EXPIRED:
      return "Hết hạn";
    case VoucherStatus.DISABLED:
      return "Đã vô hiệu";
    default:
      return status;
  }
}

export function revertVoucherStatus(status: string) {
  switch (status) {
    case "Chưa kích hoạt":
      return VoucherStatus.INACTIVE;
    case "Đang kích hoạt":
      return VoucherStatus.ACTIVE;
    case "Đã hết lượt sử dụng":
      return VoucherStatus.OUT_OF_USES;
    case "Hết hạn":
      return VoucherStatus.EXPIRED;
    case "Đã vô hiệu":
      return VoucherStatus.DISABLED;
    default:
      return status;
  }
}

export function translateDiscountType(discountType: string) {
  switch (discountType) {
    case DiscountType.AMOUNT:
      return "Cố định";
    case DiscountType.PERCENTAGE:
      return "Phần trăm";
    default:
      return discountType;
  }
}

export function revertDiscountType(discountType: string) {
  switch (discountType) {
    case "Cố định":
      return DiscountType.AMOUNT;
    case "Phần trăm":
      return DiscountType.PERCENTAGE;
    default:
      return discountType;
  }
}

export function translatePaymentStatus(status: string) {
  switch (status) {
    case PaymentStatus.COD:
      return "Thanh toán khi nhận hàng";
    case PaymentStatus.PENDING:
      return "Đang chờ thanh toán";
    case PaymentStatus.CANCELLED:
      return "Đã hủy thanh toán";
    case PaymentStatus.EXPIRED:
      return "Đã hết hạn thanh toán";
    case PaymentStatus.FAILED:
      return "Lỗi";
    case PaymentStatus.SUCCESS:
      return "Đã thanh toán";
    default:
      return status;
  }
}

export function revertPaymentStatus(status: string) {
  switch (status) {
    case "Thanh toán khi nhận hàng":
      return PaymentStatus.COD;
    case "Đang chờ thanh toán":
      return PaymentStatus.PENDING;
    case "Đã hủy thanh toán":
      return PaymentStatus.CANCELLED;
    case "Đã hết hạn thanh toán":
      return PaymentStatus.EXPIRED;
    case "Lỗi trong quá trình thanh toán":
      return PaymentStatus.FAILED;
    case "Đã thanh toán":
      return PaymentStatus.SUCCESS;
    default:
      return status;
  }
}

export function translateTransactionStatus(status: string) {
  switch (status) {
    case TransactionStatus.PENDING:
      return "Đang chờ xử lý";
    case TransactionStatus.SUCCESS:
      return "Thành công";
    case TransactionStatus.FAILED:
      return "Thất bại";
    case TransactionStatus.CANCELLED:
      return "Đã hủy";
    case TransactionStatus.EXPIRED:
      return "Đã hết hạn";
    case TransactionStatus.COD_PENDING:
      return "Thanh toán khi nhận hàng";
    default:
      return status;
  }
}

export function revertTransactionStatus(status: string) {
  switch (status) {
    case "Đang chờ xử lý":
      return TransactionStatus.PENDING;
    case "Thành công":
      return TransactionStatus.SUCCESS;
    case "Thất bại":
      return TransactionStatus.FAILED;
    case "Đã hủy":
      return TransactionStatus.CANCELLED;
    case "Đã hết hạn":
      return TransactionStatus.EXPIRED;
    case "Thanh toán khi nhận hàng":
      return TransactionStatus.COD_PENDING;
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

export function formatTime(time: string) {
  return dayjs(time).format("DD-MM-YYYY");
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
