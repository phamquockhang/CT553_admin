import { Card, Col, Spin, Typography, Button } from "antd";
import { AiFillCloseCircle, AiFillDollarCircle } from "react-icons/ai";
import { FaCheckCircle, FaShippingFast } from "react-icons/fa";
import { GiCardboardBoxClosed } from "react-icons/gi";
import { useSellingOrderStatistics } from "./hooks/useSellingOrderStatistics";
import { TbReload } from "react-icons/tb";

const { Title } = Typography;

const OverviewStatistic: React.FC = () => {
  const { sellingOrderStatisticsData, isLoading, refetch } =
    useSellingOrderStatistics();

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
      title: "Đã giao",
      value: sellingOrderStatisticsData?.totalDeliveredOrders,
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
            <Title level={4} style={{ marginBottom: 0 }}>
              Tổng quan kết quả kinh doanh trong ngày
            </Title>
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
