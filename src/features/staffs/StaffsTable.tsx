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
import { IStaff, Module, Page, PERMISSIONS } from "../../interfaces";
import {
  colorFilterIcon,
  colorSortDownIcon,
  colorSortUpIcon,
  formatTimestamp,
  getDefaultFilterValue,
  getDefaultSortOrder,
  getSortDirection,
} from "../../utils";
import Access from "../auth/Access";
import DeleteStaff from "./DeleteStaff";
import UpdateStaff from "./UpdateStaff";
import ViewStaff from "./ViewStaff";

interface TableParams {
  pagination: TablePaginationConfig;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
  sorter?: SorterResult<IStaff> | SorterResult<IStaff>[];
}

interface StaffTableProps {
  staffPage?: Page<IStaff>;
  isLoading: boolean;
}

const StaffsTable: React.FC<StaffTableProps> = ({ staffPage, isLoading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} nhân viên`,
    },
  }));

  useEffect(() => {
    if (staffPage) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: staffPage.meta?.total || 0,
          showTotal: (total) => `Tổng ${total} nhân viên`,
        },
      }));
    }
  }, [staffPage]);

  const handleTableChange: TableProps<IStaff>["onChange"] = (
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

  const columns: TableProps<IStaff>["columns"] = [
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
      title: "Họ",
      key: "lastName",
      dataIndex: "lastName",
      width: "10%",
    },
    {
      title: "Tên",
      key: "firstName",
      dataIndex: "firstName",
      width: "10%",
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      width: "15%",
    },
    {
      key: "isActivated",
      title: "Trạng thái",
      dataIndex: "isActivated",
      width: "8%",
      align: "center",
      render: (isActivated: boolean) => (
        <Tag color={isActivated ? "green" : "red"}>
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
      key: "createdAt",
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: "12%",
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
      key: "updatedAt",
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      width: "12%",
      align: "center",
      render: (updatedAt: string) =>
        updatedAt ? formatTimestamp(updatedAt) : "",
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "updatedAt"),
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
      width: "10%",
      align: "center",

      render: (record: IStaff) => (
        <Space>
          <ViewStaff user={record} />
          <Access permission={PERMISSIONS[Module.STAFF].UPDATE} hideChildren>
            <UpdateStaff user={record} />
          </Access>
          <Access permission={PERMISSIONS[Module.STAFF].DELETE} hideChildren>
            <DeleteStaff userId={record.id} />
          </Access>
        </Space>
      ),
    },
  ];

  return (
    <Table
      bordered={false}
      columns={columns}
      rowKey={(record: IStaff) => record.id}
      pagination={tableParams.pagination}
      dataSource={staffPage?.data}
      rowClassName={(_, index) =>
        index % 2 === 0 ? "table-row-light" : "table-row-gray"
      }
      rowHoverable={false}
      loading={{
        spinning: isLoading,
        tip: "Đang tải dữ liệu...",
      }}
      onChange={handleTableChange}
      size="middle"
    />
  );
};

export default StaffsTable;
