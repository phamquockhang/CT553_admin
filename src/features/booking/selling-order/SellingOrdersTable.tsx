import {
  CaretDownFilled,
  CaretUpFilled,
  FilterFilled,
} from "@ant-design/icons";
import { Space, Table, TablePaginationConfig, TableProps, Tag } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { GetProp } from "antd/lib";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ISellingOrder,
  Module,
  OrderStatus,
  Page,
  PaymentStatus,
  PERMISSIONS,
} from "../../../interfaces";
import {
  colorFilterIcon,
  colorSortDownIcon,
  colorSortUpIcon,
  formatTimestamp,
  getColorOrderStatus,
  getColorPaymentStatus,
  getDefaultFilterValue,
  getDefaultSortOrder,
  getSortDirection,
  translateOrderStatus,
  translatePaymentStatus,
} from "../../../utils";
import Access from "../../auth/Access";
import UpdateSellingOrder from "./UpdateSellingOrder";
import ViewSellingOrder from "./ViewSellingOrder";
import SellingOrderStatusHistory from "./components/SellingOrderStatusHistory";

interface TableParams {
  pagination: TablePaginationConfig;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
  sorter?: SorterResult<ISellingOrder> | SorterResult<ISellingOrder>[];
}

interface SellingOrderTableProps {
  sellingOrderPage?: Page<ISellingOrder>;
  isLoading: boolean;
  isFetching: boolean;
}

const SellingOrdersTable: React.FC<SellingOrderTableProps> = ({
  sellingOrderPage: orderPage,
  isLoading,
  isFetching,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} đơn hàng`,
    },
  }));

  useEffect(() => {
    if (orderPage) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: orderPage.meta?.total || 0,
          showTotal: (total) => `Tổng ${total} đơn hàng`,
        },
      }));
    }
  }, [orderPage]);

  const handleTableChange: TableProps<ISellingOrder>["onChange"] = (
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

  const columns: TableProps<ISellingOrder>["columns"] = [
    {
      title: "STT",
      width: "1%",
      align: "center",
      render: (_, __, index) =>
        ((tableParams.pagination.current || 1) - 1) *
          (tableParams.pagination.pageSize || 10) +
        index +
        1,
    },
    {
      title: "Mã hóa đơn",
      key: "sellingOrderId",
      dataIndex: "sellingOrderId",
      align: "left",
      width: "16%",
    },
    {
      title: "Giá trị đơn hàng (VNĐ)",
      key: "totalAmount",
      dataIndex: "totalAmount",
      width: "15%",
      align: "right",
      render: (text, record) => {
        const totalAmount = record.totalAmount.toLocaleString();
        return <p>{totalAmount}</p>;
      },
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "totalAmount"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      key: "paymentStatus",
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      // width: "5%",
      align: "center",
      render: (text, record) => {
        const paymentStatus = record.paymentStatus;
        const color = getColorPaymentStatus(paymentStatus);
        const translatedStatus = translatePaymentStatus(paymentStatus);
        return (
          <Tag className="m-0 px-1" color={color}>
            {translatedStatus}
          </Tag>
        );
      },
      filters: Object.values(PaymentStatus).map((status) => ({
        text: translatePaymentStatus(status),
        value: status,
      })),
      defaultFilteredValue: getDefaultFilterValue(
        searchParams,
        "paymentStatus",
      ),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      key: "orderStatus",
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      // width: "5%",
      align: "center",
      render: (text, record) => {
        const orderStatus = record.orderStatus;
        const color = getColorOrderStatus(orderStatus);
        const translatedStatus = translateOrderStatus(orderStatus);
        return (
          <Tag className="m-0 px-1" color={color}>
            {translatedStatus}
          </Tag>
        );
      },
      filters: [
        { text: "Đang chờ xác nhận", value: OrderStatus.PENDING },
        { text: "Đã xác nhận", value: OrderStatus.CONFIRMED },
        { text: "Đang chuẩn bị", value: OrderStatus.PREPARING },
        { text: "Đang giao hàng", value: OrderStatus.DELIVERING },
        { text: "Đã giao hàng", value: OrderStatus.DELIVERED },
        { text: "Hoàn thành", value: OrderStatus.COMPLETED },
        { text: "Đã hủy", value: OrderStatus.CANCELLED },
      ],
      defaultFilteredValue: getDefaultFilterValue(searchParams, "orderStatus"),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: "15%",
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
    {
      title: "Hành động",
      key: "action",
      width: "4%",
      align: "center",

      render: (record: ISellingOrder) => (
        <Space>
          <ViewSellingOrder sellingOrderId={record.sellingOrderId} />
          <Access
            permission={PERMISSIONS[Module.SELLING_ORDERS].UPDATE}
            hideChildren
          >
            <UpdateSellingOrder sellingOrderId={record.sellingOrderId} />
          </Access>
          <SellingOrderStatusHistory sellingOrderId={record.sellingOrderId} />
        </Space>
      ),
    },
  ];

  return (
    <Table
      bordered={false}
      columns={columns}
      rowKey={(record: ISellingOrder) => record.sellingOrderId}
      pagination={tableParams.pagination}
      dataSource={orderPage?.data}
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

export default SellingOrdersTable;
