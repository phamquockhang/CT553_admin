import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Input } from "antd";
import { useState } from "react";
import {
  ISellingOrderDetail,
  ProductFilterCriteria,
  SortParams,
} from "../../../../interfaces";
import { productService } from "../../../../services";
import FoundedProductsTable from "./FoundedProductsTable";

interface FindProductProps {
  selectedProductsDetails: ISellingOrderDetail[];
  setSelectedProductsDetails: React.Dispatch<
    React.SetStateAction<ISellingOrderDetail[]>
  >;
}

export interface IPagination {
  page: number;
  pageSize: number;
}

const FindProduct: React.FC<FindProductProps> = ({
  selectedProductsDetails,
  setSelectedProductsDetails,
}) => {
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
  });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortParams>({
    sortBy: "",
    direction: "",
  });
  const filter: ProductFilterCriteria = {
    isActivated: "true",
    itemId: undefined,
  };
  //   const [filter] = useState<ProductFilterCriteria>({
  //     isActivated: "true",
  //     itemId: undefined,
  //   });

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

  return (
    <>
      <Input
        placeholder="Nhập tên sản phẩm để tìm kiếm"
        prefix={<SearchOutlined />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4"
      />
      <FoundedProductsTable
        setPagination={setPagination}
        setSort={setSort}
        productPage={data?.payload}
        isLoading={isLoading}
        isFetching={isFetching}
        selectedProductsDetails={selectedProductsDetails}
        setSelectedProductsDetails={setSelectedProductsDetails}
      />
    </>
  );
};

export default FindProduct;
