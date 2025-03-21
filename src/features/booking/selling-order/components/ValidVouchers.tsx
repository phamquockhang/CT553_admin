import { useQuery } from "@tanstack/react-query";
import { Pagination, Skeleton } from "antd";
import { useState } from "react";
import {
  IVoucher,
  SortParams,
  VoucherFilterCriteria,
} from "../../../../interfaces";
import { voucherService } from "../../../../services";
import VoucherToUse from "../../voucher/components/VoucherToUse";

interface ValidVouchersProps {
  totalAmount: number;
  useVoucher: IVoucher | undefined;
  setUseVoucher: React.Dispatch<React.SetStateAction<IVoucher | undefined>>;
}

const ValidVouchers: React.FC<ValidVouchersProps> = ({
  totalAmount,
  useVoucher,
  setUseVoucher,
}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
  });

  // console.log("totalAmount", totalAmount);

  const query = "";
  const sort: SortParams = {
    sortBy: "endDate",
    direction: "asc",
  };
  const filter: VoucherFilterCriteria = {
    status: undefined,
    // status: "",
    discountType: undefined,
  };

  const {
    data: vouchers,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["vouchers", pagination, query, sort, filter],
    queryFn: () =>
      voucherService.getValidVouchers(pagination, query, filter, sort),
    select: (data) => data?.payload,
  });

  const voucherData = vouchers?.data;
  const voucherMeta = vouchers?.meta;

  const currentDate = new Date();

  return (
    <div>
      {isLoading || isFetching ? (
        <Skeleton active />
      ) : (
        vouchers && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {voucherData?.map((voucher) => (
                <div key={voucher.voucherId}>
                  <VoucherToUse
                    voucher={voucher}
                    currentDate={currentDate}
                    totalAmount={totalAmount}
                    useVoucher={useVoucher}
                    setUseVoucher={setUseVoucher}
                  />
                </div>
              ))}
            </div>

            <Pagination
              align="center"
              simple
              current={pagination.page}
              pageSize={pagination.pageSize}
              total={voucherMeta?.total}
              onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
              className="mt-2"
            />
          </>
        )
      )}
    </div>
  );
};

export default ValidVouchers;
