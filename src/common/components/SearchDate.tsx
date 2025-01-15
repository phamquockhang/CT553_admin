import { FilterOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Modal,
  Row,
  Select,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const { Option } = Select;
const { RangePicker } = DatePicker;

type PickerType = "date" | "week" | "month" | "quarter" | "year" | "range";

const PickerWithType = ({
  type,
  onChange,
  value,
}: {
  type: PickerType;
  onChange: (
    dates: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs] | null,
    dateStrings: [string, string],
  ) => void;
  value: [string | null, string | null];
}) => {
  if (type === "range") {
    return (
      <RangePicker
        onChange={(dates, dateStrings) =>
          onChange(
            dates as dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs] | null,
            dateStrings,
          )
        }
        style={{ width: "100%" }}
        value={
          value[0] && value[1]
            ? [dayjs(value[0]), dayjs(value[1])]
            : [null, null]
        }
      />
    );
  }

  return (
    <DatePicker
      picker={type}
      onChange={(date) =>
        onChange(date, [
          date?.format(type === "quarter" ? "YYYY-[Q]Q" : "YYYY-MM-DD") || "",
          "",
        ])
      }
      style={{ width: "100%" }}
      value={
        value[0]
          ? dayjs(value[0], type === "quarter" ? "YYYY-[Q]Q" : undefined)
          : null
      }
    />
  );
};

interface SearchDateProps {
  onDateChange: (
    startDate: string | null,
    endDate: string | null,
    type: string | null,
  ) => void;
}

const SearchDate: React.FC<SearchDateProps> = ({ onDateChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState<PickerType>("date");
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<
    [string | null, string | null]
  >([null, null]);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    if (!selectedDates[0]) {
      message.error("Vui lòng chọn thời gian.");
      return;
    }

    if (type === "range" && !selectedDates[1]) {
      message.error("Khoảng thời gian yêu cầu chọn cả hai ngày.");
      return;
    }

    searchParams.set("startDate", selectedDates[0]);
    if (type === "range") {
      searchParams.set("endDate", selectedDates[1]!);
      searchParams.delete("type");
    } else {
      searchParams.set("type", type);
      searchParams.delete("endDate");
    }

    setSearchParams(searchParams);
    onDateChange(
      selectedDates[0],
      selectedDates[1],
      type === "range" ? null : type,
    );
    setOpen(false);
  };

  const handleClear = () => {
    searchParams.delete("startDate");
    searchParams.delete("endDate");
    searchParams.delete("type");
    setSearchParams(searchParams);
    setSelectedDates([null, null]);
    onDateChange(null, null, null);
    setOpen(false);
  };

  const handleDateChange = (
    dates: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs] | null,
  ) => {
    if (dates) {
      let formattedDates: [string | null, string | null] = [null, null];
      if (Array.isArray(dates)) {
        formattedDates = [
          dates[0]?.format("YYYY-MM-DD") || null,
          dates[1]?.format("YYYY-MM-DD") || null,
        ];
      } else {
        switch (type) {
          case "month":
            formattedDates[0] = dates.format("YYYY-MM");
            break;
          case "quarter":
            formattedDates[0] = dates.format("YYYY-[Q]Q");
            break;
          case "year":
            formattedDates[0] = dates.format("YYYY");
            break;
          default:
            formattedDates[0] = dates.format("YYYY-MM-DD");
        }
      }
      setSelectedDates(formattedDates);
    } else {
      setSelectedDates([null, null]);
    }
  };

  const handleTypeChange = (value: PickerType) => {
    setType(value);
    setSelectedDates([null, null]);
  };

  const modalContent = (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Select
            value={type}
            onChange={handleTypeChange}
            style={{ width: "103%" }}
          >
            <Option value="range">Khoảng thời gian</Option>
            <Option value="date">Ngày</Option>
            <Option value="month">Tháng</Option>
            <Option value="quarter">Quý</Option>
            <Option value="year">Năm</Option>
          </Select>
        </Col>
        <Col span={16}>
          <PickerWithType
            type={type}
            onChange={handleDateChange}
            value={selectedDates}
          />
        </Col>
      </Row>
    </div>
  );

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button type="primary" onClick={showModal} icon={<FilterOutlined />}>
          {type === "range"
            ? `${searchParams.get("startDate") || ""} - ${
                searchParams.get("endDate") || ""
              }`
            : searchParams.get("startDate") || "Lọc thời gian"}
        </Button>
        <Modal
          title="Chọn thời gian"
          open={open}
          onOk={handleOk}
          onCancel={handleClear}
          centered
          okText="Xác nhận"
          cancelText="Bỏ lọc"
        >
          {modalContent}
        </Modal>
      </Space>
    </div>
  );
};

export default SearchDate;
