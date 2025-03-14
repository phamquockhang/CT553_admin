import { useQuery } from "@tanstack/react-query";
import { AutoComplete, AutoCompleteProps, Input } from "antd";
import { SearchProps } from "antd/es/input";
import React, { useEffect, useState } from "react";
import {
  CustomerFilterCriteria,
  ICustomer,
  SortParams,
} from "../../../../interfaces";
import { customerService } from "../../../../services";

interface FindCustomerProps {
  viewMode?: boolean;
  setChoosenCustomer: React.Dispatch<
    React.SetStateAction<ICustomer | undefined>
  >;
}

const FindCustomer: React.FC<FindCustomerProps> = ({
  viewMode,
  setChoosenCustomer,
}) => {
  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);
  const [query, setQuery] = useState<string | undefined>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string | undefined>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const pagination = {
    page: 1,
    pageSize: 5,
  };
  const sort: SortParams = {
    sortBy: "firstName",
    direction: "asc",
  };
  const filter: CustomerFilterCriteria = {
    isActivated: "true",
  };
  const { data, isLoading } = useQuery({
    queryKey: ["customers", pagination, debouncedQuery, filter, sort].filter(
      (key) => {
        if (typeof key === "string") {
          return key !== "";
        } else if (key instanceof Object) {
          return Object.values(key).some(
            (value) => value !== undefined && value !== "",
          );
        }
      },
    ),
    queryFn: () =>
      customerService.getCustomers(
        pagination,
        debouncedQuery || "",
        filter,
        sort,
      ),
    enabled: !!debouncedQuery && !debouncedQuery.includes("-"),
    select: (data) => data.payload?.data,
  });

  useEffect(() => {
    if (isLoading) {
      setOptions([
        {
          value: undefined,
          label: <p className="text-center">{`Đang tìm kiếm...`}</p>,
        },
      ]);
    } else if (data && data.length > 0) {
      setOptions(
        data.map((customer) => ({
          value: customer.customerId,
          label: `${customer.lastName} ${customer.firstName} - ${customer.email}`,
        })),
      );
    } else if (!debouncedQuery || (debouncedQuery && debouncedQuery === "")) {
      setOptions([
        {
          value: undefined,
          label: (
            <p className="">{`Nhập tên hoặc email của Khách hàng để tìm kiếm...`}</p>
          ),
        },
      ]);
    } else {
      setOptions([
        {
          value: undefined,
          label: <p className="text-center">{`--<Không có>--`}</p>,
        },
      ]);
    }
  }, [data, isLoading, debouncedQuery]);

  const onSelect = (value: string) => {
    const choosenCustomer = data?.find(
      (customer) => customer.customerId === value,
    );
    setChoosenCustomer(choosenCustomer);
    setQuery(
      choosenCustomer?.lastName +
        " " +
        choosenCustomer?.firstName +
        " - " +
        choosenCustomer?.email,
    );
  };

  const handleSearch: SearchProps["onSearch"] = (value) => {
    if (value) {
      setQuery(value);
    } else {
      setQuery(undefined);
    }
  };

  return (
    <div className="w-[50%]">
      <div className="flex gap-3">
        <AutoComplete
          className="w-full"
          options={options}
          onSelect={onSelect}
          onSearch={handleSearch}
          value={query || undefined}
          disabled={viewMode}
        >
          <Input.Search
            loading={isLoading}
            allowClear
            value={query}
            size="middle"
            placeholder="Nhập tên hoặc email của Khách hàng để tìm kiếm"
            enterButton
          />
        </AutoComplete>
      </div>
    </div>
  );
};

export default FindCustomer;
