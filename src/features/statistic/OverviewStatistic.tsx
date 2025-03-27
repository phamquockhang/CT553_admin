import {
  Card,
  Col,
  Spin,
  Typography,
  Button,
  DatePicker,
  DatePickerProps,
  Select,
} from "antd";
import { AiFillCloseCircle, AiFillDollarCircle } from "react-icons/ai";
import { FaCheckCircle, FaShippingFast } from "react-icons/fa";
import { GiCardboardBoxClosed } from "react-icons/gi";
import { useSellingOrderStatistics } from "./hooks/useSellingOrderStatistics";
import { TbReload } from "react-icons/tb";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { TimeRange } from "../../interfaces";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const OverviewStatistic: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);
  const [selectedRange, setSelectedRange] = useState<string>("today");

  const timeRange: TimeRange = {
    startTime:
      dateRange[0]?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
    endTime: dateRange[1]?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
  };

  const { sellingOrderStatisticsData, isLoading, refetch } =
    useSellingOrderStatistics(timeRange);

  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    return current && dayjs(current).isAfter(dayjs().endOf("day"));
  };

  const handleSelectChange = (value: string) => {
    let startDate: Dayjs | null = null;
    let endDate: Dayjs | null = null;

    switch (value) {
      case "today":
        startDate = dayjs();
        endDate = dayjs();
        break;
      case "yesterday":
        startDate = dayjs().subtract(1, "day").startOf("day");
        endDate = dayjs().subtract(1, "day").endOf("day");
        break;
      case "thisWeek":
        startDate = dayjs().startOf("week");
        endDate = dayjs().endOf("week");
        break;
      case "lastWeek":
        startDate = dayjs().subtract(1, "week").startOf("week");
        endDate = dayjs().subtract(1, "week").endOf("week");
        break;
      case "thisMonth":
        startDate = dayjs().startOf("month");
        endDate = dayjs().endOf("month");
        break;
      case "lastMonth":
        startDate = dayjs().subtract(1, "month").startOf("month");
        endDate = dayjs().subtract(1, "month").endOf("month");
        break;
      case "thisQuarter":
        startDate = dayjs().startOf("quarter");
        endDate = dayjs().endOf("quarter");
        break;
      case "lastQuarter":
        startDate = dayjs().subtract(1, "quarter").startOf("quarter");
        endDate = dayjs().subtract(1, "quarter").endOf("quarter");
        break;
      case "thisYear":
        startDate = dayjs().startOf("year");
        endDate = dayjs().endOf("year");
        break;
      case "lastYear":
        startDate = dayjs().subtract(1, "year").startOf("year");
        endDate = dayjs().subtract(1, "year").endOf("year");
        break;
      case "custom":
        startDate = null;
        endDate = null;
        break;
    }

    setDateRange([startDate, endDate]);
  };

  const data = [
    {
      title: "Doanh thu",
      value: sellingOrderStatisticsData?.totalRevenue.toLocaleString() + " VNĐ",
      color: "#1e3a8a",
      icon: (
        <AiFillDollarCircle className="rounded-full bg-blue-900 p-1 text-4xl text-white" />
      ),
    },
    {
      title: "Đơn hàng mới",
      value: sellingOrderStatisticsData?.totalNewOrders,
      color: "#15803d",
      icon: (
        <GiCardboardBoxClosed className="rounded-full bg-green-700 p-1 text-4xl text-white" />
      ),
    },
    {
      title: "Đang vận chuyển",
      value: sellingOrderStatisticsData?.totalDeliveringOrders,
      color: "#ca8a04",
      icon: (
        <FaShippingFast className="rounded-full bg-yellow-600 p-1 text-4xl text-white" />
      ),
    },
    {
      title: "Đã hoàn thành",
      value: sellingOrderStatisticsData?.totalCompletedOrders,
      color: "#1d4ed8",
      icon: (
        <FaCheckCircle className="rounded-full bg-blue-700 p-1 text-4xl text-white" />
      ),
    },
    {
      title: "Đã hủy",
      value: sellingOrderStatisticsData?.totalCancelledOrders,
      color: "#ef4444",
      icon: (
        <AiFillCloseCircle className="rounded-full bg-red-500 p-1 text-4xl text-white" />
      ),
    },
  ];

  return (
    <>
      <Card
        className="custom-card"
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Title level={4} style={{ marginBottom: 0 }}>
                Tổng quan kết quả kinh doanh trong
              </Title>
              <Select
                style={{ width: 150 }}
                value={selectedRange}
                onChange={(value) => {
                  setSelectedRange(value);
                  handleSelectChange(value);
                }}
                options={[
                  { value: "today", label: "Hôm nay" },
                  { value: "yesterday", label: "Hôm qua" },
                  { value: "thisWeek", label: "Tuần này" },
                  { value: "lastWeek", label: "Tuần trước" },
                  { value: "thisMonth", label: "Tháng này" },
                  { value: "lastMonth", label: "Tháng trước" },
                  { value: "thisQuarter", label: "Quý này" },
                  { value: "lastQuarter", label: "Quý trước" },
                  { value: "thisYear", label: "Năm nay" },
                  { value: "lastYear", label: "Năm trước" },
                  { value: "custom", label: "Khoảng thời gian" },
                ]}
              />
              {selectedRange === "custom" && (
                <RangePicker
                  // picker=""
                  onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
                  disabledDate={disabledDate}
                />
              )}
            </div>

            <Button
              type="primary"
              onClick={() => refetch()}
              loading={isLoading}
            >
              Làm mới <TbReload />
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {data.map((item, index) => (
            <div
              key={index}
              className="rounded-md p-4 shadow-[0px_0px_5px_1px_rgba(0,0,0,0.24)]"
            >
              <div className="flex items-center gap-3">
                {isLoading ? (
                  <Spin />
                ) : (
                  <>
                    <div>{item.icon}</div>

                    <Col flex="auto">
                      <Title
                        level={5}
                        style={{ marginBottom: 0, color: item.color }}
                      >
                        {item.title}
                      </Title>
                      <Title level={4} style={{ margin: 0, color: item.color }}>
                        {item.value}
                      </Title>
                    </Col>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default OverviewStatistic;
