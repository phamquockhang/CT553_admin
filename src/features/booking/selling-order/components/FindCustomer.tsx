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
  setChoosenCustomer: React.Dispatch<
    React.SetStateAction<ICustomer | undefined>
  >;
}

const FindCustomer: React.FC<FindCustomerProps> = ({ setChoosenCustomer }) => {
  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);

  const pagination = {
    page: 1,
    pageSize: 5,
  };
  const [query, setQuery] = useState<string | undefined>("");
  const sort: SortParams = {
    sortBy: "firstName",
    direction: "asc",
  };
  const filter: CustomerFilterCriteria = {
    isActivated: "true",
  };
  const { data, isLoading } = useQuery({
    queryKey: ["customers", pagination, query, filter, sort].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () =>
      customerService.getCustomers(pagination, query || "", filter, sort),
    select: (data) => data.payload?.data,
  });

  useEffect(() => {
    if (data) {
      setOptions(
        data.map((customer) => ({
          value: customer.customerId,
          label: `${customer.firstName} ${customer.lastName} - ${customer.email}`,
        })),
      );
    } else {
      setOptions([]);
    }
  }, [data]);

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
