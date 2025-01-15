import { Input } from "antd";
import { Module, PERMISSIONS, SortParams } from "../interfaces";
import Access from "../features/auth/Access";
import AddStaff from "../features/staffs/AddStaff";
import StaffsTable from "../features/staffs/StaffsTable";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { staffService } from "../services";
import { SearchProps } from "antd/es/input";
import { useDynamicTitle } from "../utils";

const Staffs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const pagination = {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
  };

  const sort: SortParams = {
    sortBy: searchParams.get("sortBy") || "",
    direction: searchParams.get("direction") || "",
  };

  const { data, isLoading } = useQuery({
    queryKey: ["staffs", pagination, query, sort].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () => staffService.getStaffs(pagination, query, sort),
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
          <h2 className="text-xl font-semibold">Nhân viên</h2>

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

export default Staffs;
