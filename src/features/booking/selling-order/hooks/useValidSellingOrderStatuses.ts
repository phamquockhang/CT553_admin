import { useMemo } from "react";
import { OrderStatus } from "../../../../interfaces";
import { translateOrderStatus } from "../../../../utils";

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [
    OrderStatus.PREPARING,
    OrderStatus.CANCELLED,
    OrderStatus.DELIVERED,
  ],
  [OrderStatus.PREPARING]: [OrderStatus.DELIVERING, OrderStatus.CANCELLED],
  [OrderStatus.DELIVERING]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
};

export const useValidSellingOrderStatuses = (currentStatus?: OrderStatus) => {
  return useMemo(() => {
    const availableStatuses = currentStatus
      ? validTransitions[currentStatus]
      : Object.values(OrderStatus);
    return availableStatuses.map((status) => ({
      value: status,
      label: translateOrderStatus(status),
    }));
  }, [currentStatus]);
};
