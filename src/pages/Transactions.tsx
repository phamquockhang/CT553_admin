import { useQuery } from "@tanstack/react-query";
import { Input } from "antd";
import { SearchProps } from "antd/es/input";
import { useSearchParams } from "react-router-dom";
import Access from "../features/auth/Access";
import TransactionsTable from "../features/transaction/TransactionsTable";
import {
  Module,
  PERMISSIONS,
  SortParams,
  TransactionFilterCriteria,
} from "../interfaces";
import { transactionService } from "../services";
import { useDynamicTitle } from "../utils";

const Transactions: React.FC = () => {
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
  const filter: TransactionFilterCriteria = {
    status: searchParams.get("status") || undefined,
    paymentMethodId: searchParams.get("paymentMethodId") || undefined,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["transactions", pagination, query, sort, filter].filter(
      (key) => {
        if (typeof key === "string") {
          return key !== "";
        } else if (key instanceof Object) {
          return Object.values(key).some(
            (value) => value !== undefined && value !== "",
          );
        }
      },
    ),
    queryFn: () =>
      transactionService.getTransactions(pagination, query, filter, sort),
  });

  const handleSearch: SearchProps["onSearch"] = (value) => {
    if (value) {
      searchParams.set("query", value);
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
  };

  useDynamicTitle("Quản lý giao dịch");

  console.log(data);

  return (
    <Access permission={PERMISSIONS[Module.TRANSACTIONS].GET_PAGINATION}>
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quản lý giao dịch</h2>

          <div className="w-[60%]">
            <div className="flex gap-3">
              <Input.Search
                placeholder="Nhập mã giao dịch hoặc mã đơn hàng để tìm kiếm..."
                defaultValue={query}
                enterButton
                allowClear
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>
        <TransactionsTable
          transactionPage={data?.payload}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>
    </Access>
  );
};

export default Transactions;
