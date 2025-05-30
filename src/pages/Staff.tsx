import { useQuery } from "@tanstack/react-query";
import { Input } from "antd";
import { SearchProps } from "antd/es/input";
import { useSearchParams } from "react-router-dom";
import Access from "../features/auth/Access";
import AddStaff from "../features/auth/staffs/AddStaff";
import StaffsTable from "../features/auth/staffs/StaffsTable";
import {
  Module,
  PERMISSIONS,
  SortParams,
  StaffFilterCriteria,
} from "../interfaces";
import { staffService } from "../services";
import { useDynamicTitle } from "../utils";

const Staff: React.FC = () => {
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
  const filter: StaffFilterCriteria = {
    isActivated: searchParams.get("isActivated") || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["staffs", pagination, query, sort, filter].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () => staffService.getStaffs(pagination, query, filter, sort),
  });

  const handleSearch: SearchProps["onSearch"] = (value) => {
    if (value) {
      searchParams.set("query", value);
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
  };

  useDynamicTitle("Quản lý nhân viên");

  return (
    <Access permission={PERMISSIONS[Module.STAFF].GET_PAGINATION}>
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quản lý nhân viên</h2>

          <div className="w-[60%]">
            <div className="flex gap-3">
              <Input.Search
                placeholder="Nhập tên hoặc email của Nhân viên để tìm kiếm..."
                defaultValue={query}
                enterButton
                allowClear
                onSearch={handleSearch}
              />
            </div>
          </div>
          <Access permission={PERMISSIONS[Module.STAFF].CREATE} hideChildren>
            <AddStaff />
          </Access>
        </div>
        <StaffsTable staffPage={data?.payload} isLoading={isLoading} />
      </div>
    </Access>
  );
};

export default Staff;
