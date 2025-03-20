import {
  CaretDownFilled,
  CaretUpFilled,
  FilterFilled,
} from "@ant-design/icons";
import { Table, TablePaginationConfig, TableProps, Tag } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { GetProp } from "antd/lib";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ITransaction, Page, TransactionStatus } from "../../interfaces";
import {
  colorFilterIcon,
  colorSortDownIcon,
  colorSortUpIcon,
  formatTimestamp,
  getColorTransactionStatus,
  getDefaultFilterValue,
  getDefaultSortOrder,
  getSortDirection,
  translateTransactionStatus,
} from "../../utils";

interface TableParams {
  pagination: TablePaginationConfig;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
  sorter?: SorterResult<ITransaction> | SorterResult<ITransaction>[];
}

interface TransactionTableProps {
  transactionPage?: Page<ITransaction>;
  isLoading: boolean;
  isFetching: boolean;
}

const TransactionsTable: React.FC<TransactionTableProps> = ({
  transactionPage,
  isLoading,
  isFetching,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} giao dịch`,
    },
  }));
  const navigate = useNavigate();

  useEffect(() => {
    if (transactionPage) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: transactionPage.meta?.total || 0,
          showTotal: (total) => `Tổng ${total} giao dịch`,
        },
      }));
    }
  }, [transactionPage]);

  const handleTableChange: TableProps<ITransaction>["onChange"] = (
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

  const columns: TableProps<ITransaction>["columns"] = [
    {
      title: "Mã giao dịch",
      key: "transactionId",
      dataIndex: "transactionId",
      render: (transactionId) => "#" + transactionId,
      align: "center",
      width: "15%",
    },
    {
      title: "Mã đơn hàng",
      key: "sellingOrder",
      dataIndex: "sellingOrder",
      render: (sellingOrder) => {
        return (
          <p
            className="cursor-pointer hover:underline"
            onClick={() =>
              navigate(
                `/selling-orders/${sellingOrder?.sellingOrderId}?mode=view`,
              )
            }
          >
            {sellingOrder?.sellingOrderId}
          </p>
        );
      },
      align: "center",
      width: "20%",
    },
    {
      title: "Giá trị đơn hàng (VNĐ)",
      key: "amount",
      dataIndex: "amount",
      // width: "5%",
      align: "right",
      render: (_, record) => {
        const totalAmount = record.amount.toLocaleString();
        return <p>{totalAmount}</p>;
      },
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "amount"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      key: "status",
      title: "Trạng thái thanh toán",
      dataIndex: "status",
      // width: "5%",
      align: "center",
      render: (text, record) => {
        const transactionStatus = record.status;
        const color = getColorTransactionStatus(transactionStatus);
        const translatedStatus = translateTransactionStatus(transactionStatus);
        return (
          <Tag className="m-0 px-1" color={color}>
            {translatedStatus}
          </Tag>
        );
      },
      filters: [
        { text: "Đang chờ xác nhận", value: TransactionStatus.PENDING },
        { text: "Thành công", value: TransactionStatus.SUCCESS },
        { text: "Thất bại", value: TransactionStatus.FAILED },
        { text: "Hết hạn", value: TransactionStatus.EXPIRED },
        { text: "Đã hủy", value: TransactionStatus.CANCELLED },
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
    // {
    //   key: "updatedAt",
    //   title: "Ngày cập nhật",
    //   dataIndex: "updatedAt",
    //   width: "5%",
    //   align: "center",
    //   render: (createdAt: string) =>
    //     createdAt ? formatTimestamp(createdAt) : "",
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
    //   width: "3%",
    //   align: "center",

    //   render: (record: ITransaction) => (
    //     <Space>
    //       {/* <ViewTransaction transactionId={record.transactionId} />
    //       <Access
    //         permission={PERMISSIONS[Module.SELLING_ORDERS].UPDATE}
    //         hideChildren
    //       >
    //         <UpdateTransaction transactionId={record.transactionId} />
    //       </Access>
    //       <TransactionStatusHistory transactionId={record.transactionId} /> */}
    //     </Space>
    //   ),
    // },
  ];

  return (
    <Table
      bordered={false}
      columns={columns}
      rowKey={(record: ITransaction) => record.transactionId}
      pagination={tableParams.pagination}
      dataSource={transactionPage?.data}
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

export default TransactionsTable;
