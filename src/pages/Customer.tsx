import { useSearchParams } from "react-router-dom";
import {
  CustomerFilterCriteria,
  Module,
  PERMISSIONS,
  SortParams,
} from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import { customerService } from "../services/auth/customer-service";
import { SearchProps } from "antd/es/input";
import { useDynamicTitle } from "../utils";
import Access from "../features/auth/Access";
import AddCustomer from "../features/auth/customers/AddCustomer";
import CustomersTable from "../features/auth/customers/CustomersTable";
import { Input } from "antd";

const Customer: React.FC = () => {
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
  const filter: CustomerFilterCriteria = {
    isActivated: searchParams.get("isActivated") || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["customers", pagination, query, sort, filter].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () =>
      customerService.getCustomers(pagination, query, filter, sort),
  });

  const handleSearch: SearchProps["onSearch"] = (value) => {
    if (value) {
      searchParams.set("query", value);
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
  };

  useDynamicTitle("Quản lý khách hàng");

  return (
    <Access permission={PERMISSIONS[Module.CUSTOMER].GET_PAGINATION}>
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quản lý Khách hàng</h2>

          <div className="w-[60%]">
            <div className="flex gap-3">
              <Input.Search
                placeholder="Nhập tên hoặc email của Khách hàng để tìm kiếm"
                defaultValue={query}
                enterButton
                allowClear
                onSearch={handleSearch}
              />
            </div>
          </div>
          <Access permission={PERMISSIONS[Module.CUSTOMER].CREATE} hideChildren>
            <AddCustomer />
          </Access>
        </div>
        <CustomersTable customerPage={data?.payload} isLoading={isLoading} />
      </div>
    </Access>
  );
};

export default Customer;
