import {
  CaretDownFilled,
  CaretUpFilled,
  FilterFilled,
} from "@ant-design/icons";
import { Table, TablePaginationConfig, TableProps } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { GetProp } from "antd/lib";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IPermission, Method, Module, Page } from "../../../interfaces";
import {
  colorFilterIcon,
  colorMethod,
  colorSortDownIcon,
  colorSortUpIcon,
  formatTimestamp,
  getDefaultFilterValue,
  getDefaultSortOrder,
  getSortDirection,
} from "../../../utils";

interface TableParams {
  pagination: TablePaginationConfig;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
  sorter?: SorterResult<IPermission> | SorterResult<IPermission>[];
}

interface PermissionTableProps {
  permissionPage?: Page<IPermission>;
  isLoading: boolean;
}

const PermissionsTable: React.FC<PermissionTableProps> = ({
  permissionPage,
  isLoading,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} quyền hạn`,
    },
  }));

  useEffect(() => {
    if (permissionPage) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: permissionPage.meta?.total || 0,
          showTotal: (total) => `Tổng ${total} quyền hạn`,
        },
      }));
    }
  }, [permissionPage]);

  const handleTableChange: TableProps<IPermission>["onChange"] = (
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

  const columns: TableProps<IPermission>["columns"] = [
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
      title: "Tên",
      key: "name",
      dataIndex: "name",
      width: "10%",
    },
    {
      title: "URL",
      key: "apiPath",
      dataIndex: "apiPath",
      width: "15%",
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "apiPath"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      title: "Phương thức",
      key: "method",
      dataIndex: "method",
      width: "10%",
      align: "center",
      render(method: IPermission["method"]) {
        return (
          <p
            style={{
              fontWeight: "bold",
              color: colorMethod(method),
            }}
          >
            {method}
          </p>
        );
      },
      filters: Object.values(Method).map((method: string) => ({
        text: method,
        value: method,
      })),
      defaultFilteredValue: getDefaultFilterValue(searchParams, "method"),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      width: "10%",
      align: "center",
      filters: Object.values(Module).map((module: string) => ({
        text: module,
        value: module,
      })),
      defaultFilteredValue: getDefaultFilterValue(searchParams, "module"),
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
    // {
    //   title: "Hành động",
    //   key: "action",
    //   width: "10%",
    //   align: "center",

    //   render: (record: IPermission) => (
    //     <Space>
    //       <Access
    //         permission={PERMISSIONS[Module.PERMISSIONS].UPDATE}
    //         hideChildren
    //       >
    //         <UpdatePermission permission={record} />
    //       </Access>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <Table
      bordered={false}
      columns={columns}
      rowKey={(record: IPermission) => record.permissionId}
      pagination={tableParams.pagination}
      dataSource={permissionPage?.data}
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

export default PermissionsTable;
