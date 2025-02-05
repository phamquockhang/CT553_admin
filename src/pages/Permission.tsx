import { useSearchParams } from "react-router-dom";
import {
  Module,
  PermissionFilterCriteria,
  PERMISSIONS,
  SortParams,
} from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import { permissionService } from "../services";
import { SearchProps } from "antd/es/input";
import { useDynamicTitle } from "../utils";
import Access from "../features/auth/Access";
import { Input } from "antd";
import AddPermission from "../features/auth/permissions/AddPermission";
import PermissionsTable from "../features/auth/permissions/PermissionsTable";

const Permission: React.FC = () => {
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
  const filter: PermissionFilterCriteria = {
    method: searchParams.get("method") || "",
    module: searchParams.get("module") || "",
  };

  const { data, isLoading } = useQuery({
    queryKey: ["permissions", pagination, query, sort, filter].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () =>
      permissionService.getPermissions(pagination, query, filter, sort),
  });

  const handleSearch: SearchProps["onSearch"] = (value) => {
    if (value) {
      searchParams.set("query", value);
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
  };

  useDynamicTitle("Quản lý quyền hạn");

  return (
    <Access permission={PERMISSIONS[Module.PERMISSIONS].GET_PAGINATION}>
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quản lý quyền hạn</h2>

          <div className="w-[60%]">
            <div className="flex gap-3">
              <Input.Search
                placeholder="Nhập tên hoặc url của Quyền hạn để tìm kiếm..."
                defaultValue={query}
                enterButton
                allowClear
                onSearch={handleSearch}
              />
            </div>
          </div>
          <Access
            permission={PERMISSIONS[Module.PERMISSIONS].CREATE}
            hideChildren
          >
            <AddPermission />
          </Access>
        </div>
        <PermissionsTable
          permissionPage={data?.payload}
          isLoading={isLoading}
        />
      </div>
    </Access>
  );
};

export default Permission;
