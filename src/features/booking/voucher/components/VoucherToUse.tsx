import { Button } from "antd";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";
import { DiscountType, IVoucher } from "../../../../interfaces";

interface VoucherToUseProps {
  voucher: IVoucher;
  currentDate: Date;
  totalAmount: number;
  useVoucher: IVoucher | undefined;
  setUseVoucher: React.Dispatch<React.SetStateAction<IVoucher | undefined>>;
}

const VoucherToUse: React.FC<VoucherToUseProps> = ({
  voucher,
  currentDate,
  totalAmount,
  useVoucher,
  setUseVoucher,
}) => {
  const expirationDate =
    voucher.endDate instanceof Date
      ? voucher.endDate
      : new Date(voucher.endDate.toString());
  const timeDifference = expirationDate.getTime() - currentDate.getTime();
  const daysUntilExpiration = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  const usedPercentage = parseFloat(
    (((voucher?.usedCount ?? 0) / (voucher?.usageLimit ?? 1)) * 100).toFixed(2),
  );
  const isValueValid = totalAmount >= voucher.minOrderValue;

  return (
    <div className="relative flex items-center overflow-hidden rounded-lg border p-4 shadow-md transition-all duration-500 hover:shadow-[0px_0px_5px_1px_rgba(0,0,0,0.24)]">
      <div className="absolute right-0 top-0 rounded-bl-lg bg-blue-100 px-2 py-1 text-xs text-blue-900">
        x{voucher.usageLimit - voucher.usedCount}
      </div>

      <div className="flex-1">
        <p className="text-lg font-bold">
          Giảm {voucher.discountValue.toLocaleString()}
          {voucher.discountType === DiscountType.PERCENTAGE ? "%" : " VND"}
        </p>
        <p className="text-sm">
          Đơn Tối Thiểu {voucher.minOrderValue.toLocaleString()} VND
        </p>
        <p className="text-sm">
          {voucher.maxDiscount
            ? "Giảm tối đa " + voucher.maxDiscount.toLocaleString() + " VND"
            : "\u00A0"}
        </p>

        <p className="mt-2 text-xs">
          <div className="h-1.5 w-[90%] overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600"
              style={{ width: `${usedPercentage}%` }}
            ></div>
          </div>
          <span className="text-xs">
            Đã sử dụng: {usedPercentage}%{" | "}
          </span>
          {daysUntilExpiration <= 3
            ? "Sắp hết hạn: " + daysUntilExpiration + " ngày"
            : "Còn: " + daysUntilExpiration + " ngày"}
        </p>
      </div>

      <div className="flex items-center">
        <Button
          className="relative cursor-pointer rounded bg-[#003F8F] px-4 py-2 text-white"
          disabled={!isValueValid}
          onClick={() => {
            if (useVoucher?.voucherCode === voucher.voucherCode) {
              setUseVoucher(undefined);
            } else {
              setUseVoucher(voucher);
            }
          }}
        >
          {voucher.voucherCode === useVoucher?.voucherCode ? "Đã chọn" : "Chọn"}
          {!isValueValid && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <MdOutlineDoNotDisturbAlt className="text-xl font-bold text-red-600 opacity-70" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default VoucherToUse;
