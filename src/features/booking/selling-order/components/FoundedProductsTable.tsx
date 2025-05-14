import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
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
import { FaPlus } from "react-icons/fa";
import {
  IProduct,
  ISellingOrderDetail,
  Page,
  SortParams,
} from "../../../../interfaces";
import {
  colorSortDownIcon,
  colorSortUpIcon,
  getSortDirection,
  getUniqueColorByString,
} from "../../../../utils";
import { IPagination } from "./FindProduct";

interface TableParams {
  paginationTable: TablePaginationConfig;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
  sorter?: SorterResult<IProduct> | SorterResult<IProduct>[];
}

interface FoundedProductsTableProps {
  setPagination: React.Dispatch<React.SetStateAction<IPagination>>;
  setSort: React.Dispatch<React.SetStateAction<SortParams>>;

  productPage?: Page<IProduct>;
  isLoading: boolean;
  isFetching: boolean;
  selectedProductsDetails: ISellingOrderDetail[];
  setSelectedProductsDetails: React.Dispatch<
    React.SetStateAction<ISellingOrderDetail[]>
  >;
}

const FoundedProductsTable: React.FC<FoundedProductsTableProps> = ({
  setPagination,
  setSort,
  productPage,
  isLoading,
  isFetching,
  selectedProductsDetails,
  setSelectedProductsDetails,
}) => {
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    paginationTable: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} mặt hàng`,
    },
  }));

  useEffect(() => {
    if (productPage) {
      setTableParams((prev) => ({
        ...prev,
        paginationTable: {
          ...prev.paginationTable,
          total: productPage.meta?.total || 0,
          showTotal: (total) => `Tổng ${total} mặt hàng`,
        },
      }));
    }
  }, [productPage]);

  const handleTableChange: TableProps<IProduct>["onChange"] = (
    paginationTable,
    filters,
    sorter,
  ) => {
    setTableParams((prev) => ({
      ...prev,
      paginationTable,
      filters,
      sorter,
    }));

    setPagination((prev) => ({
      ...prev,
      page: paginationTable.current || 1,
      pageSize: paginationTable.pageSize || 10,
    }));

    let sortBy;
    let direction;
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
      setSort({ sortBy, direction });
    } else {
      setSort({ sortBy: "", direction: "" });
    }
  };

  const addToInvoice = (product: IProduct) => {
    // setSelectedProducts((prev) => [...prev, product]);
    const productDetail: ISellingOrderDetail = {
      sellingOrderDetailId: product.productId,

      productId: product.productId,
      productName: product.productName,
      unit: product.productUnit,
      quantity: 1,
      unitPrice: product.sellingPrice.sellingPriceValue,
      totalPrice: product.sellingPrice.sellingPriceValue,
    };
    setSelectedProductsDetails((prev) => [...prev, productDetail]);
  };

  const columns: TableProps<IProduct>["columns"] = [
    {
      title: "STT",
      width: "2%",
      align: "center",
      render: (_, __, index) =>
        ((tableParams.paginationTable.current || 1) - 1) *
          (tableParams.paginationTable.pageSize || 10) +
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
      key: "sellingPrice",
      title: "Giá bán",
      dataIndex: ["sellingPrices.sellingPriceValue"],
      width: "7%",
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
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "7%",
      align: "center",

      render: (record: IProduct) => {
        const isAdded = selectedProductsDetails.some(
          (p) => p.productId === record.productId,
        );
        return (
          <Space>
            {!isAdded && (
              <Tooltip title="Thêm vào đơn hàng">
                <FaPlus
                  className="cursor-pointer text-blue-800"
                  onClick={() => addToInvoice(record)}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      bordered={false}
      columns={columns}
      rowKey={(record: IProduct) => record.productId}
      pagination={tableParams.paginationTable}
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
          : isFetching && {
              spinning: true,
              tip: "Đang cập nhật dữ liệu...",
            }
      }
      onChange={handleTableChange}
      size="middle"
    />
  );
};

export default FoundedProductsTable;
