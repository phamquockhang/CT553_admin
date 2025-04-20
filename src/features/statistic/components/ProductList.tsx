import { useQuery } from "@tanstack/react-query";
import { Input } from "antd";
import { SearchProps } from "antd/es/input";
import { useState } from "react";
import Access from "../../../features/auth/Access";
import {
  Module,
  PERMISSIONS,
  ProductFilterCriteria,
  SortParams,
} from "../../../interfaces";
import { productService } from "../../../services";
import OverviewProductTable from "./OverviewProductTable";

const ProductList: React.FC = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortParams>({
    sortBy: undefined,
    direction: undefined,
  });
  const [filter, setFilter] = useState<ProductFilterCriteria>({
    isActivated: undefined,
    itemId: undefined,
  });

  console.log("sort", sort);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["products", pagination, query, sort, filter].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () => productService.getProducts(pagination, query, filter, sort),
  });

  const handleSearch: SearchProps["onSearch"] = (value) => {
    if (value) {
      setQuery(value);
    } else {
      setQuery("");
    }
  };

  return (
    <Access permission={PERMISSIONS[Module.PRODUCTS].GET_PAGINATION}>
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>

          <div className="w-[60%]">
            <div className="flex gap-3">
              <Input.Search
                placeholder="Nhập tên sản phẩm để tìm kiếm..."
                defaultValue={query}
                enterButton
                allowClear
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>
        <OverviewProductTable
          productPage={data?.payload}
          pagination={pagination}
          setPagination={setPagination}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>
    </Access>
  );
};

export default ProductList;
