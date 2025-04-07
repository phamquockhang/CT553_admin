import {
  CaretDownFilled,
  CaretUpFilled,
  FilterFilled,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Table, TablePaginationConfig, TableProps, Tag, Tooltip } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { GetProp } from "antd/lib";
import React, { useEffect, useState } from "react";
import {
  IProduct,
  Page,
  ProductFilterCriteria,
  SortParams,
} from "../../../interfaces";
import { itemService } from "../../../services";
import {
  colorFilterIcon,
  colorSortDownIcon,
  colorSortUpIcon,
  getActiveColor,
  getSortDirection,
  getUniqueColorByString,
} from "../../../utils";
// import DeleteProduct from "./DeleteProduct";
// import UpdateProduct from "./UpdateProduct";
// import ViewProduct from "./ViewProduct";

interface TableParams {
  pagination: TablePaginationConfig;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
  sorter?: SorterResult<IProduct> | SorterResult<IProduct>[];
}

interface ProductTableProps {
  productPage?: Page<IProduct>;
  pagination: {
    page: number;
    pageSize: number;
  };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      page: number;
      pageSize: number;
    }>
  >;
  filter: ProductFilterCriteria;
  setFilter: React.Dispatch<React.SetStateAction<ProductFilterCriteria>>;
  sort: SortParams;
  setSort: React.Dispatch<React.SetStateAction<SortParams>>;
  isLoading: boolean;
  isFetching: boolean;
}

const OverviewProductTable: React.FC<ProductTableProps> = ({
  productPage,
  pagination,
  setPagination,
  // filter,
  setFilter,
  // sort,
  setSort,
  isLoading,
  isFetching,
}) => {
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: pagination.page,
      pageSize: pagination.pageSize,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} mặt hàng`,
    },
  }));

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
    setPagination({
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            setFilter((prev) => ({
              ...prev,
              [key]: value[0],
            }));
          } else {
            setFilter((prev) => ({
              ...prev,
              [key]: undefined,
            }));
          }
        } else {
          if (value) {
            setFilter((prev) => ({
              ...prev,
              [key]: value,
            }));
          } else {
            setFilter((prev) => ({
              ...prev,
              [key]: undefined,
            }));
          }
        }
      });
    }

    let sortBy: string | undefined;
    let direction: string | undefined;
    if (sorter) {
      if (Array.isArray(sorter)) {
        // sortBy = sorter[0].field as string;
        // direction = getSortDirection(sorter[0].order as string);
      } else {
        sortBy = sorter.field?.toString();
        direction = getSortDirection(sorter.order as string);
      }
    }
    if (sortBy && direction) {
      setSort({
        sortBy,
        direction,
      });
    } else {
      setSort({
        sortBy: "",
        direction: "",
      });
    }
  };

  const columns: TableProps<IProduct>["columns"] = [
    {
      title: "STT",
      // width: "2%",
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
      // width: "10%",
    },
    {
      title: "Thuộc mặt hàng",
      key: "itemId",
      dataIndex: "itemId",
      // width: "10%",
      render: (itemId: number) => {
        const item = allItems?.payload?.find((item) => item.itemId === itemId);
        return item?.itemName || "";
      },
      filters: itemOptions,
      // defaultFilteredValue: getDefaultFilterValue(searchParams, "itemId"),
      // filteredValue: getDefaultFilterValue(searchParams, "itemId"),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      key: "isActivated",
      title: "Trạng thái",
      dataIndex: "isActivated",
      // width: "5%",
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
      // defaultFilteredValue: getDefaultFilterValue(searchParams, "isActivated"),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      key: "buyingPrice",
      title: "Giá mua",
      dataIndex: ["buyingPrices.buyingPriceValue"],
      // width: "7%",
      align: "right",
      render: (_, record) => {
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
      // defaultSortOrder: getDefaultSortOrder(searchParams, "buyingPrice"),
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
      // width: "7%",
      align: "right",
      render: (_, record) => {
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
      // defaultSortOrder: getDefaultSortOrder(searchParams, "sellingPrice"),
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
      // width: "7%",
      align: "center",
      render: (_, record) => {
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
      // defaultSortOrder: getDefaultSortOrder(searchParams, "weight"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    // {
    //   key: "createdAt",
    //   title: "Ngày tạo",
    //   dataIndex: "createdAt",
    //   width: "9%",
    //   align: "center",
    //   render: (createdAt: string) =>
    //     createdAt ? formatTimestamp(createdAt) : "",
    //   sorter: true,
    //   defaultSortOrder: getDefaultSortOrder(searchParams, "createdAt"),
    //   sortIcon: ({ sortOrder }) => (
    //     <div className="flex flex-col text-[10px]">
    //       <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
    //       <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
    //     </div>
    //   ),
    // },
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
    // {
    //   title: "Hành động",
    //   key: "action",
    //   // width: "7%",
    //   align: "center",

    //   render: (record: IProduct) => (
    //     <Space>
    //       <ViewProduct product={record} />
    //       <Access permission={PERMISSIONS[Module.PRODUCTS].UPDATE} hideChildren>
    //         <UpdateProduct productId={record.productId} />
    //       </Access>
    //       <Access permission={PERMISSIONS[Module.PRODUCTS].DELETE} hideChildren>
    //         <DeleteProduct
    //           productId={record.productId}
    //           setIsDeleting={setIsDeleting}
    //         />
    //       </Access>
    //     </Space>
    //   ),
    // },
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
          : (isFetching || isLoadingItems) && {
              spinning: true,
              tip: "Đang cập nhật dữ liệu...",
            }
      }
      onChange={handleTableChange}
      size="middle"
    />
  );
};

export default OverviewProductTable;
