import { useMemo } from "react";
import {
  PaymentStatus,
  whenCreate_PaymentStatus,
} from "../../../../interfaces";
import { translatePaymentStatus } from "../../../../utils";

const validTransitions: Record<PaymentStatus, PaymentStatus[]> = {
  [PaymentStatus.COD]: [PaymentStatus.SUCCESS],
  [PaymentStatus.SUCCESS]: [],
  [PaymentStatus.PENDING]: [],
  [PaymentStatus.FAILED]: [],
  [PaymentStatus.CANCELLED]: [],
  [PaymentStatus.EXPIRED]: [],
};

export const useValidPaymentStatuses = (currentStatus?: PaymentStatus) => {
  return useMemo(() => {
    const availableStatuses = currentStatus
      ? validTransitions[currentStatus]
      : Object.values(whenCreate_PaymentStatus);
    return availableStatuses.map((status) => ({
      value: status,
      label: translatePaymentStatus(status),
    }));
  }, [currentStatus]);
};
