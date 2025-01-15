import { useQuery } from "@tanstack/react-query";
import { Space, Table, TablePaginationConfig, TableProps, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
// import { PERMISSIONS } from "../../../interfaces/common/constants";
// import { Module } from "../../../interfaces/common/enums";
// import { IUser } from "../../../interfaces";
// import { userService } from "../../../services";
// import { formatTimestamp } from "../../../utils";
// import Access from "../Access";
import UpdateStaff from "./UpdateStaff";
import ViewStaff from "./ViewStaff";
import { staffService } from "../../services";
import { IStaff, Module, Page, PERMISSIONS } from "../../interfaces";
import { formatTimestamp } from "../../utils";
import Access from "../auth/Access";

interface TableParams {
  pagination: TablePaginationConfig;
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

  // const pagination = {
  //   page: Number(searchParams.get("page")) || 1,
  //   pageSize: Number(searchParams.get("pageSize")) || 10,
  // };

  // const { data, isLoading } = useQuery({
  //   queryKey: ["staffs", pagination],
  //   queryFn: () => staffService.getStaffs(pagination),
  // });

  // console.log(data);

  const handleTableChange: TableProps<IStaff>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    setTableParams((prev) => ({
      ...prev,
      pagination,
      sorter,
      filters,
    }));
    searchParams.set("page", String(pagination.current));
    searchParams.set("pageSize", String(pagination.pageSize));
    setSearchParams(searchParams);
  };

  const columns: TableProps<IStaff>["columns"] = [
    {
      title: "Họ",
      key: "lastName",
      dataIndex: "lastName",
      width: "10%",
    },
    {
      title: "Tên đệm và tên",
      key: "firstName",
      dataIndex: "firstName",
      width: "15%",
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      width: "15%",
    },
    {
      key: "role",
      title: "Vai trò",
      dataIndex: "role",
      width: "10%",
      render: (role) => role.description,
    },
    {
      key: "active",
      title: "Trạng thái",
      dataIndex: "isActivated",
      width: "8%",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: "15%",
      render: (createdAt: string) =>
        createdAt ? formatTimestamp(createdAt) : "",
    },
    {
      key: "updatedAt",
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      width: "15%",
      render: (updatedAt: string) =>
        updatedAt ? formatTimestamp(updatedAt) : "",
    },
    {
      title: "Hành động",
      key: "action",

      render: (record: IStaff) => (
        <Space>
          <ViewStaff user={record} />
          <Access permission={PERMISSIONS[Module.STAFF].UPDATE} hideChildren>
            <UpdateStaff user={record} />
          </Access>
          {/* <Access permission={ALL_PERMISSIONS.USERS.DELETE} hideChildren>
            <DeleteUser userId={record.userId} />
          </Access> */}
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
