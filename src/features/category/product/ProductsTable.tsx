import {
  CaretDownFilled,
  CaretUpFilled,
  FilterFilled,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Space,
  Table,
  TablePaginationConfig,
  TableProps,
  Tag,
  Tooltip,
} from "antd";
import { SorterResult } from "antd/es/table/interface";
import { GetProp } from "antd/lib";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IProduct, Module, Page, PERMISSIONS } from "../../../interfaces";
import { itemService } from "../../../services";
import {
  colorFilterIcon,
  colorSortDownIcon,
  colorSortUpIcon,
  formatTimestamp,
  getActiveColor,
  getDefaultFilterValue,
  getDefaultSortOrder,
  getSortDirection,
  getUniqueColorByString,
} from "../../../utils";
import ViewProduct from "./ViewProduct";
import Access from "../../auth/Access";
import UpdateProduct from "./UpdateProduct";
import DeleteProduct from "./DeleteProduct";

interface TableParams {
  pagination: TablePaginationConfig;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
  sorter?: SorterResult<IProduct> | SorterResult<IProduct>[];
}

interface ProductTableProps {
  productPage?: Page<IProduct>;
  isLoading: boolean;
  isFetching: boolean;
}

const ProductsTable: React.FC<ProductTableProps> = ({
  productPage,
  isLoading,
  isFetching,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} mặt hàng`,
    },
  }));
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { data: allItems, isLoading: isLoadingItems } = useQuery({
    queryKey: ["allItems"],
    queryFn: () => itemService.getAllItems(),
  });

  const itemOptions = allItems?.payload?.map((item) => ({
    text: item.itemName,
    value: item.itemId,
  }));

  // const itemOptions = [
  //   { text: "Cang", value: 2 },
  //   { text: "The", value: 3 },
  // ];

  useEffect(() => {
    if (productPage) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: productPage.meta?.total || 0,
          showTotal: (total) => `Tổng ${total} mặt hàng`,
        },
      }));
    }
  }, [productPage]);

  const handleTableChange: TableProps<IProduct>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    setTableParams((prev) => ({
      ...prev,
      pagination,
      filters,
      sorter,
    }));
    searchParams.set("page", String(pagination.current));
    searchParams.set("pageSize", String(pagination.pageSize));

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          searchParams.set(key, value.join(","));
        } else {
          if (value) {
            searchParams.set(key, `${value}`);
          } else {
            searchParams.delete(key);
          }
        }
      });
    }

    let sortBy;
    let direction;
    if (sorter) {
      if (Array.isArray(sorter)) {
        sortBy = sorter[0].field as string;
        direction = getSortDirection(sorter[0].order as string);
      } else {
        sortBy = sorter.field as string;
        direction = getSortDirection(sorter.order as string);
      }
    }
    if (sortBy && direction) {
      searchParams.set("sortBy", sortBy);
      searchParams.set("direction", direction);
    } else {
      searchParams.delete("direction");
      searchParams.delete("sortBy");
    }

    setSearchParams(searchParams);
  };

  const columns: TableProps<IProduct>["columns"] = [
    {
      title: "STT",
      width: "2%",
      align: "center",
      render: (_, __, index) =>
        ((tableParams.pagination.current || 1) - 1) *
          (tableParams.pagination.pageSize || 10) +
        index +
        1,
    },
    {
      title: "Tên sản phẩm",
      key: "productName",
      dataIndex: "productName",
      width: "10%",
    },
    {
      title: "Thuộc mặt hàng",
      key: "itemId",
      dataIndex: "itemId",
      width: "10%",
      render: (itemId: number) => {
        const item = allItems?.payload?.find((item) => item.itemId === itemId);
        return item?.itemName || "";
      },
      filters: itemOptions,
      // defaultFilteredValue: getDefaultFilterValue(searchParams, "itemId"),
      filteredValue: getDefaultFilterValue(searchParams, "itemId"),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      key: "isActivated",
      title: "Trạng thái",
      dataIndex: "isActivated",
      width: "5%",
      align: "center",
      render: (isActivated: boolean) => (
        <Tag color={getActiveColor(isActivated)}>
          {isActivated ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
      filters: [
        { text: "ACTIVE", value: true },
        { text: "INACTIVE", value: false },
      ],
      defaultFilteredValue: getDefaultFilterValue(searchParams, "isActivated"),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      key: "buyingPrice",
      title: "Giá mua",
      dataIndex: ["buyingPrices.buyingPriceValue"],
      width: "7%",
      align: "right",
      render: (text, record) => {
        const buyingPrice =
          record.buyingPrice.buyingPriceValue.toLocaleString();
        const productUnit = "kg";
        const color = getUniqueColorByString(productUnit);
        return (
          <p>
            {buyingPrice}
            <Tag className="m-0 p-0" color={color}>
              đ/{productUnit}
            </Tag>
          </p>
        );
      },
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "buyingPrice"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      key: "sellingPrice",
      title: "Giá bán",
      dataIndex: ["sellingPrices.sellingPriceValue"],
      width: "7%",
      align: "right",
      render: (text, record) => {
        const sellingPrice =
          record.sellingPrice.sellingPriceValue.toLocaleString();
        const productUnit = record.productUnit;
        const color = getUniqueColorByString(productUnit);
        return (
          <p>
            {sellingPrice}
            <Tag className="m-0 p-0" color={color}>
              đ/{productUnit}
            </Tag>
          </p>
        );
      },
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "sellingPrice"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      key: "weight",
      title: "Khối lượng tồn kho (kg)",
      dataIndex: ["weights.weightValue"],
      width: "7%",
      align: "center",
      render: (text, record) => {
        const weight = record.weight.weightValue.toLocaleString();
        if (record.weight.weightValue < 100) {
          return (
            <Tooltip title="Sản phẩm sắp hết hàng">
              <p style={{ color: "red" }}>{weight}</p>
            </Tooltip>
          );
        }
        return <p>{weight}</p>;
      },
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "weight"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: "9%",
      align: "center",
      render: (createdAt: string) =>
        createdAt ? formatTimestamp(createdAt) : "",
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "createdAt"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    // {
    //   key: "updatedAt",
    //   title: "Ngày cập nhật",
    //   dataIndex: "updatedAt",
    //   width: "9%",
    //   align: "center",
    //   render: (updatedAt: string) =>
    //     updatedAt ? formatTimestamp(updatedAt) : "",
    //   sorter: true,
    //   defaultSortOrder: getDefaultSortOrder(searchParams, "updatedAt"),
    //   sortIcon: ({ sortOrder }) => (
    //     <div className="flex flex-col text-[10px]">
    //       <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
    //       <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
    //     </div>
    //   ),
    // },
    {
      title: "Hành động",
      key: "action",
      width: "7%",
      align: "center",

      render: (record: IProduct) => (
        <Space>
          <ViewProduct product={record} />
          <Access permission={PERMISSIONS[Module.PRODUCTS].UPDATE} hideChildren>
            <UpdateProduct productId={record.productId} />
          </Access>
          <Access permission={PERMISSIONS[Module.PRODUCTS].DELETE} hideChildren>
            <DeleteProduct
              productId={record.productId}
              setIsDeleting={setIsDeleting}
            />
          </Access>
        </Space>
      ),
    },
  ];

  // if (!isLoading) {
  //   console.log(productPage?.data);
  // }

  return (
    <Table
      bordered={false}
      columns={columns}
      rowKey={(record: IProduct) => record.productId}
      pagination={tableParams.pagination}
      dataSource={productPage?.data}
      rowClassName={(_, index) =>
        index % 2 === 0 ? "table-row-light" : "table-row-gray"
      }
      rowHoverable={false}
      loading={
        isLoading
          ? {
              spinning: true,
              tip: "Đang tải dữ liệu...",
            }
          : (isFetching || isDeleting || isLoadingItems) && {
              spinning: true,
              tip: "Đang cập nhật dữ liệu...",
            }
      }
      onChange={handleTableChange}
      size="middle"
    />
  );
};

export default ProductsTable;
