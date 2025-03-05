import { useQuery } from "@tanstack/react-query";
import { Input } from "antd";
import { SearchProps } from "antd/es/input";
import { useSearchParams } from "react-router-dom";
import Access from "../features/auth/Access";
import {
  Module,
  OrderFilterCriteria,
  PERMISSIONS,
  SortParams,
} from "../interfaces";
import { orderService } from "../services";
import { useDynamicTitle } from "../utils";
import OrdersTable from "../features/booking/order/OrdersTable";

const Order: React.FC = () => {
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
  const filter: OrderFilterCriteria = {
    orderStatus: searchParams.get("orderStatus") || undefined,
    paymentStatus: searchParams.get("paymentStatus") || undefined,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["orders", pagination, query, sort, filter].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () => orderService.getOrders(pagination, query, filter, sort),
  });

  const handleSearch: SearchProps["onSearch"] = (value) => {
    if (value) {
      searchParams.set("query", value);
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
  };

  useDynamicTitle("Quản lý đơn hàng");

  return (
    <Access permission={PERMISSIONS[Module.ORDERS].GET_PAGINATION}>
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quản lý đơn hàng</h2>

          <div className="w-[60%]">
            <div className="flex gap-3">
              <Input.Search
                placeholder="Nhập mã đơn hàng để tìm kiếm..."
                defaultValue={query}
                enterButton
                allowClear
                onSearch={handleSearch}
              />
            </div>
          </div>
          <Access permission={PERMISSIONS[Module.ORDERS].CREATE} hideChildren>
            {/* <AddOrder /> */}
          </Access>
        </div>
        <OrdersTable
          orderPage={data?.payload}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>
    </Access>
  );
};

export default Order;
