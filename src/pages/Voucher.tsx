import { useQuery } from "@tanstack/react-query";
import { Input } from "antd";
import { SearchProps } from "antd/es/input";
import { useSearchParams } from "react-router-dom";
import Access from "../features/auth/Access";
import {
  Module,
  PERMISSIONS,
  SortParams,
  VoucherFilterCriteria,
} from "../interfaces";
import { useDynamicTitle } from "../utils";
import { voucherService } from "../services/booking/voucher-service";
import VouchersTable from "../features/booking/voucher/VouchersTable";

const Voucher: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pagination = {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
  };
  const query = searchParams.get("query") || "";
  const sort: SortParams = {
    sortBy: searchParams.get("sortBy") || "",
    direction: searchParams.get("direction") || "",
  };
  const filter: VoucherFilterCriteria = {
    status: searchParams.get("status") || undefined,
    discountType: searchParams.get("discountType") || undefined,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["vouchers", pagination, query, sort, filter].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () => voucherService.getVouchers(pagination, query, filter, sort),
  });

  const handleSearch: SearchProps["onSearch"] = (value) => {
    if (value) {
      searchParams.set("query", value);
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
  };

  useDynamicTitle("Quản lý mã giảm giá");

  console.log(data?.payload);

  return (
    <Access permission={PERMISSIONS[Module.VOUCHERS].GET_PAGINATION}>
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quản lý mã giảm giá</h2>

          <div className="w-[60%]">
            <div className="flex gap-3">
              <Input.Search
                placeholder="Nhập mã giảm giá để tìm kiếm..."
                defaultValue={query}
                enterButton
                allowClear
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>
        <VouchersTable
          voucherPage={data?.payload}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>
    </Access>
  );
};

export default Voucher;
