import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { IBriefVoucher, IVoucher, VoucherStatus } from "../../../../interfaces";
import { voucherService } from "../../../../services";

export const useVoucherService = () => {
  const { mutate: createVoucher, isPending: isCreatingVoucher } = useMutation({
    mutationFn: (newVoucher: IBriefVoucher) => {
      return voucherService.create(newVoucher);
    },

    onSuccess: (data) => {
      if (data && data.success) {
        toast.success(data?.message || "Operation successful");
      } else {
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: updateVoucher, isPending: isUpdatingVoucher } = useMutation({
    mutationFn: ({
      voucherId,
      updatedVoucher,
    }: {
      voucherId: number;
      updatedVoucher: IVoucher;
    }) => {
      return voucherService.update(voucherId, updatedVoucher);
    },

    onSuccess: (data) => {
      if (data && data.success) {
        toast.success(data?.message || "Operation successful");
      } else {
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  return { createVoucher, isCreatingVoucher, updateVoucher, isUpdatingVoucher };
};

const validVoucherStatuses: Record<VoucherStatus, VoucherStatus[]> = {
  [VoucherStatus.INACTIVE]: [VoucherStatus.INACTIVE, VoucherStatus.DISABLED], // Voucher có thể chuyển từ INACTIVE -> ACTIVE
  [VoucherStatus.ACTIVE]: [VoucherStatus.ACTIVE, VoucherStatus.DISABLED], // ACTIVE có thể hết lượt dùng, hết hạn hoặc bị vô hiệu hóa
  [VoucherStatus.OUT_OF_USES]: [
    VoucherStatus.OUT_OF_USES,
    VoucherStatus.DISABLED,
  ], // Hết lượt dùng thì chỉ có thể bị vô hiệu hóa
  [VoucherStatus.EXPIRED]: [VoucherStatus.EXPIRED, VoucherStatus.DISABLED], // Hết hạn thì chỉ có thể bị vô hiệu hóa
  [VoucherStatus.DISABLED]: [VoucherStatus.DISABLED], // DISABLED là trạng thái cuối, không thể cập nhật tiếp
};

export const useValidVoucherStatuses = (currentStatus?: VoucherStatus) => {
  return useMemo(() => {
    const availableStatuses = currentStatus
      ? validVoucherStatuses[currentStatus]
      : Object.values(VoucherStatus);
    return availableStatuses;
  }, [currentStatus]);
};
