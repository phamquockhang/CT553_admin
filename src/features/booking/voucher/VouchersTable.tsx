import {
  CaretDownFilled,
  CaretUpFilled,
  FilterFilled,
} from "@ant-design/icons";
import { Space, Table, TablePaginationConfig, TableProps, Tag } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { GetProp } from "antd/lib";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  DiscountType,
  IVoucher,
  Page,
  VoucherStatus,
} from "../../../interfaces";
import {
  colorFilterIcon,
  colorSortDownIcon,
  colorSortUpIcon,
  formatTimestamp,
  getColorDiscountType,
  getColorVoucherStatus,
  getDefaultFilterValue,
  getDefaultSortOrder,
  getSortDirection,
  translateDiscountType,
  translateVoucherStatus,
} from "../../../utils";

interface TableParams {
  pagination: TablePaginationConfig;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
  sorter?: SorterResult<IVoucher> | SorterResult<IVoucher>[];
}

interface VoucherTableProps {
  voucherPage?: Page<IVoucher>;
  isLoading: boolean;
  isFetching: boolean;
}

const VouchersTable: React.FC<VoucherTableProps> = ({
  voucherPage,
  isLoading,
  isFetching,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} mã giảm giá`,
    },
  }));
  const navigate = useNavigate();

  useEffect(() => {
    if (voucherPage) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: voucherPage.meta?.total || 0,
          showTotal: (total) => `Tổng ${total} mã giảm giá`,
        },
      }));
    }
  }, [voucherPage]);

  const handleTableChange: TableProps<IVoucher>["onChange"] = (
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

  const columns: TableProps<IVoucher>["columns"] = [
    {
      title: "STT",
      key: "index",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã giảm giá",
      key: "voucherCode",
      dataIndex: "voucherCode",
      render: (voucherCode) => voucherCode,
      align: "center",
      width: "10%",
    },
    {
      key: "status",
      title: "Trạng thái",
      dataIndex: "status",
      // width: "5%",
      align: "center",
      render: (_, record) => {
        const voucherStatus = record.status;
        const color = getColorVoucherStatus(voucherStatus);
        const translatedStatus = translateVoucherStatus(voucherStatus);
        return (
          <Tag className="m-0 px-1" color={color}>
            {translatedStatus}
          </Tag>
        );
      },
      filters: Object.values(VoucherStatus).map((status) => ({
        text: translateVoucherStatus(status),
        value: status,
      })),
      defaultFilteredValue: getDefaultFilterValue(searchParams, "status"),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      key: "discountType",
      title: "Loại giảm giá",
      dataIndex: "discountType",
      // width: "5%",
      align: "center",
      render: (_, record) => {
        const discountType = record.discountType;
        const color = getColorDiscountType(discountType);
        const translatedType = translateDiscountType(discountType);
        return (
          <Tag className="m-0 px-1" color={color}>
            {translatedType}
          </Tag>
        );
      },
      filters: Object.values(DiscountType).map((types) => ({
        text: translateVoucherStatus(types),
        value: types,
      })),
      defaultFilteredValue: getDefaultFilterValue(searchParams, "discountType"),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    // {
    //   title: "Giá trị giảm",
    //   key: "discountValue",
    //   dataIndex: "discountValue",
    //   // width: "5%",
    //   align: "right",
    //   render: (_, record) => {
    //     const discountValue = record.discountValue.toLocaleString();
    //     return <p>{discountValue}</p>;
    //   },
    //   sorter: true,
    //   defaultSortOrder: getDefaultSortOrder(searchParams, "discountValue"),
    //   sortIcon: ({ sortOrder }) => (
    //     <div className="flex flex-col text-[10px]">
    //       <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
    //       <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
    //     </div>
    //   ),
    // },
    // {
    //   title: "Giá trị đơn hàng tối thiểu",
    //   key: "minOrderValue",
    //   dataIndex: "minOrderValue",
    //   // width: "5%",
    //   align: "right",
    //   render: (_, record) => {
    //     const minOrderValue = record.minOrderValue.toLocaleString();
    //     return <p>{minOrderValue}</p>;
    //   },
    //   sorter: true,
    //   defaultSortOrder: getDefaultSortOrder(searchParams, "minOrderValue"),
    //   sortIcon: ({ sortOrder }) => (
    //     <div className="flex flex-col text-[10px]">
    //       <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
    //       <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
    //     </div>
    //   ),
    // },
    // {
    //   title: "Giá trị giảm tối đa",
    //   key: "maxDiscount",
    //   dataIndex: "maxDiscount",
    //   // width: "5%",
    //   align: "right",
    //   render: (_, record) => {
    //     const maxDiscount = record.maxDiscount?.toLocaleString();
    //     return <p>{maxDiscount || "Không có"}</p>;
    //   },
    // },
    {
      title: "Bắt đầu từ",
      key: "startDate",
      dataIndex: "startDate",
      width: "15%",
      align: "center",
      render: (startDate: string) =>
        startDate ? formatTimestamp(startDate) : "",
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "startDate"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      title: "Kết thúc vào",
      key: "endDate",
      dataIndex: "endDate",
      width: "15%",
      align: "center",
      render: (endDate: string) => (endDate ? formatTimestamp(endDate) : ""),
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "endDate"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      title: "Số lượng",
      key: "usageLimit",
      dataIndex: "usageLimit",
      align: "center",
      // width: "5%",
      render: (_, record) => {
        const usageLimit = record.usageLimit;
        return <p>{usageLimit || "Không giới hạn"}</p>;
      },
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "usageLimit"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      title: "Đã sử dụng",
      key: "usedCount",
      dataIndex: "usedCount",
      align: "center",
      // width: "5%",
      render: (_, record) => {
        const usedCount = record.usedCount;
        return <p>{usedCount || 0}</p>;
      },
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "usedCount"),
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
      //   width: "3%",
      align: "center",

      render: (record: IVoucher) => (
        <Space>
          {/* <ViewVoucher voucherId={record.voucherId} />
          <Access
            permission={PERMISSIONS[Module.SELLING_ORDERS].UPDATE}
            hideChildren
          >
            <UpdateVoucher voucherId={record.voucherId} />
          </Access>
          <VoucherStatusHistory voucherId={record.voucherId} /> */}
        </Space>
      ),
    },
  ];

  return (
    <Table
      bordered={false}
      columns={columns}
      rowKey={(record: IVoucher) => record.voucherId}
      pagination={tableParams.pagination}
      dataSource={voucherPage?.data}
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

export default VouchersTable;
