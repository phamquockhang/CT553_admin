import { useMemo } from "react";
import { PaidStatus } from "../../../../interfaces";
import { translatePaymentStatus } from "../../../../utils";

const validTransitions: Record<PaidStatus, PaidStatus[]> = {
  [PaidStatus.UNPAID]: [PaidStatus.PAID],
  [PaidStatus.PAID]: [],
};

export const useValidPaymentStatuses = (currentStatus?: PaidStatus) => {
  return useMemo(() => {
    const availableStatuses = currentStatus
      ? validTransitions[currentStatus]
      : Object.values(PaidStatus);
    return availableStatuses.map((status) => ({
      value: status,
      label: translatePaymentStatus(status),
    }));
  }, [currentStatus]);
};
