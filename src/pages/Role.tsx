import { PERMISSIONS } from "../interfaces/common/constants";
import { Module } from "../interfaces/common/enums";
import Access from "../features/auth/Access";
import AddRole from "../features/auth/roles/AddRole";
import RolesTable from "../features/auth/roles/RolesTable";
import { useDynamicTitle } from "../utils";
import { Input } from "antd";
import { useSearchParams } from "react-router-dom";
import { RoleFilterCriteria, SortParams } from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import { roleService } from "../services";
import { SearchProps } from "antd/es/input";

const Role: React.FC = () => {
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
  const filter: RoleFilterCriteria = {
    isActivated: searchParams.get("isActivated") || "",
  };

  const { data, isLoading } = useQuery({
    queryKey: ["roles", pagination, query, sort, filter].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () => roleService.getRoles(pagination, query, filter, sort),
  });

  const handleSearch: SearchProps["onSearch"] = (value) => {
    if (value) {
      searchParams.set("query", value);
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
  };

  useDynamicTitle("Quản lý vai trò");

  return (
    <Access permission={PERMISSIONS[Module.ROLES].GET_PAGINATION}>
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quản lý vai trò</h2>

          <div className="w-[60%]">
            <div className="flex gap-3">
              <Input.Search
                placeholder="Nhập tên hoặc mô tả của vai trò để tìm kiếm..."
                defaultValue={query}
                enterButton
                allowClear
                onSearch={handleSearch}
              />
            </div>
          </div>

          <Access permission={PERMISSIONS[Module.ROLES].CREATE} hideChildren>
            <AddRole />
          </Access>
        </div>
        <RolesTable rolePage={data?.payload} isLoading={isLoading} />
      </div>
    </Access>
  );
};

export default Role;
